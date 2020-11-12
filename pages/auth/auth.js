import { wxGetUserInfoPromise } from '../../utils/auth.js'
import { GLOBAL_KEY, Version } from '../../lib/config.js'
import { bindUserInfo, bindWxPhoneNumber, checkFocusLogin, getWxInfo } from "../../api/auth/index"
import { $notNull, getLocalStorage, hasUserInfo, setLocalStorage } from "../../utils/util"
import { APP_LET_ID } from "../../lib/config"
import { wxLoginPromise } from "../../utils/auth"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * Page initial data
	 */
	data: {
		redirectPath: "",
		redirectType: "redirect",
		invite_user_id: "",
		fromWebView: true,
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
						bxPoint("applets_auth_status", {auth_type: "weixin", auth_result: "success"}, false)
						this.setData({
							show: true
						})
					}).catch(() => {
						// 用户取消微信授权
						bxPoint("applets_auth_status", {auth_type: "weixin", auth_result: "fail"}, false)
					})
				})
		} catch (error) {
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
				bxPoint("applets_auth_status", {auth_type: "phone", auth_result: "success"}, false)
				// 是否需要自定义调整页面
				if (this.data.redirectPath) {
					if (this.data.redirectType === "redirect") {
						wx.redirectTo({
							url: this.data.redirectPath
						})
					} else if (this.data.redirectType === "switch") {
						wx.switchTab({
							url: this.data.redirectPath
						})
					} else if (this.data.redirectType === 'navigation') {
						// 表演赛
						let link = this.data.redirectPath.split("?link=")[1]
						let naviLink = "/subCourse/competitionWebview/competitionWebview"
						wx.navigateTo({
							url: this.data.redirectPath
						})
					} else if (!this.data.fromWebView) {
						let user_id = getLocalStorage(GLOBAL_KEY.userId)
						let user_grade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
						let link = this.data.redirectPath.split("?link=")[1]
						let rootUrl = '/pages/webViewCommon/webViewCommon?link='
						link = encodeURIComponent(`${link}&user_id=${user_id}&user_grade=${user_grade}`)
						wx.navigateTo({
							url: `${rootUrl}${link}&type=link&isModel=true`,
						})
					} else {
						console.log(this.data.redirectPath)
						wx.navigateTo({
							url: this.data.redirectPath
						})
					}
					return
				}
			}
		} else {
			bxPoint("applets_auth_status", {auth_type: "phone", auth_result: "fail"}, false)
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
	onLoad: function (options) {
		let {
			invite_user_id = "", source = '', redirectPath, redirectType, fromWebView = 0, didNeedDecode = 0, needDecode = false
		} = options

		if (+didNeedDecode === 1) {
			redirectPath = decodeURIComponent(redirectPath)
		}

		if (needDecode) {
			redirectPath = decodeURIComponent(redirectPath)
		}

		console.log(redirectPath)
		if (Number(fromWebView) === 1) {
			redirectPath = decodeURIComponent(redirectPath)
		}
		this.setData({
			invite_user_id,
			redirectPath,
			redirectType,
			fromWebView: fromWebView === 0 ? true : false
		})
		if (invite_user_id) {
			getApp().globalData.super_user_id = invite_user_id
		}
		if (source) {
			getApp().globalData.source = source
		}

		let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
		if ($notNull(accountInfo) && hasUserInfo()) {
			if (Number(fromWebView) === 1) {
				let user_id = getLocalStorage(GLOBAL_KEY.userId)
				let user_grade = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade
				let link = this.data.redirectPath.split("?link=")[1]
				let rootUrl = '/pages/webViewCommon/webViewCommon?link='
				link = encodeURIComponent(`${link}&user_id=${user_id}&user_grade=${user_grade}`)
				wx.navigateTo({
					url: `${rootUrl}${link}&type=link&isModel=true`,
				})
			} else {
				wx.switchTab({
					url: '/pages/practice/practice'
				})
			}
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
