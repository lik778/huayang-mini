// pages/mall/mall.js
import { getBannerList, getCategory, getProductList } from "../../api/mall/index"
import { checkAuth } from "../../utils/auth"
import { changeTwoDecimal_f } from "../../utils/util"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		swiperHeight: '',
		bannerList: [],
		categoryList: [],
		productList: [],
		current: 0,
		indicatorDots: false,
		vertical: false,
		autoplay: false,
		interval: 2000,
		duration: 500,
		offset: 0,
		limit: 10,
		didNoMore: false,
	},
	jumpToLink(e) {
		let item = e.currentTarget.dataset.item
		wx.navigateTo({url: item.link})
	},
	currentHandle(e) {
		let {current} = e.detail
		this.setData({current})
	},
	queryProductList() {
		getProductList({
			limit: this.data.limit,
			offset: this.data.offset,
		}).then((list) => {
			list = list || []
			if (list.length < this.data.limit) {
				this.data.didNoMore = true
			}

			list.forEach(item => {
				item.product.discount_price = changeTwoDecimal_f(item.product.discount_price / 100)
			})

			let result = [...this.data.productList, ...list]
			this.setData({
				productList: result,
				offset: result.length
			})
		})
	},
	queryCategory() {
		getCategory({level: 1, category_type: 0}).then(list => {
			this.setData({
				categoryList: list.slice()
			})
		})
	},
	getBanner() {
		getBannerList({scene: 4}).then(list => {
			// 获取首张banner图片信息
			if (list.length > 0) {
				let {pic_width: width, pic_height: height} = list[0]
				this.setData({swiperHeight: (height * 688) / width + 'rpx'})
			}
			this.setData({
				bannerList: list.slice()
			})
		})
	},
	buy(e) {
		let target = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/detail/detail?prdId=' + target.product.id
		})
	},
	navigateToCategory(e) {
		let item = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/category/category?categoryId=' + item.id
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		checkAuth({ignoreFocusLogin: true})
		this.queryCategory()
		this.queryProductList()
		this.getBanner()
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
			title: '花样值得买',
			path: '/pages/mall/mall'
		}
	}
})
