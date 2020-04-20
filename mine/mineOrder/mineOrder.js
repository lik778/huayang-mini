// mine/mineOrder/mineOrder.js
import { getLocalStorage } from "../../utils/util"
import { getMineOrder } from "../../api/mine/index"
import { GLOBAL_KEY, THIRD_APPLETS_SOURCE } from "../../lib/config.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    orderData: []
  },
  // 获取订单列表
  getMineOrderData(e) {
    getMineOrder(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setData({
          orderData: res.data
        })
      }
    })
  },
  // 查看订单
  toOrder() {
    wx.navigateToMiniProgram({
      appId: THIRD_APPLETS_SOURCE.xinXuan.appId,
      path: "/pages/usercenter/dashboard/index",
      success() {
        console.log('success');
      },
      fail(e) {
        console.error(e);
      },
      complete() {
        console.log('complete');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
    // 获取订单列表
    this.getMineOrderData()
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

  }
})
