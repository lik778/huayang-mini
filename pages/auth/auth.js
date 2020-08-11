import { wxGetUserInfoPromise } from '../../utils/auth.js'
import { GLOBAL_KEY, Version } from '../../lib/config.js'
import { bindUserInfo, bindWxPhoneNumber, checkFocusLogin, getWxInfo } from "../../api/auth/index"
import { $notNull, getLocalStorage, hasUserInfo, setLocalStorage } from "../../utils/util"
import { APP_LET_ID } from "../../lib/config"
import { wxLoginPromise } from "../../utils/auth"
import { checkUserDidNeedCoopen } from "../../api/course/index"

Page({

	/**
	 * Page initial data
	 */
	data: {
		redirectPath: "",
		redirectType: "",
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
					let wxOriginUserInfo = await getWxInfo({code, app_id: APP_LET_ID.tx})
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
						this.setData({show: true})
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
		let didFocusLogin = await checkFocusLogin({app_version: Version})

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

				// 是否需要自定义调整页面
				if (this.data.redirectPath) {
					if (this.data.redirectType === "redirect") {
						wx.redirectTo({url: this.data.redirectPath})
					} else if (this.data.redirectType === "switch") {
						wx.switchTab({url: this.data.redirectPath})
					} else {
						wx.navigateTo({url: this.data.redirectPath})
					}
					return
				}

				// 判断用户是否需要引导加课程
				checkUserDidNeedCoopen({user_id: originAccountInfo.id}).then((data) => {
					// 1=>需要引导，2=>不需要引导
					if (+data === 1) {
						wx.navigateTo({
							url: "/pages/coopen/coopen?invite_user_id=" + this.data.invite_user_id
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
				// 强制授权请继续授权
			} else {
				// 随缘授权
				wx.switchTab({
					url: "/pages/discovery/discovery"
				})
			}
		}
	},
	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function ({invite_user_id = 0, redirectPath, redirectType}) {
		redirectPath = redirectPath ? redirectPath.replace("$", "?") : ""
		redirectPath = redirectPath ? redirectPath.replaceAll("#", "=") : ""
		this.setData({
			invite_user_id,
			redirectPath,
			redirectType
		})
		getApp().globalData.super_user_id = invite_user_id

		let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
		if ($notNull(accountInfo) && hasUserInfo()) {
			wx.switchTab({
				url: '/pages/practice/practice'
			})
			return
		}
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
				let originUserInfo = await getWxInfo({code, app_id: APP_LET_ID.tx})
				if ($notNull(originUserInfo) && originUserInfo.nickname) {
					// 缓存openId、userInfo
					setLocalStorage(GLOBAL_KEY.openId, originUserInfo.openid)
					setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
					// 用户已完成微信授权，引导用户手机号授权
					this.setData({didGetPhoneNumber: true})
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
	onShareAppMessage: function () {
		let data = getLocalStorage(GLOBAL_KEY.userId)
		return {
			title: "跟着花样一起变美，变自信",
			path: `/pages/auth/auth?invite_user_id=${data}`
		}
	}
})
