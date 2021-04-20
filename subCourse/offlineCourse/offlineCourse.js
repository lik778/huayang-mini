import { getOfflineCourseList } from "../../api/course/index"
import { $notNull } from "../../utils/util"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		offset: 0,
		limit: 5,
		hasMore: true,
		list: [],
		recommendCourse: null
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
		this.run()
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
		this.getList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "和我一起参加花样大学精品线下课吧",
			path: "/subCourse/offlineCourse/offlineCourse"
		}
	},
	run() {
		this.getList(true)
	},
	getList(isRefresh = false) {
		if (!this.data.hasMore) return
		let params = {offset: this.data.offset, limit: this.data.limit}
		if (isRefresh) {
			params = {offset: 0, limit: this.data.limit}
		}
		getOfflineCourseList(params).then(({data}) => {
			let {all, recommendation} = data
			all = all || []
			all = all.map(n => ({...n, price: n.price / 100, discount_price: n.discount_price / 100, cover: n.detail_pics.split(",")[0]}))
			if (all.length < this.data.limit) {
				this.setData({hasMore: false})
			}
			this.setData({list: [...this.data.list, ...all], offset: this.data.offset + all.length})
			if ($notNull(recommendation)) {
				this.setData({
					recommendCourse: {
						...recommendation,
						price: recommendation.price / 100,
						discount_price: recommendation.discount_price / 100,
						cover: recommendation.detail_pics.split(",")[0]
					}
				})
			}
		})
	},
	// 跳转到线下精品课详情页
	goToOfflineCourseDetail(e) {
		let {id} = e.currentTarget.dataset.item
		wx.navigateTo({url: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${id}`})
	}
})
