import { GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { getPhoneNumber } from "../../api/course/index"
import { getUserInfo } from "../../api/mine/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo, setLocalStorage } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    didShowAuth: false,
    statusHeight: 0,
    nodata: true,
    phoneNumber: "",
    existNo: undefined
  },
  // 加私域
  joinPrivateDomain() {
    let link = "https://mp.weixin.qq.com/s?__biz=MzU0NTI4NTQ3Nw==&mid=2247485649&idx=1&sn=31b40c6c3bb150b6ce1461270ada4be1&chksm=fb6e7cdbcc19f5cd6e148a7fac98de41f1dfdc1f662699d89efee035ef6786795574cc0a4881&mpshare=1&scene=1&srcid=1030Nx16EZ577iU60ZhOvI6W&sharer_sharetime=1604035718221&sharer_shareid=2fab58baf43a77081216e27730e2e0a9&version=3.0.31.6162&platform=mac&rd2werd=1#wechat_redirect"
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${encodeURIComponent(link)}`,
    })
  },
  // 计算用户帐号创建日期
  calcUserCreatedTime() {
    if (hasUserInfo() && hasAccountInfo()) {
      let { created_at } = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      let nowDate = dayjs()
      let no = nowDate.diff(created_at, "day")
      this.setData({existNo: no || 1})
    }
  },
  // 处理用户卡片点击
  handleCardTap(e) {
    if (hasUserInfo() && hasAccountInfo()) {
      switch (e.currentTarget.dataset.ele) {
        case "bootcamp": {
          bxPoint("applet_mine_click_bootcamp", {}, false)
          wx.navigateTo({url: "/mine/personBootcamp/personBootcamp"})
          return
        }
        case "course": {
          bxPoint("applet_mine_click_course", {}, false)
          wx.navigateTo({url: "/mine/personCourse/personCourse"})
          return
        }
        case "activity": {
          bxPoint("applet_mine_click_activity", {}, false)
          wx.navigateTo({url: "/mine/personActivity/personActivity"})
          return
        }
      }
    } else {
      this.setData({didShowAuth: true})
    }
  },
  // 获取用户信息
  getUserSingerInfo() {
    getUserInfo('scene=zhide').then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      this.setData({userInfo: res})
    })
  },
  // 获取授权
  getAuth() {
    if (this.data.nodata) {
      this.setData({didShowAuth: true})
    }
  },
  // 用户授权取消
  authCancelEvent() {
    this.run()
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.run()
    this.setData({didShowAuth: false})
  },
  // 获取个人信息
  getUserInfo() {
    this.setData({userInfo: getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}})
  },
  // 我的订单
  toOrder() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({
        url: '/mine/mineOrder/mineOrder',
      })
    } else {
      this.setData({didShowAuth: true})
    }
  },
  // 获取客服号码
  getNumber() {
    getPhoneNumber().then(phoneNumber => {
      this.setData({phoneNumber})
    })
  },
  // 公用方法
  kingOfTheWorld() {
    this.getUserInfo()
    this.getNumber()
    this.getUserSingerInfo()
  },
  // 联系客服
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  run() {
    if (hasUserInfo() && !hasAccountInfo()) {
      // 有微信信息没有手机号信息
      this.setData({
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)),
        nodata: false,
      })
    } else if (hasUserInfo() && hasAccountInfo()) {
      // 有微信信息且有手机号信息
      this.kingOfTheWorld()
      this.setData({nodata: false})
    } else {
      // nothing
      this.setData({nodata: true})
    }

    this.calcUserCreatedTime()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    this.setData({statusHeight: data})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.run()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({selected: 2})
    }
    this.calcUserCreatedTime()
    bxPoint("applets_mine", {})
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
  onShareAppMessage: function (res) {
    return {
      title: '跟着花样一起变美，变自信',
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})
