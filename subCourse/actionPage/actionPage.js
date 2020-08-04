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
		courseInfo: {"id":1,"name":"引体向上","desc":"引体向上","share_desc":"","user_id":0,"level":1,"teacher_id":0,"category_id":0,"cover_pic":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596451849ifkqsm.jpg","kecheng_type":3,"status":0,"rank":1,"vip_only":0,"link":"8,4,10##8,4,10##8,4,10","link_type":0,"room_id":0,"show_time":"","xiaoetong_url":"","price":0,"discount_price":0,"series_id":0,"duration":54,"calories":120,"cycle_count":1,"kecheng_meta":[{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/110d6ab9-173945b24ed/110d6ab9-173945b24ed.mp4","voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/558e3a7d-173956a1808/558e3a7d-173956a1808.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null}],"visit_count":43,"meta_count":3,"user_grade":0,"created_at":"2020-08-03","updated_at":"2020-08-03","deleted_at":null}, // 课程信息 TODO
		currentActionIndex: 0, // 当前动作索引
		actionData: [{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.qrlIxYGCmARp0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.mvLw2R1aZBd6bc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"4","restTime":"10"},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.Tdf6l99MzjHt0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.dSaULQjTs7dRbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"4","restTime":"10"},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.fzxOXGPwghNK0df30a4e33d11fa17538eef929df6954.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.8xzdkDmG97PYbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-07-29","deleted_at":null,"cycleTime":"4","restTime":"10"}], // 动作数据 TODO
		currentDuration: 0, // 整个课程已播放的时长

		targetActionObj: null, // 正在执行的动作
		targetActionIndex: 0, // 正在执行的动作索引

		commandAudio: null, // 口令播放器
		commandAudioEventMounted: false, // 口令播放结束事件是否结束
		commandTimer: null, // 口令timer

		countDownAudio: null, // 时间口令播放器
		countDownAudioEventMounted: false,

		mainPointAudio: null, // 要领播放器
		mainPointAudioEventMounted: false,
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

		didPracticeDone: false // 整个练习是否结束
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
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// 视频实例
		this.data.video = wx.createVideoContext("actionVideo", this)
		// 要领
		this.data.mainPointAudio = wx.createInnerAudioContext()
		// 口令
		this.data.commandAudio = wx.getBackgroundAudioManager()
		this.data.commandAudio.title = 'command'
		// 时间口令
		this.data.countDownAudio = wx.getBackgroundAudioManager()
		this.data.countDownAudio.title = 'countDown'

		// 启动
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
		this.pauseAction()
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.stopAllAction()
		// 销毁所有音视频
		this.data.mainPointAudio && this.data.mainPointAudio.destroy()

		this.data.commandAudio.url = undefined
		this.data.commandAudio.paused = true
		this.data.commandAudio.currentTime = 0

		this.data.countDownAudio.url = undefined
		this.data.countDownAudio.paused = true
		this.data.commandAudiocountDownAudio = 0
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
		wx.navigateBack()
		// wx.redirectTo({
		// 	url: "/subCourse/practiceDetail/practiceDetail?courseId=" + this.data.courseInfo.id
		// })
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
			success(res) {
				if (res.confirm) {
					wx.redirectTo({
						url: "/subCourse/practiceDetail/practiceDetail?courseId=" + this.data.courseInfo.id
					})
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
		await this.playTempAudio(LocaleVoice.lv21)
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
			await this.playTempAudio(LocaleVoice.lv15)
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
			this.setData({ didPauseRecordGlobalTime: true })
			this.data.video.pause()
			this.data.mainPointAudio && this.data.mainPointAudio.pause()
			if (this.data.targetActionObj.meta_type == 2) {
				this.data.commandAudio.pause()
			} else {
				this.data.countDownAudio.pause()
			}
		} else {
			this.setData({ didPauseRecordGlobalTime: false })
			this.data.video.play()
			this.data.mainPointAudio && this.data.mainPointAudio.play()
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
		this.data.mainPointAudio && this.data.mainPointAudio.stop()
		this.data.commandAudio && this.data.commandAudio.stop()
		this.data.countDownAudio && this.data.countDownAudio.stop()
	},
	/**
	 * 临时播放器 播放音频
	 * @param params
	 * @returns {Promise}
	 */
	playTempAudio(params) {
		let audio = wx.createInnerAudioContext()
		return new Promise(resolve => {
			let canPlayCallback = function () {
				audio.play()
			}
			let endCallback = function () {
				audio.offCanplay(canPlayCallback)
				audio.offEnded(endCallback)
				audio.destroy()
				resolve()
			}
			if (audio.src === params) {
				audio.play()
			} else {
				audio.src = params
				audio.onCanplay(canPlayCallback)
			}
			audio.onEnded(endCallback)
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

		if (this.data.mainPointAudioEventMounted) return
		this.setData({mainPointAudioEventMounted: true})

		this.data.mainPointAudio.onEnded(function () {
			// 还原口令音量
			self.data.commandAudio.volume = 1
			self.data.countDownAudio.volume = 1
			// 标示当前动作已经播放过要领
			self.setData({
				didPlayMainPointAudioInCurrentTargetAction: true
			})
		})
	},

	/**
	 * 播放时间口令
	 */
	playCountDown() {
		const self = this

		this.data.countDownAudio.src = LocaleVoice.lv10

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

		this.data.commandAudio.src = commands[this.data.targetActionIndex % commands.length]

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
			this.setData({
				isRunning: false,
				didPracticeDone: true
			})
			// 「恭喜你完成训练」
			this.playTempAudio(LocaleVoice.lv6)
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
		await this.playTempAudio(LocaleVoice.lv1)
		// 播报动作名称，并开始训练
		this._playActionNameAndStartTraining()
	}
})
