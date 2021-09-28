import {
	$notNull,
	getLocalStorage,
	getSchedule,
	hasAccountInfo,
	hasUserInfo,
	removeLocalStorage,
	setLocalStorage,
	shuffle
} from "../../utils/util"
import {
	getActivityList,
	getFindBanner,
	getOfflineCourseAllData,
} from "../../api/course/index"
import {
	getBannerList
} from "../../api/mall/index"
import {
	GLOBAL_KEY,
	WeChatLiveStatus
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import {
	addTravelVisitNumber,
	getDiscoveryRemindData,
	getGoodMorningBgTemplate,
	getIndexHeaderVideoList,
	getNewActivityList,
	getRecommendLiveList,
	queryQualityVideoList,
	queryRecentTravelList,
	updateLiveStatus
} from "../../api/live/index"
import dayjs from "dayjs"
import request from "../../lib/request"
const App = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isIosPlatform: false,
		showModelBanner: false,
		didShowAuth: false,
		isModelLink: true,
		canShow: false,
		recommendCourseList: [],
		modelBannerLink: "",
		activityList: null,
		offlineList: [],
		liveList: [],
		travelList: [],
		courseList: [],
		competitionBannerList: [],
		todayRecommendCourse: {},
		previewVideo: null,
		weekdays: ['日', '一', '二', '三', '四', '五', '六'],
		liveStatusIntervalTimer: null,
		didShowInformation: false,
		showInformationPopAnime: false,
		popData: {}, // 弹窗数据
		didShowContact: false,
		didLoadSecondMain: false, // 是否完成第二部分数据内容加载
		didShowFluentLearnModal: false, // 畅学卡引导弹窗
		_rejectModelCompetitionReload: false, // 授权成功是否跳过模特大赛相关函数
		advertisementList: '', //广告位数据列表
		advertisementImageHeight: 115, //广告位图片高;默认为设计图的115px
		fixedSiteList: [{
			icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629776383tAOPGh.jpg",
			title: '每日签到'
		}, {
			icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629776327cCfZLZ.jpg",
			title: '精品课程'
		}, {
			icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1629776397YvDIih.jpg",
			title: '城市慢游'
		}], //金刚位列表
		showGoodMorningNoticePopup: false, //显示早上好金刚位高亮提示框
		showGoodMoringPopup: false, //显示早上好弹窗(是否在播放视频过程中,true代表不在)
		nowDate: '', //当前日期（月+日）- 花样最新活动
		newActivityList: [], //花样最新活动列表
		goodMorningPopupBg: "", //早上好弹窗背景图
		needShowGoodMorningPopup: false, //是否显示早上好弹窗(本地缓存是否显示过+是否在显示时间段内)
		newActivityVideoPlayIndex: -1, //花样最新活动当前播放视频下标
		newActivityVideoPlaying: false, //花样最新活动视频是否在播放中
		showGoodMorningRedDot: false, //金刚位每日签到红点提示
		enterFullNewActivityVideo: false, //最新活动视频是否进入全屏
		headerVideoPagination: {
			offset: 0,
			limit: 30
		},
		swiperVideoList: [],
		headerVideoPaginationTrue: true,
		showGuideCollection: '', //引导用户收藏小程序卡片
		firstEnterTime: ''
	},

	/* 初始化引导收藏小程序卡片状态 */
	initGuideColletionStatus() {
		let status = getLocalStorage("need_show_guide_collection") ? false : true
		if (status) {
			this.setData({
				showGuideCollection: 1
			}, () => {
				setLocalStorage('need_show_guide_collection', new Date().getTime())
			})
		}
	},

	/* 点击切换引导收藏小程序卡片样式 */
	changeGuideCollectionStatus() {
		this.setData({
			showGuideCollection: 2
		})
	},

	/* 关闭引导收藏小程序卡片样式 */
	closeGuideCollection() {
		this.setData({
			showGuideCollection: ""
		})
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
			this.setData({
				popData
			})
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
		this.setData({
			liveList: list
		})
		const roomIds = list.filter(_ => _.roomId).map(t => t.roomId)
		getSchedule(roomIds).then(this.handleLiveStatusCallback)

		// 线下乐活课程
		let {
			data: offlineList
		} = await getOfflineCourseAllData()
		this.setData({
			offlineList: offlineList.map(n => (({
				...n,
				price: n.price / 100,
				discount_price: n.discount_price / 100,
				cover: n.cover_pic.split(",")[0]
			})))
		})

		// 花样游学
		let travelList = await queryRecentTravelList({
			limit: 99999
		})
		travelList = travelList.map(n => {
			let t = {
				...n,
				covers: n.pics.split(",")
			}
			if (t.discount_price <= 0) {
				t.discount_price = t.price
				t.price = 0
			}
			return t
		})
		this.setData({
			travelList
		})

		// this.travelLayoutListener()
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
		this.setData({
			didLoadSecondMain: true
		})
		// 校友活动
		let {
			list: activityList
		} = await getActivityList({
			status: 1,
			offset: 0,
			limit: 9999,
			colleage_activity: 1,
			platform: 1,
			sort: "rank"
		})
		this.setData({
			activityList
		})

		// 精品课程
		let params = {
			offset: 0,
			limit: 9999
		}
		if (hasAccountInfo()) {
			params["user_id"] = getLocalStorage(GLOBAL_KEY.userId)
		}
		let courseList = await queryQualityVideoList(params)
		this.setData({
			courseList
		})

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
	// 打开微信授权
	openUserAuth() {
		this.setData({
			didShowAuth: true
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
			this.setData({
				liveList: [...originLiveList]
			})
		}
	},
	// 跳转到线下精品课详情页
	goToOfflineCourseDetail(e) {
		let {
			id,
			title,
			price,
			discount_price
		} = e.currentTarget.dataset.item
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
		addTravelVisitNumber({
			travel_product_id: item.id
		})

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
	onMoreTravelLineTap() {
		wx.navigateToMiniProgram({
			appId: "wx2ea757d51abc1f47",
			path: "pages/index/index"
		})
		bxPoint("homepage_more_edu_travel_button", {}, false)
	},
	// 大学活动点击
	onCollegeActivityTap(e) {
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({
				_rejectModelCompetitionReload: true,
				didShowAuth: true
			})
		}
		let {
			id: activityId,
			title,
			start_time,
			end_time
		} = e.currentTarget.dataset.item
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
				this.setData({
					didShowFluentLearnModal: true
				})
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
			this.setData({
				_rejectModelCompetitionReload: false
			})
		}
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
		let {
			link,
			title
		} = e.currentTarget.dataset.item
		bxPoint("homepage_show", {
			show_name: title,
			show_link: link
		}, false)
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
			// 记录首次加载时长
			if (this.data.showGuideCollection !== '') {
				bxPoint("new_homepage_first_loading", {
					first_loading_num: (new Date().getTime() - this.data.firstEnterTime + 100) + "ms"
				})
			}
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
		this.setData({
			didShowInformation: true
		})
		wx.nextTick(() => {
			this.setData({
				showInformationPopAnime: true
			})
		})
		bxPoint("new_series_visit", {
			series_id: this.data.popData.id,
			kecheng_name: this.data.popData.name
		})
	},
	closeInformationPop() {
		this.setData({
			showInformationPopAnime: false
		})
		let t = setTimeout(() => {
			this.setData({
				didShowInformation: false
			})
			clearTimeout(t)
		}, 400)
	},
	jumpToLink() {
		let link = this.data.popData.link
		if (link) {
			wx.navigateTo({
				url: link,
				fail() {
					wx.switchTab({
						url: link
					})
				}
			})
		}
	},
	// 关闭联系客服
	onCloseContactModal() {
		this.setData({
			didShowContact: false
		})
	},
	// 非花样畅学卡用户访问校友活动需要引导购买畅学卡
	onFluentLearnTap() {
		wx.navigateTo({
			url: "/mine/joinFluentLearn/joinFluentLearn"
		})
	},
	onFluentLearnCloseTap() {
		this.setData({
			didShowFluentLearnModal: false
		})
	},
	/* 获取花样最新活动相关数据 */
	async getNewActivityData() {
		let link = "https://huayang-img.oss-cn-shanghai.aliyuncs.com/zw_playbill/" + (await getGoodMorningBgTemplate()).data.photo[0] + ".jpg"
		getNewActivityList({
			status: 1,
			path: 2
		}).then(res => {
			let list = res.data.list || []
			if (list.length) {
				list.map(item => {
					item.time = item.time ? item.time.split('-')[1] + '月' + item.time.split('-')[2] + "日" : ''
				})
			}
			this.setData({
				newActivityList: list,
				goodMorningPopupBg: link + "?x-oss-process=style/huayang",
				nowDate: (dayjs().month() + 1 < 10 ? '0' + (dayjs().month() + 1) : dayjs().month() + 1) + '.' + dayjs().date()
			})
		})
	},
	/* 花样最新活动点击 */
	newActivityItemTap(e) {
		let meta = e.currentTarget.dataset.meta
		/* 最新活动点击打点 */
		bxPoint("new_homepage_activity_click", {
			activity_content_id: meta.id,
			activity_content_category: meta.type,
			activity_content_date: meta.time,
			activity_content_title: meta.title,
			activity_content_type: meta.video_url ? 2 : 1,
		}, false)
		let type = e.currentTarget.dataset.type
		let item = e.currentTarget.dataset.item
		let rootPage = ['/pages/discovery/discovery', '/pages/studentMoments/studentMoments', '/pages/practice/practice', '/pages/userCenter/userCenter']
		if (type === 1) {
			/* 跳转花样大学小程序 */
			if (item.indexOf(rootPage) === -1) {
				wx.navigateTo({
					url: item,
				})
			} else {
				wx.switchTab({
					url: item,
				})
			}
		} else if (type === 2) {
			/* 跳转花样游学小程序 */
			wx.navigateToMiniProgram({
				appId: "wx2ea757d51abc1f47",
				path: item,
			})
		} else {
			/* 跳转h5 */
			wx.navigateTo({
				url: `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(item)}`,
			})
		}

	},
	/* 初始化是否显示早上好弹窗 */
	initShowGoodmorningPopup() {
		let video = this.selectComponent(`#videoSwiper`)
		if (video.__data__.playingVideo || this.data.didShowInformation) {
			return
		}
		// 不在播放视频
		let todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 //当天0点
		let secondDayTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 86400 //第二天0点
		let nowTime = parseInt(new Date().getTime() / 1000) //当前时间-s
		let nowHour = new Date().getHours() //当前小时数
		let localTime = getLocalStorage("good_morning_expire_at") || '' //本次缓存上次显示弹窗的时间
		if (3 < nowHour && nowHour < 11) {
			// 当天4-10点内显示
			if (!localTime) {
				setLocalStorage("good_morning_expire_at", nowTime)
				this.setData({
					needShowGoodMorningPopup: true
				})
			} else {
				if (localTime > todayStartTime && localTime < secondDayTime) {
					// 当天已显示弹窗
				} else {
					setLocalStorage("good_morning_expire_at", nowTime)
					this.setData({
						needShowGoodMorningPopup: true
					})
				}
			}
		}
	},
	/* 关闭早上好弹窗 */
	closeGoodMorningPopup() {
		/* 早安签到弹窗右上角退出点击 */
		bxPoint("new_homepage_morning_exit_click", {}, false)
		this.setData({
			needShowGoodMorningPopup: false
		})
	},
	/* 早上好弹窗点击立即签到；高亮金刚位 */
	showGoodMorningHighLight() {
		/* 早安签到弹窗"早安签到"按钮点击打点 */
		bxPoint("new_homepage_morning_sign_click", {}, false)
		// 花样早上好优化版本
		let isDev = request.baseUrl === 'https://dev.huayangbaixing.com' ? true : false
		let link = isDev ? 'https://dev.huayangbaixing.com/#/signIn/playbill/miniprogram' : 'https://huayang.baixing.com/#/signIn/playbill/miniprogram'
		let nowTime = parseInt(new Date().getTime() / 1000) //当前时间-s
		setLocalStorage("good_morning_click_time", nowTime)
		this.setData({
			showGoodMorningRedDot: false
		})
		wx.navigateTo({
			url: `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(link)}`,
		})

		// const query = wx.createSelectorQuery()
		// query.select('#first-screen').boundingClientRect().exec(res => {
		// 	wx.pageScrollTo({
		// 		duration: 50,
		// 		scrollTop: res[0].height - 50,
		// 		success: () => {
		// 			this.setData({
		// 				showGoodMorningNoticePopup: true,
		// 				needShowGoodMorningPopup: false
		// 			})
		// 		}
		// 	})
		// })
	},
	/* 金刚位点击 */
	fixedSiteItemTap(e) {
		let item = e.currentTarget.dataset.item
		/* 内容分类点击打点 */
		bxPoint("new_homepage_tab_button", {
			tab_tag: item.title === '每日签到' ? 1 : item.title === '精品课程' ? 2 : 3
		}, false)
		if (item.title === '每日签到') {
			let isDev = request.baseUrl === 'https://dev.huayangbaixing.com' ? true : false
			let link = isDev ? 'https://dev.huayangbaixing.com/#/signIn/playbill/miniprogram' : 'https://huayang.baixing.com/#/signIn/playbill/miniprogram'
			let nowTime = parseInt(new Date().getTime() / 1000) //当前时间-s
			setLocalStorage("good_morning_click_time", nowTime)
			this.setData({
				showGoodMorningRedDot: false
			})
			wx.navigateTo({
				url: `/subCourse/noAuthWebview/noAuthWebview?link=${encodeURIComponent(link)}`,
			})
		} else if (item.title === '精品课程') {
			wx.switchTab({
				url: '/pages/practice/practice',
			})
		} else if (item.title === '城市慢游') {
			wx.navigateToMiniProgram({
				appId: "wx2ea757d51abc1f47",
				path: '/pages/index/index',
			})
		}
	},
	/* 点击遮罩层关闭相关弹窗 */
	closeAllPopup() {
		this.setData({
			needShowGoodMorningPopup: false,
			showGoodMorningNoticePopup: false
		})
	},

	/* 头部视频数据分页 */
	queryNextList() {
		if (this.data.headerVideoPaginationTrue) {
			let param = Object.assign({}, this.data.headerVideoPagination, {
				offset: this.data.headerVideoPagination.offset + this.data.headerVideoPagination.limit
			})
			this.setData({
				headerVideoPagination: param
			}, () => {
				this.headerVideoManage()
			})
		}
	},
	/* 头部视频相关数据处理 */
	headerVideoManage() {
		getIndexHeaderVideoList(this.data.headerVideoPagination).then(({
			data
		}) => {
			let list = this.data.swiperVideoList.length > 0 ? this.data.swiperVideoList.concat(data.list || []) : data.list || []
			list = shuffle(list)
			this.setData({
				swiperVideoList: list,
				headerVideoPaginationTrue: data.list.length >= this.data.headerVideoPagination.limit ? true : false
			})
		})
	},


	/* 花样最新活动视频播放点击 */
	playNewActivityVideo(e) {
		let index = e.currentTarget.dataset.index
		this.setData({
			newActivityVideoPlayIndex: index,
			newActivityVideoPlaying: true
		}, () => {
			this.videoContext = wx.createVideoContext(`new-activity-item-video-${index}`)
			setTimeout(() => {
				this.videoContext.play()
				this.estimateVideoLocation()
			}, 200)
		})
	},

	enterFullNewActivityVideo(e) {
		if (e.detail.fullScreen) {
			// 进入全屏
			this.setData({
				enterFullNewActivityVideo: true
			})
		} else {
			// 退出全屏
			this.setData({
				enterFullNewActivityVideo: false
			})
		}
	},

	/* 花样最新活动视频播放暂停 */
	pauseNewActivityVideo() {
		this.setData({
			newActivityVideoPlaying: false
		})
	},

	/* 离开可视区暂停视频播放（头部视频+花样最新活动视频） */
	estimateVideoLocation() {
		for (let i = 0; i < this.data.newActivityList.length; i++) {
			let obj = wx.createIntersectionObserver(this)
			obj.relativeToViewport({
				top: -50,
				bottom: -50
			}).observe('#new-activity-item-video-' + i, res => {
				if (res && res.intersectionRatio <= 0 && !this.data.enterFullNewActivityVideo) {
					this.setData({
						newActivityVideoPlayIndex: -1,
						newActivityVideoPlaying: false
					})
				}
			})
		}
	},

	/* 广告位点击 */
	bannerTap(e) {
		/* 广告位点击打点 */
		bxPoint("new_homepage_banner_click", {
			banner_id: e.currentTarget.dataset.item.id
		}, false)
		let link = e.currentTarget.dataset.item.link
		let rootPage = ['/pages/discovery/discovery', '/pages/studentMoments/studentMoments', '/pages/practice/practice', '/pages/userCenter/userCenter']
		if (rootPage.indexOf(link) !== -1) {
			wx.switchTab({
				url: link
			})
		} else {
			wx.navigateTo({
				url: link
			})
		}
	},
	/* 初始化早上好红点显示 */
	initGoodMorningRedDot() {
		let time = getLocalStorage("good_morning_click_time")
		let todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 //当天0点
		let secondDayTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 86400 //第二天0点
		if (time > todayStartTime && time < secondDayTime) {
			this.setData({
				showGoodMorningRedDot: false
			})
		} else {
			this.setData({
				showGoodMorningRedDot: true
			})
		}
	},
	stopMove() {},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=235`})
		// 记录首次加载时长
		this.setData({
			firstEnterTime: new Date().getTime()
		})
		let {
			scene,
			invite_user_id = "",
			source
		} = options
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

		this.initGuideColletionStatus()

		/* 动态处理广告3:1宽高比 */
		this.setData({
			advertisementImageHeight: ((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth - 30) / 3).toFixed(2)
		})

		/* 获取花样最新活动相关数据 */
		this.getNewActivityData()
		/* 获取头部视频相关数据 */
		this.headerVideoManage()
		/* 初始化早上好红点显示 */
		this.initGoodMorningRedDot()
		/* 获取广告位数据 */
		getBannerList({
			scene: 8
		}).then(res => {
			this.setData({
				advertisementList: res.length > 0 ? res : []
			})
		})

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
			this.setData({
				didShowFluentLearnModal: false
			})
		}
		/* 保证离开页面后早上好弹窗关闭 */
		this.setData({
			needShowGoodMorningPopup: false,
			showGoodMorningNoticePopup: false
		})
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
	onReachBottom: function () {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "在花样百姓，过积极、健康、时尚的品质生活。",
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	},
	onPageScroll(e) {
		if (e.scrollTop > 500) {
			let video = this.selectComponent(`#videoSwiper`)
			video.videoContext.pause()
			video.pauseVideoAuto()
			this.initShowGoodmorningPopup()
			this.runSecondMain()
		}
	}
})