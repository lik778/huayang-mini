import {
	checkFissionTaskStatus,
	checkJoinVideoCourse,
	getFissionDetail,
	queryFissionList,
	unlockFissionTask
} from "../../api/course/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, toast } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: 0,
		list: [],
		options: {},
		taskInfo: {},
		didShowUnlockAlert: false,
		didHelped: false, // 当前用户是否已助过力
		seriesInviteId: 0, // 助力邀请ID
		didUserSelf: false, // 是否是发起人自己
		fissionPrice: 0,
		selfTipText: "立即查看邀请进度",
		didUserHadJoinedVideoCourse: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({options})

		this.helpFriendGetCourse()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight})
		this.queryList()
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
	// 关闭助力弹窗
	cancelUnlockAlert() {
		this.setData({didShowUnlockAlert: false})
	},
	// 帮助好友助力课程
	async helpFriendGetCourse() {
		let {series_invite_id = '', fissionPrice = 0} = this.data.options
		this.setData({fissionPrice})
		// 是否帮别人助力
		if (series_invite_id) {

			let {kecheng_series_invite: taskInfo = {}} = await getFissionDetail({series_invite_id}) || {}
			let userOpenId = getLocalStorage(GLOBAL_KEY.openId)

			// 没有查到订单数据则不执行后续操作
			if (!$notNull(taskInfo)) {
				return
			}

			this.setData({taskInfo})

			// 助力任务的发起人不能是助力人
			if (taskInfo.open_id === userOpenId) {
				let wantToJoinedCourseInfo = null
				if (hasAccountInfo() && hasUserInfo()) {
					wantToJoinedCourseInfo = await checkJoinVideoCourse({kecheng_series_id: this.data.taskInfo.kecheng_series_id})
				}
				if ($notNull(wantToJoinedCourseInfo)) {
					this.setData({
						selfTipText: "您成功已获取该课程",
						didUserHadJoinedVideoCourse: $notNull(wantToJoinedCourseInfo),
					})
				}
				this.setData({
					didShowUnlockAlert: true,
					didUserSelf: true,
				})

				return
			}

			// 用户如果未完全授权，展示助力弹窗
			if (!(hasAccountInfo() && hasUserInfo())) {
				this.setData({didShowUnlockAlert: true})
				return
			}

			checkFissionTaskStatus({
				open_id: userOpenId,
				invite_id: series_invite_id
			}).then((result) => {
				// 没数据说明未帮该好友助力，展示助力弹窗
				if (!$notNull(result)) {
					this.setData({didShowUnlockAlert: true, seriesInviteId: series_invite_id})
				} else {
					this.setData({didShowUnlockAlert: true, seriesInviteId: series_invite_id, didHelped: true})
				}
			})
		}
	},
	goBack() {
		let historyRoute = getCurrentPages()
		if (historyRoute.length > 1) {
			wx.navigateBack()
		} else {
			wx.switchTab({url: "/pages/discovery/discovery"})
		}
	},
	// 授权弹窗确认回调
	authCompleteEvent() {
		this.helpFriendGetCourse()
		this.setData({didShowAuth: false})
	},
	// 授权弹窗取消回调
	authCancelEvent() {
		this.setData({didShowAuth: false})
	},
	// 跳转至对应课程
	jumpToCourseDetail(e) {
		let {id} = e.currentTarget.dataset.item

		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
		})
	},
	queryList() {
		queryFissionList({limit: 100}).then((list) => {
			let handledList = list.filter((res) => {
				res.price = (res.price / 100).toFixed(2)
				if (res.discount_price === -1 && res.price > 0) {
					// 原价出售
					// 是否有营销活动
					if (+res.invite_open === 1) {
						res.fission_price = (+res.price * res.invite_discount / 10000).toFixed(2)
					}
				} else if (res.discount_price >= 0 && res.price > 0) {
					// 收费但有折扣
					// 是否有营销活动
					if (+res.invite_open === 1) {
						res.fission_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
					}
				}

				// 只显示开启营销活动的数据
				if (+res.invite_open === 1) {
					res.tipsText = res.fission_price == 0 ? "邀请好友助力免费学" : `邀请好友助力${(res.invite_discount / 10)}折购`
					return res
				}
			})
			this.setData({list: handledList})
		})
	},
	async handlerHelp() {
		// 检查权限
		if (!(hasAccountInfo() && hasUserInfo())) {
			this.setData({didShowAuth: true})
			return
		}

		// 查看邀请进度
		if (this.data.didUserSelf) {
			this.setData({didShowUnlockAlert: false})

			// 如果用户自己已经完成了邀请任务，关闭弹窗停留在本页面，反之查看进度
			if (this.data.didUserHadJoinedVideoCourse) {
				wx.navigateTo({url: `/subCourse/videoCourse/videoCourse?videoId=${this.data.taskInfo.kecheng_series_id}`})
			} else {
				wx.navigateTo({
					url: `/subCourse/invitePage/invitePage?series_invite_id=${this.data.options.series_invite_id}&videoId=${this.data.taskInfo.kecheng_series_id}&fissionPrice=${this.data.options.fissionPrice}`
				})
			}
			return
		}

		if (!this.data.didHelped) {
			// 助力解锁
			unlockFissionTask({
				open_id: getLocalStorage(GLOBAL_KEY.openId),
				user_id: getLocalStorage(GLOBAL_KEY.userId),
				invite_id: this.data.seriesInviteId
			}).then(() => {
				toast('助力成功', 1000)
			})
		}
		this.setData({didShowUnlockAlert: false})

	}
})
