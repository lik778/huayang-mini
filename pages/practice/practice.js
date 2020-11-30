import {
	getCourseData,
	getUserPracticeRecentRecord,
	getWxRoomData,
	queryBootCampContentInToday,
	updateBootcampStudyTime
} from "../../api/course/index"
import {
	CourseLevels,
	GLOBAL_KEY
} from "../../lib/config"
import dayjs from "dayjs"
import {
	$notNull,
	getLocalStorage,
	hasAccountInfo,
	hasUserInfo,
	removeLocalStorage,
	setLocalStorage
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

const CourseTypeImage = {
	kecheng: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1604371266ssIXdS.jpg",
	video: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1604371293cxSwya.jpg",
	url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1604371371aIBDqI.jpg",
	product: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1604371414cXAdkH.jpg"
}

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		CourseLevels,
		CourseTypeImage,
		handledData: [],
		resultData: [],
		didShowTipsLay: false, // 显示提示收藏蒙层
		didNeedScrollTop: false, // 是否需要将页面滑动到顶部
		didShowAuth: false,
		didShowNoDataLayout: false,
		didSignIn: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {
			scene,
			invite_user_id = ""
		} = options
		// 通过小程序码进入 scene=${source}
		if (scene) {
			let sceneAry = decodeURIComponent(scene).split('/')
			let [sceneSource = ''] = sceneAry

			if (sceneSource) {
				getApp().globalData.source = sceneSource
			}
		}

		if (invite_user_id) {
			getApp().globalData.super_user_id = invite_user_id
		}

		// 检查是否需要展示提示层
		// this.checkTipsLay()

		// 记录起始页面地址
		if (!getApp().globalData.firstViewPage && getCurrentPages().length > 0) {
			getApp().globalData.firstViewPage = getCurrentPages()[0].route
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}

		this.initial()

		bxPoint("applets_practice", {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source,
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

		// 是否需要将页面滑动到顶部
		if (this.data.didNeedScrollTop) {
			// 将页面滑动到顶部
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
			this.setData({
				didNeedScrollTop: false
			})
		}
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '跟着花样一起变美，变自信',
			path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	},
	// 用户确认授权
	authCompleteEvent() {
		this.setData({
			didShowAuth: false
		})
		setLocalStorage("hy_dd_auth_done_in_practice", "yes")
		this.initial()
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	hiddenTipMask() {
		this.setData({
			didShowTipsLay: false
		})
	},
	checkTipsLay() {
		const key = "hua_yang_practice_tip_mask_time"
		let markTime = getLocalStorage(key)
		let now = +new Date() / 1000 | 0
		let buf = 7 * 24 * 60 * 60
		if (!markTime || markTime < now) {
			this.setData({
				didShowTipsLay: true
			})
			setLocalStorage(key, now + buf)
		}
	},
	// 处理点击课程事件
	handleCourseTap(e) {
		wx.navigateTo({
			url: "/subCourse/practiceDetail/practiceDetail?courseId=" + e.currentTarget.dataset.id
		})
	},
	// 处理练习按钮事件
	handleExerciseBtnTap(e) {
		let {
			item,
			parent,
		} = e.currentTarget.dataset
		let courseIndex = e.currentTarget.dataset.index
		let campId = e.currentTarget.dataset.parent.bootCampId
		bxPoint("practice_start", {}, false)
		this.setData({
			didNeedScrollTop: true
		})
		// 训练营学习时间更新
		updateBootcampStudyTime({
			traincamp_id: parent.bootCampId,
			user_id: getLocalStorage(GLOBAL_KEY.userId)
		})
		switch (item.type) {
			case 'kecheng': {
				switch (item.kecheng_type) {
					case 0: {
						// 直播
						getWxRoomData({
							zhibo_room_id: item.room_id
						}).then(res => {
							wx.navigateTo({
								url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${res.zhibo_room.num}`
							})
						})
						return
					}
					case 1: {
						// 回看
						getWxRoomData({
							zhibo_room_id: item.room_id
						}).then(res => {
							wx.navigateTo({
								url: `/pages/webViewCommon/webViewCommon?link=${res.zhibo_room.link}`,
							})
						})
						return
					}
					case 2: {
						// 小鹅通
						wx.navigateTo({
							url: `/pages/webViewCommon/webViewCommon?link=${item.url}`
						})
						return
					}
					case 3: {
						// 结构化课程
						wx.navigateTo({
							url: `/subCourse/practiceDetail/practiceDetail?courseId=${item.kecheng_id}&formCampDetail=payUser&parentBootCampId=${parent.bootCampId}`
						})
						return
					}
				}
				return
			}
			case 'url': {
				wx.navigateTo({
					url: `/pages/webViewCommon/webViewCommon?link=${item.url}`
				})
				return
			}
			case 'product': {
				wx.navigateTo({
					url: '/subMall/detail/detail?prdId=' + item.product_id
				})
				return
			}
			case 'video': {
				wx.navigateTo({
					url: '/subLive/videoPage/videoPage?link=' + item.video + `&is_camp_video=true&courseIndex=${courseIndex}&campId=${campId}`
				})
				return
			}
		}
	},
	// 查看训练营详情
	goToBootCamp(e) {
		let {
			bootCampId
		} = e.currentTarget.dataset.item
		this.setData({
			didNeedScrollTop: true
		})
		let self = this
		wx.navigateTo({
			url: "/subCourse/campDetail/campDetail?id=" + bootCampId + "&from=practice",
			success() {
				self.setData({
					didNeedScrollTop: true
				})
			}
		})
	},
	restartToBootCamp(e) {
		let {
			bootCampId
		} = e.currentTarget.dataset.item
		wx.navigateTo({
			url: "/subCourse/joinCamp/joinCamp?id=" + bootCampId
		})
	},
	// 去发现页
	goToDiscovery() {
		bxPoint("parctice_choose", {}, false)
		if (hasUserInfo() && hasAccountInfo()) {
			wx.switchTab({
				url: '/pages/discovery/discovery'
			})
		} else {
			this.setData({
				didShowAuth: true
			})
		}
	},
	// 跳往视频课程详情
	toVideoDetail(e) {
		let id = e.currentTarget.dataset.item.kecheng_series.id
		let self = this
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
			success() {
				self.setData({
					didNeedScrollTop: true
				})
			}
		})
	},
	async initial() {
		if (hasUserInfo() && hasAccountInfo()) {
			this.setData({
				didShowNoDataLayout: false,
				didSignIn: true
			})
			getUserPracticeRecentRecord({
				user_id: getLocalStorage(GLOBAL_KEY.userId)
			}).then(async (originData) => {
				let handledData = []
				for (let item of originData) {
					if (item.hasOwnProperty("kecheng_traincamp")) {
						// 训练营
						let {
							kecheng_traincamp_id,
							date,
							status,
							kecheng_traincamp: {
								name,
								period
							}
						} = item
						// 根据训练营查找对应的课程
						let dayDiff = dayjs().diff(dayjs(date), 'day', true)
						let dayNum = dayDiff
						if (dayDiff >= 0) {
							dayNum = ++dayNum | 0
						} else {
							dayNum = 0
						}
						// 如果训练营已经过期，则显示该训练营最后一天的课程内容
						let endDate = dayjs(date).add(period, "day")
						let nowDate = dayjs().format("YYYY-MM-DD")
						if (endDate.isBefore(dayjs(nowDate))) {
							dayNum = period
						}

						let bootCampInfo = await queryBootCampContentInToday({
							traincamp_id: kecheng_traincamp_id,
							day_num: dayNum
						})

						let content = bootCampInfo && bootCampInfo.content ? JSON.parse(bootCampInfo.content) : []

						// 解析课程详情
						for (let index = 0; index < content.length; index++) {
							let c = content[index]
							if (c.kecheng_id) {
								let kechengInfo = await getCourseData({
									kecheng_id: c.kecheng_id
								})
								c.kecheng_type = kechengInfo.kecheng_type
								c.room_id = kechengInfo.room_id
							}
						}

						handledData.push({
							bootCampId: kecheng_traincamp_id,
							name: name,
							content,
							status: +status,
							visitAt: +dayjs(item.visit_at),
							_mark: "bootcamp"
						})
					} else if (item.hasOwnProperty("kecheng_series")) {
						// 视频课
						item.kecheng_series.video_detail = JSON.parse(item.kecheng_series.video_detail)
						item.videoList = item.kecheng_series.video_detail.length
						handledData.push({
							...item,
							visitAt: +dayjs(item.visit_at),
							_mark: "course"
						})
					}
				}

				handledData = handledData.sort((a, b) => b.visitAt - a.visitAt)

				let now = dayjs()
				let lastWeekTimestamp = +now.subtract(7, 'day')
				let resultData = []
				handledData.forEach(item => {
					if (item.visitAt >= lastWeekTimestamp) {
						// 7日内
						let diffDay = now.diff(dayjs(item.visitAt).format("YYYY-MM-DD"), "day")
						let key = ""
						switch (+diffDay) {
							case 0: {
								key = "今天"
								break;
							}
							case 1: {
								key = "昨天"
								break;
							}
							case 2: {
								key = "3天前"
								break;
							}
							case 3: {
								key = "4天前"
								break;
							}
							case 4: {
								key = "5天前"
								break;
							}
							case 5: {
								key = "6天前"
								break;
							}
							case 6: {
								key = "7天前"
								break;
							}
						}
						let target = resultData.find(n => n.key === key)
						if (!$notNull(target)) {
							resultData.push({
								key,
								content: []
							})
						}
						target = resultData.find(n => n.key === key)
						target.content.push(item)
					} else {
						// 超过7天
						let key = dayjs(item.visitAt).format("YYYY-MM-DD")
						let target = resultData.find(n => n.key === key)
						if (!$notNull(target)) {
							resultData.push({
								key,
								content: []
							})
						}
						target = resultData.find(n => n.key === key)
						target.content.push(item)
					}
				})

				this.setData({
					resultData,
					didShowNoDataLayout: true
				})

				// 用户首次授权成功，如果该用户没有任何课程则自动跳转至发现页
				if (getLocalStorage("hy_dd_auth_done_in_practice") === "yes" && resultData.length === 0) {
					removeLocalStorage("hy_dd_auth_done_in_practice")
					wx.reLaunch({
						url: '/pages/discovery/discovery'
					})
				}
			})
		} else {
			this.setData({
				didShowNoDataLayout: true,
				didSignIn: false
			})
		}
	}
})