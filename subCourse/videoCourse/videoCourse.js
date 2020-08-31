// subCourse/videoCourse/videoCourse.js
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
    didShowAuth: false,
  },
  // 加入课程
  joinVideoCourse() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? '' : JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    if (userInfo === '') {
      this.setData({
        didShowAuth: true
      })
      return
    } else {
      console.log(userInfo)
    }
  },
  // 授权弹窗取消回调
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 授权弹窗确认回调
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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