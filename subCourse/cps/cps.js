import {
  GLOBAL_KEY
} from "../../lib/config"
// subCourse/cps/cps.js
import {
  payCourse,
  hasUserInfo,
  hasAccountInfo,
  getLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAuth: false,
    userInfo: '',
    orderId: ''
  },

  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  authCompleteEvent() {
    setTimeout(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      this.setData({
        didShowAuth: false,
        userInfo
      })
      this.pay()
    }, 200)
  },
  // 支付
  pay() {
    payCourse({
      id: this.data.orderId,
      name: '抖音视频包'
    }).then(res => {
      console.log(res)
    })
    // console.log(this.data.orderId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      if (hasAccountInfo() && hasUserInfo()) {
        this.setData({
          userInfo: getLocalStorage(GLOBAL_KEY.accountInfo),
          orderId: options.id
        })
        this.pay()
      } else {
        this.setData({
          didShowAuth: true,
          orderId: options.id
        })
      }
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
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

  }
})