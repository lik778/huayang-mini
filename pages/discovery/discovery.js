// pages/ discovery/discovery.js
import { getLocalStorage, hasAccountInfo, hasUserInfo, setLocalStorage, simpleDurationSimple } from "../../utils/util"
import request from "../../lib/request"
import {
  getActivityList,
  getCampList,
  getFindBanner,
  getShowCourseList,
  getVideoCourseList,
  liveTotalNum
} from "../../api/course/index"
import { GLOBAL_KEY, Version } from "../../lib/config"
import { checkFocusLogin } from "../../api/auth/index"
import bxPoint from "../../utils/bxPoint"
import { getYouZanAppId } from "../../api/mall/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cureent: 0,
    liveNum: 0,
    showMoney: true,
    campList: null,
    showModelBanner: false,
    didShowAuth: false,
    isModelLink: true,
    bannerList: null,
    canShow: false,
    courseList: null,
    videoList: '',
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
    if (this.data.isModelLink) {
      wx.navigateTo({
        url: `/pages/webViewCommon/webViewCommon?link=${baseUrl}&type=link&isModel=true`,
      })
    } else {
      wx.navigateTo({
        url: this.data.modelBannerLink,
      })
    }

  },
  // 跳转到模特大赛
  toModelCompetition(e) {
    if (hasUserInfo() && hasAccountInfo()) {
      this.setData({
        isModelLink: true,
        modelBannerLink: e.currentTarget.dataset.item.link
      })
      this.initToCompetitonFun()
    } else {
      this.setData({
        didShowAuth: true,
        isModelLink: true,
        modelBannerLink: e.currentTarget.dataset.item.link
      })
    }
  },

  // 处理是否显示模特大赛banner
  initModelBanner() {
    getFindBanner({
      // scene: 9
      scene: 11
    }).then(res => {
      this.setData({
        competitionBannerList: res,
        showModelBanner: res.length === 0 ? false : true
      })
    })
  },
  // 跳往视频课程全部列表
  toVideoList(e) {
    if (e.currentTarget.dataset.index) {
      let link = e.currentTarget.dataset.item
      wx.navigateTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/videoCourseList/videoCourseList`
      })
    }
  },
  // 获取视频课程列表banner
  getVideoBanner() {
    getFindBanner({
      scene: 13
    }).then(res => {
      this.setData({
        videoBannerList: res
      })
    })
  },
  // 跳转至直播列表
  toLiveList() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  // 获取视频课程列表
  getVideoCourse() {
    getVideoCourseList({
      limit: 50
    }).then(list => {
      let handledList = list.map((res) => {
        res.price = (res.price / 100).toFixed(2)
        if (res.discount_price === -1 && res.price > 0) {
          // 原价出售
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.price * res.invite_discount / 10000).toFixed(2)
          }
        } else if (res.discount_price >= 0 && res.price > 0) {
          // 收费但有折扣
          res.discount_price = (res.discount_price / 100).toFixed(2)
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
          }
        } else if (+res.discount_price === -1 && +res.price === 0) {
          res.discount_price = 0
        }

        // 只显示开启营销活动的数据
        if (+res.invite_open === 1) {
          res.tipsText = res.fission_price == 0 ? "邀请好友助力免费学" : `邀请好友助力${(res.invite_discount / 10)}折购`
        } else {
          res.tipsText = `${res.discount_price == 0 ? "免费" : "¥" + Number(res.discount_price).toFixed(2)}`
        }

        return res
      })
      this.getVideoBanner()
      this.setData({videoList: handledList})
    })
  },
  // 跳往视频详情页
  toVideoDetail(e) {
    let id = e.currentTarget.dataset.item.id
    bxPoint("series_discovery_click", {series_id: id}, false)
    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
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
          let query = wx.createSelectorQuery()
          let height = 0
          query.select('#swiper-box').boundingClientRect((rect) => {
            height = rect ? rect.height : 0
          }).exec()
          query.select('#video-course').boundingClientRect((rect) => {
            height = rect ? rect.height : 0
            wx.pageScrollTo({
              duration: 100,
              scrollTop: height
            })
            wx.removeStorageSync('needToScrollTop')
          }).exec()
        }
        this.setData({
          canShow: true
        })
      }, 100)
    })
  },

  // 处理轮播点击事件
  joinCampFrombanner(e) {
    if (e.currentTarget.dataset.item.need_auth === 1) {
      if (!hasUserInfo() || !hasAccountInfo()) {
        let link = e.currentTarget.dataset.item.link
        this.setData({
          didShowAuth: true,
          modelBannerLink: link,
          isModelLink: false
        })
        return
      }
    }
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
  // 临时跳转至抽奖工具
  toWebview() {
    if (request.baseUrl === 'https://huayang.baixing.cn') {
      wx.navigateTo({
        url: '/subCourse/lotteryWebview/lotteryWebview?activity_id=2',
      })
    }
  },
  // 获取banner列表
  getBanner() {
    getFindBanner({
      scene: 8
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
      this.getVideoCourse()
      this.getBanner()
      // 获取直播列表个数
      this.getLiveTotalNum()
    })
  },
  // 获取直播列表个数
  getLiveTotalNum() {
    liveTotalNum().then(res => {
      this.setData({
        liveNum: res
      })
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
  // 检查ios环境
  checkIos() {
    checkFocusLogin({
      app_version: Version
    }).then(res1 => {
      let _this = this
      if (!res1) {
        wx.getSystemInfo({
          success: function (res2) {
            if (res2.platform == 'ios') {
              _this.setData({
                showMoney: false
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      invite_user_id = "",
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
    // 处理ios
    this.checkIos()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    this.initModelBanner()
    this.getCampList()
    bxPoint("applets_find", {
      from_uid: getApp().globalData.super_user_id,
      source: getApp().globalData.source,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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
  onReachBottom: function () {},

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
