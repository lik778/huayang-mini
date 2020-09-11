// subCourse/actionPage/actionPage.js
import { $notNull, getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { LocaleVoice, voices_ary, voices_key, voices_number } from "../../lib/voices"
import { completePractice, increaseExp, recordPracticeBehavior } from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0, // 状态栏高度
		screenHeight: 0, // 设备高度
		screenWidth: 0, // 设备宽度
		parentBootCampId: 0, // 训练营id，有就传无则不传
		courseInfo: null, // 课程信息
		currentActionIndex: 0, // 当前动作索引
		originData: null,
		actionData: null, // 动作数据
		currentDuration: 0, // 整个课程已播放的时长

		targetActionObj: null, // 正在执行的动作
		targetActionIndex: 0, // 正在执行的动作索引
		targetLoopCount: 1, // 正在执行的动作的循环次数

		video: null, // 视频实例
		previewVideo: null, // 预览视频实例

		backgroundMusicAudio: null, // 背景音频实例

		mainPointAudio: null, // 要领播放器
		isPlayMainPointAudioPlaying: false, // 要领语音是否正在播放
		didPlayMainPointAudioInCurrentTargetAction: false, // 是否在当前动作生命周期中播放过要领语音

		isRunning: true, // 动作是否正在进行

		didShowPrepareLayer: true, // 预备层
		PrepareNumber: "准备", // 预备文案

		didShowRestLayer: false, // 休息层
		restTimeNo: 0, // 休息时间
		restTimeText: "00:00", // 休息时间文案
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
		nextLevelText: "", // 升下一级所需经验

		didPracticeDone: false, // 整个练习是否结束

		bgAudio: null, // 背景音乐播放器

		accordPause: false // 用户是否手动暂停
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({parentBootCampId: options.parentBootCampId || 0})

		const self = this
		const eventChannel = this.getOpenerEventChannel()

		// TODO mock数据
		if (!$notNull(eventChannel)) {
			let actionData = [{"id":25,"name":"腹横肌激活","desc":"","meta_type":1,"teacher_id":11,"category":"fitness","link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/31583dca-173b812f0d6/31583dca-173b812f0d6.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.7nqzvn72tTCAbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2bffc527-173b8124879/2bffc527-173b8124879.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596521098YrAXfd.jpg","duration":12,"rank":99,"calories":30,"voice_type":"2_8","created_at":"2020-08-04","updated_at":"2020-08-13","deleted_at":null,"cycleTime":"12","restTime":"8","loopCount":2},{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/110d6ab9-173945b24ed/110d6ab9-173945b24ed.mp4","voice_link":"http://tmp/wx85d130227f745fc5.o6zAJs_TJ2EU9RmLDzP_bj42PGu8.LbcH4D0tGvZPbc7474bc5a573431793328013aca9e04.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-08-13","deleted_at":null,"cycleTime":"12","restTime":"0","loopCount":2}]

			let completedCourseMetaData = []
			for (let i = 0; i < actionData.length; i++) {
				let item = actionData[i]
				for (let j = 1; j <= item.loopCount; j++) {
					completedCourseMetaData.push(item)
				}
			}

			self.setData({
				originData: actionData,
				actionData: completedCourseMetaData,
				targetActionObj: completedCourseMetaData[0] // 默认设置第一项
			})

			let courseInfo = {"id":3,"name":"健身强化课程","desc":"强化训练","share_desc":"","user_id":0,"level":1,"teacher_id":0,"category_id":0,"cover_pic":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596521209ntPMkd.jpg","kecheng_type":3,"status":0,"rank":1,"vip_only":0,"link":"25,12,8##8,12,0","link_type":0,"room_id":0,"show_time":"","xiaoetong_url":"","price":0,"discount_price":0,"series_id":0,"duration":88,"calories":300,"cycle_count":2,"kecheng_meta":[{"id":8,"name":"引体向上","desc":"","meta_type":2,"teacher_id":14,"category":"fitness","link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/110d6ab9-173945b24ed/110d6ab9-173945b24ed.mp4","voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/558e3a7d-173956a1808/558e3a7d-173956a1808.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f616f05-173956c9583/2f616f05-173956c9583.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1595490234PiqJuF.jpg","duration":2,"rank":3,"calories":10,"voice_type":"2_2","created_at":"2020-07-23","updated_at":"2020-08-13","deleted_at":null},{"id":25,"name":"腹横肌激活","desc":"","meta_type":1,"teacher_id":11,"category":"fitness","link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/31583dca-173b812f0d6/31583dca-173b812f0d6.mp4","voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/5c54eb15-173b813511c/5c54eb15-173b813511c.mp3","name_voice_link":"https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2bffc527-173b8124879/2bffc527-173b8124879.mp3","cover":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596521098YrAXfd.jpg","duration":12,"rank":99,"calories":30,"voice_type":"2_8","created_at":"2020-08-04","updated_at":"2020-08-13","deleted_at":null}],"visit_count":3240,"meta_count":2,"user_grade":0,"hidden":0,"qrcode":"https://huayang-img.oss-cn-shanghai.aliyuncs.com/dev_kecheng_pratice_qrcode_3.jpg","created_at":"2020-08-04","updated_at":"2020-09-07","deleted_at":null,"exerciseTime":1}
			self.setData({
				courseInfo
			})

			// 记录训练行为
			recordPracticeBehavior({
				kecheng_id: courseInfo.id,
				user_id: getLocalStorage(GLOBAL_KEY.userId)
			})
		} else {
			// TODO 改造完后移动到 <位置1>
			eventChannel.on("transmitCourseMeta", function (data) {
				// console.log(data)
				let actionData = JSON.parse(data)

				let completedCourseMetaData = []
				for (let i = 0; i < actionData.length; i++) {
					let item = actionData[i]
					for (let j = 1; j <= item.loopCount; j++) {
						completedCourseMetaData.push(item)
					}
				}

				self.setData({
					originData: actionData,
					actionData: completedCourseMetaData,
					targetActionObj: completedCourseMetaData[0] // 默认设置第一项
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
		}


		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			screenHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight,
			screenWidth: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
		})

		// TODO <位置1>

		// 视频实例
		this.data.video = wx.createVideoContext("actionVideo", this)

		// 预览视频实例
		this.data.previewVideo = wx.createVideoContext("previewVideo", this)

		// 要领实例
		this.data.mainPointAudio = wx.createInnerAudioContext()

		// 背景音乐实例
		this.data.backgroundMusicAudio = wx.createInnerAudioContext()
		this.data.backgroundMusicAudio.onPause(() => {
			console.log('--------暂停 backgroundMusicAudio--------')
		})

		// 背景音频实例
		this.data.bgAudio = wx.getBackgroundAudioManager()
		this.data.bgAudio.onPause(() => {
			this.toggleAction("pause")
		})
		this.data.bgAudio.onStop(() => {
			this.destroyResource()
			wx.navigateBack()
		})


		// 启动
		this.start()


		// 设置"要领"音频播放结束监听回调
		this.data.mainPointAudio.onEnded(function () {
			// 还原口令音量
			if (self.data.bgAudio) {
				self.data.bgAudio.volume = 1
			}
			self.setData({
				isPlayMainPointAudioPlaying: false // 释放要领正在播放中的状态
			})
		})

		// 监听小程序切后台事件
		wx.onAppHide(this.onAppHideCallback)
		// 监听小程序切前台事件
		wx.onAppShow(this.onAppShowCallback)
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
		this.destroyResource()
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
	// 页面退出前销毁所有实例
	destroyResource() {
		wx.offAppHide(this.onAppHideCallback)
		wx.offAppShow(this.onAppShowCallback)

		// 销毁所有音视频
		if (this.data.mainPointAudio) {
			this.data.mainPointAudio.destroy()
		}

		if (this.data.backgroundMusicAudio) {
			this.data.backgroundMusicAudio.destroy()
		}

		if (this.data.bgAudio) {
			this.data.bgAudio.volume = 0
			this.data.bgAudio = null
		}
	},
	// 监听小程序切前台的回掉函数
	onAppShowCallback() {
		// console.log("------------小程序切 前台 事件------------")
		// 用户非手动暂停时自动延续上次播放进度
		if (!this.data.accordPause && !this.data.isRunning) {
			this.toggleAction("play")
		}

		bxPoint("course_play", {})
	},
	// 监听小程序切后台的回掉函数
	onAppHideCallback() {
		// console.log("------------小程序切 后台 事件------------")
		// 在休息层 & 未暂停休息 => 暂停休息阶段
		if (this.data.didShowRestLayer && !this.data.didPauseRest) {
			this.pauseRestTime("pause")
		}

		this.toggleAction("pause")
	},
	/**
	 * 秀一下
	 */
	async show() {
		bxPoint("course_show", {practice_time: this.data.globalRecordTiming}, false)

		let url = `/subCourse/actionPost/actionPost?actionName=${this.data.courseInfo.name}&duration=${this.data.globalRecordTimeText}&actionNo=${this.data.originData.length}&keChengId=${this.data.courseInfo.id}&bootCampId=${this.data.parentBootCampId}`
		wx.redirectTo({url})
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
	// 页面切换休息层状态
	checkoutRestStatus() {
		if (this.data.didPauseRest) {
			this.pauseRestTime("play")
		} else {
			this.pauseRestTime("pause")
		}
	},
	// 页面切换播放状态
	checkoutPracticeStatus() {
		if (this.data.isRunning) {
			this.toggleAction("pause")
			// 记录用户手动暂停，onShow时不会自动启动
			this.setData({accordPause: true})
			bxPoint("course_operation", {event: "stop", action_num: this.data.targetActionObj.id}, false)
		} else {
			this.toggleAction("play")
			this.setData({accordPause: false})
		}
	},
	/**
	 * 退出练习
	 */
	exit() {
		let self = this
		wx.showModal({
			title: "提示",
			content: "是否立即退出训练",
			confirmText: "确定",
			success(res) {
				if (res.confirm) {
					bxPoint("course_operation", {event: "exit", action_num: self.data.targetActionObj.id}, false)
					wx.navigateBack()
				} else if (res.cancel) {
					// console.log('取消')
				}
			}
		})
	},
	/**
	 * 主动暂停休息阶段
	 * @param status pause 暂停
	 */
	pauseRestTime(status) {
		this.setData({
			didPauseRest: status === 'pause',
			didPauseRecordGlobalTime: status === 'pause'
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
		// 「动作名称」「N次/秒」
		await this.playTempBgAudio(this.data.targetActionObj.name_voice_link)
		await this.playTempBgAudio(voices_number(this.data.targetActionObj.cycleTime))
		await this.playTempBgAudio(+this.data.targetActionObj.meta_type === 2 ? LocaleVoice.lv13 : LocaleVoice.lv7)
		//  准备321开始!
		await this.playTempBgAudio(LocaleVoice.lv14)
		this.setData({PrepareNumber: 3})
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
			// console.log('上一个动作')
			this.stopAllAction()
			this.checkoutNextAction(true)
			// 显示预备页
			this.setData({didShowPrepareLayer: true})

			if (!this.data.isRunning) {
				this.toggleAction("play")
			}

			// 下一个练习
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
			// console.log('下一个练习')
			this.stopAllAction()
			this.checkoutNextAction()
			// 显示预备页
			this.setData({didShowPrepareLayer: true})

			if (!this.data.isRunning) {
				this.toggleAction("play")
			}

			if (this.data.currentActionIndex === this.data.actionData.length - 1) {
				// 最后一个动作
				await this.playTempBgAudio(LocaleVoice.lv16)
			} else {
				// 下一个练习
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
		if (this.data.didShowRestLayer) return ;

		if (status === "pause") {
			// 全局计时器
			this.setData({didPauseRecordGlobalTime: true})
			this.data.video.pause()
			// [要领播放中]&当前动作未播放过[要领]，则暂停
			if (this.data.isPlayMainPointAudioPlaying && this.data.isPlayMainPointAudioPlaying) {
				this.data.mainPointAudio && this.data.mainPointAudio.pause()
			}
			this.data.bgAudio.pause()
			this.data.backgroundMusicAudio.pause()
		} else {
			// 全局计时器
			this.setData({didPauseRecordGlobalTime: false})
			this.data.video.play()
			// [要领播放中]&当前动作未播放过[要领]，则继续播放
			if (this.data.isPlayMainPointAudioPlaying && this.data.isPlayMainPointAudioPlaying) {
				this.data.mainPointAudio && this.data.mainPointAudio.play()
			}
			this.data.bgAudio.play()
			this.data.backgroundMusicAudio.play()
		}

		this.setData({isRunning: status !== "pause"})
	},
	/**
	 * 停止动作
	 */
	stopAllAction() {
		this.data.video.stop()
		this.data.mainPointAudio.stop()
		this.data.bgAudio.onCanplay(() => {
			this.data.bgAudio.pause()
			this.data.backgroundMusicAudio.pause()
		})
	},
	/**
	 * 临时播放器 播放音频
	 * @param link
	 * @returns {Promise}
	 */
	playTempBgAudio(link) {
		let audio = this.data.bgAudio
		audio.title = "花样百姓＋"
		// 解决华为P30处理音频地址完全相同时无法正常播放问题
		link = link + '?' + +new Date()
		return new Promise(resolve => {
			audio.src = link
			audio.onCanplay(() => {
				if (!this.data.isRunning) {
					audio.pause()
					this.data.backgroundMusicAudio.pause()
				}
			})
			audio.onEnded(() => {
				resolve()
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
		this.setData({
			didPlayMainPointAudioInCurrentTargetAction: true, // 标示当前动作已经播放过要领
			isPlayMainPointAudioPlaying: true
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
			// 哒
			link = LocaleVoice.lv10
		}
		this.setData({targetActionIndex: this.data.targetActionIndex + 1})
		await this.playTempBgAudio(link)
		// 判断：当前动作的"要领"语音是否已播放
		if (!this.data.didPlayMainPointAudioInCurrentTargetAction) {
			// 降低口令音量
			if (this.data.bgAudio) {
				this.data.bgAudio.volume = 0.3
			}
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
	async prepareNextAction() {
		// 停止视频
		this.data.video.stop()
		// 如果正在播放要领音频，停止要领播放
		this.data.mainPointAudio.stop()
		// 切换下一个动作
		this.checkoutNextAction()
		// 检查是否是最后一个动作
		if (this.data.currentActionIndex < this.data.actionData.length) {
			// 显示休息层
			this.setData({didShowRestLayer: true})
			// 6. 「休息一下」
			this.playTempBgAudio(LocaleVoice.lv5).then(() => {
				// 开始预览视频播放
				this.data.previewVideo.play()
				// 休息完开始下一个动作
				let restPromise = new Promise(resolve => {
					let timer = null
					let delayTime = this.data.restTimeNo
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
							// 停止预览视频播放
							this.data.previewVideo.stop()
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
						// 休息结束，下一个练习
						await this.playTempBgAudio(LocaleVoice.lv3)
					}
					// 播报动作名称，并开始训练
					this._playActionNameAndStartTraining()
				})
			})
		} else {
			// 训练结束
			this.setData({
				didShowResultLayer: true,
				didPracticeDone: true
			})
			// 停止播放背景音乐
			this.data.backgroundMusicAudio.stop()
			// 停止全局记时器
			clearInterval(this.data.globalRecordTimer)
			// 上传训练记录
			completePractice({
				open_id: getLocalStorage(GLOBAL_KEY.openId),
				user_id: getLocalStorage(GLOBAL_KEY.userId),
				kecheng_id: this.data.courseInfo.id,
				duation: this.data.globalRecordTiming
			})
			// 「恭喜你完成练习」
			await this.playTempBgAudio(LocaleVoice.lv6)
			this.setData({
				isRunning: false
			})
			// 经验值提升弹窗
			increaseExp({task_type: "task_pratice"}).then((data) => {
				// 升级信息
				if ($notNull(data)) {
					this.setData({
						didShowLevelAlert: true,
						hasGrade: data.has_grade,
						levelNumber: data.has_grade ? data.level : 10,
						nextLevelText: data.level < 3 ? `还差${data.next_experience - data.experience}升至Lv${data.level + 1}解锁` : ""
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
		if ($notNull(nextActionObj)) {
			bxPoint("course_operation", {event: isPrevious ? "previous" : "next", action_num: nextActionObj.id}, false)
		}
	},
	// 开始课程演示
	startCourse(data) {
		// 关闭预备遮罩层, 还原PrepareNumber=3
		this.setData({
			didShowPrepareLayer: false,
			PrepareNumber: "准备",
			isRunning: true
		})
		// 视频开始播放
		this.data.video.play()
		let {name, voice_link, voice_type, restTime} = data

		// 设置当前动作的休息时间
		this.modifyRestTimeTest(restTime)

		let splitSizeAry = voices_key[voice_type].split(",")
		let voices = voices_ary.slice(+splitSizeAry[0], +splitSizeAry[1])

		this.setData({
			didPlayMainPointAudioInCurrentTargetAction: false,
			restTimeNo: restTime
		})

		this.playCommand(voices)
	},

	async start() {
		// BGM
		this.data.backgroundMusicAudio.src = "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/1b3bff74-1746bb5cc2e/1b3bff74-1746bb5cc2e.3gp"
		this.data.backgroundMusicAudio.loop = true
		this.data.backgroundMusicAudio.volume = 0.3
		this.data.backgroundMusicAudio.play()

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
