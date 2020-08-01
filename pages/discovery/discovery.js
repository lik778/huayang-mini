// pages/ discovery/discovery.js
import {
  getLocalStorage,
  simpleDurationSimple
} from "../../utils/util"
import {
  getHasJoinCamp,
  getCampList,
  getFindBanner,
  getShowCourseList,
  getActivityList
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
    campList: [],
    bannerList: [],
    courseList: [],
    activityList: []
  },
  // 加入课程
  toCourse(e) {
    wx.navigateTo({
      url: `/subCourse/practiceDetail/practiceDetail?courseId=${e.currentTarget.dataset.item}`,
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
      console.log(res)
    })
  },
  // 获取课程列表
  getCourseList() {
    getShowCourseList({
      offset: 0,
      limit: 2,
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
  // 获取banner列表
  getBanner() {
    getFindBanner({
      scene: 7,
      is_all: 0
    }).then(res => {
      this.setData({
        bannerList: res
      })
      console.log(res)
    })
  },
  // 获取训练营列表
  getCampList() {
    getCampList({
      offset: 0,
      limit: 2
    }).then(res => {
      this.setData({
        campList: res.list
      })
      console.log(res)
    })
  },
  // 跳转到训练营详情
  joinCamp(e) {
    let endTime = ''
    let pushTime = ''
    let data = e.target.dataset.index.start_date.split(",")
    for (let i in data) {
      if (endTime === '') {
        endTime = data[i]
      } else {
        if (Math.round(new Date(endTime) / 1000) > Math.round(new Date(data[i]) / 1000)) {
          endTime = data[i]
        }
      }
    }
    pushTime = endTime.split("-")[1] + "月" + endTime.split("-")[2] + "日"
    getHasJoinCamp({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      date: endTime,
      traincamp_id: e.target.dataset.index.id
    }).then(res => {
      if (res.length === 0) {
        wx.navigateTo({
          url: `/subCourse/joinCamp/joinCamp?id=${e.target.dataset.index.id}&time=${pushTime}`,
        })
      } else {
        wx.navigateTo({
          url: '/subCourse/campDetail/campDetail',
        })
      }
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCampList()
    this.getBanner()
    this.getCourseList()
    // this.getActivityList()
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
    // wx.navigateTo({
    //   url: '/subCourse/campDetail/campDetail',
    // })
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