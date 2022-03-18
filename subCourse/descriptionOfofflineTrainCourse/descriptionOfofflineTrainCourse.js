// subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse.js
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
      image: options.image.split(",")
    }
    console.log(info)
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
        url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'
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