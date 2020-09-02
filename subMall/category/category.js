import { getCategory, getProductListByCategory } from "../../api/mall"
import { checkAuth } from "../../utils/auth"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: 0,
    activeTabIndex: 0,
    categoryList: [],
    productList: [],
    offset: 0,
    limit: 10,
    didNoMore: false,
  },
  queryProductList(categoryId) {
    getProductListByCategory({
      first_category_id: categoryId,
      limit: this.data.limit,
      offset: this.data.offset,
    }).then(list => {
      list = list || []
      if (list.length < this.data.limit) {
        this.data.didNoMore = true
      }
      let result = [...this.data.productList, ...list]
      this.setData({
        productList: result,
        offset: result.length
      })
    })
  },
  queryCategory(categoryId) {
    getCategory({ level: 1, category_type: 0 }).then(list => {
      list.forEach((item, index) => {
        if (item.id == categoryId) {
          // 更新标签
          this.setData({
            activeTabIndex: index
          })
          // 获取类目下的商品数据
          this.queryProductList(categoryId)
        }
      })
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
  },
  // 切换分类
  onChange(e) {
    // 清除缓存数据
    this.data.categoryList.forEach(item => {
      if (item.name === e.detail.title) {
        this.setData({
          categoryId: item.id,
          offset: 0,
          productList: []
        })
        this.queryProductList(item.id)
      }
    })
  },
  buy(e) {
    let target = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/subMall/detail/detail?prdId=' + target.product.id
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
    checkAuth()
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
    if (this.data.didNoMore) {
      return console.log('没有更多数据～')
    }
    this.queryProductList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '花样百姓+',
      path: '/subMall/category/category?categoryId=' + this.data.categoryId
    }
  }
})
