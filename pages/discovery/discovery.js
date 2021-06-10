import {
	$notNull,
	getLocalStorage,
	getSchedule,
	hasAccountInfo,
	hasUserInfo,
	removeLocalStorage,
	setLocalStorage,
} from "../../utils/util"
import { getActivityList, getFindBanner, getOfflineCourseAllData, getVideoTypeList, } from "../../api/course/index"
import { GLOBAL_KEY, WeChatLiveStatus } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { getYouZanAppId } from "../../api/mall/index"
import { getFluentCardInfo, getFluentLearnInfo } from "../../api/mine/index"
import {
	addTravelVisitNumber,
	getDiscoveryRemindData,
	getRecommendLiveList,
	queryQualityVideoList,
	queryTodayRecommendCourse,
	queryTravelList,
	updateLiveStatus
} from "../../api/live/index"
import dayjs from "dayjs"
import request from "../../lib/request"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 0,
		isIosPlatform: false,
		showModelBanner: false,
		didShowAuth: false,
		isModelLink: true,
		bannerList: null,
		canShow: false,
		recommendCourseList: [],
		modelBannerLink: "",
		activityList: null,
		kingKongs: [],
		offlineList: [],
		liveList: [],
		travelList: [],
		courseList: [],
		competitionBannerList: [],
		todayRecommendCourse: {},
		previewVideoLink: "",
		previewVideo: null,
		weekdays: ['日', '一', '二', '三', '四', '五', '六'],
		liveStatusIntervalTimer: null,
		didShowInformation: false,
		showInformationPopAnime: false,
		popData: {}, // 弹窗数据
		didShowContact: false,
		didFluentCardUser: false, // 是否是花样大学学生
		didShowGuide: false, // 是否展示入群引导
		didExecuteGuideAnimation: false, // 是否执行入群引导动画
		collegeVideoUrl: undefined, // 大学宣传视频地址
		collegeVideoPost: "", // 大学宣传视频封面图
		isCollegeVideoPlaying: false, // 大学宣传视频是否正在播放
		didLoadSecondMain: false, // 是否完成第二部分数据内容加载
		didShowFluentLearnModal: false, // 畅学卡引导弹窗
		_rejectModelCompetitionReload: false, // 授权成功是否跳过模特大赛相关函数
	},
	async run() {
		// 请求花样大学首页弹窗任务
		getDiscoveryRemindData().then((data) => {
			if (!$notNull(data.remind)) return
			data.kecheng = $notNull(data.kecheng) ? data.kecheng : {}
			data.teacher = $notNull(data.teacher) ? data.teacher : {}
			let popData = {
				id: data.kecheng.id,
				type: data.remind.remind_type,
				picture: data.remind.pic_url,
				name: `${data.teacher.name} ${data.teacher.teacher_desc}`,
				avatar: data.teacher.avatar,
				title: data.kecheng.teacher_desc,
				desc: data.kecheng.name,
				popTitle: data.remind.title.slice(0, 9),
			}
			if (data.remind.pic_width && data.remind.pic_height) {
				popData["pictureRatio"] = data.remind.pic_width / data.remind.pic_height
				popData["link"] = data.remind.link
			}
			this.setData({popData})
			let key = `hy_remind_${data.remind.id}_expire_time`
			let old_remind_expire_time = getLocalStorage(key)
			if (old_remind_expire_time) {
				// 存在
				if (dayjs(old_remind_expire_time).isAfter(dayjs())) {
					// 未过期
				} else {
					// 过期
					removeLocalStorage(key)
					let t = setTimeout(() => {
						this.openInformationPop()
						clearTimeout(t)
					}, 1000)
				}
			} else {
				// 不存在
				setLocalStorage(key, data.remind.expire_time)
				let t = setTimeout(() => {
					this.openInformationPop()
					clearTimeout(t)
				}, 1000)
			}
		})

		// 获取banner数据
		let bannerList = await this.getBanner()
		bannerList = bannerList.filter(b => b.pic_url && b.link)
		this.setData({bannerList})

		// 金刚位
		let kingKongs = await getVideoTypeList()
		this.setData({kingKongs})

		// 获取畅学卡权益信息
		let {data: {video: collegeVideoUrl, video_cover: collegeVideoPost}} = await getFluentLearnInfo()
		this.setData({
			collegeVideoUrl: collegeVideoUrl ? collegeVideoUrl : undefined,
			collegeVideoPost
		})
		if (collegeVideoUrl) {
			this.initCollegeIntroVideoListener()
		}

		// 检查用户身份
		if (hasUserInfo() && hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			let {data: fluentCardInfo} = await getFluentCardInfo({user_snow_id: accountInfo.snow_id})
			this.setData({didFluentCardUser: !!fluentCardInfo})
		}

		// 直播
		let list = await getRecommendLiveList()
		list = list.map(item => {
			item.liveStatus = this.calcStartTime(item.start_time)
			return {
				zhiboRoomId: item.id,
				roomId: item.num,
				roomType: item.room_type,
				roomName: item.title.length > 17 ? `${item.title.slice(0, 17)}...` : item.title,
				title: item.title,
				desc: item.desc,
				visitCount: item.visit_count,
				coverPicture: item.cover_pic,
				status: item.status,
				liveStatus: item.liveStatus,
				link: item.link,
				startTime: item.start_time,
				endTime: item.end_time
			}
		})
		this.setData({liveList: list})
		const roomIds = list.filter(_ => _.roomId).map(t => t.roomId)
		getSchedule(roomIds).then(this.handleLiveStatusCallback)

		// 线下乐活课程
		let {data: offlineList} = await getOfflineCourseAllData()
		this.setData({
			offlineList: offlineList.map(n => (({
				...n,
				price: n.price / 100,
				discount_price: n.discount_price / 100,
				cover: n.cover_pic.split(",")[0]
			})))
		})

		// 花样游学
		let travelList = await queryTravelList()
		travelList = travelList.map(n => {
			let t = {...n, covers: n.pics.split(",")}
			if (t.discount_price <= 0) {
				t.discount_price = t.price
				t.price = 0
			}
			return t
		})
		this.setData({travelList})

		this.travelLayoutListener()
	},
	// 监听游学板块是否进入可视区域
	travelLayoutListener() {
		let travelOB = wx.createIntersectionObserver()
		travelOB.relativeToViewport({
			top: -50,
			bottom: -50
		})
			.observe('.travel', res => {
				if (res && res.intersectionRatio > 0) {
					// 进入可视区域
					this.runSecondMain()
				}
			})
	},
	async runSecondMain() {
		if (this.data.didLoadSecondMain) return
		this.setData({didLoadSecondMain: true})
		// 校友活动
		let {list: activityList} = await getActivityList({
			status: 1,
			offset: 0,
			limit: 9999,
			colleage_activity: 1,
			platform: 1,
			sort: "rank"
		})
		this.setData({activityList})

		// 今日推荐
		let recommendCourse = await queryTodayRecommendCourse()
		if ($notNull(recommendCourse)) {
			let tname = recommendCourse.kecheng_series.name
			recommendCourse.kecheng_series.name = tname.length > 15 ? `${tname.slice(0, 15)}...` : tname
			this.setData({todayRecommendCourse: recommendCourse})
			let lessons = JSON.parse(recommendCourse.kecheng_series.video_detail)
			if (lessons.length > 0) {
				this.setData({previewVideoLink: lessons[0].url})
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

		// 模特大赛
		this.initModelBanner()
	},
	// 计算开播时间
	calcStartTime(datetime) {
		let result = ""
		let originDate = dayjs(datetime)
		let todayDate = dayjs(dayjs().format("YYYY-MM-DD"))
		let liveStartDate = dayjs(originDate.format("YYYY-MM-DD"))
		let time = originDate.format("HH:mm")
		let firstDayInWeek = todayDate.startOf('week')
		let diffNo = liveStartDate.diff(firstDayInWeek, "day")
		let todayDiffNo = liveStartDate.diff(todayDate, "day")
		switch (todayDiffNo) {
			case 0: {
				result = `今日${time}开播`
				break
			}
			case 1: {
				result = `明日${time}开播`
				break
			}
			default: {
				result = `${diffNo > 7 ? "下周" : "本周"}${this.data.weekdays[diffNo % 7]}${time}开播`
				break
			}
		}
		return result
	},
	onGuideTap() {
		this.setData({didShowContact: true})
		bxPoint("homepage_activities_group_join", {}, false)
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
						// 如果微信返回的直播间状态为102-未开始
						_.liveStatus = this.calcStartTime(_.startTime)
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
	// 初始化今日推荐视频，进入离开可视区域监听事件
	initVideoListener() {
		let previewOB = wx.createIntersectionObserver()
		previewOB.relativeToViewport({
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
	// 初始化大学宣传视频，进入离开可视区域监听事件
	initCollegeIntroVideoListener() {
		let collegeOB = wx.createIntersectionObserver()
		collegeOB.relativeToViewport({
			top: 0,
			bottom: 0
		})
			.observe('#hy-video-content', res => {
				if (res && res.intersectionRatio > 0) {
					// 进入可视区域
				} else {
					// 离开可视区域
					this.onPauseCollegeVideo()
				}
			})
	},
	// 播放花样大学介绍视频
	onPlayCollegeVideo() {
		this.data.previewVideo.play()
		this.setData({isCollegeVideoPlaying: true})
		bxPoint("homepage_introduction_start", {}, false)
	},
	onPauseCollegeVideo() {
		this.data.previewVideo.pause()
		this.setData({isCollegeVideoPlaying: false})
		bxPoint("homepage_introduction_end", {}, false)
	},
	// 跳转到线下精品课详情页
	goToOfflineCourseDetail(e) {
		let {id, title, price, discount_price} = e.currentTarget.dataset.item
		wx.navigateTo({
			url: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${id}`,
			complete() {
				bxPoint("homepage_offline_series", {
					series_offline_id: id,
					series_offline_name: title,
					series_offline_ori_price: price,
					series_offline_dis_price: discount_price,
				}, false)
			}
		})
	},
	onTravelTap(e) {
		let item = e.currentTarget.dataset.item
		addTravelVisitNumber({travel_product_id: item.id})

		// 跳转花样游学小程序
		wx.navigateToMiniProgram({
			appId: "wx2ea757d51abc1f47",
			path: item.buy_link,
		})

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
		let self = this
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`, complete() {
				bxPoint("homepage_today_recom_click", {
					is_today_recom: 1,
					series_id: item.id,
					today_recom_id: self.data.todayRecommendCourse.id,
					kecheng_name: item.teacher_desc,
					kecheng_subname: item.name,
				}, false)
			}
		})
	},
	onMoreTravelLineTap() {
		wx.navigateToMiniProgram({
			appId: "wx2ea757d51abc1f47",
			path: "pages/index/index"
		})
		bxPoint("homepage_more_edu_travel_button", {}, false)
	},
	// 点击金刚位
	onKingKongTap(e) {
		let {id, value} = e.currentTarget.dataset.item
		getApp().globalData.discoveryToPracticeTabIndex = id - 1
		wx.nextTick(() => {
			wx.switchTab({
				url: `/pages/practice/practice`,
				complete() {
					bxPoint("homepage_tab_button", {tab_tag: value}, false)
				}
			})
		})
	},
	// 打开入群引导弹窗
	openGuide() {
		this.setData({didShowGuide: true})
		wx.nextTick(() => {
			this.setData({didExecuteGuideAnimation: true})
		})
	},
	// 关闭入群引导弹窗
	closeGuide() {
		this.setData({didExecuteGuideAnimation: false})
		let t = setTimeout(() => {
			this.setData({didShowGuide: false})
			clearTimeout(t)
		}, 300)
		setLocalStorage(GLOBAL_KEY.discoveryGuideExpiredAt, dayjs(`${dayjs().year()}-${dayjs().month() + 1}-${dayjs().date()} 23:59:59`).format("YYYY-MM-DD HH:mm:ss"))
		bxPoint("homepage_activities_group_join_close", {}, false)
	},
	// 大学活动点击
	onCollegeActivityTap(e) {
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({_rejectModelCompetitionReload: true, didShowAuth: true})
		}
		let {id: activityId, title, start_time, end_time} = e.currentTarget.dataset.item
		bxPoint("homepage_activities", {
			activities_id: activityId,
			activities_name: title,
			activities_start_time: start_time,
			activities_end_time: end_time
		}, false)
		if (activityId) {
			if (this.data.didFluentCardUser) {
				let link = `${request.baseUrl}/#/home/detail/${activityId}`
				wx.navigateTo({
					url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}&didUserIsFluentCardMember=yes`
				})
			} else {
				this.setData({didShowFluentLearnModal: true})
			}
		}
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
		if (!this.data._rejectModelCompetitionReload) {
			this.initToCompetitionFun()
			this.setData({_rejectModelCompetitionReload: false})
		}
		// 检查用户身份
		if (hasUserInfo() && hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data: fluentCardInfo}) => {
				this.setData({didFluentCardUser: !!fluentCardInfo})
			})
		}
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
		let { link, title } = e.currentTarget.dataset.item
		bxPoint("homepage_show", {show_name: title, show_link: link}, false)
		if (hasUserInfo() && hasAccountInfo()) {
			this.setData({
				isModelLink: true,
				modelBannerLink: link
			})
			this.initToCompetitionFun()
		} else {
			this.setData({
				didShowAuth: true,
				isModelLink: true,
				modelBannerLink: link
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
		return getFindBanner({
			scene: 8
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
						success() {
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
			success: (res) => {
				if (res.platform === 'ios') {
					this.setData({
						isIosPlatform: true
					})
				}
			}
		})
	},
	onInformationPopTap() {
		let item = this.data.popData
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`,
			complete() {
				bxPoint("new_series_join", {
					series_id: item.id,
					kecheng_name: item.name
				}, false)
			}
		})
	},
	onCatchtouchmove() {
		return false
	},
	openInformationPop() {
		this.setData({didShowInformation: true})
		wx.nextTick(() => {
			this.setData({showInformationPopAnime: true})
		})
		bxPoint("new_series_visit", {
			series_id: this.data.popData.id,
			kecheng_name: this.data.popData.name
		})
	},
	closeInformationPop() {
		this.setData({showInformationPopAnime: false})
		let t = setTimeout(() => {
			this.setData({didShowInformation: false})
			clearTimeout(t)
		}, 400)
	},
	jumpToLink() {
		let link = this.data.popData.link
		if (link) {
			wx.navigateTo({
				url: link,
				fail() {
					wx.switchTab({url: link})
				}
			})
		}
	},
	goToJoinFluentCardPage() {
		if (this.data.isCollegeVideoPlaying) {
			this.onPauseCollegeVideo()
		}

		wx.nextTick(() => {
			wx.navigateTo({
				url: "/mine/joinFluentLearn/joinFluentLearn",
				complete() {
					bxPoint("homepage_join_huayang", {}, false)
				}
			})
		})
	},
	// 通过宣传视频进入畅学卡权益页
	goToJoinFluentCardPageByIntroVideo() {
		if (this.data.isCollegeVideoPlaying) {
			this.onPauseCollegeVideo()
		}

		wx.nextTick(() => {
			wx.navigateTo({
				url: "/mine/joinFluentLearn/joinFluentLearn",
				complete() {
					bxPoint("homepage_introduction_link", {}, false)
				}
			})
		})
	},
	// 关闭联系客服
	onCloseContactModal() {
		this.setData({
			didShowContact: false
		})
	},
	// 非花样畅学卡用户访问校友活动需要引导购买畅学卡
	onFluentLearnTap() {
		wx.navigateTo({url: "/mine/joinFluentLearn/joinFluentLearn"})
	},
	onFluentLearnCloseTap() {
		this.setData({didShowFluentLearnModal: false})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=247`})

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

		this.data.previewVideo = wx.createVideoContext("hy-video-content", this)

		// 04-22晚上9点前不显示入群引导
	  const time = getApp().globalData.showContactEnterTime
		if (dayjs().isBefore(dayjs(time))) return

		// 入群引导
		let guideExpiredAt = getLocalStorage(GLOBAL_KEY.discoveryGuideExpiredAt)
		if (!guideExpiredAt || dayjs(guideExpiredAt).isBefore(dayjs())) {
			let t = setTimeout(() => {
				this.openGuide()
				clearTimeout(t)
			}, 1000)
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
	onHide: function () {
		if (this.data.didShowInformation) {
			this.closeInformationPop()
		}

		if (this.data.didShowFluentLearnModal) {
			this.setData({didShowFluentLearnModal: false})
		}
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
	},
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
