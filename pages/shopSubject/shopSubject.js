import {
	getFindBanner
} from "../../api/course/index"
import {
	$notNull
} from "../../utils/util"
import {
	getYouZanKeChengList
} from "../../api/live/index"
import dayjs from "dayjs"
import {
	offlineTrainList
} from "../../utils/mock"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		globalShow: false,
		bannerList: [],
		list: offlineTrainList
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.run()
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
		bxPoint("course_visit", {})
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "花样培训课，开启你的美丽蜕变",
			path: "/pages/shopSubject/shopSubject"
		}
	},
	// 启动函数
	run() {
		this.getBanner()
		this.getList()
	},
	naviMiniProgram(link, linkType) {
		switch (linkType) {
			case "youzan": {
				// 有赞商城
				wx.navigateToMiniProgram({
					appId: "wx95fb6b5dbe8739b7",
					path: link
				})
				break
			}
			case "travel": {
				// 游学
				wx.navigateToMiniProgram({
					appId: "wx2ea757d51abc1f47",
					path: link
				})
				break
			}
			default: {
				wx.navigateTo({
					url: link,
					fail() {
						wx.switchTab({
							url: link
						})
					}
				})
			}
		}
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 处理轮播点击事件
	handleBannerTap(e) {
		let {
			link,
			link_type,
			id
		} = e.currentTarget.dataset.item
		this.naviMiniProgram(link, link_type)
		bxPoint("course_banner_click", {
			banner_id: id
		}, false)
	},
	// 获取banner图片
	getBanner() {
		getFindBanner({
			scene: 24
		}).then((bannerList) => {
			this.setData({
				bannerList
			})
		})
	},
	// 获取有赞培训课数据
	getList() {
		let list = this.data.list.concat([])
		list = list.map(n => ({
			...n,
			price: n.price ? (n.price / 100).toFixed(0) : ''
		}))
		this.setData({
			list
		})
		this.setData({
			globalShow: true
		})
		// getYouZanKeChengList({
		// 		offset: 0,
		// 		limit: 999
		// 	})
		// 	.then(({
		// 		data: {
		// 			list
		// 		}
		// 	}) => {
		// 		list = list || []
		// 		list = list.map(n => ({
		// 			...n,
		// 			price: (n.price / 100).toFixed(0)
		// 		}))
		// 		this.setData({
		// 			list
		// 		})
		// 	})
		// 	.finally(() => {
		// 		this.setData({globalShow: true})
		// 	})
	},
	// 唤醒电话
	onPhoneCall() {
		bxPoint("course_phone_call_click", {}, false)
		wx.makePhoneCall({
			phoneNumber: "15000961093",
		})
	},
	// 唤醒客服消息
	handleServiceTap() {
		wx.openCustomerServiceChat({
			extInfo: {
			  url: 'https://work.weixin.qq.com/kfid/kfce6a22d7afb999123'
			},
			corpId: 'ww8d4cae43fb34dc92',
			complete() {
				bxPoint("course_service_click", {}, false)
			}
		})
	},
	// 跳转到有赞全部培训课列表页
	onMoreTap() {
		bxPoint("course_enroll_more_click", {}, false)
		wx.navigateToMiniProgram({
			appId: "wx95fb6b5dbe8739b7",
			path: "packages/shop/goods/group/index?shopAutoEnter=1&alias=2x5gw6suji5z0",
		})
	},
	// 培训课课程item点击
	onAdsItemTap(e) {
		let {
			item
		} = e.currentTarget.dataset
		if (item) {
			bxPoint("course_enroll_list_click", {
				course_id: item.id,
				course_title: item.title
			}, false)

			wx.navigateTo({
				url: `/subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse?id=${item.id}`,
			})
			// wx.navigateToMiniProgram({
			// 	appId: "wx95fb6b5dbe8739b7",
			// 	path: `${item.page_url}?alias=${item.alias}`,
			// })
		}
	}
})