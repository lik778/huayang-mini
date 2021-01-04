import {
	getLocalStorage
} from "../../utils/util"
import {
	GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import dayjs from "dayjs"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		link: "",
		adapter: false,
		totalDuration: 0,
		playDurationList: [],
		hasPlayVideo: '',
		hasPoint: true,

		videoSrc: '',
		playIndex: 0,
		campId: '',
		name: '',
		date:""
	},


	// 播放视频
	playVideo() {
		if (this.data.hasPlayVideo === '') {
			this.setData({
				hasPlayVideo: true
			})
		}

	},

	// 播放进度变化
	processChange(e) {
		let duration = Math.floor(e.detail.currentTime)
		let totalDuration = Math.floor(e.detail.duration)
		let arr = this.data.playDurationList
		if (arr.indexOf(duration) === -1) {
			arr.push(duration)
			this.setData({
				playDurationList: arr
			})
		}
		if (totalDuration !== this.data.totalDuration) {
			this.setData({
				totalDuration: totalDuration
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options.is_camp_video && options.is_camp_video === 'true') {
			let host = 'http://video.huayangbaixing.com/sv'
			this.setData({
				videoSrc: options.link.split(host)[1],
				playIndex: Number(options.courseIndex),
				campId: Number(options.campId),
				name: options.name,
				date: options.date
			})
		}
		// is_camp_video
		this.setData({
			link: options.link
		})
		let res = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
		this.setData({
			adapter: /iphone x/i.test(res.model) || /iPhone11/i.test(res.model)
		})
	},
	// 记录打点
	recordPlayDuration() {
		let arr = this.data.playDurationList.sort((a, b) => {
			return a - b
		})
		let splitIndexArr = []
		let index = 0
		let timeSnippetArr = []
		let timeList = []
		for (let i = 0; i < arr.length; i++) {
			if (arr[i + 1] - arr[i] > 1) {
				splitIndexArr.push(i + 1)
			}
		}
		while (splitIndexArr.length > 0) {
			let data = arr.slice(index, splitIndexArr[0])
			timeSnippetArr.push(data)
			index = splitIndexArr[0]
			splitIndexArr.splice(0, 1)
			if (splitIndexArr.length === 0) {
				timeSnippetArr.push(arr.slice(index, arr.length))
			}
		}
		for (let i in timeSnippetArr) {
			let str1 = timeSnippetArr[i][0]
			let str2 = timeSnippetArr[i][timeSnippetArr[i].length - 1]
			timeList.push(`${str1}-${str2}`)
		}
		let listData = []
		if (arr.length <= 1) {
			listData = arr[0]
		} else {
			listData = [`${arr[0]}-${arr[arr.length-1]}`]
		}
		bxPoint("page_practice_camp", {
			scene: 'page_practice_camp',
			traincamp_id: this.data.campId,
			video_src: this.data.videoSrc,
			lesson_num: `第${this.data.playIndex + 1}节课`,
			kecheng_title: this.data.name,
			lesson_date: this.data.date,
			time_snippet: timeList.length === 0 ? listData : timeList, //事件片段
			total_duration: this.data.totalDuration, //视频总时间
			total_visit_duration: arr.length, // 总观看时间
		}, false)
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		if (this.data.hasPlayVideo && this.data.hasPoint) {
			this.setData({
				hasPoint: false
			})
			this.recordPlayDuration()
		}

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		if (this.data.hasPlayVideo && this.data.hasPoint) {
			this.setData({
				hasPoint: false
			})
			this.recordPlayDuration()
		}
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

	}
})