// pages/rank/rank.js
import { createStoreBindings } from "mobx-miniprogram-bindings"
import { store } from "../../store.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['update'],
    })

    wx.nextTick(() => {
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

  },
  enterRecycleView:() => {
    wx.navigateTo({
      url: '../recycleView/recycleView',
    })
  },
  enterVideoSwiper:() => {
    wx.navigateTo({
      url: '../videoSwiper/videoSwiper',
    })
  },
  enterMobxView:() => {
    wx.navigateTo({
      url: '../mobx/mobx',
    })
  },
  enterIndexList:() => {
    wx.navigateTo({
      url: '../indexList/indexList',
    })
  },
  enterTabsView:() => {
    wx.navigateTo({
      url: '../tabs/tabs',
    })
  },
  enterVtabs:() => {
    wx.navigateTo({
      url: '../vtabs/vtabs',
    })
  }
})