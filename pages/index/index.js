// pages/live/live.js
import { getLiveBannerList, getLiveList, setPoint, updateLiveStatus } from "../../api/live/index"
import { GLOBAL_KEY, SHARE_PARAMS, WeChatLiveStatus } from '../../lib/config'
import { $notNull, checkIdentity, getLocalStorage, getSchedule, setLocalStorage } from '../../utils/util'
import { statisticsWatchNo } from "../../api/live/course"
import { bindWxPhoneNumber } from "../../api/auth/index"
import { checkAuth } from "../../utils/auth"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import { getUserInfo } from "../../api/mine/index"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 页面打点参数，用于打点sdk劫持onshow钩子时自动PV打点
		__shareParams: {
			page_type: SHARE_PARAMS.pageType.common,
			page_level: SHARE_PARAMS.pageLevel.tabBarPage,
			page_title: "直播首页"
		},
		show: false,
		WeChatLiveStatus,
		schedule: [],
		customParams: {},
		bannerPictureObject: null,
		bannerList: [],
		liveList: [],
		liveListOffset: 0,
		liveListLimit: 10,
		didNoMore: false,
		didVip: false,
		liveStatusIntervalTimer: null,
		alertInfo: null,
		showSuccess: false, //成为超级会员弹窗
		indicatorDots: false,
		vertical: false,
		autoplay: false,
		interval: 2000,
		duration: 500,
	},
	// 处理swiper点击回调
	handleSwiperTap(e) {
		let {bannerId} = e.currentTarget.dataset.item
		// 打点
		setPoint({banner_id: bannerId})
		wx.navigateTo({url: this.data.bannerPictureObject.link})
	},
	// 关闭立即邀请
	onClickHide() {
		this.setData({
			showSuccess: false
		})
	},
	/**
	 * 一键获取微信手机号
	 * @param e
	 */
	async getPhoneNumber(e) {
		if (!e) return
		let {
			errMsg = '', encryptedData: encrypted_data = '', iv = ''
		} = e.detail
		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({
					open_id,
					encrypted_data,
					iv
				})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			}
		} else {
			console.error('用户拒绝手机号授权')
		}
	},
	/**
	 * 跳转到微信直播页面
	 * @param e
	 */
	navigateToLive(e) {
		checkAuth({listenable: true, ignoreFocusLogin: true}).then(() => {
			let {zhiboRoomId, roomId, link, vipOnly} = e.currentTarget.dataset.item
			// 当前课程是否仅限VIP用户学习
			if (vipOnly === 1) {
				// 判断是否是会员/是否入学
				checkIdentity({
					roomId,
					link,
					zhiboRoomId
				}).then((callbackString) => {
					if (callbackString === 'no-phone-auth') {
						this.setData({show: true})
					} else if (callbackString === 'no-auth-daxue') {
						Dialog.confirm({
							title: '申请入学立即观看',
							message: '完成入学信息登记，观看课程'
						}).then(() => {
							wx.navigateTo({
								url: '/mine/joinSchool/joinSchool',
							})
						}).catch(() => {})
					}
				})
			}
			else {
				statisticsWatchNo({
					zhibo_room_id: zhiboRoomId, // 运营后台配置的课程ID
					open_id: getLocalStorage(GLOBAL_KEY.openId)
				}).then(() => {
					// link存在去跳转回看页
					if (link) {
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
			}
		})
	},
	/**
	 * 跳转至课程列表
	 */
	navigateToCourse(e) {
		let {officialRoomId,bannerId} = e.currentTarget.dataset.item
		// 打点
		setPoint({banner_id: bannerId})
		wx.navigateTo({
			url: `/subLive/courseList/courseList?id=${officialRoomId}`,
		})
	},
	/**
	 * 请求直播间列表
	 */
	queryLiveList() {
		getLiveList({
			limit: this.data.liveListLimit,
			offset: this.data.liveListOffset,
			open_id: getLocalStorage(GLOBAL_KEY.openId)
		}).then((data) => {
			data = data || []
			if (data.length < this.data.liveListLimit) {
				this.data.didNoMore = true
			}
			const result = data.map(item => {
				return {
					zhiboRoomId: item.zhibo_room.id,
					roomId: item.zhibo_room.num,
					roomType: item.zhibo_room.room_type,
					roomName: item.zhibo_room.title,
					userId: item.zhibo_room.user_id,
					visitCount: item.zhibo_room.visit_count,
					coverPicture: item.zhibo_room.cover_pic,
					sharePicture: item.zhibo_room.share_pic,
					status: item.zhibo_room.status,
					liveStatus: '',
					link: item.zhibo_room.link,
					vipOnly: item.zhibo_room.vip_only,
					avatar: item.user && item.user.avatar_url ? item.user.avatar_url : 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586332410GvsWnF.jpg',
					author: item.user && item.user.nick_name ? item.user.nick_name : '主播',
				}
			})
			// 筛选出直播间状态不是"回看"的房间号
			const roomIds = result.filter(_ => _.roomId && _.status !== 2).map(t => t.roomId)

			getSchedule(roomIds).then(this.handleLiveStatusCallback)
			let arr = [...this.data.liveList, ...result]
			this.setData({
				liveList: arr,
				liveListOffset: arr.length
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
				if (tar && _.status !== 2) {
					// status -> [0：默认；1：直播中；2：直播已结束]
					_.liveStatus = tar.liveStatus
					if (tar.liveStatus === WeChatLiveStatus[103]) {
						// 如果微信返回的直播间状态为103-已过期
						updateLiveStatus({
							status: 2, // 2->直播已结束
							zhibo_room_id: _.zhiboRoomId
						})
					} else if (tar.liveStatus === WeChatLiveStatus[104] || tar.liveStatus === WeChatLiveStatus[107]) {
						// 如果微信返回的直播间状态为104、107-禁播、已过期
						updateLiveStatus({
							status: 3, // 3->直播禁播或删除
							zhibo_room_id: _.zhiboRoomId
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
				if (b.zhibo_room && b.kecheng && b.user) {
					return {
						bannerId: b.banner.id,
						zhiboRoomId: b.zhibo_room.id,
						officialRoomId: b.kecheng.user_id,
						roomId: b.zhibo_room.num,
						roomType: b.zhibo_room.room_type,
						author: b.user.nick_name,
						name: b.banner.title ? b.banner.title.split('\\n').join('\n') : '',
						bannerPicture: b.banner.pic_url,
						color: b.banner.bg_color,
						link: b.banner.link,
						visitCount: b.zhibo_room.visit_count,
						status: b.zhibo_room.status,
					}
				} else {
					return {
						bannerId: b.banner.id,
						bannerPicture: b.banner.pic_url,
						link: b.banner.link
					}
				}
			})
			this.setData({
				bannerList,
				bannerPictureObject: bannerList.length > 0 ? bannerList[0] : null
			})
			// 筛选出直播间状态不是"回看"的房间号[0:'默认',1:'直播中',2:'回看']
			let courseRoomIds = bannerList.filter(_ => _.roomId && _.status !== 2).map(t => t.roomId)
			getSchedule(courseRoomIds).then(callbackCourseStatus => {
				if (callbackCourseStatus.length > 0) {
					let originCourseList = [...bannerList]
					originCourseList.forEach(_ => {
						let tar = callbackCourseStatus.find(o => o.roomId === _.roomId)
						// status -> [0：默认；1：直播中；2：直播已结束]
						if (tar && _.status !== 2) {
							_.liveStatus = tar.liveStatus
							if (tar.liveStatus === WeChatLiveStatus[103]) {
								updateLiveStatus({
									status: 2, // 2->直播已结束
									zhibo_room_id: _.zhiboRoomId
								})
							} else if (tar.liveStatus === WeChatLiveStatus[104] || tar.liveStatus === WeChatLiveStatus[107]) {
								// 如果微信返回的直播间状态为104、107-禁播、已过期
								updateLiveStatus({
									status: 3, // 3->直播禁播或删除
									zhibo_room_id: _.zhiboRoomId
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
	invite() {
		// dotByUserClick({component: SHARE_PARAMS.component.btn, click_type: SHARE_PARAMS.clickType.url})
		wx.navigateTo({
			url: '/mine/invite/invite'
		})
	},
	// 检查是否第一次成为会员
	checkBecomeVipData() {
		// GLOBAL_KEY.vip为true代表已经请求过接口不再请求接口了
		if (getLocalStorage(GLOBAL_KEY.vip)) {
			checkBecomeVip(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(res => {
				setLocalStorage(GLOBAL_KEY.vip, false)
				if (res) {
					this.setData({
						showSuccess: res
					})
				}
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
				const roomIds = this.data.liveList.filter(_ => _.roomId && _.status !== 2).map(t => t.roomId)
				getSchedule(roomIds).then(this.handleLiveStatusCallback)
			}, 60 * 1000)
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (getLocalStorage(GLOBAL_KEY.vipBack)) {
			setLocalStorage(GLOBAL_KEY.vipBack, false)
			wx.redirectTo({
				url: '/mine/contact/contact',
			})
		} else {
			if (getLocalStorage(GLOBAL_KEY.userId)) {
				this.checkBecomeVipData()
			}
		}
		// 检查本地账户信息
		let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
		if ($notNull(accountInfo)) {
			getUserInfo("scene=zhide").then(info => {
				setLocalStorage(GLOBAL_KEY.accountInfo, info)
				this.setData({
					didVip: info.is_zhide_vip
				})
			})
		}

		checkAuth({
			listenable: true
		})
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
		return {
			title: "花样直播",
			path: '/pages/index/index',
		}
	},
})
