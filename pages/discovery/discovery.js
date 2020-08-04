// pages/ discovery/discovery.js
import {
  getLocalStorage,
  simpleDurationSimple
} from "../../utils/util"
import {
  checkAuth
} from "../../utils/auth"
import {
  getActivityList,
  getCampList,
  getFindBanner,
  getHasJoinCamp,
  getShowCourseList
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cureent: 0,
    campList: null,
    bannerList: null,
    courseList: null,
    activityList: null
  },
  // 加入课程
  toCourse(e) {
    wx.navigateTo({
      url: `/subCourse/practiceDetail/practiceDetail?courseId=${e.currentTarget.dataset.item.id}`,
    })
  },
  // swiper切换
  changeSwiperIndex(e) {
    this.setData({
      cureent: e.detail.current
    })
  },
  // 获取活动列表
  getActivityList() {
    getActivityList({
      offset: 0,
      limit: 2,
      status: 1
    }).then(res => {
      this.setData({
        activityList: res.list
      })
    })
  },
  // 获取课程列表
  getCourseList() {
    getShowCourseList({
      offset: 0,
      limit: 50,
    }).then(res => {
      for (let i in res) {
        res[i].duration = simpleDurationSimple(res[i].duration)
        res[i].listNum = res[i].link.split("##").length
      }
      this.setData({
        courseList: res
      })
    })
  },

  // 点击banner，跳转训练营
  joinCampFrombanner(e) {
    let data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: data.link,
    })
  },

  // 获取banner列表
  getBanner() {
    getFindBanner({
      scene: 8,
      is_all: 0
    }).then(res => {
      this.setData({
        bannerList: res
      })
    })
  },
  // 获取训练营列表
  getCampList() {
    getCampList({
      offset: 0,
      limit: 50
    }).then(res => {
      this.setData({
        campList: res.list
      })
    })
  },
  // 跳转到训练营详情
  joinCamp(e) {
    wx.navigateTo({
      url: `/subCourse/joinCamp/joinCamp?id=${e.currentTarget.dataset.index.id}`,
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    checkAuth({
      listenable: false,
      ignoreFocusLogin: true
    }).then(() => {
      this.getCampList()
      this.getBanner()
      this.getCourseList()
    })
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