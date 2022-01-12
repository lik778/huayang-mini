Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMAGES: [
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882858JKvNyT.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882876wtDoqq.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882886tPwoSV.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882899hziRaH.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882911OjWQTc.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882921XwslDp.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882933dlbHFa.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641882946VFUwkj.jpg",
    ],
    didVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.run()
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
      title: "花样老年大学，为银发新青年打造社交体验式学习新场景",
      path: "/subCourse/introduce/introduce",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641885461KyCzXh.jpg"
    }
  },

  // 启动函数
  run() {
    wx.showLoading({ mask: true, title: "加载中" })
    let t = setTimeout(() => {
      wx.hideLoading()
      this.setData({didVisible: true})
      clearTimeout(t)
    }, 700)
  }
})
