import { getFluentCardInfo, getFluentLearnInfo, getPartnerInfo, payForFluentCard } from "../../api/mine/index"

import {
	$notNull,
	getLocalStorage,
	hasAccountInfo,
	hasUserInfo,
	isIphoneXRSMax,
	payFluentCard,
	removeLocalStorage,
	setLocalStorage,
	toast
} from "../../utils/util"
import { ErrorLevel, FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { collectError } from "../../api/auth/index"
import bxPoint from "../../utils/bxPoint"
import { queryQualityVideoList } from "../../api/live/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: "",
		desc: "",
		features: [],
		video: "",
		video_cover: "",
		hotList: [],
		didShowAuth: false,
		payLock: false,
		didShowFluentLearnModal: false,
		payChannel: undefined, // 支付渠道字段
		showContact: false,
		showCodeBox: false,
		showCodeBoxAnimate: false,
		superiorDistributeUserId: 0,
		inviteCode: '', //邀请码
		price: '',
		discountPrice: '',
		inviteId: '',
		isIphoneXRSMax: false,
		equityImages: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754dxzZTH.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754nyGpJw.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618825754xhlddI.jpg"], // 权益图片
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {
			inviteId,
			channel
		} = options
		/**
		 * 小程序卡片中满足 sceneInviteId=0 且 channel!=undefined 时，在支付时上传渠道来源
		 */
		if (inviteId == 0 && channel != undefined) {
			this.setData({
				payChannel: channel
			})
		}
		this.setData({
			inviteId,
			isIphoneXRSMax: isIphoneXRSMax()
		})

		// 小程序卡片
		this.generateSuperiorDistributeUserCache(inviteId)
		this.getCardInfo()
		this.getHotkecheng()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		bxPoint("changxue_buy", {
			remmend_id: getLocalStorage(GLOBAL_KEY.superiorDistributeUserId)
		})
		this.checkUserFluentLearnStatus()
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
	 * 页面分享
	 * @param options
	 * @returns {{path: string, title: string}}
	 */
	onShareAppMessage(options) {
		bxPoint("changxue_buy_wx_share", {}, false)
		let accountInfoJsonData = getLocalStorage(GLOBAL_KEY.accountInfo)
		let accountInfo = accountInfoJsonData ? JSON.parse(accountInfoJsonData) : {}
		return {
			title: "课程全解锁，一卡学全年",
			path: `/mine/joinFluentLearn/joinFluentLearn${accountInfo.snow_id ? '?inviteId=' + accountInfo.snow_id : ''}`
		}
	},
	/**
	 * 学生卡专属弹窗回调事件
	 */
	onFluentLearnConfirm() {
		this.setData({
			didShowFluentLearnModal: false
		})
		wx.reLaunch({
			url: "/pages/userCenter/userCenter"
		})
	},
	/**
	 * 跳转到视频详情页
	 * @param e
	 */
	goToVideoDetail(e) {
		let {
			id,
			name,
			desc
		} = e.currentTarget.dataset.item
		bxPoint("changxue_buy_course_Learn", {
			series_id: id,
			kecheng_name: name,
			kecheng_subname: desc,
		}, false)
		wx.navigateTo({
			url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
		})
	},
	/**
	 * 生成上级分销用户信息缓存
	 */
	generateSuperiorDistributeUserCache(superiorId) {
		if (!superiorId) return
		this.initSuperId()

		// this.setData({
		// 	superiorDistributeUserId: superiorId
		// })
		setLocalStorage(GLOBAL_KEY.superiorDistributeUserId, superiorId)
		setLocalStorage(GLOBAL_KEY.superiorDistributeExpireTime, dayjs().add(2, "hour").format("YYYY-MM-DD HH:mm:ss"))
	},

	/**
	 * 清除上级分销用户信息缓存
	 */
	clearSuperiorDistributeUserCache() {
		removeLocalStorage(GLOBAL_KEY.superiorDistributeUserId)
		removeLocalStorage(GLOBAL_KEY.superiorDistributeExpireTime)
	},
	/**
	 * 分享按钮点击事件
	 */
	onShareBtnTap() {
		bxPoint("changxue_buy_post", {}, false)
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({
				didShowAuth: true
			})
		}

		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
		// wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
	},
	/**
	 * 授权失败
	 */
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	/**
	 * 授权成功
	 */
	authCompleteEvent() {
		this.initSuperId()
		this.checkUserFluentLearnStatus()
		this.setData({
			didShowAuth: false
		})
	},
	/**
	 * 检查用户学生卡状态
	 */
	checkUserFluentLearnStatus() {
		if (!hasUserInfo() || !hasAccountInfo()) return
		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		getFluentCardInfo({
			user_snow_id: accountInfo.snow_id
		}).then(({
			data
		}) => {
			if ($notNull(data) && data.status === FluentLearnUserType.active) {
				this.setData({
					didShowFluentLearnModal: true
				})
			}
		})
	},
	/**
	 * 购买学生卡
	 * @returns {Promise<void>}
	 */
	async buy() {
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({
				didShowAuth: true
			})
		}
		// 支付锁
		if (this.data.payLock) return
		this.setData({
			payLock: true
		})
		let t = setTimeout(() => {
			this.setData({
				payLock: false
			})
			clearTimeout(t)
		}, 1000)

		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		let {
			data
		} = await getFluentCardInfo({
			user_snow_id: accountInfo.snow_id
		})
		// 检查用户学生卡是否有效，有效直接返回"用户中心" （true => 已过期， false =>  未过期）
		let didUserFluentLearnCardExpired = $notNull(data) ? data.status === FluentLearnUserType.deactive : true
		if (!didUserFluentLearnCardExpired) {
			return wx.switchTab({
				url: "/pages/userCenter/userCenter"
			})
		}
		let params = {
			user_snow_id: accountInfo.snow_id,
			open_id: getLocalStorage(GLOBAL_KEY.openId),
		}
		// 检查是否存在分销上级用户ID
		let distributeUserId = this.data.superiorDistributeUserId
		if (distributeUserId != 0) {
			let distributeUserExpireTime = getLocalStorage(GLOBAL_KEY.superiorDistributeExpireTime)
			if (dayjs(distributeUserExpireTime).isAfter(dayjs())) {
				// 分销ID有效，上传分销上级用户ID
				params['recommend_user_snow_id'] = distributeUserId
			} else {
				// 分销ID过期，清除分销信息
				this.clearSuperiorDistributeUserCache()
			}
		}
		// 检查是否存在渠道字段
		if (this.data.payChannel != undefined) {
			params['channel'] = this.data.payChannel
		}
		// 如果是邀请码购买
		if (this.data.inviteCode !== '') {
			params.invite_code = this.data.inviteCode
			// jj-2021-03-12梨花
			bxPoint("changxue_invite_buy_pay", {
				remmend_id: this.data.superiorDistributeUserId
			}, false)
		} else {
			if (this.data.superiorDistributeUserId !== 0) {
				// jj-2021-03-12梨花
				bxPoint("changxue_invite_buy_pay", {
					remmend_id: this.data.superiorDistributeUserId
				}, false)
			} else {
				// jj-2021-03-12梨花
				bxPoint("changxue_buy_pay", {}, false)
			}
		}

		payForFluentCard(params).then(({
			data,
			code,
			message
		}) => {
			if (code === 0) {
				payFluentCard({
						id: data.id,
						name: "购买学生卡"
					})
					.then(() => {
						// 关闭邀请码购买弹窗
						this.closeCodeBox()
						// this.setData({
						// 	showCodeBox: false
						// })

						// TODO 购买学生卡成功，判断用户是否填写收货地址信息

						wx.navigateTo({
							url: "/mine/fluentCardCallback/fluentCardCallback"
						})
					})
					.catch((err) => {
						if (err.errMsg !== "requestPayment:fail cancel") {
							collectError({
								level: ErrorLevel.p0,
								page: "dd.joinFluentLearn.requestPayment",
								error_code: 500,
								error_message: err
							})
						}
					})
			} else {
				toast(message)
			}
		})
	},
	/**
	 * 获取学生卡权益
	 */
	getCardInfo() {
		getFluentLearnInfo().then(({
			data
		}) => {
			data.features = data.features.map(n => ({...n, titleAry: n.title.split('\n')}))
			this.setData({
				name: data.card_name,
				desc: data.description,
				features: data.features,
				video: data.video,
				video_cover: data.video_cover,
				price: data.price / 100,
				discountPrice: data.discount_price / 100
			})
		})
	},
	/**
	 * 获取热门课程
	 */
	getHotkecheng() {
		queryQualityVideoList({limit: 10}).then((data) => {
			data = data || []
			let list = data.map(item => ({
				id: item.kecheng_series.id,
				name: item.kecheng_series.teacher_desc,
				desc: item.kecheng_series.name,
				visit_count: item.kecheng_series.visit_count,
				teacherImg: item.teacher.avatar,
				coverImg: item.kecheng_series.cover_pic,
				teacherTxt: `${item.teacher.name}老师 ${item.teacher.teacher_desc}`
			}))
			this.setData({
				hotList: list
			})
		})
	},

	// 联系客服
	contactService() {
		this.setData({
			showContact: true
		})
		// jj-2021-03-12梨花
		bxPoint("changxue_contact", {}, false)
	},
	// 关闭联系客服
	onCloseContactModal() {
		this.setData({
			showContact: false
		})
	},
	// 打开邀请码购买弹窗
	openCodeModal() {
		if (hasUserInfo() && hasAccountInfo()) {
			this.setData({
				showCodeBox: true
			})
			// jj-2021-03-12梨花
			bxPoint("changxue_invite_buy", {
				remmend_id: this.data.superiorDistributeUserId
			}, false)
		} else {
			this.setData({
				didShowAuth: true
			})
		}
	},
	// 关闭邀请码购买弹窗
	closeCodeBox() {
		this.setData({
			showCodeBoxAnimate: true
		})
		setTimeout(() => {
			this.setData({
				showCodeBox: false,
				inviteCode: '',
			})

			wx.nextTick(() => {
				this.setData({
					showCodeBoxAnimate: false
				})
			})
		}, 230)
	},
	// 邀请码购买
	inviteCodeBuy() {
		if (this.data.inviteCode.trim() === '') {
			wx.showToast({
				title: '请输入您的邀请码',
				duration: 2000,
				icon: 'none'
			})
		} else {
			this.buy()
		}
	},
	// 输入邀请码
	inputInviteCode(e) {
		this.setData({
			inviteCode: e.detail.value
		})
	},
	// 初始化id值
	initSuperId() {
		let superiorId = this.data.inviteId
		if (!superiorId) return
		let userData = getLocalStorage(GLOBAL_KEY.accountInfo)
		let snowId = userData ? JSON.parse(userData).snow_id : ''
		if (String(snowId) !== String(superiorId) && Number(superiorId) !== 0) {
			getPartnerInfo({
				user_snow_id: superiorId
			}).then(res => {
				if (res.data.distribute_user && res.data.distribute_user.status === 2) {
					this.setData({
						superiorDistributeUserId: superiorId
					})
				}
			})
		}
	},
})
