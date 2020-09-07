// mine/mineOrder/mineOrder.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  getMineOrder
} from "../../api/mine/index"
import {
  GLOBAL_KEY
} from "../../lib/config.js"
import {
  getYouZanAppId
} from "../../api/mall/index"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: "",
    curentIndex: 0,
    statusHeight: 0,
    titleList: ['训练营', '课程', '商品'],
    // titleList: ['训练营', '商品'],
    orderData: [],
    pageData: {
      offset: 0,
      current: 1,
      limit: 10
    }
  },
  // 切换tab
  changeTab(e) {
    bxPoint("order_tab", {
      tab: e.currentTarget.dataset.index == 1 ? "goods" : "camp"
    }, false)
    this.setData({
      curentIndex: e.currentTarget.dataset.index
    })
    this.getMineOrderData()
  },
  // 获取订单列表
  getMineOrderData() {
    let params = {}
    if (this.data.curentIndex == 0) {
      // 训练营
      params = {
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        order_type: 'traincamp',
        offset: (this.data.pageData.current - 1) * this.data.pageData.limit,
        limit: this.data.pageData.limit
      }
    } else if (this.data.curentIndex == 1) {
      // 课程
      params = {
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        order_type: 'kecheng_series',
        offset: (this.data.pageData.current - 1) * this.data.pageData.limit,
        limit: this.data.pageData.limit
      }
    } else {
      // 商品
      params = {
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        order_type: 'product'
      }
    }
    getMineOrder(params).then(res => {
      if (res.code === 0) {
        this.setData({
          orderData: res.data
          // orderData: []
        })
      }
    })
  },
  // 查看订单
  toOrder(e) {
    if (this.data.curentIndex == 0) {
      // 眺望训练营
      let data = e.currentTarget.dataset.item.order_item_list[0]
      wx.navigateTo({
        url: `/subCourse/campDetail/campDetail?id=${data.product_id}`,
      })
    } else if (this.data.curentIndex == 1) {
      // 跳往课程详情
      let data = e.currentTarget.dataset.item.order_item_list[0]
      wx.navigateTo({
        url: `/subCourse/videoCourse/videoCourse?videoId=${data.product_id}`,
      })
    } else {
      wx.navigateToMiniProgram({
        appId: this.data.appId,
        path: "/pages/usercenter/dashboard/index"
      })
    }

  },
  // 获取有赞aooId
  getMiniProgramAppId() {
    getYouZanAppId().then(appId => {
      this.setData({
        appId
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
    // 获取订单列表
    this.getMineOrderData()
    // 获取有赞id
    this.getMiniProgramAppId()
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
    bxPoint("applets_order", {})
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

  }
})