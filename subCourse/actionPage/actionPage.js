// subCourse/actionPage/actionPage.js
import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { LocaleVoice, voices_ary, voices_key, voices_number } from "../../lib/voices"
import { completePractice, increaseExp, recordPracticeBehavior } from "../../api/course/index"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0, // 状态栏高度
		screenHeight: 0, // 设备高度
		screenWidth: 0, // 设备宽度
		courseInfo: null, // 课程信息
		currentActionIndex: 0, // 当前动作索引
		actionData: null, // 动作数据
		currentDuration: 0, // 整个课程已播放的时长

		targetActionObj: null, // 正在执行的动作
		targetActionIndex: 0, // 正在执行的动作索引

		mainPointAudio: null, // 要领播放器
		mainPointAudioEventMounted: false,
		isPlayMainPointAudioPlaying: false, // 要领语音是否正在播放
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
		didPauseRecordGlobalTime: false, // 是否停止全局计时器

		didShowResultLayer: false, // 结果层

		didShowLevelAlert: false, // 等级经验弹窗
		hasGrade: false, // 是否升级
		levelNumber: 0, // 升级等级/经验

		didPracticeDone: false, // 整个练习是否结束

		bgAudio: null // 背景音乐播放器
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		const self = this
		const eventChannel = this.getOpenerEventChannel()

		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			screenHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight,
			screenWidth: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
		})

		eventChannel.on("transmitCourseMeta", function (data) {
			// console.log(data)
			let actionData = JSON.parse(data)
			self.setData({
				actionData,
				targetActionObj: actionData[0] // 默认设置第一项
			})
		})

		eventChannel.on("transmitCourseInfo", function (data) {
			// console.log(data)
			let courseInfo = JSON.parse(data)
			self.setData({
				courseInfo
			})

			// 记录训练行为
			recordPracticeBehavior({
				kecheng_id: courseInfo.id,
				user_id: getLocalStorage(GLOBAL_KEY.userId)
			})
		})


		// 视频实例
		this.data.video = wx.createVideoContext("actionVideo", this)

		// 要领
		this.data.mainPointAudio = wx.createInnerAudioContext()

		this.data.bgAudio = wx.getBackgroundAudioManager()

		// 启动
		this.start()
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
		console.error('------ on show ------')
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		this.toggleAction("pause")
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		console.error("onUnload")
		// 销毁所有音视频
		this.data.mainPointAudio && this.data.mainPointAudio.destroy()
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
	 * 秀一下
	 */
	show() {
		// wx.navigateBack()
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
	checkoutPracticeStatus() {
		if (this.data.isRunning) {
			this.toggleAction("pause")
		} else {
			this.toggleAction("play")
		}
	},
	/**
	 * 退出练习
	 */
	exit() {
		let self = this
		wx.showModal({
			title: "提示",
			content: "是否立即推出训练",
			confirmText: "确定",
			success(res) {
				if (res.confirm) {
					wx.navigateBack()
					// wx.redirectTo({
					// 	url: "/subCourse/practiceDetail/practiceDetail?courseId=" + self.data.courseInfo.id
					// })
				} else if (res.cancel) {
					console.log('取消')
				}
			}
		})
	},
	// 主动暂停休息阶段
	pauseRestTime() {
		this.setData({
			didPauseRest: !this.data.didPauseRest,
			didPauseRecordGlobalTime: !this.data.didPauseRest
		})
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
		this.setData({
			didPlayMainPointAudioInCurrentTargetAction: false
		})
		// 「动作名称」「N次/秒」
		await this.playTempBgAudio(this.data.targetActionObj.name_voice_link)
		await this.playTempBgAudio(voices_number(this.data.targetActionObj.cycleTime))
		await this.playTempBgAudio(+this.data.targetActionObj.meta_type === 2 ? LocaleVoice.lv13 : LocaleVoice.lv7)
		//  321GO!
		await this.playTempBgAudio(LocaleVoice.lv18)
		this.setData({PrepareNumber: 2})
		await this.playTempBgAudio(LocaleVoice.lv19)
		this.setData({PrepareNumber: 1})
		await this.playTempBgAudio(LocaleVoice.lv20)
		this.setData({PrepareNumber: "GO!"})
		await this.playTempBgAudio(LocaleVoice.lv21)
		this.startCourse(this.data.targetActionObj)
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
			this.setData({didShowPrepareLayer: true})
			// 下一个动作
			await this.playTempBgAudio(LocaleVoice.lv15)
			// 播报动作名称，并开始训练
			this._playActionNameAndStartTraining()
		}
	},
	/**
	 * 切换下一个动作
	 */
	async switchNextAction() {
		if (this.data.currentActionIndex < this.data.actionData.length - 1) {
			console.log('下一个动作')
			this.stopAllAction()
			this.checkoutNextAction()
			// 显示预备页
			this.setData({didShowPrepareLayer: true})
			if (this.data.currentActionIndex === this.data.actionData.length - 1) {
				// 最后一个动作
				await this.playTempBgAudio(LocaleVoice.lv16)
			} else {
				// 下一个动作
				await this.playTempBgAudio(LocaleVoice.lv15)
			}
			// 播报动作名称，并开始训练
			this._playActionNameAndStartTraining()
		}
	},
	/**
	 * 切换练习状态
	 * @param status ['pause' || 'play']
	 */
	toggleAction(status) {
		if (status === "pause") {
			// 全局计时器
			this.setData({didPauseRecordGlobalTime: true})
			this.data.video.pause()
			// [要领播放中]&当前动作未播放过[要领]，则暂停
			if (this.data.isPlayMainPointAudioPlaying && !this.data.didPlayMainPointAudioInCurrentTargetAction) {
				this.data.mainPointAudio && this.data.mainPointAudio.pause()
			}
			this.data.bgAudio.pause()
		} else {
			// 全局计时器
			this.setData({didPauseRecordGlobalTime: false})
			this.data.video.play()
			// [要领播放中]&当前动作未播放过[要领]，则继续播放
			if (this.data.isPlayMainPointAudioPlaying && !this.data.didPlayMainPointAudioInCurrentTargetAction) {
				this.data.mainPointAudio && this.data.mainPointAudio.play()
			}
			this.data.bgAudio.play()
		}

		this.setData({isRunning: status !== "pause"})
	},
	/**
	 * 停止动作
	 */
	stopAllAction() {
		this.data.video.stop()
		this.data.mainPointAudio.stop()
		this.data.bgAudio.stop()
	},
	/**
	 * 临时播放器 播放音频
	 * @param link
	 * @returns {Promise}
	 */
	playTempBgAudio(link) {
		let audio = this.data.bgAudio
		audio.title = "旁白"
		return new Promise(resolve => {
			if (audio.src === link) {
				audio.play()
			} else {
				audio.src = link
				audio.onCanplay(() => {
					audio.play()
				})
			}
			audio.onEnded(() => {
				resolve()
			})
			audio.onPause(() => {
				console.error('暂停')
				this.toggleAction("pause")
			})
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

		// 正在播放要领
		this.setData({isPlayMainPointAudioPlaying: true})

		if (this.data.mainPointAudioEventMounted) return
		this.setData({mainPointAudioEventMounted: true})

		this.data.mainPointAudio.onEnded(function () {
			// 还原口令音量
			self.data.bgAudio.volume = 1
			self.setData({
				didPlayMainPointAudioInCurrentTargetAction: true, // 标示当前动作已经播放过要领
				isPlayMainPointAudioPlaying: false // 释放要领正在播放中的状态
			})
		})
	},
	/**
	 * 播放节奏口令
	 * @param commands
	 */
	async playCommand(commands) {
		let link = ""
		if (+this.data.targetActionObj.meta_type === 2) {
			link = commands[this.data.targetActionIndex % commands.length]
		} else {
			link = LocaleVoice.lv10
		}
		this.setData({targetActionIndex: this.data.targetActionIndex + 1})
		await this.playTempBgAudio(link)
		// 判断：当前动作的"要领"语音是否已播放
		if (!this.data.didPlayMainPointAudioInCurrentTargetAction) {
			// 降低口令音量
			this.data.bgAudio.volume = 0.3
			// 第一段"口令"结束开始播放"要领"
			this.playMainPoint(this.data.targetActionObj.voice_link)
		}

		// 判断：当前动作是否结束
		if (this.data.targetActionIndex < this.data.targetActionObj.cycleTime) {
			// 再次播放口令
			this.playCommand(commands)
		} else {
			this.prepareNextAction()
		}
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
			this.playTempBgAudio(LocaleVoice.lv5).then(() => {
				// 休息完开始下一个动作
				let restPromise = new Promise(resolve => {
					let timer = null
					let delayTime = this.data.targetActionObj.restTime
					let doneTime = 1
					timer = setInterval(() => {
						// 用户是否暂停休息时间
						if (!this.data.didPauseRest) {
							this.modifyRestTimeTest(delayTime - doneTime)
							doneTime += 1
						}
						// 立即结束休息阶段 ｜｜ 休息时间大于规定休息时间
						if (this.data.didLeaveRestImmediate || doneTime > delayTime) {
							clearInterval(timer)
							resolve()
						}
					}, 1000)
				})

				restPromise.then(async () => {
					// 隐藏休息层 && 还原立即结束休息字段
					this.setData({
						didShowRestLayer: false,
						didLeaveRestImmediate: false,
						didShowPrepareLayer: true,
					})

					if (this.data.currentActionIndex === this.data.actionData.length - 1) {
						// 休息结束
						await this.playTempBgAudio(LocaleVoice.lv17)
						// 最后一个动作
						await this.playTempBgAudio(LocaleVoice.lv16)
					} else {
						// 休息结束，下一个动作
						await this.playTempBgAudio(LocaleVoice.lv3)
					}
					// 播报动作名称，并开始训练
					this._playActionNameAndStartTraining()
				})
			})
		} else {
			this.setData({
				isRunning: false,
				didPracticeDone: true
			})
			// 「恭喜你完成训练」
			this.playTempBgAudio(LocaleVoice.lv6)
			// 训练结束
			this.setData({didShowResultLayer: true})
			// 停止全局记时器
			clearInterval(this.data.globalRecordTimer)
			// 上传训练记录
			completePractice({
				open_id: getLocalStorage(GLOBAL_KEY.openId),
				user_id: getLocalStorage(GLOBAL_KEY.userId),
				kecheng_id: this.data.courseInfo.id,
				duation: this.data.globalRecordTiming
			})
			// 经验值提升弹窗
			increaseExp({task_type: "task_pratice_playbill"}).then((data) => {
				// 升级信息
				if ($notNull(data)) {
					this.setData({
						didShowLevelAlert: true,
						hasGrade: data.has_grade,
						levelNumber: data.has_grade ? data.level : data.experience
					})
				}
			})
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
		let {name, voice_link, voice_type, restTime} = data

		// 设置当前动作的休息时间
		this.modifyRestTimeTest(restTime)

		let splitSizeAry = voices_key[voice_type].split(",")
		let voices = voices_ary.slice(+splitSizeAry[0], +splitSizeAry[1])

		this.playCommand(voices)
	},

	async start() {
		// 全局计时器
		this.data.globalRecordTimer = setInterval(() => {
			// 是否暂停全局计时
			if (!this.data.didPauseRecordGlobalTime) {
				let nextTiming = this.data.globalRecordTiming + 1
				this.setData({
					globalRecordTiming: nextTiming,
					globalRecordTimeText: this.calcRemainingTime(nextTiming)
				})
			}
		}, 1000)

		this.setData({isRunning: true})
		// 1.「准备好了吗 第一个动作」
		await this.playTempBgAudio(LocaleVoice.lv1)
		// 播报动作名称，并开始训练
		this._playActionNameAndStartTraining()
	}
})
