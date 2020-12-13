import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskDetail } from "../../api/task/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: undefined,
    indexTaskList: [],
    offset: 0,
    limit: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { taskId } = options
    this.setData({taskId})
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
