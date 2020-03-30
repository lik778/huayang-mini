// pages/live/live.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      api: 'http://api.weixin.qq.com/wxa/business/getliveinfo?access_token=',
      roomId: 4,
      customParams: encodeURIComponent(JSON.stringify({ path: 'pages/live/live'}))
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.storeBindings = createStoreBindings(this, {
        store,
        fields: [],
        actions: [],
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
      this.storeBindings.destroyStoreBindings()
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
    enterHistory() {
      wx.request({
        url: 'http://api.weixin.qq.com/wxa/business/getliveinfo',
        method: 'get',
        data: {
          "access_token": "",
          "action": "get_replay", // 获取回放
          "room_id": 4, // 直播间   id
          "start": 0, // 起始拉取视频，start = 0 表示从第 1 个视频片段开始拉取
          "limit": 10 // 每次拉取的个数上限，不要设置过大，建议 100 以内
        },
        complete: (res) => {
          console.log('res = ')
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(res)
          } else {
            console.error(res.message)
          }}
        })
      }
})
