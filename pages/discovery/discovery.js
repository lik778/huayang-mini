import {
	$notNull,
	getLocalStorage,
} from "../../utils/util"
import {
	queryWaterfallList
} from "../../api/huayangLife/index"
import {
	getFindBanner,
} from "../../api/course/index"
import {
	GLOBAL_KEY,
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isIosPlatform: false,
		didShowAuth: false,
		waterfallList: null, //生活方式瀑布流数据
		waterfallLock: false, //瀑布流锁
		isBottom: false, //生活方式到底啦
		waterfallPagination: {
			offset: 0,
			limit: 10
		}, //生活方式瀑布流分页
	},


	naviMiniProgram(link, linkType) {
		switch (linkType) {
			case "youzan": {
				// 有赞（花样心选）
				wx.navigateToMiniProgram({
					appId: "wx95fb6b5dbe8739b7",
					path: link
				})
				break
			}
			case "travel": {
				// 游学
				wx.navigateToMiniProgram({
					appId: "wx2ea757d51abc1f47",
					path: link
				})
				break
			}
			default: {
				wx.navigateTo({
					url: link,
					fail() {
						wx.switchTab({
							url: link
						})
					}
				})
			}
		}
	},

	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},

	// 处理轮播点击事件
	handleBannerTap(e) {
		let {
			link,
			link_type,
			id
		} = e.currentTarget.dataset.item
		bxPoint("new_homepage_banner_click", {
			banner_id: id
		}, false)
		this.naviMiniProgram(link, link_type)
	},

	getBanner() {
		return new Promise((resolve) => {
			let promises = [getFindBanner({
				scene: 8
			}), getFindBanner({
				scene: 23
			})]
			Promise.all(promises).then((arys) => {
				let [bannerList, textBannerList] = arys
				if ($notNull(bannerList)) this.setData({
					bannerList: bannerList
				})
				if ($notNull(textBannerList)) this.setData({
					textBannerList: textBannerList.slice(0, 2)
				})
				resolve(bannerList)
			})
		})
	},

	run() {

	},

	// 用户授权取消
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.setData({
			didShowAuth: false,
		})
	},
	// 检查ios环境
	checkIos() {
		wx.getSystemInfo({
			success: (res) => {
				if (res.platform === 'ios') {
					this.setData({
						isIosPlatform: true
					})
				}
			}
		})
	},

	/* 点击瀑布流跳转详情 */
	toDetail(e) {
		let item = e.detail.item
		if (item.type === 3) {
			/* 公众号文章 */
			console.log('公众号文章')
		} else {
			/* 跳转详情 */
			wx.navigateTo({
				url: `/huayangLife/lifeDetail/lifeDetail?id=${item.id}`,
			})
		}
	},

	/* 获取花样生活瀑布流列表 */
	getWaterfallList() {
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		queryWaterfallList(this.data.waterfallPagination).then(({
			data
		}) => {
			let list = data.list || []
			let totalList = this.data.waterfallList === null ? list : this.data.waterfallList.concat(list)
			this.setData({
				waterfallList: list,
				waterfallLock: list.length >= this.data.waterfallPagination.limit ? false : true
			})
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=235`})
		this.getBanner().then()
		/* 获取花样生活瀑布流列表 */
		this.getWaterfallList()
		// 处理ios
		this.checkIos()
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
	onUnload: function () {},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (!this.data.waterfallLock) {
			let obj = Object.assign({}, this.data.waterfallPagination, {
				offset: this.data.waterfallPagination.offset + this.data.waterfallPagination.limit
			})
			this.setData({
				waterfallPagination: obj
			}, () => {
				this.getWaterfallList()
			})
		} else {
			this.setData({
				isBottom: true
			})
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "在花样百姓，过积极、健康、时尚的品质生活。",
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	},
	onPageScroll(e) {}
})