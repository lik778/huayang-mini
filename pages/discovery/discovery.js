import { $notNull, getLocalStorage, getSchedule, hasAccountInfo, hasUserInfo, } from "../../utils/util"
import { getActivityList, getFindBanner, } from "../../api/course/index"
import { FluentLearnUserType, GLOBAL_KEY, WeChatLiveStatus } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { getYouZanAppId } from "../../api/mall/index"
import { getFluentCardInfo } from "../../api/mine/index"
import {
	addTravelVisitNumber,
	getRecommendLiveList,
	queryQualityVideoList,
	queryTodayRecommendCourse,
	queryTravelList,
	updateLiveStatus
} from "../../api/live/index"
import dayjs from "dayjs"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 0,
		isIosPlatform: false,
		isFluentLearnVIP: false, // 是否是畅学卡会员
		showModelBanner: false,
		didShowAuth: false,
		isModelLink: true,
		bannerList: null,
		canShow: false,
		recommendCourseList: [],
		modelBannerLink: "",
		activityList: null,
		liveList: [],
		travelList: [],
		courseList: [],
		todayRecommendCourse: {},
		previewVideoLink: "",
		previewVideoCover: "",
		weekdays: ['日', '一', '二', '三', '四', '五', '六'],
		liveStatusIntervalTimer: null,
	},
	async run() {
		// 推荐直播间
		let list = await getRecommendLiveList()
		list = list.map(item => ({
			zhiboRoomId: item.id,
			roomId: item.num,
			roomType: item.room_type,
			roomName: item.title.length > 17 ? `${item.title.slice(0, 17)}...` : item.title,
			title: item.title,
			desc: item.desc,
			visitCount: item.visit_count,
			coverPicture: item.cover_pic,
			status: item.status,
			liveStatus: "",
			link: item.link,
			startTime: item.start_time,
			endTime: item.end_time
		}))
		this.setData({liveList: list})
		const roomIds = list.filter(_ => _.roomId).map(t => t.roomId)
		getSchedule(roomIds).then(this.handleLiveStatusCallback)

		// 花样游学
		let travelList = await queryTravelList()
		travelList = travelList.map(n => {
			let t = {...n, covers: n.pics.split(",")}
			if (!t.discount_price) {
				t.discount_price = t.price
				t.price = 0
			}
			return t
		})
		this.setData({travelList})

		// 今日推荐
		let recommendCourse = await queryTodayRecommendCourse()
		if ($notNull(recommendCourse)) {
			let tname = recommendCourse.kecheng_series.name
			recommendCourse.kecheng_series.name = tname.length > 15 ? `${tname.slice(0, 15)}...` : tname
			this.setData({todayRecommendCourse: recommendCourse})
			let lessons = JSON.parse(recommendCourse.kecheng_series.video_detail)
			if (lessons.length > 0) {
				this.setData({previewVideoLink: lessons[0].url, previewVideoCover: lessons[0].video_pic})
			}
			this.initVideoListener()
		}

		// 精品课程
		let params = {offset: 0, limit: 9999}
		if (hasAccountInfo()) {
			params["user_id"] = getLocalStorage(GLOBAL_KEY.userId)
		}

		let courseList = await queryQualityVideoList(params)
		this.setData({courseList})
	},
	// 打开微信授权
	openUserAuth() {
		this.setData({didShowAuth: true})
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
					} else if (tar.liveStatus === WeChatLiveStatus[102]) {
						// 如果微信返回的直播间状态为102-未开始，计算星期
						let originDate = dayjs(_.startTime)
						// let originDate = dayjs("2021-03-13 18:00:00")
						let todayDate = dayjs(dayjs().format("YYYY-MM-DD"))
						let liveStartDate = dayjs(originDate.format("YYYY-MM-DD"))
						let time = originDate.format("HH:mm")
						let firstDayInWeek = todayDate.startOf('week')
						let diffNo = liveStartDate.diff(firstDayInWeek, "day")
						let todayDiffNo = liveStartDate.diff(todayDate, "day")
						switch (todayDiffNo) {
							case 0: {
								_.liveStatus = `今日${time}开播`
								break
							}
							case 1: {
								_.liveStatus = `明日${time}开播`
								break
							}
							default: {
								_.liveStatus = `${diffNo > 7 ? "下周" : "本周"}${this.data.weekdays[diffNo % 7]}${time}开播`
								break
							}
						}
					} else if (tar.liveStatus === WeChatLiveStatus[101]) {
						// 如果微信返回的直播间状态为101-直播中
						updateLiveStatus({
							status: 1, // 1->直播中
							zhibo_room_id: _.zhiboRoomId
						})
					}
				}
			})
			this.setData({liveList: [...originLiveList]})
		}
	},
	initVideoListener() {
		let ob = wx.createIntersectionObserver()
		ob.relativeToViewport({
			top: -50,
			bottom: -50
		})
			.observe('.preview-video', res => {
				if (res && res.intersectionRatio > 0) {
					// 进入可视区域
					let videoInstance = wx.createVideoContext("preview-video-content")
					videoInstance.play()
				} else {
					// 离开可视区域
					let videoInstance = wx.createVideoContext("preview-video-content")
					videoInstance.pause()
				}
			})
	},
	// 请求畅销卡信息
	getFluentInfo() {
		if (!hasUserInfo() || !hasAccountInfo()) return
		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
			this.setData({isFluentLearnVIP: $notNull(data) && data.status === FluentLearnUserType.active})
		})
	},
	onTravelTap(e) {
		let item = e.currentTarget.dataset.item
		let path = item.buy_link
		addTravelVisitNumber({travel_product_id: item.id})
		getYouZanAppId().then(appId => {wx.navigateToMiniProgram({appId, path})})
		bxPoint("homepage_edu_travel_click", {
			edu_travel_id: item.id,
			edu_travel_name: item.name,
			edu_travel_title: item.title,
			edu_travel_ori_price: item.price,
			edu_travel_dis_price: item.discount_price,
			edu_travel_visit_count: item.visit_count,
		}, false)
	},
	onTodayRecommendTap() {
		let item = this.data.todayRecommendCourse.kecheng_series
		wx.navigateTo({url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`, complete() {
				bxPoint("homepage_today_recom_click", {
					is_today_recom: 1,
					series_id: item.id,
					today_recom_id: this.data.todayRecommendCourse.id,
					kecheng_name: item.teacher_desc,
					kecheng_subname: item.name,
				}, false)
			}})
	},
	onMoreTravelLineTap() {
		getYouZanAppId().then(appId => {wx.navigateToMiniProgram({appId, path: "pages/common/blank-page/index?weappSharePath=pages%2Fhome%2Fdashboard%2Findex%3Fkdt_id%3D43257500"})})
		bxPoint("homepage_more_edu_travel_button", {}, false)
	},
	// 获取授权
	getAuth() {
		this.setData({
			didShowAuth: true
		})
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.setData({
			didShowAuth: false,
		})
		this.initToCompetitionFun()
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 获取活动列表
	getActivityList() {
		getActivityList({
			offset: 0,
			limit: 2,
			status: 1
		}).then(res => {
			this.setData({
				activityList: res.list
			})
		})
	},
	// 封装跳转模特大赛事件
	initToCompetitionFun() {
		let activity_id = 29
		let user_id = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id
		let user_grade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
		let baseUrl = `${this.data.modelBannerLink}&user_id=${user_id}&user_grade=${user_grade}`
		baseUrl = encodeURIComponent(baseUrl)
		if (this.data.isModelLink) {
			wx.navigateTo({
				url: `/pages/webViewCommon/webViewCommon?link=${baseUrl}&type=link&isModel=true`,
			})
		} else {
			wx.navigateTo({
				url: this.data.modelBannerLink,
			})
		}
	},
	// 跳转到模特大赛
	toModelCompetition(e) {
		if (hasUserInfo() && hasAccountInfo()) {
			this.setData({
				isModelLink: true,
				modelBannerLink: e.currentTarget.dataset.item.link
			})
			this.initToCompetitionFun()
		} else {
			this.setData({
				didShowAuth: true,
				isModelLink: true,
				modelBannerLink: e.currentTarget.dataset.item.link
			})
		}
	},
	// 处理是否显示模特大赛banner
	initModelBanner() {
		getFindBanner({
			scene: 11
		}).then(res => {
			this.setData({
				competitionBannerList: res,
				showModelBanner: res.length !== 0
			})
		})
	},
	// 处理轮播点击事件
	joinCampFromBanner(e) {
		if (e.currentTarget.dataset.item.need_auth === 1) {
			if (!hasUserInfo() || !hasAccountInfo()) {
				let link = e.currentTarget.dataset.item.link
				this.setData({
					didShowAuth: true,
					modelBannerLink: link,
					isModelLink: false
				})
				return
			}
		}
		let {
			link,
			link_type,
			id
		} = e.currentTarget.dataset.item
		if (link_type === 'youzan') {
			getYouZanAppId().then(appId => {
				wx.navigateToMiniProgram({
					appId,
					path: link,
				})
			})
		} else {
			wx.navigateTo({
				url: link
			})
		}

		bxPoint("homepage_banner", {
			position: 'page/discovery/discovery',
			bannerId: id || ""
		}, false)
	},
	// 获取banner列表
	getBanner() {
		getFindBanner({
			scene: 8
		}).then(bannerList => {

			bannerList = bannerList.filter(b => b.pic_url && b.link)

			this.setData({
				bannerList
			})
		})
	},
	// 检查用户是否引导
	checkUserGuide() {
		if (getApp().globalData.firstViewPage) {
			this._toggleView(100)
			return
		}
		if (getApp().globalData.didVisibleCooPenPage) {
			this._toggleView(100)
			return
		}

		try {
			getFindBanner({
				scene: 16
			}).then((data) => {
				if (data.length > 0) {
					wx.navigateTo({
						url: "/pages/coopen/coopen",
						success(res) {
							getApp().globalData.didVisibleCooPenPage = true
						}
					})
				}
				this._toggleView()
			}).catch(() => {
				this._toggleView()
			})
		} catch (e) {
			this._toggleView()
		}
	},
	_toggleView(timeNo = 300) {
		let t = setTimeout(() => {
			this.setData({
				canShow: true
			})
			clearTimeout(t)
		}, timeNo)
	},
	// 检查ios环境
	checkIos() {
		wx.getSystemInfo({
			success: (res2) => {
				if (res2.platform == 'ios') {
					this.setData({
						isIosPlatform: true
					})
				}
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		// wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=205`})

		let {scene, invite_user_id = "", source} = options
		// 通过小程序码进入 scene=${source}
		if (scene) {
			let sceneAry = decodeURIComponent(scene).split('/')
			let [sceneSource = ''] = sceneAry

			if (sceneSource) {
				getApp().globalData.source = sceneSource
			}
		} else {
			// 通过卡片进入
			if (invite_user_id) {
				getApp().globalData.super_user_id = invite_user_id
			}
			if (source) {
				getApp().globalData.source = source
			}
		}

		// 检查用户是否需要引导
		this.checkUserGuide()
		// 处理ios
		this.checkIos()
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		if (this.data.liveStatusIntervalTimer == null) {
			this.liveStatusIntervalTimer = setInterval(() => {
				// 筛选出直播间状态不是"回看"的房间号
				const roomIds = this.data.liveList.filter(_ => _.roomId).map(t => t.roomId)
				getSchedule(roomIds).then(this.handleLiveStatusCallback)
			}, 60 * 1000)
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}

		this.run()

		this.initModelBanner()

		// 获取banner数据
		this.getBanner()

		// 查询畅学卡信息
		this.getFluentInfo()

		// 获取推荐数据
		let params = {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source,
		}
		// 记录合作资源包打点标识
		if (getApp().globalData.from_co_channel) {
			params.co_channel_tag = 'co_lndx'
			getApp().globalData.from_co_channel = ''
		}
		bxPoint("homepage_visit", params)
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

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
	onReachBottom: function () {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "我在花样百姓，和我一起学习、游玩吧，开心每一天！",
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	}
})
