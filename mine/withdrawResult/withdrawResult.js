// mine/withdrawResult/withdrawResult.js
import {
  getUserInfo
} from "../../api/mine/index"
import {
  getLocalStorage,
  setLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getUserInfo('scene=zhide').then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 返回推广页
  backPromotion() {
    wx.redirectTo({
      url: '/mine/promotion/promotion',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
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