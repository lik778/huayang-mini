import bxPoint from "../../utils/bxPoint";
import { getFindBanner } from "../../api/course/index";
import { getGoodLifeProductList } from "../../api/life/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 1,
    TAGS: [],
    goodTags: ["全部", "美容", "美体"],
    lifeTags: ["全部", "美食", "游学"],
    curTag: 0,
    bannerList: [], // banner
    productList: [], // 商品列表
    hasMore: true,
    limit: 15
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
    console.log("onReady");
    this.run()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

    console.log("onShow");
    // 读取品质TAB索引
    if (getApp().globalData.selectedQualityTabIndex > 0) {
      this.setData({
        curTab: getApp().globalData.selectedQualityTabIndex,
        curTag: 0,
      }, () => {
        this.run()
        getApp().globalData.selectedQualityTabIndex = 0
      })
    }

    bxPoint("lifemall_pageview", {})
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
      this.getProductList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  handleTagTap(e) {
    let {index} = e.currentTarget.dataset
    this.setData({curTag: +index}, () => {
      this.getProductList(true)
    })

    switch (+this.data.curTab) {
      case 1: {
        bxPoint("lifemall_best_goods_tab_button", {best_goods_tab_type: index + 1}, false)
        break;
      }
      case 2: {
        bxPoint("lifemall_best_life_tab_button", {best_life_tab_type: index + 1}, false)
        break;
      }
    }
  },

  changeTab(e) {
    let {index} = e.currentTarget.dataset
    index = +index

    switch (index) {
      case 1: {
        if (this.data.curTab !== index) {
          this.setData({TAGS: this.data.goodTags.slice(), curTag: 0})
        }
        break
      }
      case 2: {
        if (this.data.curTab !== index) {
          this.setData({TAGS: this.data.lifeTags.slice(), curTag: 0})
        }
        break
      }
    }

    this.setData({curTab: index}, () => {
      this.getProductList(true)
    })

    bxPoint("lifemall_tab_button", {mall_tab_type: index}, false)
  },

  // swiper切换
  changeSwiperIndex(e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 处理轮播点击事件
  handleBannerTap(e) {
    let {link, link_type, id} = e.currentTarget.dataset.item
    bxPoint("lifemall_banner_click", {banner_id: id}, false)
    this.naviMiniProgram(link, link_type)
  },

  naviMiniProgram(link, linkType) {
    switch (linkType) {
      case "youzan": {
        // 有赞（花样心选）
        wx.navigateToMiniProgram({appId: "wx95fb6b5dbe8739b7", path: link})
        break
      }
      case "travel": {
        // 游学
        wx.navigateToMiniProgram({appId: "wx2ea757d51abc1f47", path: link})
        break
      }
      default: {
        wx.navigateTo({
          url: link, fail() {
            wx.switchTab({url: link})
          }
        })
      }
    }
  },

  getBanner() {
    getFindBanner({scene: 8}).then((data) => {
      data = data || []
      this.setData({bannerList: data})
    })
  },

  getProductList(isRefresh = false) {
    let params = {
      category1: this.data.curTab,
      limit: this.data.limit
    }

    let currentTag = this.data.curTag
    if (+currentTag !== 0) {
      params["category2"] = currentTag
    }

    if (isRefresh) {
      params["offset"] = 0
    } else {
      params["offset"] = this.data.productList.length
    }

    getGoodLifeProductList(params).then(({count, list}) => {
      list = list || []

      // 检查是否还有更多数据
      if (list.length < this.data.limit) {
        this.setData({hasMore: false})
      }

      list = list.map(item => {
        item.origin_price = (item.origin_price / 100).toFixed(0)
        item.price = (item.price / 100).toFixed(0)
        return item
      })
      let newList = []
      if (isRefresh) {
        newList = list
      } else {
        newList = [...this.data.productList, ...list]
      }
      this.setData({productList: newList})
    })
  },

  // 处理商品点击事件
  handleProductItemTap(e) {
    let {item} = e.currentTarget.dataset
    switch (+this.data.curTab) {
      case 1: {
        bxPoint("lifemall_best_goods_list_click", {
          best_goods_tab_type: this.data.curTag + 1,
          goods_id: item.id
        }, false)
        break;
      }
      case 2: {
        bxPoint("lifemall_best_life_list_click", {
          best_life_tab_type: this.data.curTag + 1,
          life_id: item.id
        }, false)
        break;
      }
    }
    wx.navigateToMiniProgram({
      appId: "wx95fb6b5dbe8739b7",
      path: `${item.page_url}?alias=${item.alias}`,
    })
  },

  run() {
    this.setData({TAGS: this.data.goodTags.slice()})
    this.getBanner()
    this.getProductList(true)
  }
})
