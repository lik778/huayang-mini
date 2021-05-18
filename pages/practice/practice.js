import { getFindBanner, getModelDataList, getVideoTypeList, queryVideoCourseListByBuyTag } from "../../api/course/index"
import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, setLocalStorage } from "../../utils/util"
import { getFluentCardInfo } from "../../api/mine/index"
import bxPoint from "../../utils/bxPoint"
import { getYouZanAppId } from "../../api/mall/index"
import dayjs from "dayjs"
import { updateSubscribeMessageStatus } from "../../api/auth/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 0,
		bannerList: [],
		titleList: [],
		currentIndex: 0,
		showMoney: true,
		isFluentLearnVIP: false, // 是否是学生卡会员
		keyArr: [],
		bottomLock: true,
		pageSize: {
			limit: 10,
			offset: 0
		},
		videoList: [],
		structuredPageSize: {
			limit: 10,
			offset: 0
		}, // 结构化课程分页器
		structuredList: [], // 结构化课程数据
		noMoreStructureData: false, // 是否还有更多结构化课程数据
		fastMarkAry: [
			{
				name: "线上免费课",
				picture: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618484705ndfWCk.jpg",
				path: "/subCourse/freeOnlineCourse/freeOnlineCourse"
			},
			{
				name: "校友活动",
				picture: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618484705gzPcha.jpg",
				path: "/subCourse/collegeActivity/collegeActivity"
			},
			{
				name: "线下乐活课堂",
				picture: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618484705DEbXLn.jpg",
				path: "/subCourse/offlineCourse/offlineCourse"
			},
			{name: "游学课程", picture: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618484705huEOMU.jpg", path: "travel"},
		],
		tabsOffsetTop: 0, // Tabs距离顶部的数字
		pageScrollLock: false, // 页面滑动记录锁
		didShowFixedTabsLayout: false, // 是否需要固定Tabs到顶部
		didFromDiscovery: false, // 是否来自首页金刚位
		didShowGuide: false, // 是否展示入群引导
		didExecuteGuideAnimation: false, // 是否执行入群引导动画
		didAlreadySubscribe: false, // 是否已经订阅课程提醒
	},
	getBanner() {
		return new Promise((resolve) => {
			getFindBanner({scene: 20}).then((data) => {
				data = data || []
				this.setData({bannerList: data})
				resolve(data)
			})
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
	// 跳往视频课程详情页
	toVideoCourseDetail(e) {
		let item = e.currentTarget.dataset.item
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`,
			complete() {
				bxPoint("series_details", {
					series_id: item.id,
					kecheng_name: item.teacher_desc,
					kecheng_subname: item.name,
					kecheng_total_amount: item.visit_count,
					kecheng_ori_price: item.price,
					kecheng_dis_price: item.discount_price,
					kecheng_teacher: item.teacher.name,
				}, false)
			}
		})
	},
	onStructureItemTap(e) {
		wx.navigateTo({url: "/subCourse/practiceDetail/practiceDetail?courseId=" + e.currentTarget.dataset.id})
	},
	// 获取课程列表
	getVideoList(index, refresh = true) {
		let category = ''
		category = this.data.keyArr[index]
		let params = {
			offset: this.data.pageSize.offset,
			limit: this.data.pageSize.limit,
			category
		}

		// 模特训练(index=3)，加载所有数据
		if (index === 3) {
			params.offset = 0
			params.limit = 9999
		}

		if (getLocalStorage(GLOBAL_KEY.userId)) {
			params.user_id = getLocalStorage(GLOBAL_KEY.userId)
		}
		queryVideoCourseListByBuyTag(params).then(list => {
			list = list.map(_ => {
				return {
					..._.kecheng_series,
					teacher: _.teacher,
					didBought: _.buy_tag === "已购",
					buy_tag: _.buy_tag
				}
			})
			let bottomLock = true
			if (list.length < 10) {
				bottomLock = false
			}
			let handledList = list.map((res) => {
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
			if (refresh || index === 3) {
				handledList = [...handledList]
			} else {
				handledList = this.data.videoList.concat(handledList)
			}
			this.setData({
				videoList: handledList,
				bottomLock: bottomLock
			})
		})
	},
	// 获取tab列表
	getTabList(index) {
		getVideoTypeList().then(res => {
			let arr = []
			let keyArr = []
			for (let i in res) {
				arr.push(res[i].value)
				keyArr.push(res[i].key)
			}
			this.setData({titleList: arr, keyArr: keyArr})
			this.changeTab(index)
			if (this.data.didFromDiscovery && this.data.tabsOffsetTop !== 0) {
				this.setData({didFromDiscovery: false})
				getApp().globalData.discoveryToPracticeTabIndex = undefined
				wx.pageScrollTo({selector: "#practice-page", scrollTop: this.data.tabsOffsetTop, duration: 400})
			}
		})
	},
	// 切换tab
	changeTab(e) {
		let index = ''
		if (e) {
			if (e.currentTarget) {
				index = e.currentTarget.dataset.index
			} else {
				index = e
			}
			// 学校课程页内部切换tab，不重新请求数据
			if (!this.data.didFromDiscovery && (+index === +this.data.currentIndex)) return

			this.setData({currentIndex: index})
		} else {
			index = 0
		}

		this.setData({
			videoList: [],
			structuredList: [],
			pageSize: {offset: 0, limit: 10},
			structuredPageSize: {offset: 0, limit: 10}
		})

		// 设置页面位置
		if (this.data.didShowFixedTabsLayout) {
			wx.pageScrollTo({
				selector: "#practice-page",
				duration: 200,
				scrollTop: this.data.tabsOffsetTop
			})
		}

		if (index === 3) {
			// 模特训练，底部填充结构化课程（含分页功能）
			this.getModelStructureList()
		}
		this.getVideoList(index)

		// 打点
		bxPoint("series_tab_button", {tab_tag: this.data.titleList[index]}, false)
	},
	// 获取模特结构化动作列表
	getModelStructureList() {
		getModelDataList({
			kecheng_type: 3,
			offset: this.data.structuredPageSize.offset,
			limit: this.data.structuredPageSize.limit
		})
			.then(({data: list}) => {
				if (list.length < this.data.structuredPageSize.limit) this.setData({noMoreStructureData: true})
				this.setData({
					structuredList: [...this.data.structuredList, ...list],
					structuredPageSize: {
						offset: this.data.structuredPageSize.offset + list.length,
						limit: this.data.structuredPageSize.limit
					}
				})
			})
	},
	// 检查ios环境
	checkIos() {
		let _this = this
		wx.getSystemInfo({
			success: function (res2) {
				_this.setData({
					showMoney: false
				})
				// if (res2.platform == 'ios') {
				// 	_this.setData({
				// 		showMoney: false
				// 	})
				// }
			}
		})
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 处理轮播点击事件
	joinCampFromBanner(e) {
		let {link, link_type, id} = e.currentTarget.dataset.item
		bxPoint("series_banner", {bannerId: id, position: "practice"}, false)
		if (e.currentTarget.dataset.item.need_auth === 1) {
			if (!hasUserInfo() || !hasAccountInfo()) {
				this.setData({didShowAuth: true})
				return
			}
		}
		if (link_type === 'youzan') {
			getYouZanAppId().then(appId => {
				wx.navigateToMiniProgram({appId, path: link})
			})
		} else {
			wx.navigateTo({url: link})
		}
	},
	onHyperTap(e) {
		let {path} = e.currentTarget.dataset.item

		switch (path) {
			case "/subCourse/freeOnlineCourse/freeOnlineCourse": {
				bxPoint("series_online_free", {}, false)
				break
			}
			case "/subCourse/collegeActivity/collegeActivity": {
				bxPoint("series_activities", {}, false)
				break
			}
			case "/subCourse/offlineCourse/offlineCourse": {
				bxPoint("series_offline_jinpin", {}, false)
				break
			}
			case "travel": {
				bxPoint("series_travel", {}, false)
				break
			}
		}

		if (path === 'travel') {
			wx.navigateToMiniProgram({
				appId: "wx2ea757d51abc1f47",
				path: "pages/index/index",
			})
		} else {
			wx.navigateTo({url: path})
		}
	},
	onGuideTap() {
		let tempId = "Yak_FhmnmqkJIjVW1T-bSqIwmHCxsIt4asMN_XkCitY"
		let self = this
		wx.getSetting({
			withSubscriptions: true,
			success(res) {
				if (res.subscriptionsSetting[tempId] === "reject") {
					wx.showModal({
						title: '订阅消息',
						content: '订阅花样百姓消息，不错过精品课程和活动。务必设置订阅消息为允许哦',
						confirmText: '立即订阅',
						confirmColor: '#33c71b',
						success(res) {
							if (res.confirm) {
								wx.openSetting()
							}
						}
					})
				} else if (res.subscriptionsSetting[tempId] === "accept") {
					self.setData({didAlreadySubscribe: true})
				} else {
					wx.requestSubscribeMessage({
						tmplIds: [tempId],
						success(response) {
							if (response.errMsg === "requestSubscribeMessage:ok" && response[tempId] === "accept") {
								updateSubscribeMessageStatus({
									app_id: "wx85d130227f745fc5",
									open_id: getLocalStorage(GLOBAL_KEY.openId),
									template_id: tempId
								}).then(() => {
									// 检查开课通知订阅状态
									self.subScribeMessage()
								})
							} else if (response[tempId] === "reject") {
								// 用户拒绝授权，则三天之内不再显示
								self.setData({didExecuteGuideAnimation: false})
								let t = setTimeout(() => {
									self.setData({didShowGuide: false})
									clearTimeout(t)
								}, 300)
								setLocalStorage(GLOBAL_KEY.practiceGuideExpiredAt, dayjs(`${dayjs().year()}-${dayjs().month() + 1}-${dayjs().add(3, 'day').date()} 23:59:59`).format("YYYY-MM-DD HH:mm:ss"))
							}
						}
					})
				}
			}
		})
		bxPoint("series_remind_open", {}, false)
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
		setLocalStorage(GLOBAL_KEY.practiceGuideExpiredAt, dayjs(`${dayjs().year()}-${dayjs().month() + 1}-${dayjs().date()} 23:59:59`).format("YYYY-MM-DD HH:mm:ss"))
		bxPoint("series_remind_close", {}, false)
	},
	subScribeMessage() {
		let tempId = "Yak_FhmnmqkJIjVW1T-bSqIwmHCxsIt4asMN_XkCitY"
		let self = this
		wx.getSetting({
			withSubscriptions: true,
			success(res) {
				if (res.subscriptionsSetting[tempId] === "accept") {
					self.setData({didAlreadySubscribe: true})
				}
			}
		})

		if (dayjs(getApp().globalData.showContactEnterTime).isAfter(dayjs())) return

		let guideExpiredAt = getLocalStorage(GLOBAL_KEY.practiceGuideExpiredAt)
		if (!guideExpiredAt || dayjs(guideExpiredAt).isBefore(dayjs())) {
			let t = setTimeout(() => {
				this.openGuide()
				clearTimeout(t)
			}, 1000)
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let index = options.index ? parseInt(options.index) : ""
		if (options.index) {
			this.setData({
				currentIndex: index
			})
		}
		if (options.invite_user_id) {
			getApp().globalData.super_user_id = options.invite_user_id
		}

		this.getBanner().then((list) => {
			let top = 232
			if (list.length > 0) top += 139
			// 计算Tabs高度
			this.setData({tabsOffsetTop: top})
			if (this.data.didFromDiscovery) {
				this.setData({didFromDiscovery: false})
				getApp().globalData.discoveryToPracticeTabIndex = undefined
				wx.pageScrollTo({selector: "#practice-page", scrollTop: top, duration: 400})
			}
		})

		// ios规则适配
		this.checkIos()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		if (getApp().globalData.discoveryToPracticeTabIndex === undefined) {
			this.getTabList(0)
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2
			})
		}

		// 检查开课通知订阅状态
		this.subScribeMessage()

		this.getFluentInfo()

		// 首页金刚位进入，页面Tabs固定在顶部
		let index = getApp().globalData.discoveryToPracticeTabIndex
		if (index !== undefined) {
			this.setData({didFromDiscovery: true, currentIndex: index})
			this.getTabList(index)
		}

		bxPoint("series_visit", {})
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

	onPageScroll({scrollTop}) {
		if (this.data.pageScrollLock) return
		this.setData({pageScrollLock: true})
		let t = setTimeout(() => {
			this.setData({didShowFixedTabsLayout: scrollTop >= this.data.tabsOffsetTop, pageScrollLock: false})
			clearTimeout(t)
		}, 50)
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
		if (this.data.bottomLock) {
			this.setData({
				pageSize: {
					offset: this.data.pageSize.offset + this.data.pageSize.limit,
					limit: this.data.pageSize.limit
				}
			})
			this.getVideoList(this.data.currentIndex, false)
		}

		if (this.data.currentIndex === 3 && !this.data.noMoreStructureData) {
			// 模特训练，底部填充结构化课程（含分页功能）
			this.getModelStructureList()
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "花样大学精品课程，让退休生活更精彩！",
			path: `/pages/practice/practice?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	}
})
