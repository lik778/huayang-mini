// huayangLife/lifeList/lifeList.js
import {
  queryWaterfallList,
  recordWaterfallVisitCount
} from "../../api/huayangLife/index"
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
    this.setData({
      ['pagination.class']: e.detail.index === 0 ? "" : e.detail.index,
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
    this.getWaterfallList()
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

  }
})