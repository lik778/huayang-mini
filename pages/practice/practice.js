import { getBannerList } from "../../api/mall/index"
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
import { CourseLevels } from "../../lib/config"
import dayjs from "dayjs"
import { $notNull, calculateExerciseTime } from "../../utils/util"
import { checkAuth } from "../../utils/auth"

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
		exerciseTime: 0 // 训练时间
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
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}

		checkAuth({
			listenable: true,
			ignoreFocusLogin: true
		})

		this.initial()
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

	},
	// 处理点击课程事件
	handleCourseTap(e) {
		wx.navigateTo({
			url: "/subCourse/practiceDetail/practiceDetail?courseId=" + e.currentTarget.dataset.item.id
		})
	},
	// 处理练习按钮事件
	handleExerciseBtnTap(e) {
		let item = e.currentTarget.dataset.item
		// 创建用户当日练习记录
		createPracticeRecordInToday()
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
						wx.navigateTo({url: `/subCourse/practiceDetail/practiceDetail?courseId=${item.kecheng_id}`})
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
				// TODO video预览页面 item.video
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
			userJoinedClassesList.forEach(classItem => {
				classItem.kecheng.exerciseTime = calculateExerciseTime(classItem.kecheng.duration)
			})
			if (userJoinedClassesList.length > 0) {
				this.setData({userJoinedClassesList})
			} else {
				// 推荐课程
				queryRecommendCourseList({scene: 'zhide_kecheng_pratice'}).then((recommendList) => {
					recommendList.forEach(recommendList => {
						recommendList.exerciseTime = calculateExerciseTime(recommendList.duration)
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
		let handlerBootCampList = []
		for (const {kecheng_traincamp_id, kecheng_traincamp: {name, start_date}} of bootCampList) {
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
				content
			})
		}
		this.setData({bootCampList: handlerBootCampList.slice()})
	}
})
