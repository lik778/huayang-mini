// pages/webViewCommon/webViewCommon.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    isModel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = decodeURIComponent(options.link)
    if (!getLocalStorage(GLOBAL_KEY.accountInfo)) {
      // 处理webview没授权时候
      let authLink = "/pages/webViewCommon/webViewCommon?link=" + link
      authLink = encodeURIComponent(authLink)
      if (link.indexOf("activity_id=") !== -1 && !options.isModel) {
        wx.navigateTo({
          url: `/pages/auth/auth?redirectPath=${authLink}&fromWebView=1`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/auth/auth?redirectPath=${authLink}&fromWebView=1`,
        })
      }
    }
    if (options.isModel === 'true' || link.indexOf("activity_id=") !== -1) {
      // 通过activity_id判断是大赛banner解决分享问题
      let user_id = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id

      let user_grade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
      if (link.indexOf("activity_id=") !== -1 && !options.isModel) {
        link += `&user_id=${user_id}&user_grade=${user_grade}`
      }
      this.setData({
        baseUrl: encodeURIComponent(link),
        isModel: true
      })
    }
    console.log(link)
    this.setData({
      link: link
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
    if (this.data.isModel) {
      return {
        title: "2020上海花样时尚模特大赛投票正在火热进行中",
        path: `/pages/webViewCommon/webViewCommon?link=${this.data.baseUrl}&type=link`
      }
    }
  }
})