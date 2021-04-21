import { createNewOfflineCourseOrder, getOfflineCourseDetail } from "../../api/course/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, isIphoneXRSMax, payFluentCard } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getFluentCardInfo, getFluentLearnInfo } from "../../api/mine/index"
import dayjs from "dayjs"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 0,
		productId: 0,
		info: null,
		didShowFooterBtn: false,
		btnType: 'no-auth',
		isFluentCardUser: false,
		didShowAuth: false,
		didShowContact: false,
		payLock: false,
		isIphoneX: false,
		weekDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {id} = options
		if (id) this.setData({productId: id})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({isIphoneX: isIphoneXRSMax()})
		this.run()
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getUserInformation()
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
			title: `推荐花样线下乐活课堂：${this.data.info.name}`,
			path: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${this.data.productId}`
		}
	},
	async run() {
		// 获取线下课详情
		if (this.data.productId) {
			let {data: fluentCardData} = await getFluentLearnInfo()
			let {data} = await getOfflineCourseDetail({kecheng_offline_id: this.data.productId})
			if ($notNull(data)) {
				this.setData({
					info: {
						...data,
						covers: data.cover_pic.split(","),
						details: data.detail_pics.split(","),
						discount_price: data.discount_price / 100,
						price: data.price / 100,
						new_member_price: (data.discount_price + fluentCardData.discount_price) / 100,
						zh_study_time: `${dayjs(data.study_time).format("YYYY-MM-DD")} ${this.data.weekDays[dayjs(data.study_time).day()]}`
					}
				})
			}
		}

	},
	// 判别用户账号类型
	getUserInformation() {
		// 判别用户类型
		if (hasUserInfo() && hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			getFluentCardInfo({user_snow_id: accountInfo.snow_id})
				.then(({data}) => {
					this.setData({isFluentCardUser: !!data})
					if (data) {
						// 花样会员
						this.setData({btnType: 'member', didShowFooterBtn: true})
					} else {
						// 非花样会员
						this.setData({btnType: 'non-member', didShowFooterBtn: true})
					}
				})
		} else {
			// 未登录
			this.setData({btnType: 'no-auth', didShowFooterBtn: true})
		}
	},
	// 创建订单
	createOrder(e) {
		if (this.data.payLock) return
		let order_type = e.currentTarget.dataset.key
		this.setData({payLock: true})
		createNewOfflineCourseOrder({
			kecheng_offline_id: this.data.productId,
			open_id: getLocalStorage(GLOBAL_KEY.openId),
			user_id: getLocalStorage(GLOBAL_KEY.userId),
			order_type
		}).then(({data}) => {
			payFluentCard({id: data.id, name: "线下精品课购买"})
				.then(() => {
					this.setData({payLock: false})
					wx.redirectTo({url: '/mine/personCourse/personCourse?index=1'})
				})
				.catch((err) => {
					if (err.errMsg !== "requestPayment:fail cancel") {}
					this.setData({payLock: false})
				})
		}).catch(() => {
			this.setData({payLock: false})
		})
	},
	onAuthTap() {
		this.setData({didShowAuth: true})
	},
	// 用户授权取消
	authCancelEvent() {
		this.getUserInformation()
		this.setData({didShowAuth: false})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.getUserInformation()
		this.setData({didShowAuth: false})
	},
	openContactModal() {
		this.setData({didShowContact: true})
	},
	onCloseContactModal() {
		this.setData({didShowContact: false})
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
})
