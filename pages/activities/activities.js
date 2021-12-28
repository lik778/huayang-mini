import { getActivityList } from "../../api/course/index"
import dayjs from "dayjs"
import { ROOT_URL } from "../../lib/config"
import request from "../../lib/request"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 10,
    list: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.run()
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
    bxPoint("activity_visit", {})
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
    if (!this.data.hasMore) return
    this.setData({offset: this.data.list.length})
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "50+线下活动，让你的退休生活更精彩",
      path: "/pages/activities/activities"
    }
  },
  // 启动函数
  run() {
    this.getList()
  },
  // 请求活动列表
  getList() {
    getActivityList({offset: this.data.offset, limit: this.data.limit, platform: 1, status: 1, sort: "begin_time"})
      .then(({list}) => {
        if (list.length < this.data.limit) {
          this.setData({hasMore: false})
        }
        list = list || []
        list = list.map(n => ({
          ...n,
          year: dayjs(n.start_time).year(),
          month: dayjs(n.start_time).month() + 1,
          date: dayjs(n.start_time).date(),
        }))
        let oldList = this.data.list.slice()
        this.setData({list: [...oldList, ...list]})
      })
  },
  goToPureWebview(e) {
    let {item} = e.currentTarget.dataset
    let link = ""
    switch (request.baseUrl) {
      case ROOT_URL.dev: {
        link = 'https://dev.huayangbaixing.com'
        break
      }
      case ROOT_URL.prd: {
        link = 'https://huayang.baixing.com'
        break
      }
    }

    bxPoint("activity_list_click", {
      activity_id: item.id,
      activity_title: item.title,
      activity_run_date: item.start_time
    }, false)

    link += `/#/home/detail/${item.id}`
    wx.navigateTo({url: `/pages/pureWebview/pureWebview?link=${link}`})
  },
  onContactLogoTap() {
    wx.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'},
      corpId: 'ww8d4cae43fb34dc92'
    })
  }
})
