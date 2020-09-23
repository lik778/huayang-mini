// subCourse/competitionWebview/competitionWebview.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getUserInfo
} from "../../api/mine/index"
import {
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  setLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewLink: "", //webview地址
    shareLink: "", //分享地址
  },

  // 确保webview用户信息是最新的
  getUserSingerInfo() {
    return new Promise(resolve => {
      getUserInfo('scene=zhide').then(res => {
        setLocalStorage(GLOBAL_KEY.accountInfo, res)
        resolve()
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = decodeURIComponent(options.link)
    let shareLink = options.link
    if (hasAccountInfo() && hasUserInfo()) {
      this.getUserSingerInfo().then(() => {
        let userId = JSON.parse(getLocalStorage(GLOBAL_KEY.userId))
        let userGrade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
        // 授过权了
        let allLink = link.indexOf('?') !== -1 ? `${link}&user_id=${userId}&user_grade=${userGrade}` : `${link}?user_id=${userId}&user_grade=${userGrade}`
        this.setData({
          webViewLink: allLink
        })
      })
    } else {
      // 未授权
      wx.navigateTo({
        url: `/pages/auth/auth?redirectPath=${encodeURIComponent(`/subCourse/competitionWebview/competitionWebview?link=${shareLink}`)}&redirectType=navigation&fromWebView=1`,
      })
    }
    this.setData({
      shareLink
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
      title: "2020上海花样时尚模特大赛投票正在火热进行中",
      path: `/subCourse/competitionWebview/competitionWebview?link=${this.data.shareLink}`
    }
  }
})