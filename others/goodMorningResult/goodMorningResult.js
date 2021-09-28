// others/goodMorningResult/goodMorningResult.js
import bxPoint from "../../utils/bxPoint"
import request from "../../lib/request"
import {
  isIphoneXRSMax
} from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharer: false,
    posterBg: '',
    isIphoneXRSMax: isIphoneXRSMax()
  },

  /* 保存相册 */
  saveToAlbums() {
    /* 海报生成后，"保存相册"按钮点击dad */
    bxPoint("morning_poster_save_click", {}, false)
    wx.getImageInfo({
      src: this.data.posterBg,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (res1) => {
            if (res1.errMsg === 'saveImageToPhotosAlbum:ok') {
              wx.showToast({
                title: '保存成功'
              })
            }
          },
          fail: () => {
            wx.showToast({
              title: "保存失败",
              icon: 'none'
            });
          }
        })
      }
    })
  },

  /* 花样精彩视频点击 */
  wonderfulVideo() {
    /* 分享卡片进入后,"花样精彩视频"按钮点击打点 */
    bxPoint("shared_morning_poster_vedio_click", {}, false)
    this.toIndex()
  },

  /* 分享好友点击打点 */
  share() {
    bxPoint("morning_poster_share_click", {}, false)
  },

  /* 早安签到按钮点击 */
  goodMorningSignIn() {
    /* 分享卡片进入后,"早安签到"按钮点击打点 */
    bxPoint('shared_morning_poster_sign_click', {}, false)
    let isDev = request.baseUrl === 'https://dev.huayangbaixing.com' ? true : false
		let link = isDev ? 'https://dev.huayangbaixing.com/#/signIn/playbill/miniprogram' : 'https://huayang.baixing.com/#/signIn/playbill/miniprogram'
    wx.navigateTo({
      url: `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(link)}`,
    })
  },

  /* 花样精彩视频+早安签到 */
  toIndex() {
    wx.switchTab({
      url: '/pages/discovery/discovery',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      img,
      sharer = false
    } = options
    console.log(options)
    this.setData({
      sharer,
      posterBg: img
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
    return {
      title: "打开查看我与你分享的心情",
      imageUrl: this.data.posterBg,
      path: `/others/goodMorningResult/goodMorningResult?img=${this.data.posterBg}&sharer=true`
    }
  }
})