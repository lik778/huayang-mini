// mine/vipWelfare/vipWelfare.js
import request from "../../lib/request"
import {
  GLOBAL_KEY
} from "../../lib/config.js"
import {
  getLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: request.baseUrl
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
    if (!getLocalStorage(GLOBAL_KEY.userId)) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else if (!JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).is_zhide_vip) {
      wx.navigateTo({
        url: `/mine/joinVip/joinVip?from=vipWelfare`,
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})