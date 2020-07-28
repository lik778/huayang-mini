// subCourse/actionPage/actionPage.js
import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0, // 状态栏高度
		screenHeight: 0, // 设备高度
		currentActionIndex: 0, // 当前动作索引
		globalDuration: 0, // 整个课程时长
		currentDuration: 0, // 整个课程已播放的时长
		actionData: [{"id":8,"name":"游泳","desc":"","meta_type":1,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.kyYfpVyGJcora5f4eb586e8b99b872468785d13f7944.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.uOssAZ7ww9fX054fbe6c695e49078a5e8788447ac8ad.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":10,"rank":3,"calories":1000,"voice_type":"4_4","created_at":"2020-07-23","updated_at":"2020-07-27","deleted_at":null,"cycleTime":"1","restTime":"2"},{"id":8,"name":"游泳","desc":"","meta_type":1,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.6LKICdY19Kxza5f4eb586e8b99b872468785d13f7944.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.peTwJP2qY9Cb054fbe6c695e49078a5e8788447ac8ad.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":10,"rank":3,"calories":1000,"voice_type":"4_4","created_at":"2020-07-23","updated_at":"2020-07-27","deleted_at":null,"cycleTime":"13","restTime":"31"}], // 动作数据
		targetActionObj: null, // 正在执行的动作
		targetActionIndex: 0, // 正在执行的动作索引
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const self = this
		const eventChannel = this.getOpenerEventChannel()

		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			screenHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight
		})

		if (!$notNull(eventChannel)) {
			// TODO 调试代码记得删除
			this.setData({
				targetActionObj: this.data.actionData[0]
			})
			return
		}
		eventChannel.on("transmitCourseDuration", function(data) {
			self.setData({
				globalDuration: data
			})
		})

		eventChannel.on("transmitCourseMeta", function (data) {
			console.log(data)
			let actionData = JSON.parse(data);
			self.setData({
				actionData,
				targetActionObj: actionData[0] // 默认设置第一项
			})
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		let a = wx.createInnerAudioContext()
		a.src = this.data.actionData[0].voice_link
		// a.play()
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
	// 开始课程
	startCourse() {

	}
})
