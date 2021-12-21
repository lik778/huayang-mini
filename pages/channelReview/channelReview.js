Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = options.link
    if (link) {
      this.setData({link})
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
    return {
      title: "花样直播，成就向往的生活，成为更好的自己～",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639987387CcNSwq.jpg",
      path: "/pages/channelLive/channelLive"
    }
  },
})
