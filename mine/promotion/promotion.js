// mine/wallet/wallet.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  getUniversityCode
} from "../../api/mine/index"
import {
  getTakeoutList
} from "../../api/markting/course"
import {
  getUserInfo
} from "../../api/mine/index"
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
      limit: 10,
      show_type: 0
    },
    isShare: false,
    hasAll: false,
    shareUserInfo: ""
  },

  // 切换tab分支
  changeTab(e) {
    let item = e.currentTarget.dataset.item
    let type = ''
    if (item.name === "训练营") {
      type = 2
    } else if (item.name === "课程") {
      type = 1
    } else if (item.name === "全部") {
      type = 0
    }
    this.setData({
      pageData: {
        offset: 0,
        limit: 10,
        show_type: type
      }
    })
    this.getList()
  },

  // 提现
  tokeout() {
    wx.navigateTo({
      url: '/mine/withdraw/withdraw',
    })
  },

  // 去推广记录

  // 获取推荐列表
  getList(e) {
    let params = ''
    if (this.data.pageData.show_type !== 2) {
      params = {
        offset: this.data.pageData.offset,
        limit: this.data.pageData.limit,
        show_type: this.data.pageData.show_type,
      }
    } else {
      params = {
        show_type: this.data.pageData.show_type,
      }
    }
    getTakeoutList(params).then(res => {
      let list = []
      if (e) {
        let list1 = this.data.listData
        list1.series_list = list1.series_list.concat(res.data.series_list)
        list = this.data.listData
      } else {
        list = res.data
      }
      this.setData({
        listData: list,
        hasAll: res.data.series_list ? res.data.series_list.length < 10 ? true : false : true
      })
    })
  },

  // 获取分享人用户信息
  getShareUserInfo() {
    getUniversityCode(`user_id=${this.data.promoteUid}`).then(res => {
      console.log(res.data)
      this.setData({
        shareUserInfo: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      promote_uid = ''
    } = options
    console.log(promote_uid)
    this.setData({
      promoteUid: promote_uid,
      isShare: promote_uid === "" ? false : true
    })
    if (promote_uid !== '') {
      this.getShareUserInfo()
    } else {
      this.setData({
        shareUserInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)),
        promoteUid: JSON.parse(getLocalStorage(GLOBAL_KEY.userId)),
      })
    }
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
    if (!this.data.hasAll) {
      this.setData({
        pageData: {
          offset: this.data.pageData.offset + this.data.pageData.limit,
          limit: this.data.pageData.limit,
          show_type: this.data.pageData.show_type
        }
      })
      this.getList(true)
    }
  },
  onShareAppMessage: function (res) {
    console.log(this.data.shareUserInfo)
    return {
      title: `${this.data.shareUserInfo.nick_name}为您推荐了花样精选课程`,
      path: `/mine/promotion/promotion?promote_uid=${this.data.promoteUid}`
    }
  }
})