import dayjs from "dayjs"
import { deleteTaskRecord, thumbTask, unThumbTask } from "../../api/task/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo, toast } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
// 媒体资源类型
const MEDIA_TYPE = {
	image: 1,
	video: 2,
	audio: 3
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

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		taskInfo: {
			type: Object,
			value: null
		},
		isOwnner: {
			type: Boolean,
			value: false
		},
		isPerson: {
			type: Boolean,
			value: false
		},
		isTheme: {
			type: Boolean,
			value: false
		},
		didShowTip: {
			type: Boolean,
			value: false,
			observer(newVal) {
				if (newVal) {
					let t = setTimeout(() => {
						this.setData({innerTip: false})
						clearTimeout(t)
					}, 3000)
				}
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		MEDIA_TYPE,
		AUDIO_CALLBACK_STATUS,
		AUDIO_CALLBACK_IMAGE,
		audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause,
		info: {},
		bgAudioInstance: null,
		videoInstance: null,
		didBgAudioRunning: false,
		innerTip: true
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		/**
		 * 记录作业卡片内部分享按钮点击事件
		 */
		onShareBtnTap() {
			let {taskId, userId} = this.data.info
			bxPoint("task_card_inner_share", {taskId, authorId: userId}, false)
		},
		/**
		 * 重置提示框
		 */
		resetTips() {
			this.setData({innerTip: false})
		},
		/**
		 * 跳转到个人作业秀页面
		 */
		goToPersonTaskPage() {
			this.resetTips()
			if (this.data.isPerson) return
			let {userId} = this.data.info
			if (this.data.isTheme) {
				wx.redirectTo({url: `/subCourse/personTask/personTask?visit_user_id=${userId}`})
			} else {
				wx.navigateTo({url: `/subCourse/personTask/personTask?visit_user_id=${userId}`})
			}
		},
		/**
		 * 跳转到主题作业秀页面
		 */
		goToThemeTaskPage() {
			this.resetTips()
			if (this.data.isTheme) return
			let {kecheng_type, kecheng_id} = this.data.info
			bxPoint("task_tag_click", {type: kecheng_type, contentId: kecheng_id}, false)

			if (!hasUserInfo() || !hasAccountInfo()) {
				return this.triggerEvent("noAuth", {cb: () => {wx.navigateTo({url: `/subCourse/themeTask/themeTask?kecheng_type=${kecheng_type}&kecheng_id=${kecheng_id}`})}})
			}

			if (this.data.isPerson) {
				wx.redirectTo({url: `/subCourse/themeTask/themeTask?kecheng_type=${kecheng_type}&kecheng_id=${kecheng_id}`})
			} else {
				wx.navigateTo({url: `/subCourse/themeTask/themeTask?kecheng_type=${kecheng_type}&kecheng_id=${kecheng_id}`})
			}
		},
		/**
		 * 删除自己的作业
		 */
		deleteSelfTask() {
			if (!this.data.isOwnner) return
			let {taskId} = this.data.info
			let params = {work_id: taskId, user_id: getLocalStorage(GLOBAL_KEY.userId)}
			let self = this
			wx.showModal({
				title: '提示',
				content: '确定删除该作业吗？',
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						deleteTaskRecord(params).then(({data}) => {
							if (data === "success") {
								toast("作业删除成功")
								self.triggerEvent("deleteTask", {taskId})
							}
						})
					}
				},
			})
		},
		/**
		 * [取消]点赞
		 */
		toggleThumbStatus() {
			this.resetTips()
			if (!hasUserInfo() || !hasAccountInfo()) {
				return this.triggerEvent("noAuth", {cb: () => {this.toggleThumbStatus()}})
			}

			let oldInfoData = {...this.data.info}
			let {taskId, has_like} = oldInfoData
			let params = {work_id: taskId, user_id: getLocalStorage(GLOBAL_KEY.userId)}
			if (!!has_like) {
				unThumbTask(params).then(({data, message}) => {
					if (data === "success") {
						let new_like_count = oldInfoData.like_count - 1
						oldInfoData.has_like = 0
						oldInfoData.like_count = new_like_count < 0 ? 0 : new_like_count
						this.setData({info: oldInfoData})
						this.triggerEvent("thumbChange", {thumbType: "unlike"})
					} else {
						toast(message)
					}
				})
			} else {
				thumbTask(params).then(({data, message}) => {
					if (data === "success") {
						let new_like_count = oldInfoData.like_count + 1
						oldInfoData.has_like = 1
						oldInfoData.like_count = new_like_count
						this.setData({info: oldInfoData})
						this.triggerEvent("thumbChange", {thumbType: "like"})
					} else {
						toast(message)
					}
				})
			}
		},
		/**
		 * 计算日期
		 * @param timestring
		 * @returns {string}
		 */
		calcDate(timestring) {
			let result = ""
			let firstDateInThisYear = `${dayjs().year()}-01-01`
			if (dayjs(timestring).isBefore(dayjs(firstDateInThisYear))) {
				result = dayjs(timestring).format("YYYY-MM-DD [_]d HH:mm")
			} else {
				result = dayjs(timestring).format("MM-DD [_]d HH:mm")
			}

			result = result.replace(/_(\d)/, (matchString, p1) => {
				let replaceString = ""
				switch (+p1) {
					case 0: {
						replaceString = "周日"
						break
					}
					case 1: {
						replaceString = "周一"
						break
					}
					case 2: {
						replaceString = "周二"
						break
					}
					case 3: {
						replaceString = "周三"
						break
					}
					case 4: {
						replaceString = "周四"
						break
					}
					case 5: {
						replaceString = "周五"
						break
					}
					case 6: {
						replaceString = "周六"
						break
					}
				}
				return replaceString
			})

			return result
		},
		/**
		 * 图片预览
		 * @param e
		 */
		reviewImages(e) {
			this.resetTips()
			let sources = this.data.info.media_detail.map(img => {
				return {url: img}
			})
			wx.previewMedia({
				sources,
				current: e.currentTarget.dataset.index
			})
		},
		/**
		 * 预览视频
		 */
		reviewVideo() {
			this.resetTips()
			let videoInstance = wx.createVideoContext("task-video-" + this.data.info.taskId, this)
			videoInstance.requestFullScreen()
			this.setData({videoInstance})
			this.postTaskId()
		},
		/**
		 * 向上传递作业ID
		 */
		postTaskId() {
			this.triggerEvent("postTaskId", {taskId: this.data.info.taskId})
		},
		/**
		 * 预览音频
		 */
		reviewAudio() {
			this.resetTips()
			if (this.data.bgAudioInstance) {
				// 已初始化
				if (this.data.didBgAudioRunning) {
					this.data.bgAudioInstance.pause()
				} else {
					this.data.bgAudioInstance.src = this.data.info.media_detail + '?' + +new Date()
					this.data.bgAudioInstance.play()
				}
			} else {
				this.initBgAudioContext()
				this.postTaskId()
			}
		},
		/**
		 * 重置媒体状态
		 */
		resetMediaStatus() {
			switch (this.data.info.media_type) {
				case MEDIA_TYPE.video: {
					this.data.videoInstance.stop()
					break
				}
				case MEDIA_TYPE.audio: {
					this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
					this.setData({bgAudioInstance: null})
					break
				}
			}
		},
		/**
		 * 初始化背景音频播放器
		 */
		initBgAudioContext() {
			let bgAudioInstance = wx.getBackgroundAudioManager()

			bgAudioInstance.title = "audio" + this.data.info.taskId
			bgAudioInstance.src = this.data.info.media_detail

			bgAudioInstance.onCanplay(() => {
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.start})
				this.setData({didBgAudioRunning: true})
				console.log("bga can play")
			})

			bgAudioInstance.onEnded(() => {
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
				this.setData({didBgAudioRunning: false})
				console.log("bga ended")
			})

			bgAudioInstance.onPause(() => {
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
				bgAudioInstance.stop()
				console.log("bga pause")
			})

			bgAudioInstance.onStop(() => {
				this.setData({audioCallbackStatus: AUDIO_CALLBACK_STATUS.pause})
				this.setData({didBgAudioRunning: false})
				console.log("bga stop")
			})

			bgAudioInstance.onError((err) => {
				console.error(err)
			})

			this.setData({bgAudioInstance})
		}
	},
	lifetimes: {
		ready: function () {
			if (!this.data.taskInfo) return

			let {kecheng_work = {}, user = {}, work_comment_list, has_like, kecheng_name} = this.data.taskInfo || {}
			let {
				id: taskId,
				kecheng_id,
				kecheng_type,
				like_count,
				media_type,
				media_detail,
				title: desc,
				video_height,
				video_width,
				video_cover,
				created_at,
				audio_length
			} = kecheng_work
			let {avatar_url, nick_name, id: userId} = user
			work_comment_list = work_comment_list || []
			work_comment_list = work_comment_list.map(item => {
				return {
					comment: item.kecheng_work_comment.content,
					updated_at: this.calcDate(item.kecheng_work_comment.updated_at),
					teacherAvatar: item.teacher.avatar,
					teacherName: item.teacher.name,
				}
			})

			switch (media_type) {
				case MEDIA_TYPE.image: {
					media_detail = media_detail.split(",")
					break
				}
				case MEDIA_TYPE.video: {
					break
				}
				case MEDIA_TYPE.audio: {
					let minutes = audio_length / 60 | 0
					let seconds = audio_length % 60 | 0
					audio_length = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
					break
				}
			}

			let info = {
				taskId,
				kecheng_id,
				kecheng_type,
				kecheng_name,
				has_like,
				like_count,
				media_type,
				media_detail,
				desc,
				video_height: video_height >= video_width ? 400 : 300,
				video_width: video_width >= video_height ? 400 : 300,
				// video_cover: video_cover || (video_width >= video_height ? "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608000399bcXYDv.jpg" : "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608000356lGHZEl.jpg"),
				created_at: this.calcDate(created_at),
				audio_length,
				avatar_url,
				nick_name,
				userId,
				work_comment_list
			}

			this.setData({info})
		}
	},
})
