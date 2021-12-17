// teacherModule/momentList/momentList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639626899gtUcEr.jpg",
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    type: 3
  },

  /* 前往发布动态 */
  toUpload() {
    wx.navigateTo({
      url: '/teacherModule/momentPublish/momentPublish',
    })
  },

  /* 前往动态详情 */
  toMomentDetail() {
    wx.navigateTo({
      url: '/teacherModule/momentDetail/momentDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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