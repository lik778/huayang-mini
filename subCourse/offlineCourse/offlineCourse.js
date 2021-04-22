import { getOfflineCourseList, getRecommendOfflineCourse } from "../../api/course/index"
import { $notNull } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

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
		this.getRecommend()
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		bxPoint("offline_series_visit")
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
			data = data || []
			data = data.map(n => ({...n, price: n.price / 100, discount_price: n.discount_price / 100, cover: n.detail_pics.split(",")[0]}))
			if (data.length < this.data.limit) {
				this.setData({hasMore: false})
			}
			this.setData({list: [...this.data.list, ...data], offset: this.data.offset + data.length})

		})
	},
	getRecommend() {
		getRecommendOfflineCourse().then(({data}) => {
			data = data || []
			let recommendation = data[0]
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
		let {id, name, title, price, discount_price} = e.currentTarget.dataset.item
		wx.navigateTo({
			url: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${id}`,
			complete() {
				bxPoint("offline_series_all", {
					series_offline_id: id,
					series_offline_name: name,
					series_offline_subname: title,
					series_offline_ori_price: price,
					series_offline_dis_price: discount_price
				}, false)
			}
		})
	},
	// 点击推荐线下课
	goToOfflineCourseDetailByRecommend(e) {
		let {id, name, title, price, discount_price} = e.currentTarget.dataset.item
		wx.navigateTo({
			url: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${id}`,
			complete() {
				bxPoint("offline_series_recommend", {
					series_offline_id: id,
					series_offline_name: name,
					series_offline_subname: title,
					series_offline_ori_price: price,
					series_offline_dis_price: discount_price
				}, false)
			}
		})
	}
})
