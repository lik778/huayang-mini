import { getBannerList } from "../../api/mall/index"
import {
	createPracticeRecordInToday, queryBootCampContentInToday,
	queryRecommendCourseList,
	queryUserHaveClassesInfo, queryUserJoinedBootCamp,
	queryUserJoinedClasses,
	queryUserRecentPracticeLog
} from "../../api/course/index"
import { CourseLevels } from "../../lib/config"
import dayjs from "dayjs"
import { $notNull } from "../../utils/util"

const TagImageUrls = {
	// done 今日完成
	done: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262295sLZtTc.jpg",
	// none 今日未完成
	none: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262357uoBywC.jpg",
	// gone 之前完成
	gone: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262385rBoLOO.jpg",
	// forget 未完成
	forget: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596262406bSNcQC.jpg"
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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.initial()
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
	// 处理练习按钮事件
	handleExerciseBtnTap(e) {
		let item = e.currentTarget.dataset.item
		console.log(item)
		switch (item.type) {
			case "kecheng": {
				wx.navigateTo({url: `/subCourse/practiceDetail/practiceDetail?courseId=${item.kecheng_id}`})
				return
			}
			case "video": {
				// wx.navigateTo({url: `/subLive/review/review?zhiboRoomId=${}`})
				return
			}
			case "product": {
				wx.navigateTo({url: `/subCourse/detail/detail?prdId=${item.product_id}`})
				return
			}
			case "url": {
				return
			}
		}
	},
	// 查看所有训练营
	goToBootCamp(e) {
		console.log('打开训练营详情页', e.currentTarget.dataset.bootCampId)
	},
	// 去发现页
	findMoreBootCamp() {
		console.log('打开发现页')
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
		// 用户学习数据统计
		queryUserHaveClassesInfo().then((userHaveClassesInfo) => {
			this.setData({userHaveClassesInfo})
		})
		// 用户加入的课程
		queryUserJoinedClasses().then((userJoinedClassesList) => {
			this.setData({userJoinedClassesList})
		})
		// 推荐课程
		queryRecommendCourseList({scene: 'zhide_kecheng_pratice'}).then((recommendList) => {
			this.setData({recommendList})
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
		for (const {kecheng_traincamp_id, date, kecheng_traincamp: {name}} of bootCampList) {
			// 根据训练营查找对应的课程

			let bootCampInfo = await queryBootCampContentInToday({
				traincamp_id: kecheng_traincamp_id,
				day_num: dayjs().diff(dayjs(date), 'day')
			})

			handlerBootCampList.push({
				bootCampId: kecheng_traincamp_id,
				name,
				content: bootCampInfo && bootCampInfo.content ? JSON.parse(bootCampInfo.content) : []
			})
		}
		this.setData({bootCampList: handlerBootCampList})
		// this.setData({bootCampList: []})
	}
})
