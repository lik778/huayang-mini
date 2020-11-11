import { $notNull } from "../../utils/util"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [
			{
				id: 0,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/926f381-1759c09abca/926f381-1759c09abca.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "14天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "手机课"
			},
			{
				id: 1,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/1e828613-1759bbe1370/1e828613-1759bbe1370.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 2,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/20a24ae-1759b948967/20a24ae-1759b948967.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 3,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/37e5710d-1759b94d118/37e5710d-1759b94d118.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 4,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/49fa979c-1759b95c953/49fa979c-1759b95c953.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 5,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/324339cb-1759ccb4d3a/324339cb-1759ccb4d3a.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 6,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/4bf33664-1759ccbe439/4bf33664-1759ccbe439.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},
			{
				id: 7,
				src: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/49fa979c-1759b95c953/49fa979c-1759b95c953.mp4",
				price: 120,
				discount_price: 99,
				show: false,
				start_date: "2020-11-11",
				title: "21天时尚达人秋季速成营",
				desc: "一营畅学5类课，掌握今秋时尚风向标！",
				tag: "时尚课 名师指导 线下活动"
			},

		],
		cacheList: [],
		scrollTop: 0,
		scrollIng: false,
		didFirstLoad: true
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
		this.calc()
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
	onPageScroll(e) {
		// this.setData({scrollTop: e.scrollTop, scrollIng: true})
		// let timer = setTimeout(() => {
		// 	if (this.data.scrollTop === e.scrollTop) {
		// 		this.setData({scrollTop: e.scrollTop, scrollIng: false})
		// 		this.setData({list: this.data.cacheList.slice()})
		// 		clearTimeout(timer)
		// 	}
		// }, 200)
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	touchStart(e) {
		this.setData({scrollIng: true})
	},
	touchMove(e) {
		console.log("move", e);
	},
	touchEnd(e) {
		this.setData({scrollIng: false, list: this.data.cacheList.slice()})
	},
	onError(e) {
		console.error(e)
	},
	calc() {
		for (let index = 0; index < this.data.list.length; index++) {
			wx.createIntersectionObserver()
				.relativeToViewport({bottom: 100})
				.observe('.card-' + index, res => {
					let list = this.data.cacheList.length > 0 ? this.data.cacheList.slice() : this.data.list.slice()
					if (res && res.intersectionRatio > 0) {
						// 进入可视区域
						list = list.map((item, itemIndex) => {
								if (itemIndex === index) {
									item.show = true
								}
								return item
							}
						)

						// 滚动结束，跟新可视区域位置
						if (!this.data.scrollIng) {
							this.setData({cacheList: list.slice()})
							let target = this.data.list.find(n => n.id === index)
							if ($notNull(target) && target.show) {
								let videoInstance = wx.createVideoContext("video-" + index)
								videoInstance.play()
							}
						}

					}
					else {
						// 移除可视区域
						list = list.map((item, itemIndex) => {
								if (itemIndex === index) {
									item.show = false
								}
								return item
							}
						)

						// 滚动结束，跟新可视区域位置
						if (!this.data.scrollIng) {
							this.setData({cacheList: list.slice()})
							let target = this.data.list.find(n => n.id === index)
							if ($notNull(target) && target.show) {
								let videoInstance = wx.createVideoContext("video-" + index)
								videoInstance.pause()
							}
						}

					}
					if (this.data.didFirstLoad) {
						let t = setTimeout(() => {
							this.setData({list: list.slice(), didFirstLoad: false})
							clearTimeout(t)
						}, 50)
					}
				})
		}
	}
})
