import { getActivityList } from "../../api/course/index"
import request from "../../lib/request"
import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getFluentCardInfo } from "../../api/mine/index"

Page({
	data: {
		pagesControl: {
			limit: 10,
			offset: 0
		},
		hasMore: true,
		didFluentCardUser: false,
		activityList: [],
		didShowAuth: false,
		didShowFluentLearnModal: false
	},
	authCompleteEvent() {
		this.setData({
			didShowAuth: false,
		})
		this.checkUserKind()
	},
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	// 非花样畅学卡用户访问校友活动需要引导购买畅学卡
	onFluentLearnTap() {
		wx.navigateTo({url: "/mine/joinFluentLearn/joinFluentLearn"})
	},
	onFluentLearnCloseTap() {
		this.setData({didShowFluentLearnModal: false})
	},
	getActivityList() {
		if (!this.data.hasMore) return
		getActivityList({
			sort: "rank",
			status: 1,
			colleage_activity: 1,
			platform: 1,
			limit: this.data.pagesControl.limit,
			offset: this.data.pagesControl.offset
		}).then(x => {
			let list = x.list
			if (list.length < this.data.pagesControl.limit) {
				this.setData({hasMore: false})
			}
			this.setData({
				activityList: this.data.activityList.concat(list),
				pagesContorl: {
					limit: this.data.pagesControl.limit,
					offset: this.data.pagesControl.offset + this.data.pagesControl.limit
				}
			})
		}).catch(err => {
			console.log(err)
		})
	},
	onActivityTap(e) {
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({didShowAuth: true})
		}
		let activityId = e.currentTarget.dataset.item.id
		if (activityId) {
			if (this.data.didFluentCardUser) {
				let link = `${request.baseUrl}/#/home/detail/${activityId}`
				wx.navigateTo({url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}&didUserIsFluentCardMember=yes`})
			} else {
				this.setData({didShowFluentLearnModal: true})
			}

		}
	},
	checkUserKind() {
		// 检查用户身份
		if (hasUserInfo() && hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data: fluentCardInfo}) => {
				this.setData({didFluentCardUser: !!fluentCardInfo})
			})
		}
	},
	onLoad() {
		this.getActivityList()
	},
	onShow() {
		this.checkUserKind()
	},
	onHide() {
		if (this.data.didShowFluentLearnModal) {
			this.setData({didShowFluentLearnModal: false})
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "花样大学校友活动招募中",
			path: "/subCourse/collegeActivity/collegeActivity"
		}
	},
	onReachBottom() {
		this.getActivityList()
	}
})
