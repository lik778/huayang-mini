import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    playing: false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = {
      ...options,
      image: options.image.split(","),
      height: options.video_url ? Number(options.video_bottom_height) + 1302 : ''
    }
    this.setData({
      info: info
    })
    wx.setNavigationBarTitle({
      title: info.title || '线下培训'
    })
  },

  /* 联系客服 */
  contactService() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfcdba4386d5d74c0b5'
      },
      corpId: 'ww8d4cae43fb34dc92',
      complete() {
        bxPoint("course_service_click", {}, false)
      }
    })
  },

  onReady() {
    this.data.previewVideo = wx.createVideoContext("video", this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
