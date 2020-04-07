// mine/wallet/wallet.js
import {
  getInviteList
} from "../../api/mine/index"
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
      wolletData:JSON.parse(options.wolletData)
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