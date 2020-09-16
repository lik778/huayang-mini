// pages/webViewCommon/webViewCommon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    isModel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = decodeURIComponent(options.link)
    if (options.isModel === 'true') {
      this.setData({
        baseUrl: link,
        isModel: true
      })
    }
    console.log(link)
    this.setData({
      link: link
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
    if (this.data.isModel) {
      return {
        title: "2020上海花样时尚模特大赛投票正在火热进行中",
        path: `/pages/webViewCommon/webViewCommon?link=${this.data.baseUrl}&type=link`
      }
    }
  }
})