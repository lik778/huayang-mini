import { getBannerList } from "../../api/mall/index"
import {
	createPracticeRecordInToday,
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

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TagImageUrls,
		CourseLevels,
		bannerList: [],
		userHaveClassesInfo: {}, // 用户的学习数据统计
		userJoinedClassesList: [], // 用户加入的课程列表
		recommendList: [], // 推荐课程列表
		weeklyLog: [], // 本周打卡记录
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
	// 生成本周打卡日志
	generateWeeklyLog() {
		let now = dayjs()
		let todayDate = now.date()
		let mondayDateInThisWeek = now.day(1)
		return new Array(7).fill("").map((item, index) => {
			let date = mondayDateInThisWeek.add(index, 'day').date()
			return {
				date,
				dateText: date === todayDate ? '今天' : "周" + "一二三四五六日".charAt(index),
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
		bootCampList = bootCampList.map(boot => {
			console.log(boot);
		})
	}
})
