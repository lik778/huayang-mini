import { getTaskStream } from "../../api/task/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"

const NAME = "compositeTaskPage"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		compositeTaskList: [],
		mediaQueue: [],
		offset: 0,
		limit: 3,
		hasMore: true,
		didShowAuth: false,
		didShowTip: false,
		firstTaskCardHeight: 0,
		cachedAction: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		bxPoint("pv_composite_task_page", {})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.getCompositeTask(true)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let needInitialPageName = getApp().globalData.needInitialPageName
		if (needInitialPageName === NAME) {
			wx.pageScrollTo({scrollTop: 0, duration: 0})
			this.getCompositeTask(true)
			getApp().globalData.needInitialPageName = ""
		}
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
		this.getCompositeTask(true)
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (this.data.hasMore) {
			this.getCompositeTask()
		}
	},

	onPageScroll(e) {
		if (this.data.compositeTaskList.length === 0 && this.data.firstTaskCardHeight === 0) return
		if (getApp().globalData.didShowedTaskTip) return
		if (e.scrollTop >= this.data.firstTaskCardHeight) {
			this.setData({didShowTip: true})
			getApp().globalData.didShowedTaskTip = true
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (e) {
		if (e.target) {
			let {taskid, nickname, userid} = e.target.dataset
			return {
				imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
				title: `${nickname}的作业很棒哦，快来看看吧！`,
				path: `/subCourse/indexTask/indexTask?taskId=${taskid}&nickname=${nickname}&userId=${userid}`
			}
		} else {
			return {
				imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608515904gwuBds.jpg",
				title: '花样作业秀，精彩纷呈！',
				path: `/subCourse/compositeTask/compositeTask`
			}
		}

	},
	initPageScroll() {
		if (this.data.compositeTaskList.length > 1) {
			let self = this
			const query = wx.createSelectorQuery()
			query.select(`#task-layout-${this.data.compositeTaskList[1].kecheng_work.id}`).boundingClientRect()
			query.exec(function (res) {
				self.setData({firstTaskCardHeight: res[0].top})
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
			this.setData({cachedAction: e.detail.cb})
		}
		this.setData({didShowAuth: true})
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({didShowAuth: false, cachedAction: null})
	},
	// 用户确认授权
	authCompleteEvent() {
		if (this.data.cachedAction) {
			this.data.cachedAction()
			this.setData({cachedAction: null})
		}
		this.setData({didShowAuth: false})
	},
	/**
	 * 获取综合作业流
	 */
	getCompositeTask(refresh = false) {
		if (refresh) {
			this.setData({compositeTaskList: []})
		}
		let params = {
			limit: this.data.limit,
			offset: refresh ? 0 : this.data.offset
		}
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		if (userId) {
			params.user_id = userId
		}
		getTaskStream(params).then(({data}) => {
			data = data || []
			let oldData = this.data.compositeTaskList.slice()
			let compositeTaskList = refresh ? [...data] : [...oldData, ...data]
			this.setData({compositeTaskList, hasMore: data.length === this.data.limit, offset: compositeTaskList.length})

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
		this.setData({mediaQueue: queue})
	},
	/**
	 * 跳转去发布页
	 */
	goToLaunchTask() {
		if (hasUserInfo() && hasAccountInfo()) {
			wx.navigateTo({url: "/subCourse/launchTask/launchTask?fromPageName=" + NAME})
		} else {
			this.onNoAuth({detail: { cb: () => {wx.navigateTo({url: "/subCourse/launchTask/launchTask?fromPageName=" + NAME})} }})
		}
	}
})
