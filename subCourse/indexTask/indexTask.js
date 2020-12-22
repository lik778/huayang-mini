import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskDetail } from "../../api/task/index"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: undefined,
    nickname: undefined,
    indexTaskList: [],
    offset: 0,
    limit: 1,
    didShowAuth: false,
    cachedAction: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { taskId, nickname } = options
    this.setData({taskId, nickname})

    bxPoint("pv_share_task_page", {})
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
    this.getDetail()
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
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
      title: `${this.data.nickname}的作业很棒哦，快来看看吧！`,
      path: `/subCourse/indexTask/indexTask?taskId=${this.data.taskId}&nickname=${this.data.nickname}`
    }
  },
  /**
   * [取消]点赞事件触发
   */
  onThumbChange(e) {
    if (e.detail.thumbType === "like") {
      // 送花
      let comp = this.selectComponent("#flower")
      comp.star()
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
   * 调整到首页查看更多内容
   */
  goToDiscoveryPage() {
    wx.switchTab({url: "/pages/discovery/discovery"})
  },
  /**
   * 获取作业详情
   */
  getDetail() {
    let params = {
      limit: this.data.limit,
      offset: this.data.offset,
      work_id: this.data.taskId
    }
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      params.user_id = userId
    }
    getTaskDetail(params).then(({data}) => {
      data = data || {}
      data = {
        ...data,
        kecheng_work: {...data.work},
        work_comment_list: data.comment_list,
      }

      this.setData({indexTaskList: [data]})
    })
  }
})
