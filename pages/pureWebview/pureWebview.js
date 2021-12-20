Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    didBrand: false, // 加载「花样百姓」品牌介绍文章时，定制化分享文案+图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = decodeURIComponent(options.link)
    this.setData({link})

    if (options.brand === "true") {
      this.setData({didBrand: true})
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
  onShareAppMessage: function () {
    if (this.data.didBrand) {
      // 花样品牌故事ICON，定制分享内容
      return {
        title: "花样大学品牌介绍",
        imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639997736gcurPq.jpg",
        path: `/pages/pureWebview/pureWebview?link=${this.data.link}`
      }
    } else {
      // 常规活动分享内容
      return {
        title: "50+线下活动，让你的退休生活更精彩",
        path: `/pages/pureWebview/pureWebview?link=${this.data.link}`
      }
    }
  },
})
