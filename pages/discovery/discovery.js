// pages/ discovery/discovery.js
import {
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  setLocalStorage,
  simpleDurationSimple
} from "../../utils/util"
import {
  checkAuth
} from "../../utils/auth"
import {
  getActivityList,
  getCampList,
  getFindBanner,
  getShowCourseList
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import request from "../../lib/request"
import {
  getYouZanAppId
} from "../../api/mall/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cureent: 0,
    campList: null,
    showModelBanner: false,
    didShowAuth: false,
    bannerList: null,
    canShow: false,
    courseList: null,
    modelBannerLink: "",
    activityList: null
  },
  // 获取授权
  getAuth() {
    this.setData({
      didShowAuth: true
    })
  },
  // 用户授权取消
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
    })
    this.initToCompetitonFun()
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
  // 封装跳转模特大赛事件
  initToCompetitonFun() {
    let activity_id = 29
    let user_id = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id
    let user_grade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
    // let baseUrl = `${request.baseUrl}/#/modelCompetition/introduce?activity_id=${activity_id}&user_id=${user_id}&user_grade=${user_grade}`
    let baseUrl = `${this.data.modelBannerLink}&user_id=${user_id}&user_grade=${user_grade}`
    baseUrl = encodeURIComponent(baseUrl)
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${baseUrl}&type=link`,
    })
  },
  // 跳转到模特大赛
  toModelCompetition(e) {
    if (hasUserInfo() && hasAccountInfo()) {
      this.setData({
        modelBannerLink: e.currentTarget.dataset.item.link
      })
      this.initToCompetitonFun()
    } else {
      this.setData({
        didShowAuth: true,
        modelBannerLink: e.currentTarget.dataset.item.link
      })
    }
  },

  // 处理是否显示模特大赛banner
  initModelBanner() {
    getFindBanner({
      scene: 9
    }).then(res => {
      this.setData({
        competitionBannerList: res
      })
    })
    let show = false
    let isStage = true //正式上线后需要置为false
    if (request.baseUrl === 'https://huayang.baixing.cn') {
      // 测试环境
      show = true
    } else if (isStage) {
      // 测试环境线上接口
      show = true
    } else {
      // 正式环境
      show = false
    }
    this.setData({
      showModelBanner: show
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
      setTimeout(() => {
        if (Number(getLocalStorage('needToScrollTop')) === 1) {
          wx.pageScrollTo({
            scrollTop: 0
          })
          wx.removeStorageSync('needToScrollTop')
        }
        this.setData({
          canShow: true
        })
      }, 20)
    })
  },

  // 处理轮播点击事件
  joinCampFrombanner(e) {
    let {
      link,
      link_type
    } = e.currentTarget.dataset.item
    bxPoint("applets_banner", {
      position: 'page/discovery/discovery'
    }, false)
    if (link_type === 'youzan') {
      getYouZanAppId().then(appId => {
        wx.navigateToMiniProgram({
          appId,
          path: link,
        })
      })
    } else {
      wx.navigateTo({
        url: link
      })
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
      this.getCourseList()
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
      this.getBanner()
    })
  },
  // 跳转到训练营详情
  joinCamp(e) {
    bxPoint("find_join", {
      join_type: "bootcamp"
    }, false)
    wx.navigateTo({
      url: `/subCourse/joinCamp/joinCamp?id=${e.currentTarget.dataset.index.id}&share=true`,
    })
  },
  // 检查用户是否引导
  checkUserGuide() {
    let didUserGuided = getLocalStorage('has_user_guide_page')
    if (getApp().globalData.firstViewPage) return
    if (didUserGuided !== 'yes') {
      wx.navigateTo({
        url: "/pages/coopen/coopen"
      })
      setLocalStorage('has_user_guide_page', 'yes')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      invite_user_id,
      source
    } = options
    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/');
      let [sceneSource = ''] = sceneAry;

      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
    } else {
      // 通过卡片进入
      if (invite_user_id) {
        getApp().globalData.super_user_id = invite_user_id
      }
      if (source) {
        getApp().globalData.source = source
      }
    }
    this.checkUserGuide()
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
      redirectPath: "/pages/discovery/discovery",
      redirectType: "switch"
    }).then(() => {
      this.initModelBanner()
      this.getCampList()
    })

    bxPoint("applets_find", {
      from_uid: getApp().globalData.super_user_id,
      source: getApp().globalData.source,
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
    return {
      title: "这里有好多好课，快来一起变美，变自信",
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})