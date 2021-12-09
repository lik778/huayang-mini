// huayangLife/lifeDetail/lifeDetail.js
import {
  queryWaterfallDetailInfo
} from "../../api/huayangLife/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1638840893RreULx.jpg",
    lifeId: "",
    list: null,
    detailInfo: null,
    playing: false
  },

  /* 查看大图 */
  amplification(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.list // 需要预览的图片http链接列表
    })
  },

  /* 播放暂停 */
  playEnd() {
    this.setData({
      playing: false
    })
  },

  /* 播放视频 */
  playVideo() {
    this.videoContext = wx.createVideoContext(`video`, this)
    this.setData({
      playing: true
    }, () => {
      setTimeout(() => {
        this.videoContext.play()
      }, 200)
    })
  },

  /* 获取详情信息 */
  getDetailInfo() {
    queryWaterfallDetailInfo({
      life_id: this.data.lifeId
    }).then(({
      data
    }) => {
      let list = data.material_url.split(',')
      this.setData({
        list,
        detailInfo: data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      id = ''
    } = options
    if (id) {
      this.setData({
        lifeId: id
      }, () => {
        this.getDetailInfo()
      })
    } else {
      wx.redirectTo({
        url: '/pages/discovery/discovery',
      })
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

  }
})