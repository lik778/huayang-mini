import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, queryWxAuth, toast } from "../../utils/util"
import { GLOBAL_KEY, WX_AUTH_TYPE } from "../../lib/config"
import request from "../../lib/request"
import { getOssCertificate, getTaskBelongList, publishTask } from "../../api/task/index"
import VODUpload from "../../utils/aliyun-upload-sdk-1.0.1.min"
import bxPoint from "../../utils/bxPoint"

const MAX_AUDIO_DURATION = 10 * 60 * 1000

// 资源上传服务器接口
const DEVELOPMENT_SERVICE_URL = {
	image: `${request.baseUrl}/hy/wx/applets/image/upload`,
	audio: `${request.baseUrl}/hy/wx/applets/audio/uploadByFile`,
	video: "https://huayang-img.oss-cn-shanghai.aliyuncs.com",
}

// 资源上传相关KEY
const DEVELOPMENT_PICTURE_KEY_NAME = {
	image: "hyimage",
	audio: "audio",
	video: "file"
}

// 录音弹窗标题文案
const AUDIO_MODAL_TITLE_TEXT = {
	audio_ready: "点击录音",
	audio_record_done: "已录完",
	audio_record_playing: "已录完"
}

// 录音相关图标
const AUDIO_BUTTON_IMAGE = {
	audio_ready: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607495016BuyEUt.jpg",
	audio_record_running: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607493387ZJQPKp.jpg",
	audio_record_done: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607493404EshMbG.jpg",
	audio_record_playing: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607493416guXaKR.jpg"
}

// 录音相关文案
const AUDIO_BUTTON_TEXT = {
	audio_ready: "",
	audio_record_running: "点击结束",
	audio_record_done: "试听",
	audio_record_playing: "暂停"
}

// 录音状态
const AUDIO_STATUS = {
	ready: "audio_ready",
	run: "audio_record_running",
	done: "audio_record_done",
	play: "audio_record_playing",
}

// 回显音频暂停、启动图标
const AUDIO_CALLBACK_IMAGE = {
	callback_audio_pause: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607503757nGTLDx.jpg",
	callback_audio_start: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607505373jvyHel.jpg"
}

// 回显音频播放状态
const AUDIO_CALLBACK_STATUS = {
	start: "callback_audio_start",
	pause: "callback_audio_pause",
}

// 媒体资源类型
const MEDIA_TYPE = {
	image: 1,
	video: 2,
	audio: 3
}

