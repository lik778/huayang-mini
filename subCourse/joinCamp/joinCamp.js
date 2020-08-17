// 加入训练营
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  checkAuth
} from "../../utils/auth"
import {
  getCampDetail,
  getHasJoinCamp,
  joinCamp
} from "../../api/course/index"
import {
  getLocalStorage,
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
    campId: 0,
    titleName: "",
    joinTime: "",
    hasJoinAll: false,
    endTime: "",
    userInfo: "",
    hasAllTime: "",
    buttonType: 1,
    lock: true,
    campDetailData: {},
    timeJoin:'',
    backIndex: false
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      let userData = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      let buttonType = 1
      res.desc = res.desc.split(",")
      this.setData({
        titleName: res.name.length > 8 ? res.name.slice(0, 8) + ".." : res.name
      })
      let dateList = res.start_date.split(',')
      let date = new Date();
      let year = date.getFullYear()
      let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      let nowDate = year + "-" + month + "-" + day
      let startDate = ''
      if (dateList.length > 1) {
        // 多个开营日期
        for (let i in dateList) {
          if (new Date(dateList[i]).getTime() > new Date(nowDate).getTime()) {
            // 开营时间大于当前日期
            if (new Date(dateList[i]).getTime() === new Date(nowDate).getTime()) {
              // 开营当天
              startDate = nowDate
            } else if (startDate === '') {
              startDate = dateList[i]
            } else if (new Date(startDate).getTime() > new Date(dateList[i]).getTime()) {
              startDate = dateList[i]
            }
          }
        }
      } else {
        if (new Date(res.start_date).getTime() > new Date(nowDate).getTime()) {
          startDate = res.start_date
        }
      }
      let pushTime = startDate.split("-")[1] + "月" + startDate.split("-")[2] + "日"
      let datas = startDate.replace(/-/g, "/")
      if (startDate === '' && !this.data.hasJoinAll) {
        // 没有开营日期
        buttonType = 2
      }
      if (res.discount_price === 0) {
        if (userData.user_grade < res.user_grade) {
          buttonType = 3
        }
      }
      this.setData({
        campDetailData: res,
        joinTime: pushTime,
        buttonType: buttonType,
        endTime: startDate,
        campId: id
      })
    })
  },
  // 等级不够
  openBox() {
    this.setData({
      didShowAlert: true
    })
  },
  // 跳往任务页
  goToTask() {
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },
  // 加入训练营
  joinCamp() {
    if (this.data.lock) {
      this.setData({
        lock: false
      })
      bxPoint("camp_join", {}, false)
      joinCamp({
        open_id: getLocalStorage(GLOBAL_KEY.openId),
        // open_id:'oG8Rd5Zxr7cjV6tUdraUDdsOSS8w',
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
      console.log(res, 100)
      if (res.length === 0 || res.status === 2 || res.id) {
        this.getCampDetail(id)
        if (res.status === 2) {
          // 代表是已经加入过放弃的
          let pushTime = res.date.split("-")[1] + "月" + res.date.split("-")[2] + "日"
          this.setData({
            hasJoinAll: true,
            hasAllTime: res.date,
            timeJoin: pushTime
          })
        }
      } else {
        wx.redirectTo({
          url: `/subCourse/campDetail/campDetail?id=${id}&share=true`,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录分享人身份
    getApp().globalData.super_user_id = options.invite_user_id
    getApp().globalData.source = options.source

    this.setData({
      backIndex: !!options.share
    })

    checkAuth({
      authPhone: true,
      redirectPath: `/subCourse/joinCamp/joinCamp$id#${options.id}`,
      redirectType: 'redirect'
    }).then(() => {
      let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
      this.setData({
        campId: options.id,
        userInfo: userInfo
      })
      // id代表训练营ID
      this.checkCamp(this.data.campId)
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