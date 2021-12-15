// teacherModule/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639018163AAXOrg.jpg",
    likeIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538156QZXmPX.jpg",
    unLikeIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538135qpLqha.jpg',
    visitIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538173rMsMan.jpg",
    girlIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538201xdkMWA.jpg",
    boyIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538413HLQLzn.jpg',
    rightArrowIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538221DoDrbl.jpg",
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    bannerList: [1, 2, 3],
    currentBannerIndex: 0,
    signList: ['测试', '爱情'],
    momentList: [{
      type: 1,
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639130596SBmWKG.jpg'
    }, {
      type: 1,
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639130596SBmWKG.jpg'
    }, {
      type: 1,
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639130596SBmWKG.jpg'
    }, {
      type: 1,
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639130596SBmWKG.jpg'
    }, {
      type: 1,
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639130596SBmWKG.jpg'
    }, {
      type: 2,
      url: 'http://video.huayangbaixing.com/sv/11e82bfb-17da34e60ae/11e82bfb-17da34e60ae.mp4'
    }, ]
  },

  /* 滑动banner */
  switchBanner(e) {
    let index = e.detail.current
    this.setData({
      currentBannerIndex: index
    })
  },

  /* 前往留言板列表 */
  toMessageList() {
    wx.navigateTo({
      url: '/teacherModule/messageList/messageList',
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