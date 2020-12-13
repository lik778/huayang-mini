import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskStream } from "../../api/task/index"
import { getCampDetail } from "../../api/course/index"

const NAME = "themeTaskPage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kecheng_type: undefined,
    kecheng_id: undefined,
    themeTaskList: [],
    mediaQueue: [],
    offset: 0,
    limit: 3,
    hasMore: true,
    themeBannerImage: "",
    themeTitle: "",
    didSignIn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {kecheng_type, kecheng_id} = options
    this.setData({kecheng_type, kecheng_id})
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getThemeTask(true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({didSignIn: hasAccountInfo() && hasUserInfo()})

    let needInitialPageName = getApp().globalData.needInitialPageName
    if (needInitialPageName === NAME) {
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      this.getThemeTask(true)
      getApp().globalData.needInitialPageName = ""
    }
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
    this.getThemeTask(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getThemeTask()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let taskId = e.target.dataset.taskid
    return {
      title: '作业秀分享文案',
      path: `/subCourse/indexTask/indexTask?taskId=${taskId}`
    }
  },
  goToJoinBootcamp() {
    wx.navigateTo({url: `/subCourse/joinCamp/joinCamp?id=${this.data.kecheng_id}`})
  },
  gotoBootcampDetail() {
    wx.navigateTo({url: `/subCourse/campDetail/campDetail?id=${this.data.kecheng_id}`})
  },
  goToLaunchTaskPage() {
    wx.navigateTo({url: `/subCourse/launchTask/launchTask?fromPageName=${NAME}themeType=${this.data.kecheng_type}&themeId=${this.data.kecheng_id}&themeTitle=${this.data.themeTitle}`})
  },
  back() {
    wx.navigateBack()
  },
  getDetail() {
    switch (+this.data.kecheng_type) {
      case 0: {
        // 训练营
        getCampDetail({
          traincamp_id: this.data.kecheng_id,
          user_id: getLocalStorage(GLOBAL_KEY.userId)
        }).then((data) => {
          data = data || []
          let { cover_pic, name } = data
          this.setData({themeBannerImage: cover_pic, themeTitle: name})
        })
      }
      case 1: {
        // 学院 TODO 学院banner找叶子设计
      }
    }
  },
  /**
   * 获取主题作业流
   */
  getThemeTask(refresh = false) {
    if (refresh) {
      this.setData({themeTaskList: []})
    }
    let params = {
      kecheng_type: this.data.kecheng_type,
      kecheng_id: this.data.kecheng_id,
      limit: this.data.limit,
      offset: refresh ? 0 : this.data.offset
    }
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      params.user_id = userId
    }
    getTaskStream(params).then(({data}) => {
      data = data || []
      let oldData = this.data.themeTaskList.slice()
      let themeTaskList = refresh ? [...data] : [...oldData, ...data]
      this.setData({themeTaskList, hasMore: data.length === this.data.limit, offset: themeTaskList.length})
    })
  },
  /**
   * 接受正在播放媒体的作业ID号
   */
  receiveTaskId(e) {
    let queue = this.data.mediaQueue.slice()
    let taskId = e.detail.taskId
    let isDifferent = queue[0] != taskId
    // 重置之前播放的所有媒体
    if (this.data.mediaQueue.length > 0 && isDifferent) {
      let comp = this.selectComponent(`#task-layout-${queue[0]}`)
      comp.resetMediaStatus()
      queue.shift()
    }

    // 缓存正要播放的媒体ID
    isDifferent && queue.push(taskId)
    this.setData({mediaQueue: queue})
  },
})
