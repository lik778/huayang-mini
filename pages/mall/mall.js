// pages/mall/mall.js
import { getCategory, getProductList } from "../../api/mall/index"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		categoryList: [],
		productList: [],
		indicatorDots: true,
		autoplay: true,
		interval: 2000,
		duration: 500,
		showAddressMedal: false
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
	buy(e) {
		let target = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/detail/detail?prdId=' + target.id
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.queryCategory()
		this.queryProductList()
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
