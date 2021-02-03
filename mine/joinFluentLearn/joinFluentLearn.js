import { getFluentCardHotkecheng, getFluentCardInfo, getFluentLearnInfo, payForFluentCard } from "../../api/mine/index"
import {
	$notNull,
	getLocalStorage,
	hasAccountInfo,
	hasUserInfo,
	payFluentCard,
	removeLocalStorage,
	setLocalStorage
} from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"
import dayjs from "dayjs"
import { collectError } from "../../api/auth/index"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: "",
		desc: "",
		features: [],
		video: "",
		hotList: [],
		didShowAuth: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {scene, inviteId} = options
    if (scene) {
      // 小程序二维码
      let sceneAry = decodeURIComponent(scene).split('/')
      let [sceneInviteId] = sceneAry
      this.generateSuperiorDistributeUserCache(sceneInviteId)
    } else {
      // 小程序卡片
      this.generateSuperiorDistributeUserCache(inviteId)
    }

		this.getCardInfo()
		this.getHotkecheng()
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
		bxPoint("changxue_buy", {})
		// 已购买畅学卡的用户访问时跳转到权益页
		if (hasUserInfo() && hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
				if ($notNull(data)) {
					wx.redirectTo({url: "/mine/fluentLearnInfo/fluentLearnInfo"})
				}
			})
		}
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
			title: "花样大学畅学卡，精彩课程，随时随地，想看就看",
			path: `/mine/joinFluentLearn/joinFluentLearn${accountInfo.snow_id ? '?inviteId='+accountInfo.snow_id : ''}`
		}
	},
	/**
	 * 跳转到视频详情页
	 * @param e
	 */
	goToVideoDetail(e) {
		let {id, name, desc} = e.currentTarget.dataset.item
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
			return this.setData({didShowAuth: true})
		}

		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
	},
	/**
	 * 授权成功
	 */
	authCancelEvent() {
		this.setData({didShowAuth: false})
		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
			if ($notNull(data)) {
				wx.showModal({
					title: '提示',
					content: '您已拥有花样大学畅学卡',
					confirmText: '立即查看',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							wx.reLaunch({url: "/pages/userCenter/userCenter"})
						}
					}
				})
			}
		})
	},
	/**
	 * 授权失败
	 */
	authCompleteEvent() {
		this.setData({didShowAuth: false})
	},
	/**
	 * 购买畅学卡
	 * @returns {Promise<void>}
	 */
	async buy() {
		bxPoint("changxue_buy_pay", {}, false)
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({didShowAuth: true})
		}
		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
		let {data} = await getFluentCardInfo({user_snow_id: accountInfo.snow_id})
		// 检查用户畅学卡是否有效，有效直接返回"用户中心" （true => 已过期， false =>  未过期）
		let didUserFluentLearnCardExpired = $notNull(data) ? dayjs(data.expire_time).isBefore(dayjs()) : true
		if (!didUserFluentLearnCardExpired) {
			return wx.switchTab({url: "/pages/userCenter/userCenter"})
		}
		let params = {
			user_snow_id: accountInfo.snow_id,
			open_id: getLocalStorage(GLOBAL_KEY.openId),
		}
		// 检查是否存在分销上级用户ID
		let distributeUserId = getLocalStorage(GLOBAL_KEY.superiorDistributeUserId)
		if (distributeUserId) {
			let distributeUserExpireTime= getLocalStorage(GLOBAL_KEY.superiorDistributeExpireTime)
			if (dayjs(distributeUserExpireTime).isAfter(dayjs())) {
				// 分销ID有效，上传分销上级用户ID
				params['recommend_user_snow_id'] = distributeUserId
			} else {
				// 分销ID过期，清除分销信息
				this.clearSuperiorDistributeUserCache()
			}
		}
		let {data: {id: order_id} = {}} = await payForFluentCard(params)
		payFluentCard({id: order_id, name: "购买畅学卡"})
			.then(() => {
				getApp().globalData.didNeedReloadUserCenterfluentLearnCardInfo = true
				wx.switchTab({url: "/pages/userCenter/userCenter"})
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
	},
	/**
	 * 获取畅学卡权益
	 */
	getCardInfo() {
		getFluentLearnInfo().then(({data}) => {
			this.setData({
				name: data.card_name,
				desc: data.description,
				features: data.features,
				video: data.video
			})
		})
	},
	/**
	 * 获取热门课程
	 */
	getHotkecheng() {
		getFluentCardHotkecheng({limit: 5}).then(({data}) => {
			data = data || []
			let list = data.map(item => ({
				id: item.kecheng_series.id,
				name: item.kecheng_series.name,
				desc: item.kecheng_series.desc,
				visit_count: item.kecheng_series.visit_count,
				teacherImg: item.teacher.avatar,
				teacherTxt: `${item.teacher.name}老师 ${item.teacher.teacher_desc}`
			}))
			this.setData({hotList: list})
		})
	}
})
