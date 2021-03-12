import { getLiveList, querySectionCourseList } from "../../api/live/index"
import bxPoint from "../../utils/bxPoint"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { statisticsWatchNo } from "../../api/live/course"
import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import { getFluentCardInfo } from "../../api/mine/index"

Page({

	/**
	 * Page initial data
	 */
	data: {
		sectionList: [],
		liveList: [],
		isFluentLearnVIP: false
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {

	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {
		this.run()
	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {
		bxPoint("replay_visit", {})
	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {
		return {
			title: "我在花样百姓，和我一起学习、游玩吧，开心每一天！",
			path: "/subCourse/liveback/liveback"
		}
	},
	async run() {
		this.getFluentInfo()
		// 专栏列表
		let data = await querySectionCourseList()
		data = data.map(_ => {
			return {
				..._.kecheng_series,
				teacher: _.teacher,
				didBought: _.buy_tag === "已购",
				buy_tag: _.buy_tag
			}
		})

		let handledList = data.map((res) => {
			if (res.visit_count >= 10000) {
				res.visit_count = (res.visit_count / 10000).toFixed(1) + "万"
				res.visit_count = res.visit_count.split('.')[1] === '0万' ? res.visit_count[0] + "万" : res.visit_count
			}
			res.price = (res.price / 100) // .toFixed(2)
			if (res.discount_price === -1 && res.price > 0) {
				// 原价出售
				// 是否有营销活动
				if (+res.invite_open === 1) {
					res.fission_price = (+res.price * res.invite_discount / 10000) // .toFixed(2)
				}
				res.discount_price = res.price
			} else if (res.discount_price >= 0 && res.price > 0) {
				// 收费但有折扣
				res.discount_price = (res.discount_price / 100) // .toFixed(2)
				// 是否有营销活动
				if (+res.invite_open === 1) {
					res.fission_price = (+res.discount_price * res.invite_discount / 10000) // .toFixed(2)
				}
			} else if (+res.discount_price === -1 && +res.price === 0) {
				res.discount_price = 0
			}

			// 只显示开启营销活动的数据
			if (+res.invite_open === 1 && (res.price > 0 || res.discount_price > 0)) {
				res.tipsText = res.fission_price == 0 ? "邀好友免费学" : `邀好友${(res.invite_discount / 10)}折购`
			}

			return res
		})
		// handledList = handledList.filter(n => n.id && n.cover_pic && n.name && n.visit_count)
		this.setData({sectionList: handledList})

		// 直播回看列表
		let list = await getLiveList({
			limit: 9999,
			offset: 0
		})
		list = list.map(item => ({
			zhiboRoomId: item.zhibo_room.id,
			roomId: item.zhibo_room.num,
			roomType: item.zhibo_room.room_type,
			roomTitle: item.zhibo_room.title,
			roomDesc: item.zhibo_room.desc,
			startTime: item.zhibo_room.start_time,
			visitCount: item.zhibo_room.visit_count,
			coverPicture: item.zhibo_room.cover_pic,
		}))
		this.setData({liveList: list})
	},
	navigateToVideoDetail(e) {
		let item = e.currentTarget.dataset.item
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`, complete() {
				bxPoint("replay_zhuanlan", {
					series_id: item.id,
					kecheng_name: item.teacher_desc,
					kecheng_subname: item.name,
					kecheng_teacher: item.teacher.name,
					kecheng_total_amount: item.visit_count,
				}, false)
			}
		})
	},

	/**
	 * 请求畅销卡信息
	 */
	getFluentInfo() {
		if (!hasUserInfo() || !hasAccountInfo()) return
		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
			this.setData({isFluentLearnVIP: $notNull(data) && data.status === FluentLearnUserType.active})
		})
	},

	navigateToLive(e) {
		if (!hasUserInfo()) return this.triggerEvent("openUserAuth")
		let {
			zhiboRoomId,
			roomId,
			link,
			status,
			roomTitle,
			roomDesc,
			startTime,
			roomType
		} = e.currentTarget.dataset.item

		statisticsWatchNo({
			zhibo_room_id: zhiboRoomId, // 运营后台配置的课程ID
			open_id: getLocalStorage(GLOBAL_KEY.openId)
		}).then(() => {
			// link存在去跳转回看页
			if (+status === 2 && link) {
				wx.navigateTo({
					url: `/subLive/review/review?zhiboRoomId=` + zhiboRoomId,
				})
			} else {
				wx.navigateTo({
					url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(this.data.customParams))}`
				})
			}
			setTimeout(() => {
				// 更新直播间观看次数
				let list = [...this.data.liveList]
				list.forEach(_ => {
					if (_.zhiboRoomId === zhiboRoomId) {
						_.visitCount += 1
					}
				})
				this.setData({
					liveList: [...list]
				})
			}, 1000)
		})

		bxPoint("replay_more", {
			live_id: roomId,
			live_title: roomTitle,
			live_desc: roomDesc,
			live_room_type: roomType,
			live_start_time: startTime,
		}, false)
	},
})
