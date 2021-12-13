import {
	$notNull,
	getLocalStorage,
} from "../../utils/util"
import {
	getActivityList,
	getFindBanner,
} from "../../api/course/index"
import {
	queryWaterfallList,
	recordWaterfallVisitCount
} from "../../api/huayangLife/index"
import {
	GLOBAL_KEY,
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { getHomeHeadLines, getHomeIcons } from "../../api/live/index"
import request from "../../lib/request"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isIosPlatform: false,
		didShowAuth: false,
		f1: [],
		f2: [],
		f3: [],
		headlines: [],
		activityList: [],
		movableAreaWidth: 0,
		waterfallList: null, //生活方式瀑布流数据
		waterfallLock: false, //瀑布流锁
		isBottom: false, //生活方式到底啦
		waterfallPagination: {
			offset: 0,
			limit: 10
		}, //生活方式瀑布流分页
	},
	run() {
		// 加载icons
		getHomeIcons().then(({data}) => {
			data = data || []
			if (data.length === 13) {
				this.setData({f1: data.slice(0, 4), f2: data.slice(4, 9), f3: data.slice(9, 13)})
			}
		})

		// 加载花样头条
		getHomeHeadLines().then(({data}) => {
			data = data || []
			this.setData({headlines: data.slice()})
		})

		// 加载最新活动
		getActivityList({offset: 0, limit: 5, platform: 1, homepage_show: 1})
			.then(({list}) => {
				list = list || []
				this.setData({
					activityList: list,
					movableAreaWidth: list.length * 414 + (list.length - 1) * 16
				})
			})
	},
	naviMiniProgram(link, linkType) {
		switch (linkType) {
			case "youzan": {
				// 有赞商城
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
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 处理轮播点击事件
	handleBannerTap(e) {
		let {link, link_type, id} = e.currentTarget.dataset.item
		bxPoint("new_homepage_banner_click", {banner_id: id}, false)
		this.naviMiniProgram(link, link_type)
	},
	// 获取banner图片
	getBanner() {
		return new Promise((resolve) => {
			let promises = [getFindBanner({scene: 8}), getFindBanner({scene: 23})]
			Promise.all(promises).then((arys) => {
				let [bannerList, textBannerList] = arys
				if ($notNull(bannerList)) this.setData({bannerList: bannerList})
				if ($notNull(textBannerList)) this.setData({textBannerList: textBannerList.slice(0, 2)})
				resolve(bannerList)
			})
		})
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
		recordWaterfallVisitCount({
			life_id: item.id
		})


		bxPoint("new_homepage_life_list_click", {
			life_id: item.id,
			life_title: item.title
		}, false)

		if (item.type === 3) {
			/* 公众号文章 */
			wx.navigateTo({
				url: `/subCourse/noAuthWebview/noAuthWebview?link=${item.material_url}`,
			})
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
	// 处理icon点击事件
	onIconItemTap(e) {
		let {item: {type, link_url, rank}} = e.currentTarget.dataset
		if (rank <= 9) {
			bxPoint("new_homepage_tab_button_click", {tab_tag: rank}, false)
		} else {
			bxPoint("new_homepage_content_button_click", {tab_tag: rank}, false)
		}
		switch (+type) {
			case 1: {
				// 花样百姓
				wx.switchTab({
					url: link_url,
					fail() {
						wx.navigateTo({url: link_url})
					}
				})
				break
			}
			case 2: {
				// 花样游学
				wx.navigateToMiniProgram({appId: "wx2ea757d51abc1f47", path: link_url})
				break
			}
			case 3: {
				// H5链接
				wx.navigateTo({
					url: `/pages/pureWebview/pureWebview?link=${link_url}`
				})
				break
			}
			case 4: {
				// 有赞商城
				wx.navigateToMiniProgram({appId: "wx95fb6b5dbe8739b7", path: link_url})
				break
			}
		}
	},
	// 查看更多最新活动
	onNewsMoreTap() {
		bxPoint("new_homepage_activity_more_click", {}, false)
		wx.navigateTo({url: "/pages/activities/activities"})
	},
	// 打开最新活动
	onNewsContentTap(e) {
		let {item} = e.currentTarget.dataset
		let link = ""
		switch (request.baseUrl) {
			case ROOT_URL.dev: {
				link = 'https://dev.huayangbaixing.com'
				break
			}
			case ROOT_URL.prd: {
				link = 'https://huayang.baixing.com'
				break
			}
		}
		bxPoint("new_homepage_activity_click", {
			activity_id: item.id,
			activity_title: item.title,
			activity_run_date: item.start_time
		}, false)

		link += `/#/home/detail/${item.id}`
		wx.navigateTo({
			url: `/pages/pureWebview/pureWebview?link=${link}`
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
		bxPoint("homepage_visit", {})
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
			title: "在花样百姓，过积极、健康、时尚的品质生活",
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	},
	onPageScroll(e) {}
})
