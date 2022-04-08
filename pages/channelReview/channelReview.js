Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    title: "",
    cover: "",
    loading: true,
    didRedirect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { link, title, cover, didRedirect } = options
    if (link) {
      this.setData({link, title, cover, didRedirect: didRedirect === "yes"})
    }

    wx.showLoading({title: '加载中'})
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
    return {
      title: this.data.title,
      imageUrl: this.data.cover,
      path: `/pages/channelReview/channelReview?link=${this.data.link}&didRedirect=yes`
    }
  },
  onLoadMetaDataDone() {
    this.setData({loading: false})
    wx.hideLoading()
  }
})
