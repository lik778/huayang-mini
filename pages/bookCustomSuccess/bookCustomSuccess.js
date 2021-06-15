Page({

  /**
   * 页面的初始数据
   */
  data: {
    didFromUpload: true,
    didShowContact: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({didFromUpload: options.type === "upload"})
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
  // 关闭联系客服
  onCloseContactModal() {
    this.setData({didShowContact: false})
  },
  // 打开联系客服
  openContactModal() {
    this.setData({didShowContact: true})
  }
})
