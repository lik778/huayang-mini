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
    tabIndex: 0,
    promoteUid: "",
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

  // 返回
  back() {
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },

  // 跳往详情页
  toDetail(e) {
    let data = e.currentTarget.dataset
    let userId = getLocalStorage(GLOBAL_KEY.userId) ? Number(getLocalStorage(GLOBAL_KEY.userId)) : ""
    let linkData = ''
    if (this.data.promoteUid !== '') {
      if (userId !== '') {
        if (Number(this.data.promoteUid) && Number(userId)) {
          linkData = ''
        } else {
          linkData = Number(this.data.promoteUid)
        }
      } else {
        linkData = Number(this.data.promoteUid)
      }
    }

    if (data.type === "course") {
      // 课程
      if (linkData === '') {
        wx.navigateTo({
          url: `/subCourse/videoCourse/videoCourse?videoId=${data.item.id}`,
        })
      } else {
        wx.navigateTo({
          url: `/subCourse/videoCourse/videoCourse?videoId=${data.item.id}&promote_uid=${linkData}`,
        })
      }

    } else if (data.type === "camp") {
      // 训练营
      if (linkData === '') {
        wx.navigateTo({
          url: `/subCourse/joinCamp/joinCamp?id=${data.item.id}`,
        })
      } else {
        wx.navigateTo({
          url: `/subCourse/joinCamp/joinCamp?id=${data.item.id}&promote_uid=${linkData}`,
        })
      }
    }
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
      },
      tabIndex: item.index
    })
    this.getList()
  },

  // 提现
  tokeout() {
    wx.navigateTo({
      url: '/mine/withdraw/withdraw',
    })
  },

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
      for (let i in list.series_list) {
        let data = list.series_list
        if (data[i].discount_price > 0 && data[i].distribution_ratio > 0) {
          data[i].sharePrice = ((data[i].discount_price / 100) * (data[i].distribution_ratio / 100)).toFixed(2)
          list.series_list = data
        } else {
          list.series_list[i].sharePrice = ''
        }
      }
      for (let i in list.traincamp_list) {
        let data = list.traincamp_list
        if (data[i].discount_price > 0 && data[i].distribution_ratio > 0) {
          data[i].sharePrice = ((data[i].discount_price / 100) * (data[i].distribution_ratio / 100)).toFixed(2)
          list.traincamp_list = data
        } else {
          list.traincamp_list[i].sharePrice = ''
        }
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
      this.setData({
        shareUserInfo: res.data
      })
    })
  },

  // 去往推广记录
  toRecord() {
    wx.navigateTo({
      url: '/mine/promotionRecord/promotionRecord',
    })
  },

  // 去往提现页
  toWithdraw() {
    wx.navigateTo({
      url: '/mine/withdraw/withdraw',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      promote_uid = ''
    } = options
    this.setData({
      promoteUid: promote_uid,
      isShare: promote_uid !== "" ? false : true
    })
    if (promote_uid !== '') {
      if (getLocalStorage(GLOBAL_KEY.userId)) {
        if (Number(getLocalStorage(GLOBAL_KEY.userId)) === Number(promote_uid)) {
          this.setData({
            isShare: true,

          })
        }
      }
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
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : ""
    if (userInfo !== '') {
      userInfo.kecheng_user.deposit = Number((userInfo.kecheng_user.deposit / 100).toFixed(2))
    }
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      accountInfo: userInfo
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
    return {
      title: `${this.data.shareUserInfo.nick_name}为您推荐了花样精选课程`,
      path: `/mine/promotion/promotion?promote_uid=${this.data.promoteUid}`
    }
  }
})