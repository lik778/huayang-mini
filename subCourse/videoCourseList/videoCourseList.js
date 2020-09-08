// subCourse/videoCourseList/videoCourseList.js
import {
  getVideoTypeList,
  getVideoCourseList
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleList: [],
    curentIndex: 0,
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
    getVideoCourseList({
      offset: this.data.pageSize.offset,
      limit: this.data.pageSize.limit,
      category: category
    }).then(res => {
      let bottomLock = true
      if (res.length < 10) {
        bottomLock = false
      }
      for (let i in res) {
        if (res[i].discount_price < 0 && res[i].price <= 0) {
          res[i].money = '免费'
        } else if (res[i].discount_price === -1 && res[i].price > 0) {
          res[i].money = (res[i].price / 100).toFixed(2)
        } else if (res[i].discount_price > 0 && res[i].price > 0) {
          res[i].money = (res[i].discount_price / 100).toFixed(2)
        } else if (res[i].discount_price === 0 && res[i].price > 0) {
          res[i].money = '免费'
        } else if (res[i].discount_price === 0 && res[i].price === 0) {
          res[i].money = '免费'
        }
      }
      if (refresh) {
        res = res
      } else {
        res = this.data.videoList.concat(res)
      }
      this.setData({
        videoList: res,
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
        console.log(res)
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
        curentIndex: index
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
    this.getVideoList(index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.index ? parseInt(options.index) : ""
    if (options.index) {
      this.setData({
        curentIndex: index
      })
    }
    this.getTabList(index)
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
      this.getVideoList(this.data.curentIndex, false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})