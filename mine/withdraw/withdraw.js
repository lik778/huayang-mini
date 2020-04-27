// mine/withdraw/withdraw.js
import {
  getLocalStorage
} from "../../utils/util"
import {GLOBAL_KEY} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyboardHeight: 0,
    canWithdrawPrice: 224.3,
    inputValue: "",
    statusHeight: 0,
  },
  // 输入框改变输入
  changeInputValue(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 获取焦点处理定位
  getFocus(e) {
    this.setData({
      keyboardHeight: parseInt(e.detail.height) + 20
    })
  },
  // 失去焦点定位复位
  leaveFocus() {
    this.setData({
      keyboardHeight: 20
    })
  },
  // 全部提现
  allWithdraw() {
    this.setData({
      inputValue: this.data.canWithdrawPrice
    })
  },
  // 体现
  withdraw() {
    wx.navigateTo({
      url: '/mine/withdrawResult/withdrawResult?money=' + this.data.inputValue,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
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

})