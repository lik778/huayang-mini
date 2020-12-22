import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskStream, getTaskUserInfo } from "../../api/task/index"
import bxPoint from "../../utils/bxPoint"

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
    isOwnner: false,
    didShowAuth: false,
    cachedAction: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {visit_user_id} = options
    this.setData({visit_user_id})

    bxPoint("pv_person_task_page", {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPersonTask(true)
    this.getUserInfo()
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
      this.getUserInfo()
      getApp().globalData.needInitialPageName = ""
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 在页面隐藏前，移除媒体队列
    if (this.data.mediaQueue.length > 0) {
      let queue = this.data.mediaQueue.slice()
      // 重置之前播放的所有媒体
      let comp = this.selectComponent(`#task-layout-${queue[0]}`)
      comp.resetMediaStatus()
      queue.shift()

      // 缓存正要播放的媒体ID
      this.setData({mediaQueue: queue})
    }
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
    if (e.target) {
      let {taskid, nickname, userid} = e.target.dataset
      return {
        imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
        title: `${nickname}的作业很棒哦，快来看看吧！`,
        path: `/subCourse/indexTask/indexTask?taskId=${taskid}&nickname=${nickname}&userId=${userid}`
      }
    } else {
      return {
        imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
        title: `${this.data.visit_user_info.nick_name}的精彩作业秀`,
        path: `/subCourse/personTask/personTask?visit_user_id=${this.data.visit_user_id}`
      }
    }
  },
  /**
   * 处理未登录状态
   */
  onNoAuth(e) {
    if (e) {
      this.setData({cachedAction: e.detail.cb})
    }
    this.setData({didShowAuth: true})
  },
  // 用户授权取消
  authCancelEvent() {
    this.setData({didShowAuth: false, cachedAction: null})
  },
  // 用户确认授权
  authCompleteEvent() {
    if (this.data.cachedAction) {
      this.data.cachedAction()
      this.setData({cachedAction: null})
    }
    this.setData({didShowAuth: false})
  },
  /**
   * [取消]点赞事件触发
   */
  onThumbChange(e) {
    this.getUserInfo()
    if (e.detail.thumbType === "like") {
      // 送花
      let comp = this.selectComponent("#flower")
      comp.star()
    }
  },
  /**
   * 跳转发布页
   */
  goToLaunchTaskPage() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({url: "/subCourse/launchTask/launchTask?fromPageName=" + NAME})
    } else {
      this.onNoAuth({detail: { cb: () => {wx.navigateTo({url: "/subCourse/launchTask/launchTask?fromPageName=" + NAME})} }})
    }
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

    let len = newData.filter(n => $notNull(n)).length

    // 删除自己作业后，剩余作业小于2继续往后加载数据
    if (len < 2) {
      this.getPersonTask()
    }

    this.setData({personTaskList: [...newData]})
    this.getUserInfo()
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
