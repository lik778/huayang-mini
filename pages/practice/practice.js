import { getVideoTypeList, queryVideoCourseListByBuyTag } from "../../api/course/index"
import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { getFluentCardInfo } from "../../api/mine/index"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		titleList: [],
		currentIndex: 0,
		showMoney: true,
		isFluentLearnVIP: false, // 是否是畅学卡会员
		keyArr: [],
		bottomLock: true,
		pageSize: {
			limit: 10,
			offset: 0
		},
		videoList: []
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
	// 获取课程列表
	getVideoList(index, refresh = true) {
		let category = ''
		if (index === 0) {
			category = ''
		} else {
			category = this.data.keyArr[index - 1]
		}
		let params = {
			offset: this.data.pageSize.offset,
			limit: this.data.pageSize.limit,
			category: category
		}
		if (getLocalStorage(GLOBAL_KEY.userId)) {
			params.user_id = getLocalStorage(GLOBAL_KEY.userId)
		}
		queryVideoCourseListByBuyTag(params).then(list => {
			// if (getLocalStorage(GLOBAL_KEY.userId)) {
			list = list.map(_ => {
				return {
					..._.kecheng_series,
					teacher: _.teacher,
					didBought: _.buy_tag === "已购",
					buy_tag: _.buy_tag
				}
			})
			// }
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
			if (refresh) {
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
			arr.unshift("全部课程")
			this.setData({
				titleList: arr,
				keyArr: keyArr
			})
			this.changeTab(index)
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
			this.setData({
				currentIndex: index
			})
		} else {
			index = 0
		}

		switch (index) {
			case 0: {
				bxPoint("series_all_tab", {}, false)
				break;
			}
			case 1: {
				bxPoint("series_mote_tab", {}, false)
				break;
			}
			case 2: {
				bxPoint("series_shishang_tab", {}, false)
				break;
			}
			case 3: {
				bxPoint("series_shengyue_tab", {}, false)
				break;
			}
		}

		this.setData({
			pageSize: {
				offset: 0,
				limit: 10
			}
		})
		wx.pageScrollTo({
			duration: 100,
			scrollTop: 0
		})
		this.getVideoList(index)
	},
	// 检查ios环境
	checkIos() {
		let _this = this
		wx.getSystemInfo({
			success: function (res2) {
				if (res2.platform == 'ios') {
					_this.setData({
						showMoney: false
					})
				}
			}
		})
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

		this.getTabList(index)
		// ios规则适配
		this.checkIos()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

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

		this.getFluentInfo()

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
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "我在花样百姓，和我一起学习、游玩吧，开心每一天！",
			path: `/pages/practice/practice?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
		}
	}
})
