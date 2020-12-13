import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskStream, getTaskUserInfo } from "../../api/task/index"

const NAME = "personTaskPage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visit_user_id: undefined,
    visit_user_info: null,
    personTaskList: [],
    mediaQueue: [],
    offset: 0,
    limit: 3,
    hasMore: true,
    isOwnner: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {visit_user_id} = options
    this.setData({visit_user_id})
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPersonTask(true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let current_user_id = getLocalStorage(GLOBAL_KEY.userId)
    this.setData({isOwnner: current_user_id == this.data.visit_user_id})

    let needInitialPageName = getApp().globalData.needInitialPageName
    if (needInitialPageName === NAME) {
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      this.getPersonTask(true)
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
    this.getPersonTask(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getPersonTask()
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
  /**
   * 取消点赞回调
   */
  onUmthumbed() {
    let oldData = {...this.data.visit_user_info}
    this.setData({visit_user_info: { ...oldData, like_count: oldData.like_count - 1 }})
  },
  /**
   * 点赞回调
   */
  onThumbed() {
    let oldData = {...this.data.visit_user_info}
    this.setData({visit_user_info: { ...oldData, like_count: oldData.like_count + 1 }})
  },
  /**
   * 跳转发布页
   */
  goToLaunchTaskPage() {
    wx.navigateTo({url: "/subCourse/launchTask/launchTask?fromPageName=" + NAME})
  },
  /**
   * 获取用户作业相关信息
   */
  getUserInfo() {
    getTaskUserInfo({user_id: this.data. visit_user_id}).then(({data}) => {
      this.setData({visit_user_info: data})
    })
  },
  /**
   * 获取个人作业流
   */
  getPersonTask(refresh = false) {
    if (refresh) {
      this.setData({personTaskList: []})
    }
    let params = {
      visit_user_id: this.data.visit_user_id,
      limit: this.data.limit,
      offset: refresh ? 0 : this.data.offset
    }
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      params.user_id = userId
    }
    getTaskStream(params).then(({data}) => {
      data = data || []
      let oldData = this.data.personTaskList.slice()
      let personTaskList = refresh ? [...data] : [...oldData, ...data]
      this.setData({personTaskList, hasMore: data.length === this.data.limit, offset: personTaskList.length})
    })
  },
  /**
   * 删除自己的作业
   * @param e
   */
  removeTask(e) {
    let oldData = this.data.personTaskList.slice()
    let newData = oldData.map((item) => {
      if ($notNull(item) && (item.kecheng_work.id != e.detail.taskId)) {
        return item
      }
      return null
    })

    this.setData({personTaskList: [...newData]})
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
