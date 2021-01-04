// subCourse/schoolReportResult/schoolReportResult.js
import {
  getLocalStorage
} from "../../utils/util";
import {
  GLOBAL_KEY
} from "../../lib/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: ""
  },

  // 返回
  back() {
    wx.navigateTo({
      url: `/subCourse/campDetail/campDetail?id=${this.data.info.campId}&share=true`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data)
    console.log(options.data)
    this.setData({
      info: data
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
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
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