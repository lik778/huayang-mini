import { getActivityList, getRecommendOfflineCourse } from "../../api/course/index"
import { queryTravelList } from "../../api/live/index"
import request from "../../lib/request"
import { ROOT_URL } from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAGS: [
      { type: 1, title: "校友活动" },
      { type: 2, title: "游学课程" },
      { type: 3, title: "乐活课堂" },
    ],
    curTagIndex: 1,
    list: [],
    loading: false
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
      title: "花样老年大学过往活动风采秀",
      path: "/subCourse/historyActivity/historyActivity"
    }
  },
  run() {
    this.getList()
  },

  // 获取活动列表
  getList() {
    wx.showLoading({ mask: true, title: "加载中" })
    switch (this.data.curTagIndex) {
      case 1: {
        // 校友活动
        getActivityList({
          sort: "rank",
          status: 1,
          colleage_activity: 1,
          platform: 1,
          limit: 9999,
          offset: 0
        }).then(({list}) => {
          let prefix = request.baseUrl === ROOT_URL.dev ? "https%3A%2F%2Fdev.huayangbaixing.com%2F%23%2Fhome%2Fdetail%2F" : "https%3A%2F%2Fhuayang.baixing.com%2F%23%2Fhome%2Fdetail%2F"
          list = list || []
          list = list.map(n => ({
            cover: n.cover_url,
            title: n.title,
            link: `/pages/pureWebview/pureWebview?link=${prefix}${n.id}`
          }))
          this.setData({list})
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
        break;
      }
      case 2: {
        // 游学课程
        queryTravelList({offset: 0, limit: 9999}).then((data) => {
          data = data || []
          data = data.map((n) => ({
            cover: n.pics.split(",")[0],
            title: n.name,
            link: n.buy_link
          }))
          this.setData({list: data})
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
        break;
      }
      case 3: {
        // 乐活课堂
        getRecommendOfflineCourse().then(({data}) => {
          data = data || []
          data = data.map((n) => ({
            cover: n.cover_pic.split(",")[0],
            title: n.title,
            link: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${n.id}`
          }))
          this.setData({list: data})
          wx.hideLoading()
        }).catch(() => {
          wx.hideLoading()
        })
        break;
      }
    }
  },

  // 处理tag点击事件
  onTagTap(e) {
    let {index} = e.currentTarget.dataset
    this.setData({curTagIndex: Number(index)})

    this.getList()
  },

  onItemTap(e) {
    let {item} = e.currentTarget.dataset
    if (this.data.curTagIndex === 2) {
      // 游学课程
      wx.navigateToMiniProgram({
        appId: "wx2ea757d51abc1f47",
        path: item.link,
      })
    } else {
      wx.navigateTo({url: item.link})
    }
  }
})
