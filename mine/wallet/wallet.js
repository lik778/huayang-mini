// mine/wallet/wallet.js
import {
  getInviteList
} from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteList: ["", ""],
    wolletData:"",
    limit: 10,
    offset: 0
  },
  // 提现
  withdraw(){
    wx.showToast({
      title: '提示',
      duration:5000,
      icon:"none"
    })
  },
  // 获取小程序邀请列表
  inviteListData() {
    getInviteList(`offset=${this.data.offset}&limit=${this.data.limit}`).then(res => {
      res = res.data || []
      this.setData({
        inviteList: res
      })
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inviteListData()
    this.setData({
      wolletData:JSON.parse(options.wolletData),
      statusHeight:JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
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

  }
})