import {
  queryWaterfallList,
  recordWaterfallVisitCount
} from "../../api/huayangLife/index"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    waterfallList: null,
    typeBarList: ['全部', '护肤美妆', '时尚穿搭', '乐活人生', '人物故事'],
    active: 0,
    isBottom: false,
    refresh: false,
    pagination: {
      offset: 0,
      limit: 10,
      class: ''
    }
  },

  /* 点击瀑布流跳转详情 */
  toDetail(e) {
    let item = e.detail.item
    recordWaterfallVisitCount({
      life_id: item.id
    })

    bxPoint("life_style_all_list_click", {
      tag_id: Number(this.data.active) + 1,
      life_id: item.id,
      life_title: item.title
    }, false)

    if (item.type === 3) {
      /* 公众号文章 */
      wx.navigateTo({
        url: `/subCourse/noAuthWebview/noAuthWebview?link=${item.material_url}`,
      })
    } else {
      /* 跳转详情 */
      wx.navigateTo({
        url: `/huayangLife/lifeDetail/lifeDetail?id=${item.id}`,
      })
    }
  },

  /* 切换tab */
  changeTab(e) {
    let index = e.detail.index
    bxPoint("life_style_tab_button", {
      tag_id: Number(index) + 1,
    }, false)

    this.setData({

      ['pagination.class']: e.detail.index === 0 ? "" : e.detail.index,
      active: e.detail.index,
      ['pagination.offset']: 0,
      refresh: true,
      isBottom: false
    }, () => {
      this.getWaterfallList()
    })
  },

  /* 获取花样生活瀑布流列表 */
  getWaterfallList() {
    wx.showLoading({
      title: '加载中',
    })
    queryWaterfallList(this.data.pagination).then(({
      data
    }) => {
      let list = data.list || []
      let totalList = this.data.waterfallList === null ? list : this.data.waterfallList.concat(list)
      this.setData({
        waterfallList: list,
        refresh: false,
        lock: list.length >= this.data.pagination.limit ? false : true,
        isBottom: list.length < this.data.pagination.limit ? true : false
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index) {
      this.setData({
        ['pagination.class']: Number(options.index),
        ['pagination.offset']: 0,
        refresh: true,
        isBottom: false,
        active: Number(options.index),
      }, () => {
        this.getWaterfallList()
      })
    } else {
      this.getWaterfallList()
    }

    bxPoint("life_style_visit", {})

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
    if (!this.data.lock) {
      let obj = Object.assign({}, this.data.pagination, {
        offset: this.data.pagination.offset + this.data.pagination.limit
      })
      this.setData({
        pagination: obj
      }, () => {
        this.getWaterfallList()
      })
    } else {
      setTimeout(() => {
        this.setData({
          isBottom: true
        })
      }, 100)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "花样好生活，领略不同人生",
      path: `/huayangLife/lifeList/lifeList`
    }
  }
})
