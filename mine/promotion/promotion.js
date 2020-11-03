// mine/wallet/wallet.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  getTakeoutList
} from "../../api/markting/course"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: "",
    listData: "",
    accountInfo: "",
    tabList: [{
      name: "全部",
      index: 0
    }, {
      name: "训练营",
      index: 1
    }, {
      name: "课程",
      index: 2
    }],
    pageData: {
      offset: 0,
      limit: 10
    }
  },

  // 切换tab分支
  changeTab(e) {
    let item = e.currentTarget.dataset.item
    if (item.name === "训练营") {
      this.getList(2)
    } else if (item.name === "课程") {
      this.getList(1)
    } else if (item.name === "全部") {
      this.getList(0)
    }
  },

  // 提现
  tokeout() {
    wx.navigateTo({
      url: '/mine/withdraw/withdraw',
    })
  },

  // 去推广记录

  // 获取推荐列表
  getList(type) {
    let params = ''
    if (type !== 2) {
      params = {
        offset: this.data.pageData.offset,
        limit: this.data.pageData.limit,
        show_type: type
      }
    } else {
      params = {
        show_type: type
      }
    }
    getTakeoutList(params).then(res => {
      console.log(res.data)
      this.setData({
        listData: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(0)
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
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      accountInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
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

  }
})