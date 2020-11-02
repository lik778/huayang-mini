import { getActivityDetail } from "../../api/mine/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */

  data: {
    link: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { link = "" } = options

    if (hasUserInfo() && hasAccountInfo()) {
      this.setData({link: decodeURIComponent(link)})
    } else {
      let url = "/pages/activePlatform/activePlatform?link=" + decodeURIComponent(link)
      wx.navigateTo({url: `/pages/auth/auth?redirectType=redirect&didNeedDecode=1&redirectPath=${encodeURIComponent(url)}`})
    }
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
  onShareAppMessage: async function () {
    let mats = this.data.link.match(/detail\/(\w+)/)
    let title = "花样活动"
    if (mats.length >= 2) {
      let detail = await getActivityDetail({activity_id: mats[1], user_id: getLocalStorage(GLOBAL_KEY.userId)})
      title = detail.share_title
    }

    return {
      title,
      link: "/pages/activePlatform/activePlatform?link=" + encodeURIComponent(this.data.link)
    }
  }
})
