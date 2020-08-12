import { getBannerList, getYouZanAppId } from "../../api/mall/index"
import {
	createPracticeRecordInToday,
	getCourseData,
	queryBootCampContentInToday,
	queryRecommendCourseList,
	queryUserHaveClassesInfo,
	queryUserJoinedBootCamp,
	queryUserJoinedClasses,
	queryUserRecentPracticeLog
} from "../../api/course/index"
import { CourseLevels, GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { $notNull, calculateExerciseTime, getLocalStorage, setLocalStorage } from "../../utils/util"
import { checkAuth } from "../../utils/auth"
import bxPoint from "../../utils/bxPoint"

const TagImageUrls = {
	// done 今日完成
	done: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262295sLZtTc.jpg",
	// none 今日未完成
	none: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596446506oAldMH.jpg",
	// gone 之前完成
	gone: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262385rBoLOO.jpg",
	// forget 未完成
	forget: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596446539AZlUwr.jpg"
}

const CourseTypeImage = {
	kecheng: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596352654quOqYe.jpg",
	video: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596352666EUnLUw.jpg",
	url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596352721XfdrJj.jpg",
	product: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596352734UhOOIu.jpg"
}

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TagImageUrls,
		CourseLevels,
		CourseTypeImage,
		bannerList: [],
		userHaveClassesInfo: {}, // 用户的学习数据统计
		userJoinedClassesList: [], // 用户加入的课程列表
		recommendList: [], // 推荐课程列表
		weeklyLog: [], // 本周打卡记录
		bootCampList: [], // 训练营
		didShowTipsLay: false, // 显示提示收藏蒙层
		currentBannerItem: 0,
		exerciseTime: 0 // 训练时间
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 检查是否需要展示提示层
		this.checkTipsLay()
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

		checkAuth({
			authPhone: true
		})

		this.initial()

		bxPoint("applets_practice", {from_uid: getApp().globalData.super_user_id})
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
		let data = getLocalStorage(GLOBAL_KEY.userId)

		return {
			title: '跟着花样一起变美，变自信',
			path: `/pages/auth/auth?invite_user_id=${data}`
		}
	},
	// 处理轮播点击事件
	jumpToLink(e) {
		let {link, link_type} = e.currentTarget.dataset.item
		bxPoint("applets_banner", {position: 'page/practice/practice'}, false)
		if (link_type === 'youzan') {
			getYouZanAppId().then(appId => {
				wx.navigateToMiniProgram({
					appId,
					path: link,
				})
			})
		} else {
			wx.navigateTo({url: link})
		}
	},
	hiddenTipMask() {
		this.setData({didShowTipsLay: false})
	},
	checkTipsLay() {
		const key = "hua_yang_practice_tip_mask_time"
		let markTime = getLocalStorage(key)
		let now = +new Date()/1000|0
		let buf = 7*24*60*60
		if (!markTime || markTime < now) {
			this.setData({didShowTipsLay: true})
			setLocalStorage(key, now + buf)
		}
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			currentBannerItem: e.detail.current
		})
	},
	// 处理点击课程事件
	handleCourseTap(e) {
		wx.navigateTo({
			url: "/subCourse/practiceDetail/practiceDetail?courseId=" + e.currentTarget.dataset.id
		})
	},
	// 处理练习按钮事件
	handleExerciseBtnTap(e) {
		let item = e.currentTarget.dataset.item
		if (item.type !== "kecheng" && item.kecheng_type !== 3) {
			// 创建用户当日练习记录
			createPracticeRecordInToday()
		}
		bxPoint("practice_start", {}, false)
		console.log(item)
		switch (item.type) {
			case 'kecheng': {
				switch (item.kecheng_type) {
					case 0: {
						// 直播
						wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.room_id}`})
						return
					}
					case 1: {
						// 回看
						wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.room_id}`})
						return
					}
					case 2: {
						// 小鹅通
						wx.navigateTo({url: `/pages/webViewCommon/webViewCommon?link=${item.url}`})
						return
					}
					case 3: {
						// 结构化课程
						wx.navigateTo({url: `/subCourse/practiceDetail/practiceDetail?courseId=${item.kecheng_id}&formCampDetail=payUser`})
						return
					}
				}
				return
			}
			case 'url': {
				wx.navigateTo({url: `/pages/webViewCommon/webViewCommon?link=${item.url}`})
				return
			}
			case 'product': {
				wx.navigateTo({
					url: '/subCourse/detail/detail?prdId=' + item.product_id
				})
				return
			}
			case 'video': {
				wx.navigateTo({
					url: '/subLive/videoPage/videoPage?link=' + item.video
				})
				return
			}
		}
	},
	// 课程管理
	goToPracticeManage() {
		wx.navigateTo({
			url: "/subCourse/practiceManage/practiceManage"
		})
	},
	// 查看训练营详情
	goToBootCamp(e) {
		wx.navigateTo({
			url: "/subCourse/campDetail/campDetail?id=" + e.currentTarget.dataset.bootcampid
		})
	},
	// 发现页
	goToDiscovery() {
		bxPoint("parctice_choose", {}, false)
		wx.switchTab({
			url: '/pages/discovery/discovery'
		})
	},
	// 生成本周打卡日志
	generateWeeklyLog() {
		let now = dayjs()
		let todayDate = now.date()
		let mondayDateInThisWeek = now.day(0)
		return new Array(7).fill("").map((item, index) => {
			let date = mondayDateInThisWeek.add(index, 'day').date()
			return {
				date,
				dateText: date === todayDate ? '今天' : "周" + "日一二三四五六".charAt(index),
				status: date === todayDate ? 'none' : 'forget'
			}
		})
	},
	async initial() {
		// banner
		getBannerList({scene: 7}).then((bannerList) => {
			this.setData({bannerList})
		})

		// 用户加入的课程
		queryUserJoinedClasses().then((userJoinedClassesList) => {
			userJoinedClassesList.filter(c => c.kecheng).forEach(classItem => {
				classItem.kecheng.exerciseTime = calculateExerciseTime(classItem.kecheng.duration)
			})
			if (userJoinedClassesList.length > 0) {
				this.setData({userJoinedClassesList})
			} else {
				// 推荐课程
				queryRecommendCourseList({scene: 'zhide_kecheng_pratice'}).then((recommendList) => {
					recommendList.filter(r => r).forEach(recommendItem => {
						recommendItem.exerciseTime = calculateExerciseTime(recommendItem.duration)
					})
					this.setData({recommendList})
				})
			}
		})

		// 用户学习数据统计
		queryUserHaveClassesInfo().then((userHaveClassesInfo) => {
			this.setData({
				userHaveClassesInfo,
				exerciseTime: calculateExerciseTime(userHaveClassesInfo.study_time)
			})
		})

		// 用户最近7天的打卡记录
		let userRecentPracticeLog = await queryUserRecentPracticeLog({limit: 7})
		let weeklyLog = this.generateWeeklyLog()
		let now = dayjs()
		weeklyLog.forEach((dayItem, index) => {
			let target = userRecentPracticeLog.find(n => Number(String(n.date).slice(-2)) === dayItem.date)
			if ($notNull(target)) {
				dayItem.status = Number(String(target.date).slice(-2)) === now.date() ? 'done' : 'gone'
			}
		})
		this.setData({weeklyLog})

		// 获取训练营列表
		let bootCampList = await queryUserJoinedBootCamp()
		bootCampList = bootCampList.filter(item => +item.kecheng_traincamp.status !== 2)
		let handlerBootCampList = []
		for (const {kecheng_traincamp_id, kecheng_traincamp: {name, start_date, status}} of bootCampList) {
			// 根据训练营查找对应的课程
			let dayNum = dayjs().diff(dayjs(start_date), 'day')
			let bootCampInfo = await queryBootCampContentInToday({
				traincamp_id: kecheng_traincamp_id,
				day_num: dayNum < 0 ? 0 : dayNum
			})

			let content = bootCampInfo && bootCampInfo.content ? JSON.parse(bootCampInfo.content) : []

			// 解析课程详情
			for (let index = 0; index < content.length; index++) {
				let c = content[index]
				if (c.kecheng_id) {
					let kechengInfo = await getCourseData({kecheng_id: c.kecheng_id})
					c.kecheng_type = kechengInfo.kecheng_type
					c.room_id = kechengInfo.room_id
				}
			}

			handlerBootCampList.push({
				bootCampId: kecheng_traincamp_id,
				name: name,
				content,
				status: +status
			})
		}
		this.setData({bootCampList: handlerBootCampList.slice()})
	}
})
