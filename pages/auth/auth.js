// pages/auth/auth.js
import { wxGetUserInfoPromise, checkAuth } from '../../utils/auth.js'
import { GLOBAL_KEY } from '../../lib/config.js'
import { bindUserInfo, bindWxPhoneNumber } from "../../api/auth/index"
import { getLocalStorage, setLocalStorage, toast } from "../../utils/util"

Page({

	/**
	 * Page initial data
	 */
	data: {},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {

	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {

	},
	/**
	 * 一键微信授权
	 */
	getUserInfo() {
		try {
			wxGetUserInfoPromise().then(async (response) => {
				const userInfo = response.userInfo
				let params = {
					open_id: getLocalStorage(GLOBAL_KEY.openId),
					avatarUrl: userInfo.avatarUrl,
					city: userInfo.city,
					nickname: userInfo.nickName,
					province: userInfo.province,
					country: userInfo.country,
					gender: userInfo.gender
				}
				let originUserInfo = await bindUserInfo(params)
				setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
				// 返回上一页
				wx.nextTick(() => {
					wx.navigateBack()
				})
			})
		} catch (error) {
			toast('用户取消微信授权')
		}
	},
	/**
	 * 一键获取微信手机号
	 * @param e
	 */
	async getPhoneNumber(e) {
		if (!e) return
		let {errMsg = '', encryptedData: encrypted_data = '', iv = ''} = e.detail
		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({open_id, encrypted_data, iv})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			}
		} else {
			toast('用户拒绝手机号授权')
		}
	}
})
