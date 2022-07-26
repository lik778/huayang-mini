import { getTravelList } from "../../api/mindfulness/index"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cityWalkList: [],
		qualityTravelList: [],
		current: 0,
		playingDays: ["", "半日游", "一日游", "二日游", "三日游", "四日游", "五日游", "六日游", "七日游", "八日游", "九日游", "十日游"],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}

		this.run()
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
		return {
			title: "趁现在，和花样一起游学，享受精彩人生",
			path: "/pages/index/index"
		}
	},
	run() {
		// 城市慢游
		getTravelList({
			travel_type: 1,
			offset: 0,
			limit: 9999
		}).then((data) => {
			this.setData({
				cityWalkList: this.handleTravelData(data)
			})
		})

		// 精品秀游
		getTravelList({
			travel_type: 2,
			offset: 0,
			limit: 9999
		}).then((data) => {
			this.setData({
				qualityTravelList: this.handleTravelData(data)
			})
		})
	},
	onTravelItemTap(e) {
		let {id} = e.currentTarget.dataset.item
		wx.navigateToMiniProgram({
			appId: "wx2ea757d51abc1f47",
			path: `/pages/travelDetail/travelDetail?productId=${id}`
		})
	},
	handleTravelData(data) {
		data = data.map((item) => {
			return {
				...item,
				cover: item.pics.split(",")[0],
				zh_day_count: this.data.playingDays[item.day_count],
				discount_price: item.discount_price > 0 ? item.discount_price : item.price,
				price: item.discount_price > 0 ? item.price : item.discount_price,
			}
		})
		return data
	},
})