Page({
	data: {
		AUDIO_MODAL_TITLE_TEXT,
		AUDIO_BUTTON_IMAGE,
		AUDIO_BUTTON_TEXT,
		AUDIO_STATUS,
		AUDIO_CALLBACK_IMAGE,
		AUDIO_CALLBACK_STATUS,
		aliyunUploader: null,
		recorderManager: null,
		innerAudioContext: null,
		materialVisible: true,
		videoReviewVisible: false,
		audioReviewVisible: false,
		textCount: 0,
		desc: "",
		previewLocalAudioUrl: "",
		localAudioTimes: "00:00",
		audioUrl: "",
		audioDuration: 0,
		audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause,
		previewLocalVideoUrl: undefined,
		videoUrl: undefined,
		videoId: undefined,
		videoHeight: undefined,
		videoWidth: undefined,
		images: [],
		audioModalVisible: false,
		recordAudioStatus: AUDIO_STATUS.ready,
		recordAudioTimer: null,
		recordAudioTimes: "00:00",
		recentCourseList: [],
		selectedCourseItem: null,
		mediaType: "",
		fromPageName: undefined,
		launchLock: false, // 发布锁
		didRecordFileUploading: false, // 录音文件是否上传中
		didVideoFileUploading: false, // 视频文件是否上传中
		didShowAuth: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {themeType, themeId, themeTitle, fromPageName} = options;
		if (themeId && themeTitle) {
			let recentCourseList = [{
				name: themeTitle,
				kecheng_type: themeType,
				kecheng_id: themeId,
				isSelected: true
			}]
			this.setData({recentCourseList, selectedCourseItem: recentCourseList[0]})
		}

		if (fromPageName) {
			this.setData({fromPageName})
		}

		this.initAliyunUploader()
		this.initialRecorderManager()

		if (!$notNull(this.data.recentCourseList)) {
			this.getRecentCourseList()
		}

		this.disableMuteSwitch()

		bxPoint("pv_launch_task_page", {})
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
		clearInterval(this.data.recordAudioTimer)
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
	onShareAppMessage: function () {},

	// 用户授权取消
	authCancelEvent() {
		this.setData({didShowAuth: false})
	},

	// 用户确认授权
	authCompleteEvent() {
		this.setData({didShowAuth: false})
	},

	/**
	 * 即使是在静音模式下，也能播放声音
	 */
	disableMuteSwitch() {
		wx.setInnerAudioOption({obeyMuteSwitch: false})
	},

	/**
	 * 加载最近学习的主题营和课程
	 */
	getRecentCourseList() {
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		getTaskBelongList({user_id: userId}).then(({data}) => {
			data = data || []
			data = data.map((n, i) => {
				n.isSelected = false
				return n
			})
			this.setData({recentCourseList: data.slice()})
		})
	},

	/**
	 * 初始化阿里云上传器
	 */
	initAliyunUploader() {
		let self = this
		let aliyunUploader = new VODUpload({
			userId: "1416960148576552",
			onUploadstarted: function (uploadInfo) {
				let {RequestId, VideoId, UploadAddress, UploadAuth} = self.data.aliyunUploader.dd_custom_params
				// 设置上传参数
				aliyunUploader.setUploadAuthAndAddress(uploadInfo, UploadAuth, UploadAddress, VideoId)
			},
			// 文件上传成功
			onUploadSucceed: function (uploadInfo) {
				let callbackUrl = `https://video.huayangbaixing.com/${uploadInfo.object}`
				console.log("上传文件的地址 = ", callbackUrl)
				switch (self.data.mediaType) {
					case MEDIA_TYPE.audio: {
						self.setData({audioUrl: callbackUrl})
						break
					}
					case MEDIA_TYPE.video: {
						self.setData({
							videoId: uploadInfo.videoId,
							videoUrl: callbackUrl,
						})
						break
					}
				}
				self.setData({didRecordFileUploading: false, didVideoFileUploading: false})
				// 发布
				self.launch()
			},
			// 文件上传失败
			onUploadFailed: function (uploadInfo, code, message) {
				console.error("文件上传失败", message)
				self.setData({didRecordFileUploading: false, didVideoFileUploading: false})
				wx.hideLoading()
			},
			// 上传凭证超时
			onUploadTokenExpired: function (uploadInfo) {
				console.error("上传凭证超时")
			}
		})

		this.setData({aliyunUploader})
	},

	/**
	 * 初始化录音器
	 */
	initialRecorderManager() {
		const recorderManager = wx.getRecorderManager()
		let self = this
		recorderManager.onStart(() => {
			// 开始倒计时 录音状态为运行中
			self.setData({recordAudioStatus: AUDIO_STATUS.run, recordAudioTimer: self.createTheTimer()})
		})

		// 监听录音错误
		recorderManager.onError((e) => {
			console.error("recorder error", e)
		})

		// 监听录音结束事件
		recorderManager.onStop((res) => {
			let {tempFilePath, duration, fileSize} = res
			// 小程序录音时长不能超过10分钟
			if (duration > MAX_AUDIO_DURATION) {
				toast("录音时长不能超过10分钟")
			}

			duration = duration / 1000 | 0
			let minutes = duration / 60 | 0
			let seconds = duration % 60 | 0

			// 结束倒计时，清空历史计时 录音状态为结束
			clearInterval(self.data.recordAudioTimer)
			self.setData({
				recordAudioStatus: AUDIO_STATUS.done,
				recordAudioTimes: "00:00",
				audioDuration: duration,
				localAudioTimes: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
			})

			console.log(tempFilePath, duration, fileSize)

			// 录音时长不能小于5秒
			if (duration < 5) {
				self.setData({
					recordAudioStatus: AUDIO_STATUS.ready,
					recordAudioTimes: "00:00",
					audioDuration: 0,
					localAudioTimes: "00:00"
				})
				return toast("录音时长不能小于5秒")
			}

			self.setData({previewLocalAudioUrl: tempFilePath})
		})

		// 监听录音暂停事件
		recorderManager.onPause((res) => {
			console.log("onPause")
		})

		// 监听录音继续事件
		recorderManager.onResume((res) => {
			console.log("onResume")
		})

		// 创建内部 innerAudioContext 对象
		const innerAudioContext = wx.createInnerAudioContext()
		innerAudioContext.onEnded(() => {
			this.setData({recordAudioStatus: AUDIO_STATUS.done, audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
			console.log("录音播放结束")
		})

		innerAudioContext.onError((res) => {
			console.error("innerAudioContext error", res)
		})

		this.setData({recorderManager, innerAudioContext})
	},

	/**
	 * 开始录音
	 */
	startRecording() {
		// 获取录音权限
		queryWxAuth(WX_AUTH_TYPE.record).then(() => {
			// 开启录音
			this.data.recorderManager.start({
				duration: MAX_AUDIO_DURATION,
				format: "mp3"
			})
		}).catch(() => {
			wx.showModal({
				title: '录音授权',
				content: '录音失败，未获得您的授权，请前往设置授权',
				confirmText: '去设置',
				confirmColor: '#33c71b',
				success(res) {
					if (res.confirm) {
						wx.openSetting()
					}
				}
			})
		})
	},

	/**
	 * 暂停录音
	 */
	pauseRecording() {
		this.data.recorderManager.pause()
	},

	/**
	 * 继续录音
	 */
	resumeRecording() {
		this.data.recorderManager.resume()
	},

	/**
	 * 结束录音
	 */
	stopRecording() {
		this.data.recorderManager.stop()
	},

	/**
	 * 播放录音
	 */
	playRecord() {
		console.log("开始试听");
		this.data.innerAudioContext.src = this.data.previewLocalAudioUrl
		this.data.innerAudioContext.play()
	},
	/**
	 * 暂停播放音频
	 */
	pauseRecord() {
		this.data.innerAudioContext.pause()
	},
	/**
	 * 结束播放音频
	 * @param didRemovePreviewAudioUrl
	 */
	stopRecord(didRemovePreviewAudioUrl = false) {
		console.log("结束试听");
		if (!this.data.innerAudioContext.paused) {
			this.data.innerAudioContext.stop()
		}

		// 移除预览录音地址
		if (didRemovePreviewAudioUrl) {
			let t = setTimeout(() => {
				this.removeAudio()
				clearTimeout(t)
			}, 1000)
		}
	},
	/**
	 * 选择设备中的图片
	 */
	chooseDeviceImage() {
		// 切换媒体类型：图片
		this.setData({mediaType: MEDIA_TYPE.image})

		const MAX_IMAGE_LEN = 4
		let self = this
		let alreadyChoosedImagesLen = this.data.images.length
		if (alreadyChoosedImagesLen >= MAX_IMAGE_LEN) return
		wx.chooseImage({
			count: MAX_IMAGE_LEN - alreadyChoosedImagesLen,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				let {tempFilePaths, tempFiles} = res
				let promiseArray = []
				tempFilePaths.forEach((tempFilePath) => {
					promiseArray.push(self.uploadFileToWxService(tempFilePath, "image"))
				})
				Promise.all(promiseArray).then((images) => {
					let oldImages = self.data.images.slice()
					let newImages = [...oldImages, ...images]
					self.setData({images: newImages.slice(0, 4)})
				})
			},
			fail(err) {
				console.error("chooseDeviceImage fail ", err)
			}
		})
	},
	/**
	 * 选择设备中的视频
	 */
	chooseDeviceVideo() {
		// 切换媒体类型：视频
		this.setData({mediaType: MEDIA_TYPE.video})

		const MAX_VIDEO_DURATION = 60
		let self = this
		wx.chooseVideo({
			sourceType: ['album', 'camera'],
			compressed: true,
			maxDuration: MAX_VIDEO_DURATION,
			success(res) {
				let {tempFilePath, duration, size, height, width} = res

				let videoSize = size / 1024 / 1024 | 0

				console.log("压缩后的视频大小(MB) = ", videoSize);
				// 视频不能超过200MB
				if (videoSize > 200) {
					return toast("视频大小不能超过200MB")
				}

				// 记录视频的宽高、设备本地视频地址、显示本地视频
				self.setData({
					videoHeight: height,
					videoWidth: width,
					previewLocalVideoUrl: tempFilePath,
					videoReviewVisible: true,
					materialVisible: false
				})
			},
			fail(err) {
				console.error("chooseDeviceVideo fail ", err)
			}
		})
	},
	/**
	 * 上传本地文件到微信服务器
	 * @param filePath
	 * @param type
	 * @param extraHeaders
	 */
	uploadFileToWxService(filePath, type, extraHeaders = {}) {
		wx.showLoading({title: "上传中...", mask: true})
		return new Promise((resolve, reject) => {
			wx.uploadFile({
				url: DEVELOPMENT_SERVICE_URL[type],
				filePath,
				name: DEVELOPMENT_PICTURE_KEY_NAME[type],
				header: {
					"Content-Type": "multipart/form-data",
					...extraHeaders
				},
				success(res) {
					let {data} = JSON.parse(res.data)
					resolve(data)
				},
				error(err) {
					console.error(err)
					let {message} = JSON.parse(err)
					reject(message)
				},
				complete() {
					wx.hideLoading()
				}
			})
		})
	},
	/**
	 * 预览图片
	 * @param e
	 */
	reviewImage(e) {
		let sources = this.data.images.map(img => {
			return {url: img}
		})
		wx.previewMedia({
			sources,
			current: e.currentTarget.dataset.index
		})
	},
	/**
	 * 切换录音播放器状态
	 */
	toggleAudioPlayer() {
		switch (this.data.audioCallbackStatus) {
			case AUDIO_CALLBACK_STATUS.pause: {
				// 切换回显音频状态 开始播放录音
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.start})
				this.playRecord()
				break
			}
			case AUDIO_CALLBACK_STATUS.start: {
				// 切换回显音频状态 暂停播放录音
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
				this.stopRecord()
				break
			}
		}
	},
	/**
	 * 删除预览图片
	 * @param e
	 */
	removeImage(e) {
		let reviewImages = this.data.images.slice()
		reviewImages = reviewImages.filter(i => i !== e.currentTarget.dataset.item)

		if (reviewImages.length === 0) {
			this.resetMediaType()
		}

		this.setData({images: reviewImages})
	},
	/**
	 * 删除预览视频
	 */
	removeVideo() {
		this.resetMediaType()
		this.setData({
			videoId: undefined,
			videoUrl: undefined,
			videoHeight: undefined,
			videoWidth: undefined,
			videoReviewVisible: false,
			materialVisible: true
		})
	},
	/**
	 * 删除录音
	 */
	removeAudio() {
		this.resetMediaType()
		this.setData({
			previewLocalAudioUrl: "",
			localAudioTimes: "00:00",
			audioUrl: "",
			audioDuration: 0,
			audioReviewVisible: false,
			materialVisible: true
		})
	},
	/**
	 * 处理文本输入事件
	 * @param e
	 */
	onTextareaInput(e) {
		let text = String(e.detail.value).slice(0, 200)
		this.setData({textCount: text.length, desc: text.trim()})
	},
	/**
	 * 切换录音弹窗
	 */
	toggleAudioModal(bool) {
		this.setData({audioModalVisible: bool})
	},
	/**
	 * 打开录音弹窗
	 */
	openAudioModal() {
		// 切换媒体类型：音频
		this.setData({mediaType: MEDIA_TYPE.audio})

		this.setData({recordAudioStatus: AUDIO_STATUS.ready})
		this.toggleAudioModal(true)
	},
	/**
	 * 关闭录音弹窗
	 */
	closeAudioModal() {
		// 停止录音播放，清除本地录音地址
		this.stopRecord(true)

		// 结束录音 结束倒计时 录音状态为初始状态
		if (this.data.recordAudioStatus === AUDIO_STATUS.run) {
			this.stopRecording()
		}

		this.toggleAudioModal(false)
	},
	/**
	 * 处理音频按钮点击事件
	 */
	onAudioBtnTap() {
		switch (this.data.recordAudioStatus) {
			case AUDIO_STATUS.ready: {
				// 开始录音
				this.startRecording()
				break
			}
			case AUDIO_STATUS.run: {
				// 结束录音
				this.stopRecording()
				break
			}
			case AUDIO_STATUS.done: {
				// 播放已录制的音频 录音状态为播放中
				this.playRecord()
				this.setData({recordAudioStatus: AUDIO_STATUS.play})
				break
			}
			case AUDIO_STATUS.play: {
				// 结束播放已录制的音频 录音状态为暂停
				this.stopRecord()
				this.setData({recordAudioStatus: AUDIO_STATUS.done})
				break
			}
		}
	},
	/**
	 * 保存录音
	 */
	saveAudioRecord() {
		this.stopRecord()
		this.setData({audioReviewVisible: true, materialVisible: false})
		this.toggleAudioModal(false)
	},
	/**
	 * 重录录音
	 */
	reloadAudioRecord() {
		// 停止录音播放，清除本地录音地址
		this.stopRecord(true)

		if (this.data.recordAudioStatus === AUDIO_STATUS.run) {
			this.stopRecording()
		}
		this.setData({recordAudioStatus: AUDIO_STATUS.ready})
	},
	/**
	 * 创建一个时间计数器
	 */
	createTheTimer() {
		let times = 0
		return setInterval(() => {
			times += 1
			let minutes = times / 60 | 0
			let seconds = times % 60 | 0
			this.setData({recordAudioTimes: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`})
		}, 1000)
	},
	/**
	 * 监听课程选择变化
	 */
	onCourseListChange(e) {
		let selectedCourseItem = e.currentTarget.dataset.item
		let recentCourseList = this.data.recentCourseList.slice()
		recentCourseList = recentCourseList.map(n => {
			n.isSelected = selectedCourseItem.kecheng_id === n.kecheng_id && selectedCourseItem.kecheng_type === n.kecheng_type
			return n
		})
		this.setData({recentCourseList, selectedCourseItem})
	},
	/**
	 * 还原媒体类型
	 */
	resetMediaType() {
		this.setData({mediaType: ""})
	},
	/**
	 * 准备发布
	 */
	async prepareLaunch() {
		if (this.data.launchLock) return

		if(!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({didShowAuth: true})
		}

		if (!this.data.desc) {
			return toast("请填写作业内容或心情")
		} else if (!$notNull(this.data.selectedCourseItem)) {
			return toast("请选择作业所在课程")
		} else if (!this.data.mediaType) {
			return toast("请选择作业素材")
		}

		switch (this.data.mediaType) {
			case MEDIA_TYPE.video: {
				if (!this.data.previewLocalVideoUrl) return toast("请选择作业素材")
				wx.showLoading({title: "上传中...", mask: true})
				// 上传视频
				let { data } = await getOssCertificate({
					title: "video_task",
					filename: this.data.previewLocalVideoUrl.split("://")[1]
				})
				this.data.aliyunUploader.dd_custom_params = data
				this.data.aliyunUploader.addFile({url: this.data.previewLocalVideoUrl}, null, null, null, '{"Vod":{}}')
				this.data.aliyunUploader.startUpload()
				// 开始上传视频文件
				this.setData({didVideoFileUploading: true})
				break
			}
			case MEDIA_TYPE.audio: {
				if (!this.data.previewLocalAudioUrl) return toast("请选择作业素材")
				// 上传录音
				let { data } = await getOssCertificate({
					title: "aduio_task",
					filename: this.data.previewLocalAudioUrl.split("://")[1]
				})
				this.data.aliyunUploader.dd_custom_params = data
				this.data.aliyunUploader.addFile({url: this.data.previewLocalAudioUrl}, null, null, null, '{"Vod":{}}')
				this.data.aliyunUploader.startUpload()
				// 开始上传录音文件
				this.setData({didRecordFileUploading: true})
				break
			}
			case MEDIA_TYPE.image: {
				this.launch()
				break
			}
			default: {
				this.launch()
			}
		}
	},

	/**
	 * 正式发布
	 */
	launch() {
		let errorMessage = ""
		let userId = getLocalStorage(GLOBAL_KEY.userId)

		let params = {
			user_id: userId,
			title: this.data.desc,
			media_type: this.data.mediaType,
			kecheng_id: this.data.selectedCourseItem.kecheng_id,
			kecheng_type: this.data.selectedCourseItem.kecheng_type,
		}

		switch (this.data.mediaType) {
			case MEDIA_TYPE.image: {
				if (this.data.images.length === 0) {
					errorMessage = "请上传作业图片"
				}
				params.media_detail = this.data.images.join(",")
				break
			}
			case MEDIA_TYPE.video: {
				if (!this.data.videoUrl) {
					errorMessage = "请上传作业视频"
				}
				params.media_detail = this.data.videoUrl
				params.video_id = this.data.videoId
				params.video_height = this.data.videoHeight
				params.video_width = this.data.videoWidth
				break
			}
			case MEDIA_TYPE.audio: {
				if (!this.data.audioUrl) {
					errorMessage = "请上传作业音频"
				}
				params.media_detail = this.data.audioUrl
				params.audio_length = this.data.audioDuration
				break
			}
		}

		if (errorMessage) {
			return toast(errorMessage)
		}

		this.setData({launchLock: true})

		wx.showLoading({title: "发布中...", mask: true})
		publishTask(params).then(({data}) => {
			toast("发布作业成功", 1000)
			console.log(data)
			getApp().globalData.needInitialPageName = this.data.fromPageName
			this.setData({launchLock: false})
			wx.navigateBack()
			wx.hideLoading()
		}).catch(() => {
			this.setData({launchLock: false})
			wx.hideLoading()
		})
	}
})
