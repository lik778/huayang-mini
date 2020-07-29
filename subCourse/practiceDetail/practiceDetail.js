// subCourse/practiceDetail/practiceDetail.js
import { getBootCampCourseInfo } from "../../api/course/index"
import { batchDownloadFiles } from "../../utils/util"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		courseInfoObj: null,
		voiceUrlQueue: [],
		videoUrlQueue: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// ?courseId=xxx
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

	initial() {
		// 获取训练营课程详情 TODO 更换 kecheng_id
		getBootCampCourseInfo({kecheng_id: 118}).then((response) => {
			this.data.courseInfoObj = {...response}
		})
	},

	// 转化课程动作为可执行的数据结构
	cookCourseMeta({kecheng_meta, link}) {
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
				restTime
			}
		})
		this.data.voiceUrlQueue = voiceUrlQueue
		this.data.videoUrlQueue = videoUrlQueue
		return actionAry
	},

	// 开始练习
	startPractice() {
		const self = this
		let cookedCourseMetaData = this.cookCourseMeta(this.data.courseInfoObj)

		// TODO 按钮的loading状态
		wx.showLoading()
		batchDownloadFiles([...this.data.voiceUrlQueue, ...this.data.videoUrlQueue]).then((response) => {
			let voiceResourceTempAry = response.slice(0, response.length / 2)
			let videoResourceTempAry = response.slice(response.length / 2)

			cookedCourseMetaData = cookedCourseMetaData.map((item, index) => {
				return {
					...item,
					voice_link: voiceResourceTempAry[index],
					link: videoResourceTempAry[index]
				}
			})

			wx.hideLoading()

			wx.navigateTo({
				url: "/subCourse/actionPage/actionPage",
				success(res) {
					res.eventChannel.emit('transmitCourseMeta', JSON.stringify(cookedCourseMetaData))
				}
			})
		})
	},
})
