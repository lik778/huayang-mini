import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getTaskStream } from "../../api/task/index"
import { getCampDetail, getHasJoinCamp, getVideoTypeList } from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"

const NAME = "themeTaskPage"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: 0,
		kecheng_type: undefined,
		kecheng_id: undefined,
		themeTaskList: [],
		mediaQueue: [],
		offset: 0,
		limit: 3,
		hasMore: true,
		themeBannerImage: "",
		themeTitle: "",
		isOwnBootcamp: false, // 当前用户是否已用户该训练营
		didSignIn: false, // 登录状态
		didShowAuth: false,
		didShowTip: false,
		firstTaskCardHeight: 0,
		cachedAction: null,
		scrollTopNumber: 0, // 页面滑动位置
		didFromCooperationPage: false, // 是否来自资源合作页面
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {
			kecheng_type,
			kecheng_id,
			from_co_channel = false
		} = options
		let {
			statusBarHeight
		} = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
		this.setData({
			kecheng_type,
			kecheng_id,
			statusBarHeight,
			didFromCooperationPage: !!from_co_channel
		})
		this.getDetail()

		if (from_co_channel) {
			bxPoint("pv_theme_task_page", {
				co_channel_tag: 'co_lndx'
			})
		} else {
			bxPoint("pv_theme_task_page", {})
		}


	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.getThemeTask(true)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData({
			didSignIn: hasAccountInfo() && hasUserInfo()
		})

		let needInitialPageName = getApp().globalData.needInitialPageName
		if (needInitialPageName === NAME) {
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
			this.getThemeTask(true)
			getApp().globalData.needInitialPageName = ""
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		// 在页面隐藏前，移除媒体队列
		if (this.data.mediaQueue.length > 0) {
			let queue = this.data.mediaQueue.slice()
			// 重置之前播放的所有媒体
			let comp = this.selectComponent(`#task-layout-${queue[0]}`)
			comp.resetMediaStatus()
			queue.shift()

			// 缓存正要播放的媒体ID
			this.setData({
				mediaQueue: queue
			})
		}
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
		this.getThemeTask(true)
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (this.data.hasMore) {
			this.getThemeTask()
		}
	},

	onPageScroll(e) {
		this.setData({
			scrollTopNumber: e.scrollTop
		})
		if (this.data.themeTaskList.length === 0 && this.data.firstTaskCardHeight === 0) return
		if (getApp().globalData.didShowedTaskTip) return
		if (e.scrollTop >= (this.data.firstTaskCardHeight)) {
			this.setData({
				didShowTip: true
			})
			getApp().globalData.didShowedTaskTip = true
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (e) {
		if (e.target) {
			let {
				taskid,
				nickname,
				userid
			} = e.target.dataset
			return {
				imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
				title: `${nickname}的作业很棒哦，快来看看吧！`,
				path: `/subCourse/indexTask/indexTask?taskId=${taskid}&nickname=${nickname}&userId=${userid}`
			}
		} else {
			return {
				imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
				title: `花样“${this.data.themeTitle}”${this.data.kecheng_type === '1' ? '学院' : ''}的精彩作业秀`,
				path: `/subCourse/themeTask/themeTask?kecheng_type=${this.data.kecheng_type}&kecheng_id=${this.data.kecheng_id}`
			}
		}
	},
	/**
	 * 发布作业
	 */
	goToLaunchPage() {
		wx.navigateTo({
			url: `/subCourse/launchTask/launchTask?fromPageName=${NAME}&themeType=${this.data.kecheng_type}&themeId=${this.data.kecheng_id}&themeTitle=${this.data.themeTitle}`
		})
	},
	/**
	 * 跳转到视频系列课
	 */
	goToCoursePage() {
		wx.navigateTo({
			url: `/subCourse/videoCourseList/videoCourseList?index=${this.data.kecheng_id}`
		})
	},
	initPageScroll() {
		if (this.data.themeTaskList.length > 1) {
			let self = this
			const query = wx.createSelectorQuery()
			query.select(`#task-layout-${this.data.themeTaskList[1].kecheng_work.id}`).boundingClientRect()
			query.exec(function (res) {
				self.setData({
					firstTaskCardHeight: res[0].top - 100
				})
			})
		}
	},
	/**
	 * [取消]点赞事件触发
	 */
	onThumbChange(e) {
		if (e.detail.thumbType === "like") {
			// 送花
			let comp = this.selectComponent("#flower")
			comp.star()
		}
	},
	/**
	 * 处理未登录状态
	 */
	onNoAuth(e) {
		if (e) {
			this.setData({
				cachedAction: e.detail.cb
			})
		}
		this.setData({
			didShowAuth: true
		})
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({
			didShowAuth: false,
			cachedAction: null
		})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.setData({
			didSignIn: hasAccountInfo() && hasUserInfo()
		})

		if (this.data.cachedAction) {
			this.data.cachedAction()
			this.setData({
				cachedAction: null
			})
		}

		this.setData({
			didShowAuth: false
		})
	},
	goToJoinBootcamp() {
		if (this.data.didSignIn) {
			wx.navigateTo({
				url: `/subCourse/joinCamp/joinCamp?id=${this.data.kecheng_id}`
			})
		} else {
			this.onNoAuth({
				detail: {
					cb: () => {
						wx.navigateTo({
							url: `/subCourse/joinCamp/joinCamp?id=${this.data.kecheng_id}`
						})
					}
				}
			})
		}
	},
	goToBootcampDetail() {
		wx.navigateTo({
			url: `/subCourse/campDetail/campDetail?id=${this.data.kecheng_id}`
		})
	},
	goToLaunchTaskPage() {
		wx.navigateTo({
			url: `/subCourse/launchTask/launchTask?fromPageName=${NAME}&themeType=${this.data.kecheng_type}&themeId=${this.data.kecheng_id}&themeTitle=${this.data.themeTitle}`
		})
	},
	/**
	 * 返回上一页
	 */
	back() {
		wx.navigateBack({
			fail() {
				wx.reLaunch({
					url: "/pages/discovery/discovery"
				})
			}
		})
	},
	/**
	 * 获取主题页详情
	 */
	getDetail() {
		switch (+this.data.kecheng_type) {
			case 0: {
				// 训练营
				getHasJoinCamp({
					traincamp_id: this.data.kecheng_id
				}).then((data) => {
					this.setData({
						isOwnBootcamp: +data.status === 1
					})
				})

				getCampDetail({
					traincamp_id: this.data.kecheng_id,
					user_id: getLocalStorage(GLOBAL_KEY.userId)
				}).then((data) => {
					data = data || []
					let {
						cover_pic,
						name
					} = data
					this.setData({
						themeBannerImage: cover_pic,
						themeTitle: name
					})
				})
				break
			}
			case 1: {
				// 学院
				getVideoTypeList().then((data) => {
					let target = data.find(item => item.id === +this.data.kecheng_id)
					this.setData({
						themeBannerImage: target.pic,
						themeTitle: target.value
					})
				})
			}
		}
	},
	/**
	 * 获取主题作业流
	 */
	getThemeTask(refresh = false) {
		if (refresh) {
			this.setData({
				themeTaskList: []
			})
		}
		let params = {
			kecheng_type: this.data.kecheng_type,
			kecheng_id: this.data.kecheng_id,
			limit: this.data.limit,
			offset: refresh ? 0 : this.data.offset
		}
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		if (userId) {
			params.user_id = userId
		}
		getTaskStream(params).then(({
			data
		}) => {
			data = data || []
			let oldData = this.data.themeTaskList.slice()
			let themeTaskList = refresh ? [...data] : [...oldData, ...data]
			this.setData({
				themeTaskList,
				hasMore: data.length === this.data.limit,
				offset: themeTaskList.length
			})

			if (refresh) wx.stopPullDownRefresh()

			let t = setTimeout(() => {
				this.initPageScroll()
				clearTimeout(t)
			}, 200)
		})
	},
	/**
	 * 接受正在播放媒体的作业ID号
	 */
	receiveTaskId(e) {
		let queue = this.data.mediaQueue.slice()
		let taskId = e.detail.taskId
		let isDifferent = queue[0] != taskId
		// 重置之前播放的所有媒体
		if (this.data.mediaQueue.length > 0 && isDifferent) {
			let comp = this.selectComponent(`#task-layout-${queue[0]}`)
			comp.resetMediaStatus()
			queue.shift()
		}

		// 缓存正要播放的媒体ID
		isDifferent && queue.push(taskId)
		this.setData({
			mediaQueue: queue
		})
	},
})
