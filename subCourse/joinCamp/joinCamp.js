// 加入训练营
import {
  GLOBAL_KEY,
  Version
} from "../../lib/config"

import {
  checkFocusLogin
} from "../../api/auth/index"

import {
  getCampDetail,
  getHasJoinCamp,
  joinCamp
} from "../../api/course/index"
import {
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  payCourse
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAlert: false,
    statusHeight: 0,
    didShowAuth: false,
    campId: 0,
    overdue: false,
    titleName: "",
    joinTime: "",
    hasJoinAll: false, //代表加入过
    endTime: "",
    userInfo: "",
    hasAllTime: "",
    buttonType: 1,
    lock: true,
    campDetailData: {},
    timeJoin: '',
    backIndex: false
  },
  // 生成当前天的日期
  getCurrentDate(currentDate) {
    return new Promise(resolve => {
      let date = new Date();
      let year = date.getFullYear()
      let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      let nowDate = year + "-" + month + "-" + day
      resolve(nowDate)
    })
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      let dateList = res.start_date.split(',')
      let startDate = ''
      let pushTime = ''
      let buttonType = 7
      res.desc = res.desc.split(",")
      this.getCurrentDate().then(nowDate => {
        let date2 = new Date(nowDate).getTime() //当前日期
        if (dateList.length > 1) {
          // 多个开营日期
          for (let i in dateList) {
            let date1 = new Date(dateList[i]).getTime() //开营日期
            let date3 = ''
            if (date1 > date2) {
              // 存在开营日期大于当前日期
              if (startDate !== '') {
                date3 = new Date(startDate).getTime()
              }
              startDate = startDate === '' ? dateList[i] : date3 > date1 ? dateList[i] : startDate
            }
          }
        } else {
          // 一个开营日期
          let date1 = new Date(res.start_date).getTime()
          if (date1 > date2) {
            startDate = res.start_date
          }
        }
        if (startDate !== '') {
          pushTime = startDate.split("-")[1] + "月" + startDate.split("-")[2] + "日"
          pushTime = pushTime.replace(/-/g, "/")
        }
        if (!hasUserInfo() || !hasAccountInfo()) {
          // 没有授权
          buttonType = 7
        } else {
          // 受过权了
          if (res.price > 0) {
            // 收费
            if (res.discount_price < res.price && res.discount_price > 0) {
              // 有折扣价且折扣价>0
              buttonType = 3
            } else if (res.discount_price < 0) {
              // 不折扣
              buttonType = 2
            } else if (res.discount_price === 0) {
              // 有折扣价且为0
              let userData = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
              if (userData.user_grade < res.user_grade) {
                // 免费但是等级不够
                buttonType = 6
              } else {
                // 免费且等级够了
                buttonType = 5
              }
            } else {
              // 无折扣价
              buttonType = 2
            }
          } else {
            // 免费
            let userData = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
            if (userData.user_grade < res.user_grade) {
              // 免费但是等级不够
              buttonType = 6
            } else {
              // 免费且等级够了
              buttonType = 5
            }
          }
          if (startDate === '') {
            // 后续没有训练营开营日期了
            buttonType = 1
          }
          if (this.data.hasJoinAll) {
            // 中途退出
            if (this.data.overdue) {
              // 过期
              buttonType = 1
            } else {
              // 未过期
              buttonType = 4
            }
          }
        }
        checkFocusLogin({
          app_version: Version
        }).then(res1 => {
          let _this=this
          if (!res1) {
            wx.getSystemInfo({
              success: function (res2) {
                if (res2.platform == 'ios') {
                  buttonType = 8
                }
                _this.setData({
                  campDetailData: res,
                  joinTime: pushTime,
                  buttonType: buttonType,
                  endTime: startDate,
                  campId: id,
                  titleName: res.name.length > 8 ? res.name.slice(0, 8) + ".." : res.name
                })
              }
            })
          } else {
            _this.setData({
              campDetailData: res,
              joinTime: pushTime,
              buttonType: buttonType,
              endTime: startDate,
              campId: id,
              titleName: res.name.length > 8 ? res.name.slice(0, 8) + ".." : res.name
            })
          }
        })

      })
    })
  },
  // ios规则弹窗
  openToast() {
    wx.showModal({
      title: "提示",
      content: "由于相关规范，ios功能暂不可用",
      showCancel: false
    })
  },
  // 等级不够
  openBox() {
    this.setData({
      didShowAlert: !this.data.didShowAlert
    })
  },
  // 跳往任务页
  goToTask() {
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },
  // 用户授权取消
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
    })
    this.checkCamp(this.data.campId)
    // this.joinCamp()
  },
  // 加入训练营
  joinCamp() {
    if (hasUserInfo() && hasAccountInfo()) {
      if (this.data.lock) {
        this.setData({
          lock: false
        })
        bxPoint("camp_join", {}, false)
        joinCamp({
          open_id: getLocalStorage(GLOBAL_KEY.openId),
          date: this.data.hasJoinAll ? this.data.hasAllTime : this.data.endTime,
          traincamp_id: this.data.campId
        }).then((res) => {
          if (res.id) {
            payCourse({
              id: res.id,
              name: '加入训练营'
            }).then(res => {
              // 设置顶部标题
              if (res.errMsg === "requestPayment:ok") {
                this.backFun({
                  type: "success"
                })
              } else {
                this.backFun({
                  type: "fail"
                })
              }
            }).catch(err => {
              this.backFun({
                type: "fail"
              })
            })
          } else {
            this.backFun({
              type: "success"
            })
          }
        })
      }
    } else {
      this.setData({
        didShowAuth: true
      })
    }

  },
  // 集中处理支付回调
  backFun({
    type
  }) {
    if (type === 'fail') {
      this.setData({
        lock: true
      })
      wx.showToast({
        title: '支付失败',
        icon: "none",
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '加入成功',
        icon: "success",
        duration: 2000
      })
      setTimeout(() => {
        wx.redirectTo({
          url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&share=true`,
        })
      }, 2000)
    }
  },

  // 跳转到训练营详情
  checkCamp(id) {
    getHasJoinCamp({
      traincamp_id: id
    }).then(res => {
      if (res.id) {
        // 已经加入过
        res.date = res.date.replace(/-/g, "/")
        let oneDayTime = 86400000 * res.period //一天毫秒数
        let dateDay = new Date(res.date).getTime() //加入日期
        let date = new Date();
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        let nowDate = year + "/" + month + "/" + day
        let nowDay = new Date(nowDate).getTime()
        if (dateDay + oneDayTime > nowDay) {
          // 训练营未过期
          if (res.status === 2) {
            // 代表是已经加入过放弃的
            let pushTime = res.date.split("/")[1] + "月" + res.date.split("/")[2] + "日"
            this.setData({
              hasJoinAll: true,
              hasAllTime: res.date.replace(/\//g, "-"),
              timeJoin: pushTime
            })
            this.getCampDetail(id)
          } else {
            wx.redirectTo({
              url: `/subCourse/campDetail/campDetail?id=${id}&share=true`,
            })
          }
        } else {
          this.setData({
            overdue: true
          })
          this.getCampDetail(
            id
          )
        }
      } else {
        // 未加入过
        this.getCampDetail(id)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      invite_user_id = "",
      source,
      id,
      share
    } = options
    let campId = id
    // 通过小程序码进入 scene=${source}/${id}/${share}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/');
      let [sceneSource = '', sceneId = 0, sceneShare = ''] = sceneAry;
      if (sceneId) {
        campId = sceneId
      }
      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
      this.setData({
        backIndex: !!sceneShare
      })
    } else {
      // 通过卡片进入
      if (invite_user_id) {
        getApp().globalData.super_user_id = invite_user_id
      }
      if (source) {
        getApp().globalData.source = source
      }
      this.setData({
        backIndex: !!share
      })
    }

    if (hasUserInfo() && hasAccountInfo()) {
      let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
      this.setData({
        campId,
        userInfo: userInfo
      })
      // id代表训练营ID
      this.checkCamp(this.data.campId)
    } else {
      this.setData({
        campId: campId
      })
      // id代表训练营ID
      this.getCampDetail(campId)
    }

    // 记录起始页面地址
    if (!getApp().globalData.firstViewPage && getCurrentPages().length > 0) {
      getApp().globalData.firstViewPage = getCurrentPages()[0].route
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })

    bxPoint("camp_introduce", {
      from_uid: getApp().globalData.super_user_id,
      source: getApp().globalData.source,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `我正在参加${this.data.campDetailData.name}，每天都有看的见的变化，快来试试`,
      path: "/subCourse/joinCamp/joinCamp?id=" + this.data.campId + `&invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})