// mine/joinSchool/joinSchool.js
import { GLOBAL_KEY } from "../../lib/config"
import { getLocalStorage } from "../../utils/util"
import request from "../../lib/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '0',
    webViewData: 0,
    baseUrl: "",
    statusHeight: ""
  },
  // 切换性别
  changeSex(e) {
    this.setData({
      radio: e.detail
    })
    console.log(e.detail)
  },
  getWebViewData(mobile) {
    this.setData({
      webViewData: JSON.stringify({
        userId: wx.getStorageSync(GLOBAL_KEY.userId),
        open_id: wx.getStorageSync(GLOBAL_KEY.openId),
      })
    })
    console.log(this.data.webViewData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (getLocalStorage(GLOBAL_KEY.accountInfo)===undefined) {
      // 未手机号授权
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    } else if (!JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).is_zhide_vip) {
      // 手机号授权，但不是vip
      wx.navigateTo({
        url: '/mine/joinVip/joinVip?from=article',
      })
    } else {
      this.getWebViewData()
      this.setData({
        statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
        baseUrl: request.baseUrl
      })
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

  }
})
