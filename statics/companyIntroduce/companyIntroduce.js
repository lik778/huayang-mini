import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeElStartHeight: 0,
    milestoneHeight: 0,
    reports: [
      {title: "《环球时报》专题报道花样时尚模特大赛", link: "https://mp.weixin.qq.com/s/fZUjzT7iZpVIHaxIzj-xBg"},
      {title: "《福布斯》杂志专访花样百姓创始人罗颖女士", link: "https://mp.weixin.qq.com/s/X6pBmQKS7lRSe3jNHy9r3A"},
      {title: "《新民晚报》专题报道花样大学", link: "https://mp.weixin.qq.com/s/2gt-xFNC9ga9S6eZBmzJHQ"},
      {title: "《ELLE》杂志专题报道花样百姓系列活动", link: "https://mp.weixin.qq.com/s/Fs8XlQVBsIsdMtsS-Q-lcQ"},
      {title: "上海电视台新闻综合频道专题报道花样时尚模特大赛", link: "https://mp.weixin.qq.com/s/E4KMTXfRpsBzLgXWNtwvjQ"},
    ]
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
    this.run()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    bxPoint("huayang_introduction_page", {})
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
      title: "花样百姓成立于2019年，是百姓网集团旗下全资子公司",
      path: "/statics/companyIntroduce/companyIntroduce",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1645149947vprRkf.jpg"
    }
  },

  run() {
    let self = this;
    let query = wx.createSelectorQuery().in(this);
    query.select('#time-el-start').boundingClientRect(function (res) {
      self.setData({timeElStartHeight: res.top})
    }).exec()

    query.select('#time-el-end').boundingClientRect(function (res) {
      self.setData({milestoneHeight: res.top - self.data.timeElStartHeight})
    }).exec()
  },

  goToReport(e) {
    let {link, title} = e.currentTarget.dataset.item
    bxPoint("huayang_introduction_media_news", {media_news_title: title}, false)
    wx.navigateTo({url: `/pages/pureWebview/pureWebview?link=${link}`});
  }
})
