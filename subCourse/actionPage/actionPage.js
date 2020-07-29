// subCourse/actionPage/actionPage.js
import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { voices_ary, voices_key, voices_number, LocaleVoice } from "../../lib/voices"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0, // 状态栏高度
		screenHeight: 0, // 设备高度
		screenWidth: 0, // 设备宽度
		currentActionIndex: 0, // 当前动作索引
		actionData: [{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.u0QwXWSzueXc0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.ja1i95SmWTabbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"2","restTime":"10"},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.LAc5uuWAp5ks0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.M5gJBhwRysBNbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"2","restTime":"10"},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.RZJ74n6mSqx30df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.HBh2g6KHpL11bc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"2","restTime":"10"},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.944ebmDPF07v0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.r87lRM7zgvMkbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"2","restTime":"10"}], // 动作数据
		currentDuration: 0, // 整个课程已播放的时长

		targetActionObj: null, // 正在执行的动作
		targetActionIndex: 0, // 正在执行的动作索引

		beforeSportAudio: null, // 动作开始前的旁白播放器
		beforeSportAsideAudioEventMounted: false, // 动作开始前的旁白播放器结束事件是否结束

		commandAudio: null, // 口令播放器
		commandAudioEventMounted: false, // 口令播放结束事件是否结束
		commandTimer: null, // 口令timer

		countDownAudio: null, // 时间口令播放器
		countDownAudioEventMounted: false,

		mainPointAudio: null, // 要领播放器
		didPlayMainPointAudioInCurrentTargetAction: false, // 是否在当前动作生命周期中播放过要领语音

		isRunning: true, // 动作是否正在进行

		didShowPrepareLayer: true, // 预备层
		PrepareNumber: 3, // 预备数字

		didShowRestLayer: false, // 休息层
		restTimeText: "00:00", // 休息时间
		didPauseRest: false, // 是否暂停休息阶段
		didLeaveRestImmediate: false, // 是否立即结束休息阶段

		globalRecordTimer: null, // 全局训练时长计时器
		globalRecordTiming: 0, // 整个课程时长
		globalRecordTimeText: "00:00", // 训练时长
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const self = this
		const eventChannel = this.getOpenerEventChannel()

		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			screenHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight,
			screenWidth: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
		})

		if (!$notNull(eventChannel)) {
			// TODO 调试代码记得删除
			this.setData({
				targetActionObj: this.data.actionData[0]
			})
			return
		}

		eventChannel.on("transmitCourseMeta", function (data) {
			console.log(data)
			let actionData = JSON.parse(data)
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
		// 视频实例
		this.data.video = wx.createVideoContext("actionVideo", this)
		// 练习开始前的旁白
		this.data.beforeSportAudio = wx.createInnerAudioContext()
		// 要领
		this.data.mainPointAudio = wx.createInnerAudioContext()
		// 口令
		this.data.commandAudio = wx.createInnerAudioContext()
		// 时间口令
		this.data.countDownAudio = wx.createInnerAudioContext()

		// TODO 暂时开发设计稿
		this.start()
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
	/**
	 * 在休息层切换上一个动作
	 */
	switchPrevActionInRestTime() {
		this.checkoutNextAction(true)
		this.switchNextActionInRestTime()
	},
	/**
	 * 在休息层切换下一个动作
	 */
	switchNextActionInRestTime() {
		// 立即结束休息，开始动作
		this.setData({
			didLeaveRestImmediate: true,
			didPauseRest: false,
		})

	},
	/**
	 * 退出练习
	 */
	exit() {
		wx.showModal({
			title: "提示",
			content: "是否立即推出训练",
			confirmText: "确定",
			success() {
				// TODO 干点什么...
				console.log("回到某一页");
			}
		})
	},
	// 主动暂停休息阶段
	pauseRestTime() {
		this.setData({ didPauseRest: !this.data.didPauseRest })
	},
	// 修改休息阶段的休息时间
	modifyRestTimeTest(time) {
		this.setData({restTimeText: this.calcRemainingTime(time)})
	},
	/**
	 * 计算剩余时间
	 */
	calcRemainingTime(remainingTime) {
		remainingTime = +remainingTime
		if (remainingTime > 0) {
			let minutes = remainingTime / 60 | 0
			let seconds = remainingTime % 60
			return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
		} else {
			return "00:00"
		}
	},
	/**
	 * 播报动作名称，并开始训练
	 * @returns {Promise<void>}
	 * @private
	 */
	async _playActionNameAndStartTraining() {
		// 「动作名称」「N次/秒」
		await this.playTempAudio(this.data.targetActionObj.name_voice_link)
		await this.playTempAudio(voices_number(this.data.targetActionObj.cycleTime))
		await this.playTempAudio(this.data.targetActionObj.meta_type == 2 ? LocaleVoice.lv13 : LocaleVoice.lv7)
		//  321GO!
		await this.playTempAudio(LocaleVoice.lv18)
		this.setData({PrepareNumber: 2})
		await this.playTempAudio(LocaleVoice.lv19)
		this.setData({PrepareNumber: 1})
		await this.playTempAudio(LocaleVoice.lv20)
		this.setData({PrepareNumber: "GO!"})
		this.playBeforeSportAside(LocaleVoice.lv21)
	},
	/**
	 * 切换上一个动作
	 */
	async switchPrevAction() {
		if (this.data.currentActionIndex > 0) {
			console.log('上一个动作')
			this.stopAllAction()
			this.checkoutNextAction(true)
			// 显示预备页
			this.setData({ didShowPrepareLayer: true })
			// 下一个动作
			await this.playTempAudio(LocaleVoice.lv15)
			// 播报动作名称，并开始训练
			this._playActionNameAndStartTraining()
		}
	},
	/**
	 * 切换下一个动作
	 */
	async switchNextAction() {
		if (this.data.currentActionIndex <= this.data.actionData.length - 1) {
			console.log('下一个动作')
			this.stopAllAction()
			this.checkoutNextAction()
			// 显示预备页
			this.setData({ didShowPrepareLayer: true })
			if (this.data.currentActionIndex === this.data.actionData.length - 1) {
				// 最后一个动作
				await this.playTempAudio(LocaleVoice.lv16)
			} else {
				// 下一个动作
				await this.playTempAudio(LocaleVoice.lv15)
			}
			// 播报动作名称，并开始训练
			this._playActionNameAndStartTraining()
		}
	},
	/**
	 * 暂停动作
	 */
	pauseAction() {
		if (this.data.isRunning) {
			this.data.video.pause()
			this.data.mainPointAudio.pause()
			if (this.data.targetActionObj.meta_type == 2) {
				this.data.commandAudio.pause()
			} else {
				this.data.countDownAudio.pause()
			}
		} else {
			this.data.video.play()
			this.data.mainPointAudio.play()
			if (this.data.targetActionObj.meta_type == 2) {
				this.data.commandAudio.play()
			} else {
				this.data.countDownAudio.play()
			}
		}
		this.setData({isRunning: !this.data.isRunning})
	},
	/**
	 * 停止动作
	 */
	stopAllAction() {
		this.data.video.stop()
		this.data.mainPointAudio.stop()
		this.data.commandAudio.stop()
		this.data.countDownAudio.stop()
	},
	/**
	 * 临时播放器 播放音频
	 * @param params
	 * @returns {Promise<unknown>}
	 */
	playTempAudio(params) {
		let audio = wx.createInnerAudioContext()
		return new Promise(resolve => {
			let callback = function () {
				audio.offEnded(callback)
				audio.destroy()
				resolve()
			}
			audio.src = params
			audio.play()
			audio.onEnded(callback)
		})
	},

	/**
	 * 播放动作前的旁白
	 * @param link
	 */
	playBeforeSportAside(link) {
		const self = this
		this.data.beforeSportAudio.src = link
		this.data.beforeSportAudio.play()

		if (this.data.beforeSportAsideAudioEventMounted) return
		this.setData({beforeSportAsideAudioEventMounted: true})

		this.data.beforeSportAudio.onEnded(function () {
			// 课程演示
			self.startCourse(self.data.targetActionObj)
		})
	},

	/**
	 * 播放要领
	 * @param voiceLink
	 */
	playMainPoint(voiceLink) {
		const self = this
		this.data.mainPointAudio.src = voiceLink
		this.data.mainPointAudio.play()

		this.data.mainPointAudio.onEnded(function () {
			// 还原口令音量
			self.data.commandAudio.volume = 1
			self.data.countDownAudio.volume = 1
		})
	},
	/**
	 * 播放时间口令
	 */
	playCountDown() {
		const self = this
		this.data.countDownAudio.src = LocaleVoice.lv10
		this.data.countDownAudio.play()
		this.setData({targetActionIndex: this.data.targetActionIndex + 1})

		if (this.data.countDownAudioEventMounted) return
		this.setData({countDownAudioEventMounted: true})

		this.data.countDownAudio.onEnded(function () {
			// 判断：当前动作的"要领"语音是否已播放
			if (!self.data.didPlayMainPointAudioInCurrentTargetAction) {
				// 降低口令音量
				self.data.countDownAudio.volume = 0.3
				// 5次滴后开始播放"要领"
				self.playMainPoint(self.data.targetActionObj.voice_link)
				self.setData({didPlayMainPointAudioInCurrentTargetAction: true})
			}

			// 判断：当前动作倒计时是否结束
			if (self.data.targetActionIndex < self.data.targetActionObj.cycleTime) {
				self.playCountDown()
			} else {
				self.prepareNextAction()
			}
		})
	},
	/**
	 * 播放节奏口令
	 * @param commands
	 */
	playCommand(commands) {
		const self = this
		this.data.commandAudio.src = commands[this.data.targetActionIndex]
		this.data.commandAudio.play()
		this.setData({targetActionIndex: this.data.targetActionIndex + 1})


		if (this.data.commandAudioEventMounted) return
		this.setData({commandAudioEventMounted: true})

		this.data.commandAudio.onEnded(function () {
			// 一拍口令结束

			// 判断：当前动作的"要领"语音是否已播放
			if (!self.data.didPlayMainPointAudioInCurrentTargetAction) {
				// 降低口令音量
				self.data.commandAudio.volume = 0.3
				// 第一段"口令"结束开始播放"要领"
				self.playMainPoint(self.data.targetActionObj.voice_link)

				self.setData({didPlayMainPointAudioInCurrentTargetAction: true})
			}

			// 判断：当前动作是否结束
			if (self.data.targetActionIndex < self.data.targetActionObj.cycleTime) {
				// 再次播放口令
				self.playCommand(commands)
			} else {
				self.prepareNextAction()
			}

		})
	},
	/**
	 * 筹备下个动作
	 */
	prepareNextAction() {
		// 停止视频
		this.data.video.stop()
		// 切换下一个动作
		this.checkoutNextAction()
		// 检查是否是最后一个动作
		if (this.data.currentActionIndex < this.data.actionData.length) {
			// 显示休息层
			this.setData({didShowRestLayer: true})
			// 6. 「休息一下吧」
			this.playTempAudio(LocaleVoice.lv5).then(() => {
				// 休息完开始下一个动作
				let restPromise = new Promise(resolve => {
					let timer = null
					let delayTime = this.data.targetActionObj.restTime
					let doneTome = 1
					timer = setInterval(() => {
						this.modifyRestTimeTest(delayTime - doneTome)
						// 用户是否暂停休息时间
						if (!this.data.didPauseRest) {
							doneTome += 1
						}
						// 立即结束休息阶段 ｜｜ 休息时间大于规定休息时间
						if (this.data.didLeaveRestImmediate || doneTome > delayTime) {
							clearInterval(timer)
							resolve()
						}
					}, 1000)
				})

				restPromise.then(async () => {
					// 准备！滴滴滴
					// await this.playTempAudio(LocaleVoice.lv14)
					// await this.playTempAudio(LocaleVoice.lv10)
					// await this.playTempAudio(LocaleVoice.lv10)
					// await this.playTempAudio(LocaleVoice.lv10)

					// 隐藏休息层 && 还原立即结束休息字段
					this.setData({
						didShowRestLayer: false,
						didLeaveRestImmediate: false,
						didShowPrepareLayer: true,
					})

					if (this.data.currentActionIndex === this.data.actionData.length - 1) {
						// 休息结束
						await this.playTempAudio(LocaleVoice.lv17)
						// 最后一个动作
						await this.playTempAudio(LocaleVoice.lv16)
					} else {
						// 休息结束，下一个动作
						await this.playTempAudio(LocaleVoice.lv3)
					}
					// 播报动作名称，并开始训练
					this._playActionNameAndStartTraining()
				})
			})
		} else {
			this.setData({isRunning: false})
			// 「恭喜你完成训练」
			this.playTempAudio(LocaleVoice.lv6)
			// 训练结束
			// 停止全局记时器
			clearInterval(this.data.globalRecordTimer)
		}
	},
	// 切换下个动作
	checkoutNextAction(isPrevious = false) {
		let nextIndex = this.data.currentActionIndex + (isPrevious ? -1 : 1)
		let nextActionObj = this.data.actionData[nextIndex]
		this.setData({
			currentActionIndex: nextIndex,
			targetActionObj: nextActionObj,
			targetActionIndex: 0,
			didPlayMainPointAudioInCurrentTargetAction: false
		})
	},
	// 开始课程演示
	startCourse(data) {
		// 关闭预备遮罩层, 还原PrepareNumber=3
		this.setData({
			didShowPrepareLayer: false,
			PrepareNumber: 3
		})
		// 视频开始播放
		this.data.video.play()
		console.log(data)
		let {name, voice_link, voice_type, restTime} = data

		// 设置当前动作的休息时间
		this.modifyRestTimeTest(restTime)

		let splitSizeAry = voices_key[voice_type].split(",")
		let voices = voices_ary.slice(+splitSizeAry[0], +splitSizeAry[1])

		if (this.data.targetActionObj.meta_type == 2) {
			// 节奏口令动作
			this.playCommand(voices)
		} else {
			// 时间口令动作
			this.playCountDown(voices)
		}
	},

	async start() {
		// 全局计时器
		this.data.globalRecordTimer = setInterval(() => {
			let nextTiming = this.data.globalRecordTiming + 1
				this.setData({
				globalRecordTiming: nextTiming,
				globalRecordTimeText: this.calcRemainingTime(nextTiming)
			})
		}, 1000)

		this.setData({isRunning: true})
		// 1.「准备好了吗 第一个动作」
		await this.playTempAudio(LocaleVoice.lv1)
		// 播报动作名称，并开始训练
		this._playActionNameAndStartTraining()
	}
})
