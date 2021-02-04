// pages/ discovery/discovery.js
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, } from "../../utils/util"
import request from "../../lib/request"
import {
	getActivityList,
	getCampList,
	getFindBanner,
	getVideoTypeList,
	liveTotalNum,
	queryBootcampFeatureList,
	queryVideoCourseListByBuyTag
} from "../../api/course/index"
import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { getYouZanAppId } from "../../api/mall/index"
import dayjs from "dayjs"
import { getFluentCardInfo } from "../../api/mine/index"

const TRAINCAMP_SCENE = "traincamp"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 0,
		liveNum: 0,
		isIosPlatform: false,
		isFluentLearnVIP: false, // 是否是畅学卡会员
		campList: null,
		showModelBanner: false,
		didShowAuth: false,
		isModelLink: true,
		bannerList: null,
		canShow: false,
		recommendCourseList: [],
		modelBannerLink: "",
		activityList: null,
		tabs: [{
				id: 0,
				name: "推荐"
			},
			{
				id: 1,
				name: "主题营"
			},
			{
				id: 2,
				name: "课程"
			},
		],
		tabIndex: 0,
		cacheCampList: [],
		scrollTop: 0,
		scrollIng: false,
		didFirstLoad: true,
		tabsOffsetLeftAry: [],
		featureList: [],
		didFixedTab: false,
		tabsDomOffsetTopNo: 0,
		obs: [], // 被监听的video标签队列
		themeTabMinHeight: 0,
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
	calcTabsOffset() {
		let self = this
		let tabQuery = wx.createSelectorQuery()
		tabQuery.select("#tabs").boundingClientRect()
		tabQuery.exec(function (res) {
			let bool = res[0].top <= 0
			if (bool !== self.data.didFixedTab) {
				self.setData({
					didFixedTab: bool
				})
			}
		})
	},
	touchMove(e) {
		this.calcTabsOffset()
	},
	initBootcampListener() {
		let obs = []
		for (let index = 0; index < this.data.campList.length; index++) {
			let ob = wx.createIntersectionObserver()
			ob.relativeToViewport({
					top: -50,
					bottom: -50
				})
				.observe('.card-' + index, res => {
					let campList = this.data.campList.slice()
					if (res && res.intersectionRatio > 0) {
						// 进入可视区域
						campList = campList.map((item, itemIndex) => {
							if (itemIndex === index && item.intro_video_cover_pic && item.intro_video_link) {
								item.show = true
							}
							return item
						})
						// 滚动结束，更新可视区域位置
						if (!this.data.scrollIng) {
							this.setData({
								cacheCampList: campList.slice()
							})
							let target = this.data.campList.find(n => n.id === index)
							if ($notNull(target) && target.show) {
								let videoInstance = wx.createVideoContext("video-" + index)
								videoInstance.play()
							}
						}
					} else {
						// 离开可视区域
						campList = campList.map((item, itemIndex) => {
							if (itemIndex === index) {
								item.show = false
							}
							return item
						})
						// 滚动结束，跟新可视区域位置
						if (!this.data.scrollIng) {
							this.setData({
								cacheCampList: campList.slice()
							})
							let target = this.data.campList.find(n => n.id === index)
							if ($notNull(target) && target.show) {
								let videoInstance = wx.createVideoContext("video-" + index)
								videoInstance.pause()
							}
						}
					}
					// 可视区域首次渲染
					if (this.data.didFirstLoad) {
						let t = setTimeout(() => {
							this.setData({
								campList: campList.slice(),
								didFirstLoad: false
							})
							clearTimeout(t)
						}, 50)
					}
				})
			obs.push(ob)
		}
		this.setData({
			obs
		})
	},
	handleTab(e) {
		let {
			id,
			name
		} = e.currentTarget.dataset.item

		if (this.data.tabIndex === +id) return

		this.setData({
			tabIndex: id
		})

		// 检查是否存在obs，存在的话清除队列
		if (this.data.obs.length > 0) {
			this.data.obs.forEach(o => {
				o.disconnect()
			})
		}

		switch (id) {
			case 2: {
				this.getVideoCourse()
				break
			}
			default: {
				// 推荐、主题营TAB切换时，清除视频位置数据缓存
				this.setData({
					didFirstLoad: true,
					cacheCampList: []
				})
				this.getRecommendList()
				break
			}
		}

		bxPoint("discovery_tab", {
			tab: name
		}, false)

		if (this.data.scrollTop >= this.data.tabsDomOffsetTopNo) {
			let scrollTop = this.data.tabsDomOffsetTopNo
			wx.pageScrollTo({
				duration: 0,
				scrollTop
			})
		}
	},
	initTabOffset() {
		let self = this
		let query = wx.createSelectorQuery()
		query.selectAll('.tab-ep').boundingClientRect()
		query.exec(function (res) {
			let domAry = res[0]
			let tabsOffsetLeftAry = []
			domAry.forEach(item => {
				let diff = (item.width - 44) / 2
				tabsOffsetLeftAry.push(item.left + diff)
			})
			self.setData({
				tabsOffsetLeftAry
			})
		})

		// 计算tabs的scrollTop位置
		let tabQuery = wx.createSelectorQuery()
		tabQuery.select("#tabs").boundingClientRect()
		tabQuery.exec(function (res) {
			self.setData({
				tabsDomOffsetTopNo: res[0].top
			})
		})
		// 计算主题营TAB最小高度
		this.setData({
			themeTabMinHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight - 264
		})
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
	// 加入课程
	toCourse(e) {
		bxPoint("find_join", {
			join_type: "kecheng"
		}, false)
		wx.navigateTo({
			url: `/subCourse/practiceDetail/practiceDetail?courseId=${e.currentTarget.dataset.item.id}`,
		})
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
	// 跳往视频课程全部列表
	toVideoList(e) {
		let {
			key
		} = e.currentTarget.dataset.item
		let activeIndex = this.data.recommendCourseList.findIndex(n => n.key === key) + 1
		bxPoint("discovery_more_college_info", {
			collegeName: key
		}, false)
		wx.navigateTo({
			url: `/subCourse/videoCourseList/videoCourseList?index=${activeIndex}`
		})
	},
	// 跳转至直播列表
	toLiveList() {
		wx.navigateTo({
			url: '/pages/index/index',
		})
	},
	// 加载"全部"或"推荐"的视频系列课
	getVideoCourse() {
		getVideoTypeList().then((list) => {
			let processIndex = 1
			let resultList = []
			list.forEach(({
				key,
				value
			}) => {
				resultList.push({
					key: value,
					content: []
				})
				let params = {
					limit: 5,
					category: key
				}
				if (getLocalStorage(GLOBAL_KEY.userId)) {
					params.user_id = getLocalStorage(GLOBAL_KEY.userId)
				}
				queryVideoCourseListByBuyTag(params).then(data => {
					// if (getLocalStorage(GLOBAL_KEY.userId)) {
					data = data.map(_ => {
						return {
							..._.kecheng_series,
							teacher: _.teacher,
							didBought: _.buy_tag === "已购",
							buy_tag: _.buy_tag
						}
					})
					// }
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

					handledList = handledList.filter(n => n.id && n.cover_pic && n.name && n.visit_count)

					if (handledList.length > 0) {
						let target = resultList.find(n => n.key === value)
						target.content = handledList.slice()
					}
					if (processIndex === list.length) {
						resultList = resultList.filter(n => n.content.length > 0)
						this.setData({
							recommendCourseList: resultList
						})
					}
					processIndex += 1
				})
			})
		})
	},
	// 跳往视频详情页
	toVideoDetail(e) {
		let item = e.currentTarget.dataset.item
		let id = e.currentTarget.dataset.item.id
		bxPoint("series_discovery_click", {
			series_id: id,
			kecheng_name: item.teacher_desc,
			kecheng_subname: item.name,
			kecheng_label: item.series_tag === 1 ? "口碑好课" : item.series_tag === 2 ? "新课" : "无",
			kecheng_total_amount: item.visit_count,
			kecheng_ori_price: item.price > 0 ? item.price : 0,
			kecheng_dis_price: item.discount_price < 0 ? '' : item.discount_price,
			kecheng_teacher: item.teacher.name,
		}, false)
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
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
		bxPoint("applets_banner", {
			position: 'page/discovery/discovery',
			bannerId: id || ""
		}, false)
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
	},
	// 临时跳转至抽奖工具
	toWebview() {
		if (request.baseUrl === 'https://huayang.baixing.cn') {
			wx.navigateTo({
				url: '/subCourse/lotteryWebview/lotteryWebview?activity_id=2',
			})
		}
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
	// 加载"推荐"或"全部"的训练营列表
	getRecommendList() {
		let params = {
			offset: 0,
			limit: 999,
		}

		// 监听tab变化，传递额外参数
		switch (this.data.tabIndex) {
			case 0: {
				// 推荐，传递用户ID，获取推荐训练营
				params.user_id = getLocalStorage(GLOBAL_KEY.userId) || ""
				break
			}
			case 1: {
				// 主题营，传递scene，获取除读书营之外所有训练营
				params.scene = TRAINCAMP_SCENE
				break
			}
		}
		// 获取训练营列表
		getCampList(params).then(({
			list
		}) => {
			list = list.map(item => {
				// 处理训练营特色标签
				item.feature = item.feature.split(",").map(k => {
					let target = this.data.featureList.find(({
						key
					}) => key === k)
					if ($notNull(target)) {
						return target
					}
				})

				// 处理训练营价格单位
				if (item.discount_price > 0) {
					item.price = (item.price / 100) // .toFixed(2)
					item.discount_price = (item.discount_price / 100) // .toFixed(2)
				} else {
					// 折扣价小于等于零时，不显示折扣价，仅显示原价
					item.discount_price = (item.price / 100) // .toFixed(2)
					item.price = 0
				}

				// 计算下次开营时间
				item.next_bootcamp_start_date = "即将开营"
				if (item.start_date) {
					let dates = item.start_date.split(",")
					let nextStartDate = ""
					dates.forEach(date => {
						if (dayjs(date).isAfter(dayjs())) {
							nextStartDate = date
						}
					})
					if (nextStartDate) {
						item.next_bootcamp_start_date = nextStartDate
					}
				}
				return item
			})

			list = list.filter(n => n.id && (n.intro_video_cover_pic || n.cover_pic) && n.name && n.summary)

			this.setData({
				campList: list
			})

			if (this.data.tabIndex === 0) {
				// 获取视频系列课
				this.getVideoCourse()
				// 获取直播列表个数
				this.getLiveTotalNum()
			}

			// 监听每个video标签在视口的位置
			this.initBootcampListener()
		})
	},
	// 获取直播列表个数
	getLiveTotalNum() {
		liveTotalNum().then(res => {
			this.setData({
				liveNum: res
			})
		})
	},
	// 跳转到训练营详情
	joinCamp(e) {
		bxPoint("find_join", {
			join_type: "bootcamp"
		}, false)
		wx.navigateTo({
			url: `/subCourse/joinCamp/joinCamp?id=${e.currentTarget.dataset.index.id}&share=true`,
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

		// wx.navigateTo({url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=178`})

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

		// 获取训练营特色标签列表
		queryBootcampFeatureList().then(({
			data
		}) => {
			this.setData({
				featureList: data
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
		// 计算tab偏移位置
		this.initTabOffset()
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
		this.initModelBanner()

		// 获取banner数据
		this.getBanner()

		// 查询畅学卡信息
		this.getFluentInfo()

		// 获取推荐数据
		this.getRecommendList()
		let params = {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source,
		}
		// 记录合作资源包打点标识
		if (getApp().globalData.from_co_channel) {
			params.co_channel_tag = 'co_lndx'
			getApp().globalData.from_co_channel = ''
		}
		bxPoint("applets_find", params)
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

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
	onReachBottom: function () {},
	onPageScroll(e) {
		this.setData({
			scrollTop: e.scrollTop,
			scrollIng: true
		})
		this.calcTabsOffset()
		let timer = setTimeout(() => {
			if (this.data.scrollTop === e.scrollTop) {
				this.setData({
					scrollTop: e.scrollTop,
					scrollIng: false
				})
				// 视频位置数据为空时，不更新视图
				if (this.data.cacheCampList.length > 0) {
					this.setData({
						campList: this.data.cacheCampList.slice()
					})
				}
				clearTimeout(timer)
			}
		}, 300)
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "这里有好多好课，快来一起变美，变自信",
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	}
})
