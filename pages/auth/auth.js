import {
	wxGetUserInfoPromise
} from '../../utils/auth.js'
import {
	GLOBAL_KEY,
	Version
} from '../../lib/config.js'
import {
	bindUserInfo,
	bindWxPhoneNumber,
	checkFocusLogin,
	getWxInfo
} from "../../api/auth/index"
import {
	$notNull,
	getLocalStorage,
	setLocalStorage
} from "../../utils/util"
import {
	APP_LET_ID
} from "../../lib/config"
import {
	wxLoginPromise
} from "../../utils/auth"
import {
	checkUserDidNeedCoopen
} from "../../api/course/index"

Page({

	/**
	 * Page initial data
	 */
	data: {
		invite_user_id: 0,
		didGetPhoneNumber: false,
		show: false
	},
	jumpToPrivacy() {
		wx.navigateTo({
			url: '/pages/privacy/privacy'
		})
	},
	jumpToService() {
		wx.navigateTo({
			url: '/pages/service/service'
		})
	},
	/**
	 * 一键微信授权
	 */
	getUserInfo() {
		try {
			wxLoginPromise()
				.then(async (code) => {
					// 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
					let wxOriginUserInfo = await getWxInfo({
						code,
						app_id: APP_LET_ID.tx
					})
					// 缓存openId
					setLocalStorage(GLOBAL_KEY.openId, wxOriginUserInfo.openid)

					wxGetUserInfoPromise().then(async (response) => {
						const userInfo = response.userInfo
						let params = {
							open_id: getLocalStorage(GLOBAL_KEY.openId),
							avatar_url: userInfo.avatarUrl,
							city: userInfo.city,
							nickname: userInfo.nickName,
							province: userInfo.province,
							country: userInfo.country,
							gender: userInfo.gender
						}
						let originUserInfo = await bindUserInfo(params)
						setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
						this.setData({
							show: true
						})
					})
				})

		} catch (error) {
			console.log('用户取消微信授权')
		}
	},
	/**
	 * 一键获取微信手机号
	 * @param e
	 */
	async getPhoneNumber(e) {
		if (!e) return
		let {
			errMsg = '', encryptedData: encrypted_data = '', iv = ''
		} = e.detail

		// 是否强制手机号授权
		let didFocusLogin = await checkFocusLogin({
			app_version: Version
		})

		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({
					open_id,
					encrypted_data,
					iv,
					invite_user_id: this.data.invite_user_id
				})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
				// 判断用户是否需要引导加课程
				checkUserDidNeedCoopen({
					user_id: originAccountInfo.id
				}).then((data) => {
					// 1=>需要引导，2=>不需要引导
					if (+data === 1) {
						wx.navigateTo({
							url: "/pages/coopen/coopen"
						})
					} else {
						wx.switchTab({
							url: "/pages/practice/practice"
						})
					}
				})
			}
		} else {
			if (didFocusLogin) {
				// 审核人员的拒绝
				wx.switchTab({
					url: "/pages/discovery/discovery"
				})
			} else {
				// 用户的拒绝，对不起请继续授权
				console.error('用户拒绝手机号授权')
			}
		}
	},
	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		this.setData({
			invite_user_id: options.invite_user_id
		})
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
		wxLoginPromise()
			.then(async (code) => {
				let originUserInfo = await getWxInfo({
					code,
					app_id: APP_LET_ID.tx
				})
				if ($notNull(originUserInfo) && originUserInfo.nickname) {
					// 缓存openId、userInfo
					setLocalStorage(GLOBAL_KEY.openId, originUserInfo.openid)
					setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
					// 用户已完成微信授权，引导用户手机号授权
					this.setData({
						didGetPhoneNumber: true
					})
				}
			})
			.catch((error) => {
				console.error(error)
			})
	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	}
})