// others/applyResultForActivityInH5/applyResultForActivityInH5.js
import {
  getActivityDetail
} from "../../api/mine/index"
import {
  queryOrderDetail
} from "../../api/course/index"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: '',
    activityData: "",
    activityId: '',
    orderId: ""
  },

  addTeacherTap() {
    wx.previewImage({
      urls: [this.data.activityData.ret_guide_qrcode],
      success: () => {
        // 2022-04-15 JJ
        bxPoint("university_activity_detail_contact_click", {
          activity_id: this.data.activityId,
          order_id: this.data.orderId
        }, false)
      }
    })
  },

  getOrderData() {
    queryOrderDetail({
      order_id: this.data.orderId
    }).then(({
      data
    }) => {
      this.setData({
        orderData: data
      })
      console.log(data)
    })
  },

  getActivtyData() {
    getActivityDetail({
      activity_id: this.data.activityId,
      user_id: this.data.userInfo.id
    }).then(res => {
      if (res.pay_online === 1) {
        this.getOrderData()
      }
      this.setData({
        activityData: res
      })
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.orderId && options.activityId) {
      let userInfo = getLocalStorage(GLOBAL_KEY.userInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)) : ""
      this.setData({
        orderId: options.orderId,
        activityId: options.activityId,
        userInfo
      }, () => {
        this.getActivtyData()
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 2022-04-15 JJ
    bxPoint("university_activity_detail_enroll_success", {
      activity_id: this.data.activityId,
      order_id: this.data.orderId
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})