// pages/live/live.js
import { getLiveBannerList, getLiveList, updateLiveStatus } from "../../api/live/index"
import { GLOBAL_KEY, WeChatLiveStatus } from '../../lib/config'
import { $notNull, getLocalStorage, getSchedule } from '../../utils/util'
import { statisticsWatchNo } from "../../api/live/course"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		WeChatLiveStatus,
		schedule: [],
		roomId: 4,
		customParams: {},
		bannerPictureObject: null,
		bannerList: [],
		liveList: [],
		liveListOffset: 0,
		liveListLimit: 100,
		didNoMore: false,
		didVip: false,
		liveStatusIntervalTimer: null
	},
	/**
	 * 跳转到微信直播页面
	 * @param e
	 */
	navigateToLive(e) {
		let { roomId:targetId, link } = e.currentTarget.dataset.item
		this.setData({
			roomId: targetId
		})
		statisticsWatchNo({
			zhibo_room_id: targetId,
			open_id: getLocalStorage(GLOBAL_KEY.openId)
		}).then(() => {
			// 判读link是否存在
			if (link) {
				wx.navigateTo({
					url: `/subLive/review/review?roomId=` + targetId
				})
			} else {
				wx.navigateTo({
					url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${targetId}&custom_params=${encodeURIComponent(JSON.stringify(this.data.customParams))}`
				})
			}
		})
	},
	/**
	 * 请求直播间列表
	 */
	queryLiveList() {
		getLiveList({limit: this.data.liveListLimit, offset: this.data.liveListOffset}).then((data) => {
			if (data.length < this.data.liveListLimit) {
				this.data.didNoMore = true
			}
			this.data.liveListOffset = data.length
			const result = data.map(item => {
				return {
					id: item.zhibo_room.id,
					roomId: item.zhibo_room.num,
					roomType: item.zhibo_room.room_type,
					roomName: item.zhibo_room.title,
					userId: item.zhibo_room.user_id,
					visitCount: item.zhibo_room.visit_count,
					coverPicture: item.zhibo_room.cover_pic,
					sharePicture: item.zhibo_room.share_pic,
					status: item.zhibo_room.status,
					liveStatus: 0,
					link: item.zhibo_room.link,
					vipOnly: item.zhibo_room.vip_only,
					avatar: item.user && item.user.avatar_url ? item.user.avatar_url : 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586332410GvsWnF.jpg',
					author: item.user && item.user.nick_name ? item.user.nick_name : '主播',
				}
			})
			// 筛选出直播间状态不是"回看"的房间号
			const roomIds = result.filter(_ => _.roomId && _.status !== 2).map(t => t.roomId)

			getSchedule(roomIds).then(this.handleLiveStatusCallback)
			this.setData({
				liveList: [...result],
			})
		})
	},
	/**
	 * 处理直播间状态回调
	 * @param callbackLiveStatus
	 */
	handleLiveStatusCallback(callbackLiveStatus) {
		if (callbackLiveStatus.length > 0) {
			let originLiveList = [...this.data.liveList]
			originLiveList.forEach(_ => {
				let tar = callbackLiveStatus.find(o => o.roomId === _.roomId)
				if (tar) {
					_.liveStatus = tar.liveStatus
					// 如果微信返回的直播间状态为103-已过期
					if (tar.liveStatus === WeChatLiveStatus[103]) {
						updateLiveStatus({
							status: 2, // 2->直播已结束
							zhibo_room_id: _.id
						})
					}
				}
			})

			this.setData({
				liveList: [...originLiveList]
			})
		}
	},
	/**
	 * 获取banner
	 */
	getBanner() {
		getLiveBannerList().then((banner) => {
			let bannerList = banner.map(b => {
				return {
					id: b.kecheng.id,
					roomId: b.zhibo_room.num,
					roomType: b.zhibo_room.room_type,
					author: b.user.nick_name,
					name: b.banner.title ? b.banner.title.split('\\n').join('\n') : '',
					bannerPicture: b.banner.pic_url,
					color: b.banner.bg_color,
					visitCount: b.zhibo_room.visit_count,
					status: b.zhibo_room.status
				}
			})
			// 筛选出直播间状态不是"回看"的房间号[0:'默认',1:'直播中',2:'回看']
			let courseRoomIds = bannerList.map(_ => _.roomId && _.status !== 2)
			getSchedule(courseRoomIds).then((callbackCourseStatus) => {
				if (callbackCourseStatus.length > 0) {
					let originCourseList = [...bannerList]
					originCourseList.forEach(_ => {
						let tar = callbackCourseStatus.find(o => o.roomId === _.roomId)
						if (tar) {
							_.liveStatus = tar.liveStatus
							if (tar.liveStatus === WeChatLiveStatus[103]) {
								updateLiveStatus({
									status: 2, // 2->直播已结束
									zhibo_room_id: _.id
								})
							}
						}
					})

					this.setData({
						bannerList,
						bannerPictureObject: bannerList.length > 0 ? bannerList[0] : null
					})
				}
			})
		})
	},
	/**
	 * 跳转至课程列表
	 */
	navigateToCourse(e) {
		let selectedCourseId = e.currentTarget.dataset.item.id
		wx.navigateTo({
			url: `../../subLive/courseList/courseList?id=${selectedCourseId}`,
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
		if ($notNull(accountInfo)) {
			this.setData({
				didVip: accountInfo.is_zhide_vip
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.getBanner()
		this.queryLiveList()
		if (this.liveStatusIntervalTimer == null) {
			this.liveStatusIntervalTimer = setInterval(() => {
				// 筛选出直播间状态不是"回看"的房间号
				const roomIds = this.data.liveList.map(_ => _.roomId && _.status !== 2)
				getSchedule(roomIds).then(this.handleLiveStatusCallback)
			}, 60 * 1000)
		}
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
		clearInterval(this.data.liveStatusIntervalTimer)
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
		if (this.data.didNoMore) {
			return console.log('没有更多数据～')
		}
		this.queryLiveList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
	},
})
