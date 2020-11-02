// pages/activePayCancel/activePayCancel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { successUrl } = options;

    if (successUrl) {
      successUrl = decodeURIComponent(successUrl)
      this.setData({successUrl})
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

  continuePay() {
    wx.navigateBack()
  },

  back() {
    if (this.data.successUrl) {
      wx.navigateTo({url: this.data.successUrl})
    } else {
      wx.switchTab({url: "/pages/discovery/discovery"})
    }
  }
})
