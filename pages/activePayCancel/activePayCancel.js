// pages/activePayCancel/activePayCancel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successUrl: "",
    orderId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { successUrl, orderId } = options;
    if (orderId) {
      successUrl = decodeURIComponent(successUrl)
      this.setData({successUrl, orderId})
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
    wx.redirectTo({url: "/pages/activePay/activePay?orderId=" + this.data.orderId})
  },

  back() {
    if (this.data.successUrl) {
      wx.redirectTo({
				url: this.data.successUrl,
				fail() {
					wx.switchTab({url: "/pages/discovery/discovery"})
				}
      })
    }
  }
})
