import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY, CourseLevels } from "../../lib/config"
import { joinCourseInGuide, queryBootCampCourseList } from "../../api/course/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		CourseLevels,
		statusHeight: 0,
		didSkip: false,
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
		let timer = setTimeout(() => {
			this.setData({didSkip: true})
			clearTimeout(timer)
		}, 9000)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

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
	// 查看更多课程
	moreCourse() {
		console.log("查看更多课程");
	},
	/**
	 * 加入课程，跳转至个人课程页
	 */
	joinCourse() {
		let selectedCourseIds = this.data.recommendCourseList.filter(n => n.selected === 1).map(c => c.id)
		if (selectedCourseIds.length > 0) {
			joinCourseInGuide({kecheng_id_str: selectedCourseIds.join(",")})
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
		this.setData({
			didSkip: true
		})
	},
	// 初始化
	initial() {
		queryBootCampCourseList({limit: 4}).then((data) => {
			data = data || []
			data = data.map(item => {
				return {
					...item,
					selected: 1
				}
			})
			this.setData({recommendCourseList: data.slice()})
		})
	}
})
