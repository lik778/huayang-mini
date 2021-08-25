// others/goodMorningResult/goodMorningResult.js
import {
  isIphoneXRSMax
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharer: false,
    posterBg: '',
    isIphoneXRSMax: isIphoneXRSMax()
  },

  /* 保存相册 */
  saveToAlbums() {
    wx.getImageInfo({
      src: this.data.posterBg,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (res1) => {
            if (res1.errMsg === 'getImageInfo:ok') {
              wx.showToast({
                title: '保存成功'
              })
            }
          },
          fail: () => {
            wx.showToast({
              title: "保存失败",
              icon: 'none'
            });
          }
        })
      }
    })
  },

  /* 花样精彩视频点击 */
  wonderfulVideo() {
    this.toIndex()
  },

  /* 早安签到按钮点击 */
  goodMorningSignIn() {
    this.toIndex()
  },

  /* 花样精彩视频+早安签到 */
  toIndex() {
    wx.switchTab({
      url: '/pages/discovery/discovery',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      img,
      sharer = false
    } = options
    console.log(options)
    this.setData({
      sharer,
      posterBg: img
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