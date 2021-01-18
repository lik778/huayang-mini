// 加入训练营
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"

import { collectError } from "../../api/auth/index"

import { getCampDetail, getHasJoinCamp, getIosCustomerLink, joinCamp } from "../../api/course/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, payCourse } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    didShowAuth: false,
    campId: 0,
    overdue: false,
    titleName: "",
    joinTime: "",
    isIosPlatform: false, //是否是Ios平台
    hasJoinAll: false, //代表加入过
    endTime: "",
    showPromotion: true, //分销分享按钮
    userInfo: "", //用户信息
    hasAllTime: "",
    buttonType: 1,
    lock: true,
    campDetailData: {},
    timeJoin: '',
    promoteUid: "", //分销邀请人id
    backIndex: false,
    isPromoter: false, //是否是分销人
    adapter: false
  },
  toBootcampDetailPage() {
    bxPoint("camp_join", {}, false)
    wx.navigateTo({
      url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&share=true`
    })
  },
  // 打点
  shareNow() {
    bxPoint("promotion_camp_joinpage", {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      isPromoter: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).kecheng_user.is_promoter === 1 ? true : false
    })
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
      this.getCurrentDate().then(async nowDate => {
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
              // 有折扣价且为0，免费
              buttonType = 5
            } else {
              // 无折扣价
              buttonType = 2
            }
          } else {
            // 免费
            let userData = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
            buttonType = 5
          }
          if (startDate === '') {
            // 后续没有训练营开营日期了
            buttonType = 1
          }
          if (this.data.hasJoinAll) {
            // 中途退出
            // if (this.data.overdue) {
            //   // 过期
            //   buttonType = 1
            // } else {
            //   // 未过期
            //   buttonType = 4
            // }
            wx.navigateTo({
              url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&share=true`,
            })
          }
        }
        let _this = this
        if (res.discount_price > 0 && res.distribution_ratio > 0) {
          res.sharePrice = ((res.discount_price * (res.distribution_ratio / 100)) / 100).toFixed(2)
        } else {
          res.sharePrice = ''
        }
        // 用户已登录，检查用户是否加入过当前训练营
        if (hasUserInfo() && hasAccountInfo()) {
          let campInfo = await getHasJoinCamp({
            traincamp_id: id
          })
          if ($notNull(campInfo)) {
            // 已经加入过，显示继续学习
            buttonType = 10
          }
        }
        wx.getSystemInfo({
          success: (res2) => {
            let isIosPlatform = false
            if (res2.platform == 'ios') {
              isIosPlatform = true
              if (hasUserInfo() && hasAccountInfo()) {
                buttonType = buttonType === 10 ? 10 : 9
              }
            }
            this.setData({
              campDetailData: res,
              joinTime: pushTime,
              buttonType: buttonType === 10 ? 10 : startDate === '' ? 1 : buttonType,
              endTime: startDate,
              campId: id,
              isIosPlatform,
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
  // 用户授权取消
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    setTimeout(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      this.setData({
        didShowAuth: false,
        userInfo
      })
    }, 200)
    this.checkCamp(this.data.campId)
    // this.joinCamp()
  },
  // 加入训练营
  joinCamp() {
    if (hasUserInfo() && hasAccountInfo() && this.data.endTime !== '') {
      if (this.data.lock) {
        this.setData({
          lock: false
        })
        bxPoint("camp_join", {}, false)
        if (this.data.isIosPlatform) {
          // ios平台
          getIosCustomerLink().then(res => {
            this.setData({
              lock: true
            })
            let link = encodeURIComponent(res.data)
            wx.navigateTo({
              url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
              fail(err) {
                collectError({
                  level: ErrorLevel.p0,
                  page: "jj.joinCamp.navigateToH5ForPay",
                  error_code: 500,
                  error_message: err
                })
              }
            })
          })
        } else {
          joinCamp({
            open_id: getLocalStorage(GLOBAL_KEY.openId),
            date: this.data.hasJoinAll ? this.data.hasAllTime : this.data.endTime,
            traincamp_id: this.data.campId,
            promote_uid: this.data.promoteUid
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
                collectError({
                  level: ErrorLevel.p0,
                  page: "jj.joinCamp.requestPayment",
                  error_code: 500,
                  error_message: err
                })
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
    this.getCampDetail(id)
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
      promote_uid = "",
      share
    } = options
    // 设置邀请人id
    if (promote_uid !== '') {
      this.setData({
        promoteUid: promote_uid
      })
    }
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

    let systemInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    this.setData({
      adapter: /iphone x/i.test(systemInfo.model) || /iPhone11/i.test(systemInfo.model)
    })
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
      traincamp_id: this.data.campId,
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
    let shareLink = "/subCourse/joinCamp/joinCamp?id=" + this.data.campId + `&invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    if (this.data.promoteUid !== '') {
      shareLink += `&promote_uid=${this.data.promoteUid}`
    } else {
      if (this.data.userInfo !== '' && this.data.userInfo.kecheng_user.is_promoter === 1) {
        shareLink += `&promote_uid=${this.data.userInfo.id}`
      }
    }

    return {
      title: `我正在参加${this.data.campDetailData.name}，每天都有看的见的变化，快来试试`,
      path: shareLink
    }
  }
})
