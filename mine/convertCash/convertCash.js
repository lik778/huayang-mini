import { getDistributeRecordList, getUserInfo } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    offset: 0,
    limit: 10,
    recordList: [],
    status: ["", "审核中", "审核失败", "审核成功"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.run()
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
    this.setData({offset: 0})
    this.getRecordList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.setData({offset: this.data.offset + this.data.limit})
      this.getRecordList()
    }

  },
  withdrawal() {
    bxPoint("mine_finalamount_withdraw", {}, false)
    wx.showModal({
      title: '提示',
      content: '感谢您的分享，提现正在准备中，计划3月初可提现，请等候',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {}
      }
    })
  },
  run() {
    bxPoint("mine_finalamount_list", {})

    getUserInfo('scene=zhide').then(res => {
      res.amount = Number((res.amount / 100).toFixed(2))
      this.setData({userInfo: res})
    })

    this.getRecordList(true)
  },
  getRecordList(isRefresh = false) {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    getDistributeRecordList({
      user_snow_id: accountInfo.snow_id,
      offset: isRefresh ? 0 : this.data.offset,
      limit: this.data.limit
    }).then(({data}) => {
      data = data || []
      data = data.map((item) => ({
        id: item.id,
        change_title: item.change_title,
        change_amount: Number((item.change_amount / 100).toFixed(2)),
        created_at: item.created_at,
        status: this.data.status[item.status],
      }))
      if (!isRefresh) {
        data = [...this.data.recordList, ...data]
      }
      this.setData({recordList: data, hasMore: data.length === this.data.limit})
    })
  }
})
