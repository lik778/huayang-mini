// subCourse/trainingCampDetail/trainingCampDetail.js
import {
  getCampDetail
} from "../../api/course/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campData: "",
    showCover: true,
    showPlayIcon: true,
    iconSrcList: {
      course: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925TZrmey.jpg',
      video: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925iFZICS.jpg',
      product: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925fmEUmR.jpg',
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925KAfZPv.jpg',
      lock: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596613255fHAzmw.jpg',
    },
    advertisingIndex: 0,
    advertisingList: ['https://goss.veer.com/creative/vcg/veer/800water/veer-360547308.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-353816507.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-351568172.jpg'],
  },

  // 轮播切换
  changeAdvertisingIndex(e) {
    this.setData({
      advertisingIndex: Number(e.detail.current)
    })
  },

  // 视频播放
  playVideo() {
    this.setData({
      showCover: false,
      showPlayIcon: false
    })
    this.videoContext.play()
    this.videoContext.requestFullScreen()
  },

  // 进/退全屏
  enterFull(e) {
    if (e.detail.fullscreen === false) {
      this.videoContext.pause()
      this.setData({
        showPlayIcon: true,
        showCover: true
      })
    }
  },

  // 获取训练营详情
  getCampDetailData(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      console.log(res)
      this.setData({
        campData: res
      })
      this.setTitile()
    })
  },

  // 跳转至训练营日期切换
  toChangeDate() {
    wx.navigateTo({
      url: '/subCourse/campPeriodList/campPeriodList',
    })
  },

  // 设置导航栏标题
  setTitile() {
    wx.setNavigationBarTitle({
      title: this.data.campData.name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCampDetailData(options.id)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
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