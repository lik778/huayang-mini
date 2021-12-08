// huayangLife/lifeDetail/lifeDetail.js
import {
  queryWaterfallDetailInfo
} from "../../api/huayangLife/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeId: ""
  },

  /* 获取详情信息 */
  getDetailInfo() {
    queryWaterfallDetailInfo({
      life_id: this.data.lifeId
    }).then(({
      data
    }) => {
      console.log(data)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      id = ''
    } = options
    if (id) {
      this.setData({
        lifeId: id
      }, () => {
        this.getDetailInfo()
      })
    } else {
      wx.redirectTo({
        url: '/pages/discovery/discovery',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})