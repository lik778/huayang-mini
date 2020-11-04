// mine/promotionRrecord/promotionRrecord.js
import {
  getPromotionRecord
} from "../../api/markting/course"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 2,
    pageData: {
      offset: 0,
      limit: 10
    },
    list: ""
  },

  // 去往推广页
  toPromotion() {
    wx.navigateTo({
      url: '/mine/promotion/promotion',
    })
  },

  // 获取推广记录
  getList() {
    getPromotionRecord(this.data.pageData).then(res => {
      let list = res.data.list
      if (list.kecheng_promote_record !== null) {
        list.map(item => {
          if (item.kecheng_promote_record !== null) {
            item.kecheng_promote_record.amount = (item.kecheng_promote_record.amount / 100).toFixed(2)
          }
        })
      }
      this.setData({
        list: list
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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