// subMall/category/category.js
import { getCategory, getProductList } from "../../api/mall/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: 0,
    activeTabIndex: 0,
    categoryList: []
  },
  queryProductList(categoryId) {
    getProductList({
      first_category_id: categoryId
    }).then(list => {
      this.setData({
        productList: list.slice()
      })
    })
  },
  queryCategory(categoryId) {
    getCategory({ level: 1 }).then(list => {
      let tar = list.find(_ => _.id === categoryId)
      console.log(tar)
      this.setData({
        categoryList: list.slice()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({categoryId}) {
    this.setData({
      categoryId: categoryId
    })
    this.queryCategory(categoryId)
    this.queryProductList(categoryId)
  },
  // 切换分类
  onChange(e) {
    // 清除缓存数据
    this.data.categoryList.forEach(_ => {
      if (_.name === e.detail.title) {
        // TODO
        console.log(_);
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
