// others/applyJoinClassResult/applyJoinClassResult.js
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channel: ''
  },
  showWxCode() {
    // JJ-2022-03-30
    bxPoint('post_changxue_free_get_success_contact ', {
      channel: this.data.channel || ""
    }, false)
    wx.previewImage({
      urls: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1647571047LaWGXt.jpg'],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.channel) {
      this.setData({
        channel: options.channel
      })
    }
    // JJ-2022-03-30
    bxPoint('post_changxue_free_get_success ', {
      channel: options.channel || ""
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