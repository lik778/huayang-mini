import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import { getFluentCardInfo, getPartnerInfo } from "../../api/mine/index"
import { GLOBAL_KEY } from "../../lib/config"
import request from "../../lib/request"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		h5Url: "",
		tipMsg: "",
		backUrl: "/pages/discovery/discovery",
		didShowFluentLearnModal: false,
		didShowAuth: false,
		btnText: "立即购买"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
		this.run()
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

	},
	async run() {
		// 授权检查
		if (!hasUserInfo() || !hasAccountInfo()) {
			return this.setData({didShowAuth: true})
		}

		let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))

		// 畅学卡检查
		let fluentCardInfo = await getFluentCardInfo({user_snow_id: accountInfo.snow_id})
		if (!$notNull(fluentCardInfo.data)) {
			return this.setData({tipMsg: "您还没有花样大学畅学卡", didShowFluentLearnModal: true, backUrl: "/mine/joinFluentLearn/joinFluentLearn"})
		}

		// 合伙人检查
		let partnerInfo = await getPartnerInfo({user_snow_id: accountInfo.snow_id})
		if ($notNull(partnerInfo.data)) {
			if (partnerInfo.data.distribute_user.status === 2) {
				return this.setData({tipMsg: "您的花样合伙人申请已通过啦", btnText: "去查看", didShowFluentLearnModal: true, backUrl: "/pages/userCenter/userCenter"})
			} else if (partnerInfo.data.distribute_user.status === 1) {
				return this.setData({tipMsg: "您的花样合伙人申请已提交，会由客服告知您最终的审核结果，先去花样大学学习吧", btnText: "去学习", didShowFluentLearnModal: true})
			}
		}

		this.generateURL(accountInfo.snow_id)
	},
	// 生成地址
	generateURL(id) {
		this.setData({h5Url: `${request.baseUrl}/#/home/applyForFluentPartner?data=${id}`})
	},
	// 允许授权
	authCompleteEvent() {
		this.setData({didShowAuth: false})
		this.reload()
	},
	// 取消授权
	authCancelEvent() {
		this.setData({didShowAuth: false})
		this.reload()
	},
	onFluentLearnConfirm() {
		wx.reLaunch({url: this.data.backUrl})
	},
	reload() {
		let t = setTimeout(() => {
			this.run()
			clearTimeout(t)
		}, 300)
	}
})
