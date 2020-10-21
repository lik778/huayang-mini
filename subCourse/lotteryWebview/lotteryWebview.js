// subCourse/lotteryWebview/lotteryWebview.js
import request from "../../lib/request"
import {
  getLotteryActivityData
} from "../../api/course/index"
import {
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    activityData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      activity_id
    } = options
    // 获取抽奖活动信息
    getLotteryActivityData({
      activity_id
    }).then(res => {
      this.setData({
        activityData: res
      })
      // 判断授权信息
      if (hasAccountInfo() && hasUserInfo()) {
        let link = ''
        let userId = JSON.parse(getLocalStorage(GLOBAL_KEY.userId))
        if (request.baseUrl === 'https://huayang.baixing.cn') {
          // 测试环境
          if (res.win_type === 'laohuji') {
            link = `https://huayang.baixing.cn/#/home/miniprogram/lottery?activity_id=${activity_id}&user_id=${userId}`
          }
        } else {
          // 生产环境
          if (res.win_type === 'laohuji') {
            link = `https://huayang.baixing.com/#/home/miniprogram/lottery?activity_id=${activity_id}&user_id=${userId}`
          }
        }
        this.setData({
          src: link
        })
      } else {
        let redirectPath = `/subCourse/lotteryWebview/lotteryWebview?activity_id=${activity_id}`
        redirectPath = encodeURIComponent(redirectPath)
        wx.navigateTo({
          url: `/pages/auth/auth?redirectPath=${redirectPath}&needDecode=true`,
        })
      }
    })


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
      title: this.data.activityData.title,
      path: `/subCourse/lotteryWebview/lotteryWebview?activity_id=${this.data.activityData.id}`
    }
  }
})