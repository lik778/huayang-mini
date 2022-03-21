import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"

// others/classIntroduce/classIntroduce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAuth: false,
    mobile: "",
    previewVideo: null,
    playing: false,
    channel: ""
  },
  authInfo() {
    if (!this.data.mobile) {
      this.setData({
        didShowAuth: true
      })
    } else {
      wx.navigateTo({
        url: `/others/applyJoinClass/applyJoinClass?mobile=${this.data.mobile}&channel=${this.data.channel}`,
      })
    }
  },

  playVideoTap() {
    this.data.previewVideo.play()
    this.setData({
      playing: true
    })
  },

  pauseTap() {
    this.setData({
      playing: false
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
      mobile: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (getLocalStorage(GLOBAL_KEY.accountInfo)) {
      this.setData({
        mobile: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
      })
    }
    if (options.channel) {
      this.setData({
        channel: options.channel
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.previewVideo = wx.createVideoContext("video", this)
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