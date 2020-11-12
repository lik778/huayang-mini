// subCourse/videoCourseList/videoCourseList.js
import { getVideoTypeList, queryVideoCourseListByBuyTag } from "../../api/course/index"
import { checkFocusLogin } from "../../api/auth/index"
import { GLOBAL_KEY, Version } from "../../lib/config"
import { getLocalStorage } from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleList: [],
    currentIndex: 0,
    showMoney: true,
    keyArr: [],
    bottomLock: true,
    pageSize: {
      limit: 10,
      offset: 0
    },
    videoList: []
  },
  // 跳往视频课程详情页
  toVideoCourseDetail(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
    })
  },
  // 获取课程列表
  getVideoList(index, refresh = true) {
    let category = ''
    if (index === 0) {
      category = ''
    } else {
      category = this.data.keyArr[index - 1]
    }
    let params = {
      offset: this.data.pageSize.offset,
      limit: this.data.pageSize.limit,
      category: category
    }
    if (getLocalStorage(GLOBAL_KEY.userId)) {
      params.user_id = getLocalStorage(GLOBAL_KEY.userId)
    }
    queryVideoCourseListByBuyTag(params).then(list => {
      if (getLocalStorage(GLOBAL_KEY.userId)) {
        list = list.map(_ => {
          return {
            ..._.kecheng_series,
            didBought: _.buy_tag === "已购",
            buy_tag: _.buy_tag
          }
        })
      }
      let bottomLock = true
      if (list.length < 10) {
        bottomLock = false
      }
      let handledList = list.map((res) => {
        res.price = (res.price / 100) // .toFixed(2)
        if (res.discount_price === -1 && res.price > 0) {
          // 原价出售
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.price * res.invite_discount / 10000) // .toFixed(2)
          }
        }
        else if (res.discount_price >= 0 && res.price > 0) {
          // 收费但有折扣
          res.discount_price = (res.discount_price / 100) // .toFixed(2)
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.discount_price * res.invite_discount / 10000) // .toFixed(2)
          }
        } else if (+res.discount_price === -1 && +res.price === 0) {
          res.discount_price = 0
        }

        // 只显示开启营销活动的数据
        if (+res.invite_open === 1) {
          res.tipsText = res.fission_price == 0 ? "邀请好友助力免费学" : `邀请好友助力${(res.invite_discount / 10)}折购`
        }

        return res
      })
      if (refresh) {
        handledList = [...handledList]
      } else {
        handledList = this.data.videoList.concat(handledList)
      }
      this.setData({
        videoList: handledList,
        bottomLock: bottomLock
      })
    })
  },
  // 获取tab列表
  getTabList(index) {
    getVideoTypeList().then(res => {
      let arr = []
      let keyArr = []
      for (let i in res) {
        arr.push(res[i].value)
        keyArr.push(res[i].key)
      }
      arr.unshift("全部")
      this.setData({
        titleList: arr,
        keyArr: keyArr
      })
      if (index !== '') {
        this.changeTab(index)
      } else {
        this.changeTab(index)
      }
    })
  },
  // 切换tab
  changeTab(e) {
    let index = ''
    if (e) {
      if (e.currentTarget) {
        index = e.currentTarget.dataset.index
      } else {
        index = e
      }
      this.setData({
        currentIndex: index
      })
    } else {
      index = 0
    }
    this.setData({
      pageSize: {
        offset: 0,
        limit: 10
      }
    })
    wx.pageScrollTo({
      duration: 100,
      scrollTop: 0
    })
    this.getVideoList(index)
  },
  // 检查ios环境
  checkIos() {
    checkFocusLogin({
      app_version: Version
    }).then(res1 => {
      let _this = this
      if (!res1) {
        wx.getSystemInfo({
          success: function (res2) {
            if (res2.platform == 'ios') {
              _this.setData({
                showMoney: false
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.index ? parseInt(options.index) : ""
    if (options.index) {
      this.setData({
        currentIndex: index
      })
    }

    if (options.invite_user_id) {
      getApp().globalData.super_user_id = options.invite_user_id
    }

    this.getTabList(index)
    // ios规则适配
    this.checkIos()
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
    if (this.data.bottomLock) {
      this.setData({
        pageSize: {
          offset: this.data.pageSize.offset + this.data.pageSize.limit,
          limit: this.data.pageSize.limit
        }
      })
      this.getVideoList(this.data.currentIndex, false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "这里有好多好课，快来一起变美，变自信",
      path: `/subCourse/videoCourseList/videoCourseList?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})
