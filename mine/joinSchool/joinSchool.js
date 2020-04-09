// mine/joinSchool/joinSchool.js
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '0',
    webViewData: 0
  },
  // 切换性别
  changeSex(e) {
    this.setData({
      radio: e.detail
    })
    console.log(e.detail)
  },
  getWebViewData(mobile) {
    this.setData({
      webViewData: JSON.stringify({
        userId: wx.getStorageSync(GLOBAL_KEY.userId),
        mobile:mobile,
        open_id:wx.getStorageSync(GLOBAL_KEY.openId),
      })
    })
    console.log(this.data.webViewData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWebViewData(options.mobile)
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