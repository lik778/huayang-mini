// pages/ discovery/discovery.js
import { getLocalStorage, simpleDurationSimple } from "../../utils/util"
import { checkAuth } from "../../utils/auth"
import { getActivityList, getCampList, getFindBanner, getShowCourseList } from "../../api/course/index"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import request from "../../lib/request"
import { getYouZanAppId } from "../../api/mall/index"

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
    bxPoint("find_join", {
      join_type: "kecheg"
    }, false)
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
  // 跳转到模特大赛
  toModelCompetition() {
    let data = JSON.stringify({
      activity_id: 29,
      user_id: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id,
      user_grade: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
    })
    let baseUrl = `${request.baseUrl}/#/modelCompetition/introduce?data=${data}`
    // let baseUrl = `${request.baseUrl}/#/modelCompetition/detail?id=816`
    baseUrl = encodeURIComponent(baseUrl)
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${baseUrl}&type=link`,
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

  // 处理轮播点击事件
  joinCampFrombanner(e) {
    let {link, link_type} = e.currentTarget.dataset.item
    bxPoint("applets_banner", {position: 'page/discovery/discovery'}, false)
    if (link_type === 'youzan') {
      getYouZanAppId().then(appId => {
        wx.navigateToMiniProgram({
          appId,
          path: link,
        })
      })
    } else {
      wx.navigateTo({url: link})
    }
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
    bxPoint("find_join", {join_type: "bootcamp"}, false)
    wx.navigateTo({
      url: `/subCourse/joinCamp/joinCamp?id=${e.currentTarget.dataset.index.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录分享人身份
    getApp().globalData.super_user_id = options.invite_user_id
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

    checkAuth({redirectPath: "/pages/discovery/discovery", redirectType: "switch"}).then(() => {
      this.getCampList()
      this.getBanner()
      this.getCourseList()
    })

    bxPoint("applets_find", {from_uid: getApp().globalData.super_user_id})
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
      title: "这里有好多好课，快来一起变美，变自信",
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})
