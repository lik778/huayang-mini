import { createNewOfflineCourseOrder, getOfflineCourseDetail } from "../../api/course/index"
import {
	$notNull,
	getLocalStorage,
	hasAccountInfo,
	hasUserInfo,
	isIphoneXRSMax,
	payFluentCard,
	toast
} from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getFluentCardInfo, getFluentLearnInfo } from "../../api/mine/index"
import dayjs from "dayjs"
import bxPoint from "../../utils/bxPoint"

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
		weekDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		didReserveMessageSuccess: false,
		reserveMessageForm: null,
		didShowReserveMessageModal: false,
		didShowReserveMessageAnimate: false,
		cachedOrderType: "",
		keyBoardHeight: 0
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

				bxPoint("offline_series_detail_visit", {
					series_offline_id: data.id,
					series_offline_name: data.name,
					series_offline_subname: data.title,
					series_offline_ori_price: data.price,
					series_offline_dis_price: data.discount_price
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
		bxPoint("offline_series_buy", {series_offline_id: this.data.info.id}, false)
		if (this.data.payLock) return

		let order_type = e.currentTarget.dataset.key

		console.error(1)

		// 是否需要填写预定信息
		if (this.data.info.has_reserve_message === 1 && !this.data.didReserveMessageSuccess) {
			if (this.data.reserveMessageForm == null) {
				let fieldStringAry = this.data.info.reserve_message.split(",")
				let form = {}
				fieldStringAry.forEach((item) => form[item] = "")
				this.setData({reserveMessageForm: form})
			}
			console.error(2)
			this.setData({didShowReserveMessageModal: true, cachedOrderType: order_type})
			wx.nextTick(() => {
				this.setData({didShowReserveMessageAnimate: true})
			})
			return
		}

		console.error(3)

		this.setData({payLock: true})
		let params = {
			kecheng_offline_id: this.data.productId,
			open_id: getLocalStorage(GLOBAL_KEY.openId),
			user_id: getLocalStorage(GLOBAL_KEY.userId),
			order_type
		}
		if ($notNull(this.data.reserveMessageForm)) {
			params["extra_info"] = JSON.stringify(this.data.reserveMessageForm)
		}
		createNewOfflineCourseOrder(params).then(({data}) => {
			payFluentCard({id: data.id, name: "线下精品课购买"})
				.then(() => {
					this.setData({payLock: false})
					wx.redirectTo({url: '/mine/personCourse/personCourse?index=1'})
				})
				.catch((err) => {
					if (err.errMsg !== "requestPayment:fail cancel") {
					}
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
		bxPoint("offline_series_contact_service", {series_offline_id: this.data.info.id}, false)
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
	onCatchtouchmove() {
		return false
	},
	closeModal() {
		this.setData({didShowReserveMessageAnimate: false})
		let t = setTimeout(() => {
			this.setData({didShowReserveMessageModal: false})
			clearTimeout(t)
		}, 300)
	},
	onKeyboardActive(e) {
		this.setData({keyBoardHeight: e.detail.height})
	},
	onInputHeight(e) {
		let form = this.data.reserveMessageForm
		this.setData({reserveMessageForm: {...form, height: e.detail.value}})
	},
	onInputIdCard(e) {
		let form = this.data.reserveMessageForm
		this.setData({reserveMessageForm: {...form, idcard: e.detail.value}})
	},
	onInputName(e) {
		let form = this.data.reserveMessageForm
		this.setData({reserveMessageForm: {...form, name: e.detail.value}})
	},
	validParams(form) {
		for (let key of Object.keys(form)) {
			switch (key) {
				case "height": {
					if (!form["height"]) {
						toast("请填写您的身高")
						return false
					}
					if (form["height"] <= 0) {
						toast("身高不合法")
						return false
					}
					break
				}
				case "idcard": {
					if (!form["idcard"]) {
						toast("请填写您的身份证")
						return false
					}
					let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
					let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
					if (_IDRe18.test(form["idcard"]) || _IDre15.test(form["idcard"])) {
					} else {
						toast("身份证格式不合法")
						return false
					}
					break
				}
				case "name": {
					if (!form["name"]) {
						toast("请填写您的姓名")
						return false
					}
					break
				}
			}
		}
		return true
	},
	reserve() {
		let bool = this.validParams(this.data.reserveMessageForm)
		if (bool) {
			this.setData({didShowReserveMessageAnimate: false})
			let t = setTimeout(() => {
				this.setData({didShowReserveMessageModal: false, didReserveMessageSuccess: true})
				this.createOrder({currentTarget: {dataset: {key: this.data.cachedOrderType}}})
				clearTimeout(t)
			}, 300)
		}

		bxPoint("offline_series_reserve", {
			series_offline_id: this.data.productId,
			series_offline_reserve_info: $notNull(this.data.reserveMessageForm) ? JSON.stringify(this.data.reserveMessageForm) : ""
		}, false)
	}
})
