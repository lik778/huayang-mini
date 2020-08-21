import { calculateExerciseTime, getLocalStorage } from "../../utils/util"
import { CourseLevels, GLOBAL_KEY } from "../../lib/config"
import { joinCourseInGuide, queryBootCampCourseList } from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		CourseLevels,
		statusHeight: 0,
		didSkip: false,
		visible: false,
		recommendCourseList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
		})

		this.initial()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// 解决IOS设备animation动画失效问题
		let startTimer = setTimeout(() => {
			this.setData({visible: true})
			clearTimeout(startTimer)
		}, 100)

		let timer = setTimeout(() => {
			this.setData({didSkip: true})
			clearTimeout(timer)
			wx.switchTab({
				url: '/pages/discovery/discovery',
			})
		}, 7500)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		bxPoint("applets_guide", {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source
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
		let data = getLocalStorage(GLOBAL_KEY.userId)
		return {
			title: "跟着花样一起变美，变自信",
			path: `/pages/auth/auth?invite_user_id=${data}`
		}
	},
	// 查看更多课程
	moreCourse() {
		bxPoint("applets_more", {}, false)
		wx.switchTab({
			url: '/pages/discovery/discovery'
		})
	},
	/**
	 * 加入课程，跳转至个人课程页
	 */
	joinCourse() {
		let selectedCourseIds = this.data.recommendCourseList.filter(n => n.selected === 1).map(c => c.id)
		if (selectedCourseIds.length > 0) {
			joinCourseInGuide({kecheng_id_str: selectedCourseIds.join(",")})
			this.data.recommendCourseList.forEach(item => {
				bxPoint("applets_join", {check: item.kecheng_type, check_name: item.name, isSelected: selectedCourseIds.indexOf(item.id) !== -1}, false)
			})
		}
		wx.switchTab({
			url: '/pages/practice/practice',
		})
	},
	/**
	 * 处理课程选择事件
	 * @param e
	 */
	handleTap(e) {
		let list = this.data.recommendCourseList.slice()
		let index = e.currentTarget.dataset.index
		list[index].selected = list[index].selected === 1 ? 0 : 1
		this.setData({recommendCourseList: list})
	},
	/**
	 * 跳过动画
	 */
	skip() {
		bxPoint("applets_skip", {}, false)
		wx.switchTab({
			url: "/pages/discovery/discovery"
		})
	},
	// 初始化
	initial() {
		queryBootCampCourseList({kecheng_type: 3, limit: 4}).then((data) => {
			data = data || []
			data = data.map(item => {
				return {
					...item,
					duration: calculateExerciseTime(item.duration),
					selected: 1
				}
			})
			this.setData({recommendCourseList: data.slice()})
		})
	}
})
