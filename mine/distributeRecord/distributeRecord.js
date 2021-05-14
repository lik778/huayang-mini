import { getDistributeFirstList, getDistributeSecondList } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    currentTab: 1,
    offset: 0,
    limit: 10,
    hasMore: true,
    didEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {index} = options
    if (index) {
      this.setData({currentTab: +index})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList()
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
    if (this.data.hasMore) {
      this.setData({offset: this.data.offset + this.data.limit})
      this.getList()
    }
  },
  // 跳转专属海报页
  goToFluentCardDistribute() {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    // wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
    wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
  },
  // tab按钮点击事件
  onTapChange(e) {
    this.setData({list: [], offset: 0, currentTab: +e.currentTarget.dataset.id})
    this.getList()
  },
  getList () {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    switch (this.data.currentTab) {
      case 1: {
        getDistributeFirstList({
          user_snow_id: accountInfo.snow_id,
          limit: this.data.limit,
          offset: this.data.offset
        }).then(({data}) => {
          data = data || []
          data = data.map((_) => ({
            isPartner: _.distribute_user ? _.distribute_user.status === 2 : false,
            avatar: _.user ? _.user.avatar_url : "",
            nickname: _.user ? _.user.nick_name : "",
            date: dayjs(_.bind_time).format("YYYY-MM-DD HH:mm")
          }))
          let newList = this.data.list.concat(data)
          this.setData({list: newList, hasMore: data.length === this.data.limit, didEmpty: newList.length === 0})
        })
        break;
      }
      case 2: {
        getDistributeSecondList({
          user_snow_id: accountInfo.snow_id,
          limit: this.data.limit,
          offset: this.data.offset
        }).then(({data}) => {
          data = data || []
          data = data.map((_) => ({
            isPartner: false,
            avatar: _.user ? _.user.avatar_url : "",
            nickname: _.user ? _.user.nick_name : "",
            date: dayjs(_.bind_time).format("YYYY-MM-DD HH:mm")
          }))
          let newList = this.data.list.concat(data)
          this.setData({list: newList, hasMore: data.length === this.data.limit, didEmpty: newList.length === 0})
        })
        break;
      }
    }
  }
})
