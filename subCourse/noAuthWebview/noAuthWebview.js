// subCourse/noAuthWebview/noAuthWebview.js
import {
  hasAccountInfo
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    needAuthMsg: '',
    changeTitle: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      link,
      needAuthMsg = false
    } = options
    link = decodeURIComponent(link)
    if (needAuthMsg) {
      let hasLogin = hasAccountInfo() ? true : ''
      link = link + '&login=' + hasLogin
      this.setData({
        needAuthMsg: needAuthMsg
      })
    }
    if (link.indexOf('huayangDouyinCps') !== -1) {
      this.setData({
        changeTitle: true
      })
    }
    console.log(link)
    this.setData({
      link
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

    let path = this.data.needAuthMsg ? `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(this.data.link)}&login=${this.data.needAuthMsg}` : `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(this.data.link)}`
    let title = this.data.changeTitle ? '花样大学精品课程包' : ''
    return {
      title: title,
      path: path
    }
  }
})