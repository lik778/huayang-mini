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
    isAll: false,
    list: ""
  },

  // 去往推广页
  toPromotion() {
    wx.navigateTo({
      url: '/mine/promotion/promotion',
    })
  },

  // 获取推广记录
  getList(e) {
    getPromotionRecord(this.data.pageData).then(res => {
      if (res.data.list.length > 0) {
        for (let i in res.data.list) {
          res.data.list[i].kecheng_promote_record.amount = (res.data.list[i].kecheng_promote_record.amount / 100).toFixed(2)
        }
      }
      let list = e ? this.data.list.concat(res.data.list) : res.data.list
      this.setData({
        list,
        isAll: res.data.list.length < 10 ? true : false
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

    if (!this.data.isAll) {
      this.setData({
        pageData: {
          offset: this.data.pageData.offset + this.data.pageData.limit,
          limit: this.data.pageData.limit,
        }
      })
      this.getList(true)
    }

  },
})