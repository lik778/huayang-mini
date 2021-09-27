import { $notNull, hasAccountInfo, hasUserInfo } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { getBannerList } from "../../api/mall/index"
import {
	getCompetitionMedia,
	getCompetitionVideo,
	getHistoryAlbums,
	getHistoryAlbumsById
} from "../../api/competition/index"
import request from "../../lib/request"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		didShowAuth: false,
		bannerList: [],
		secondBannerList: [],
		current: 0,
		mediaList: [],
		videoList: [],
		albumList: [],
		videoClass: null,
		currentVideoUrl: "",
		isPlaying: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.run()
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
				selected: 1
			})
		}

		bxPoint("model_homepage_visit", {})
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
			title: "2021花样时尚模特大赛，绽放趁现在！",
			path: "/pages/competition/competition"
		}
	},
	run() {
		getBannerList({scene: 22}).then((data) => {
			this.setData({bannerList: data, secondBannerList: data.length % 2 === 1 ? data.slice(1, 4) : data})
		})

		getCompetitionMedia().then(({list}) => {
			list = list || []
			this.setData({mediaList: list.slice(0, 2)})
		})

		getCompetitionVideo().then(({list}) => {
			list = list || []
			this.setData({videoList: list})
		})

		getHistoryAlbums().then((albums) => {
			let ids = []
			albums.forEach((ab) => {
				Object.entries(ab).forEach(([key, values]) => {
					ids = [...ids, ...values.map(n => n.album_id)]
				})
			})

			getHistoryAlbumsById({ids: ids.join(",")}).then((data) => {
				let ary = []
				albums.forEach((ab) => {
					let list = []
					Object.entries(ab).forEach(([key, values]) => {
						list = data.map(n => {
							let target = values.find(_ => _.album_id === n.id)
							if ($notNull(target)) {
								n.cover = n.cover + "?" + +new Date()
								n.pic_count = n.pic_count >= 10000 ? (n.pic_count / 10000).toFixed(1) + "w" : n.pic_count
								n.video_count = n.video_count >= 10000 ? (n.video_count / 10000).toFixed(1) + "w" : n.video_count
								n.view_count = n.view_count >= 10000 ? (n.view_count / 10000).toFixed(1) + "w" : n.view_count
								target.album = n
							} else {
								target = null
							}
							return target
						})
						ary.push({name: key, content: list.filter(n => n)})
					})
				})

				ary[0] = ary[0] && {name: ary[0].name, content: ary[0].content.reverse()}
				ary[1] = ary[1] && {name: ary[1].name, content: ary[1].content.reverse()}
				this.setData({albumList: ary})

				this.initVideoListener()
			})
		})
	},
	handleIntroduce() {
		wx.navigateTo({url: "/mine/normal-web-view/normal-web-view?link=https://mp.weixin.qq.com/s/0fvrEEqvFLfJH0EDulrqRw"})
		bxPoint("model_introduce_click", {}, false)
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 处理轮播点击事件
	handleBannerTap(e) {
		let {link, need_auth, id } = e.currentTarget.dataset.item
		if (need_auth === 1) {
			if (!hasUserInfo() || !hasAccountInfo()) {
				return this.setData({didShowAuth: true})
			}
		}

		bxPoint("model_banner_click", {banner_id: id}, false)

		wx.switchTab({
			url: link, fail() {
				wx.navigateTo({
					url: link
				})
			}
		})
	},
	handleMediaTap(e) {
		let item = e.currentTarget.dataset.item
		bxPoint("model_news_click", {new_id: item.id, new_title: item.title}, false)
		wx.navigateTo({url: `/mine/normal-web-view/normal-web-view?link=${(item.link_url)}`})
	},
	findMoreMediaTap() {
		bxPoint("model_news_more_cilck", {}, false)
		wx.navigateTo({url: "/pages/mediaList/mediaList"})
	},
	handleVideoTap(e) {
		let item  = e.currentTarget.dataset.item
		this.playVideo(item.video_url)
		bxPoint("model_vedios_click", {vedio_id: item.id}, false)
	},
	playVideo(src) {
		if (this.data.videoClass == null) {
			let video = wx.createVideoContext("competitionVideo", this)
			this.setData({videoClass: video})
		}
		this.setData({currentVideoUrl: src})
		let t = setTimeout(() => {
			this.data.videoClass.play()
			this.setData({isPlaying: true})
			clearTimeout(t)
		}, 200)
	},
	pauseVideo() {
		this.setData({isPlaying: false})
		this.data.videoClass.pause()
	},
	endVideo() {
		this.pauseVideo()
	},
	initVideoListener() {
		let self = this
		let previewOB = wx.createIntersectionObserver()
		previewOB.relativeToViewport({
			top: -50,
			bottom: -50
		})
			.observe('#competitionVideo', res => {
				if (res && res.intersectionRatio > 0) {
				} else {
					// 离开可视区域
					self.data.videoClass && self.pauseVideo()
				}
			})
	},
	handleAlbumTap(e) {
		let item = e.currentTarget.dataset.item
		let link = `${request.baseUrl}/#/home/albums/${item.album_id}`
		bxPoint("model_photos_click", {
			photos_id: item.album.id,
			photos_title: item.name,
			photo_nums: item.album.pic_count,
			vedio_nums: item.album.video_count
		}, false)
		wx.navigateTo({url: "/pages/activityAlbum/activityAlbum?link=" + encodeURIComponent(link)})
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
	handleShareBtnTap() {
		bxPoint("model_share_click", {}, false)
	}
})
