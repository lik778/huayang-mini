import { getFissionDetail, getVideoCourseDetail, joinFissionTask } from "../../api/course/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo, payCourse } from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"
import { collectError } from "../../api/auth/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    conclude: false, // 用户是否已经完成邀请任务
    series_invite_id: 0,
    videoId: 0,
    taskInfo: {},
    invitedUserAry: [],
    total: 0,
    alreadyInvitedNo: 0,
    diffInviteNo: "",
    subTitle: "免费学习课程",
    btnTitle: "加入课程",
    process: 0,
    fissionPrice: 0,
    lock: false,
    courseName: "花样好课"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      invite_user_id = "",
      source,
      series_invite_id = "",
      videoId = 0,
      fissionPrice = 0
    } = options
    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/');
      let [sceneSource = '', scene_series_invite_id] = sceneAry;

      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }

      if (scene_series_invite_id) {
        this.setData({series_invite_id: scene_series_invite_id})
      }

    } else {
      // 通过卡片进入
      if (invite_user_id) {
        getApp().globalData.super_user_id = invite_user_id
      }
      if (source) {
        getApp().globalData.source = source
      }
      this.setData({series_invite_id, videoId})
    }

    this.setData({ fissionPrice: (+fissionPrice).toFixed(2) })

    this.getCourseInfo()
    this.getFissionInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight})
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
      title: "找到一个好课，请帮我解锁课程，和我一起来学习",
      path: `/subCourse/receiveCourseList/receiveCourseList?series_invite_id=${this.data.series_invite_id}&fissionPrice=${this.data.fissionPrice}`
    }
  },
  goBack() {
    let historyRoute = getCurrentPages()
    if (historyRoute.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({url: "/pages/discovery/discovery"})
    }
  },
  buy() {
    // 检查权限
    if (!(hasAccountInfo() && hasUserInfo())) {
      // this.setData({didShowAuth: true})
      return
    }

    if (this.data.lock) return
    this.setData({lock: true})

    joinFissionTask({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      invite_id: this.data.series_invite_id
    }).then((res) => {
      if (res === "success") {
        this.backFun({type: "success"})
      } else if (res.num) {
        payCourse({
          id: res.id,
          name: '加入视频课程'
        })
          .then(res => {
          // 设置顶部标题
          if (res.errMsg === "requestPayment:ok") {
            this.backFun({type: "success"})
          } else {
            this.backFun({type: "fail"})
          }
        })
          .catch(err => {
            collectError({
              level: ErrorLevel.p0,
              page: "invitePage.requestPayment",
              error_code: 401,
              error_message: err
            })
          this.backFun({type: "fail"})
        })
      }
    })
  },
  // 集中处理支付回调
  backFun({type}) {
    if (type === 'fail') {
      this.setData({lock: false})
      wx.showToast({
        title: '支付失败',
        icon: "none",
        duration: 2000
      })
    } else {
      let self = this
      wx.showToast({
        title: '加入成功',
        icon: "success",
        duration: 2000,
        success() {
          setTimeout(() => {
            wx.redirectTo({url: `/subCourse/videoCourse/videoCourse?videoId=${self.data.taskInfo.kecheng_series_id}`})
          }, 2000)
        }
      })
    }
  },
  handleShareTap() {},
  getCourseInfo() {
    getVideoCourseDetail({series_id: this.data.videoId})
      .then((info) => {this.setData({ courseName: info.series_detail.name })})
  },
  getFissionInfo() {
    getFissionDetail({series_invite_id: this.data.series_invite_id}).then((data) => {
      let {kecheng_series_invite: taskInfo = {}, series_invite_user_list: invitedUserAry = []} = data
      let {invite_count = 0, current_count = 0, invite_discount = 0} = taskInfo;
      let diffInviteNumber = parseInt(invite_count - current_count);
      this.setData({
        taskInfo,
        invitedUserAry: invitedUserAry.slice(0, 15),
        total: invite_count,
        alreadyInvitedNo: current_count > invite_count ? invite_count : current_count,
        diffInviteNo: diffInviteNumber <= 0 ? 0 : diffInviteNumber,
        subTitle: invite_discount > 0 ? `${(invite_discount / 10)}折学习课程` : "免费学习课程",
        btnTitle: invite_discount > 0 ? `${(invite_discount / 10)}折优惠购` : "加入课程",
        process: (current_count % invite_count / invite_count * 100),
        conclude: +current_count >= +invite_count
      })
    })
  }
})
