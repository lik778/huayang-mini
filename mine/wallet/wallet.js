// mine/wallet/wallet.js
import {
  getInviteList
} from "../../api/mine/index"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteList: ["", ""],
    wolletData: "",
    limit: 10,
    offset: 0
  },
  // 花豆介绍
  explain(){
    wx.navigateTo({
      url: '/mine/beanExplain/beanExplain',
    })
  },
  // 提现
  withdraw() {
    wx.showModal({
      title: '提示',
      content:" 提现功能将在5月中旬开放，敬请期待哦！",
      showCancel:false,
    })
  },
  // 获取小程序邀请列表
  inviteListData() {
    getInviteList(`offset=${this.data.offset}&limit=${this.data.limit}`).then(res => {
      res = res.data || []
      if (res.length !== 0) {
        for (let i in res) {
          if (Number.isInteger(res[i].amount / 100)) {
            res[i].amount = res[i].amount / 100 + ".00"
          } else {
            res[i].amount = res[i].amount / 100
          }
        }
      }
      this.setData({
        inviteList: res
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inviteListData()
    this.setData({
      wolletData: JSON.parse(options.wolletData),
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
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

  }
})
