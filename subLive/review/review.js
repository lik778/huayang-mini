// subLive/review/review.js
import { getLiveInfo } from "../../api/live/course"

Page({

  /**
   * 页面的初始数据
   */
  data: {},
  haveMore() {
    // TODO 临时处理后续迭代
    wx.navigateTo({
      url: '/subLive/courseList/courseList?id=25'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({roomId}) {
    // this.setData({
    //   link: options.roomId || ''
    // })
    getLiveInfo({zhibo_room_id: roomId}).then((response) => {
      console.log(response)
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
