// pages/mall/mall.js
import { getBannerList, getCategory, getProductList } from "../../api/mall/index"
import { checkAuth } from "../../utils/auth"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		bannerList: [],
		categoryList: [],
		productList: [],
		current: 0,
		indicatorDots: false,
		vertical: false,
		autoplay: false,
		interval: 2000,
		duration: 500,
		showAddressMedal: false
	},
	currentHandle(e) {
		let {
			current
		} = e.detail
		this.setData({
			current
		})
	},
	queryProductList() {
		getProductList(this.form).then(list => {
			this.setData({
				productList: list.slice()
			})
		})
	},
	queryCategory() {
		getCategory({ level: 1 }).then(list => {
			this.setData({
				categoryList: list.slice()
			})
		})
	},
	getBanner() {
		getBannerList({ scene: 4 }).then(list => {
			this.setData({
				bannerList: list.slice()
			})
		})
	},
	buy(e) {
		let target = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/detail/detail?prdId=' + target.id
		})
	},
	navigateToCategory(e) {
		let item = e.currentTarget.dataset.item
		console.log(item)
		wx.navigateTo({
			url: '/subMall/category/category?categoryId' + item.id
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})
