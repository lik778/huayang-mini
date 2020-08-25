import {
	createPracticeRecordInToday,
	getBootCampCourseInfo,
	getRecentVisitorList,
	joinCourseInGuide
} from "../../api/course/index"
import { calculateExerciseTime, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { CourseLevels, GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0,
		screenWidth: 0,
		parentBootCampId: 0, // 训练营id，有就传无则不传
		accountInfo: {},
		CourseLevels,
		courseId: 0, // 课程ID
		courseInfoObj: {}, // 课程详情
		voiceUrlQueue: [], // 要领音频队列
		videoUrlQueue: [], // 动作视频队列
		actionQueue: [], // 动作队列
		avatarAry: [], // 最近参与人的头像数据
		btnText: "开始练习", // 按钮文案
		isDownloading: false, // 是否正在下载
		hasDoneFilePercent: 0, // 已经下载完的文件数量
		didShowAlert: false,
		didPayUser: false, // 是否是付费用户
		backPath: "", // 自定义导航栏返回路径
		didShowAuth: false, // 授权弹窗
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		let {scene, parentBootCampId = 0, courseId, source = '', formCampDetail, invite_user_id} = options
		// 通过小程序码进入 scene=${source}
		if (scene) {
			let sceneAry = decodeURIComponent(scene).split('/')
			let [sceneSource = ''] = sceneAry

			if (sceneSource) {
				getApp().globalData.source = sceneSource
			}
		} else {
			// 通过卡片进入
			if (invite_user_id) {
				getApp().globalData.super_user_id = invite_user_id
			}
			if (source) {
				getApp().globalData.source = source
			}
		}

		// 检查是否是训练营付费会员
		if (formCampDetail === "payUser") {
			this.setData({didPayUser: true})
		}

		let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
		this.setData({
			parentBootCampId,
			courseId,
			screenWidth: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth,
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			accountInfo,
			backPath: parentBootCampId ? `/subCourse/practiceDetail/practiceDetail?courseId=${courseId}&parentBootCampId=${parentBootCampId}` : `/subCourse/practiceDetail/practiceDetail?courseId=${courseId}`
		})

		this.initial()

		// 记录起始页面地址
		if (!getApp().globalData.firstViewPage && getCurrentPages().length > 0) {
			getApp().globalData.firstViewPage = getCurrentPages()[0].route
		}
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
		bxPoint("course_details", {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source,
		})
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
			title: `我正在学习${this.data.courseInfoObj.name}，每天都有看的见的变化，快来试试`,
			path: `/subCourse/practiceDetail/practiceDetail?courseId=${this.data.courseId}&invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	},

	// 用户拒绝授权
	authCancelEvent(e) {
		this.setData({didShowAuth: false})
		console.log('用户完成授权')
	},

	// 用户完成授权
	authCompleteEvent(e) {
		this.setData({didShowAuth: false})
		console.log('用户完成授权')
	},

	goToTask() {
		wx.switchTab({
			url: "/pages/userCenter/userCenter"
		})
	},

	/**
	 * 有进度的批量下载文件
	 * @param files
	 * @returns {Promise<[]>}
	 */
	async downloadFilesByProcess(files) {
		this.setData({hasDoneFilePercent: 0})
		let result = []
		for (let index = 0; index < files.length; index++) {
			let task = function () {
				return new Promise(resolve => {
					wx.downloadFile({
						url: files[index],
						success(res) {
							if (res.statusCode === 200) {
								resolve(res.tempFilePath)
							}
						}
					})
				})
			}

			let localeTempFilePath = await task()
			let percent = ((index + 1) / 2 / this.data.actionQueue.length) * 100 | 0
			this.setData({
				hasDoneFilePercent: percent,
				btnText: `正在下载${percent}%`
			})

			result.push(localeTempFilePath)
		}

		return result
	},

	initial() {
		// 获取训练营课程详情
		getBootCampCourseInfo({kecheng_id: this.data.courseId}).then((response) => {

			if (+response.hidden === 1) {
				wx.hideShareMenu({
					menus: ['shareAppMessage', 'shareTimeline']
				})
			}

			// 检查是否付费用户
			if (!this.data.didPayUser) {
				// 检查用户等级
				if (response.user_grade > (this.data.accountInfo.user_grade || 0)) {
					this.setData({
						btnText: `Lv ${response.user_grade} 等级开启`,
						isDownloading: true // 禁止用户点击按钮
					})
				}
			}
			response.exerciseTime = calculateExerciseTime(response.duration)
			this.setData({
				courseInfoObj: {...response},
				actionQueue: this.cookCourseMeta(response)
			})
		})

		// 获取课程最近参与人列表
		getRecentVisitorList({kecheng_id: this.data.courseId, limit: 6}).then((data) => {
			data = data || []
			let avatarAry = data.map(info => info.avatar_url)
			this.setData({avatarAry})
		})
	},

	// 转化课程动作为可执行的数据结构
	cookCourseMeta({kecheng_meta, link, cycle_count}) {
		let voiceUrlQueue = []
		let videoUrlQueue = []
		const actionAry = link.split("##").map(actionItem => {
			// [动作ID，循环次数，休息时间]
			let [actionId, cycleTime, restTime] = actionItem.split(",")
			let targetAction = kecheng_meta.find(m => m.id === +actionId)

			// 将"要领"加入要下载的语音队列
			voiceUrlQueue.push(targetAction.voice_link)
			videoUrlQueue.push(targetAction.link)

			return {
				...targetAction,
				cycleTime,
				restTime,
				loopCount: cycle_count
			}
		})
		this.data.voiceUrlQueue = voiceUrlQueue
		this.data.videoUrlQueue = videoUrlQueue
		return actionAry
	},

	// 处理分享按钮点击事件
	handleShareTap() {
		bxPoint("course_share", {}, false)
	},

	// 开始练习
	startPractice() {
		// 检查权限
		if (!(hasAccountInfo() && hasUserInfo())) {
			this.setData({didShowAuth: true})
			return
		}

		bxPoint("practice_begin", {keChengId: this.data.courseId}, false)
		createPracticeRecordInToday()

		// 检查是否是付费用户，是=>跳过用户等级检查，否=>检查用户等级
		if (!this.data.didPayUser) {
			// 检查用户等级
			if (this.data.courseInfoObj.user_grade > this.data.accountInfo.user_grade) {
				this.setData({
					didShowAlert: true
				})
				return
			}
		}

		const self = this
		let cookedCourseMetaData = this.data.actionQueue.slice()

		if (this.data.isDownloading) return
		this.setData({
			isDownloading: true
		})

		// let waitingForDownloadFiles = [...this.data.voiceUrlQueue, ...this.data.videoUrlQueue]
		let waitingForDownloadFiles = [...this.data.voiceUrlQueue]
		this.downloadFilesByProcess(waitingForDownloadFiles).then((downloadedFiles) => {
			let voiceResourceTempAry = downloadedFiles.slice()
			// let voiceResourceTempAry = downloadedFiles.slice(0, downloadedFiles.length / 2)
			// let videoResourceTempAry = downloadedFiles.slice(downloadedFiles.length / 2)

			cookedCourseMetaData = cookedCourseMetaData.map((item, index) => {
				return {
					...item,
					voice_link: voiceResourceTempAry[index],
					// link: videoResourceTempAry[index]
				}
			})

			this.setData({
				isDownloading: false,
				btnText: "开始练习"
			})

			// 加入课程
			joinCourseInGuide({kecheng_id_str: this.data.courseId})

			wx.navigateTo({
				url: `/subCourse/actionPage/actionPage?parentBootCampId=${this.data.parentBootCampId}`,
				success(res) {
					res.eventChannel.emit('transmitCourseMeta', JSON.stringify(cookedCourseMetaData))
					res.eventChannel.emit('transmitCourseInfo', JSON.stringify(self.data.courseInfoObj))
				}
			})
		})
	},
})
