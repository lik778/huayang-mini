import { APP_LET_ID, GLOBAL_KEY, Version } from "../lib/config"
import { $notNull, getLocalStorage, hasUserInfo, setLocalStorage } from "./util"
import { checkFocusLogin, getWxInfo } from "../api/auth/index"

/**
 * 鉴权
 * @param listenable 是否检查session有效性
 * @param ignoreFocusLogin 是否忽略强制授权校验
 * @returns {Promise<unknown>}
 */
const checkAuth = async ({listenable = false, ignoreFocusLogin = false} = {}) => {
	// 是否强制手机号授权
	let didFocusLogin = await checkFocusLogin({app_version: Version})

	if (ignoreFocusLogin || didFocusLogin) {

		if (listenable) {
			return wxLogin()
		} else {
			return new Promise(resolve => {
				if (hasUserInfo()) {
					wxCheckSessionPromise().then(() => {
						resolve()
					}).catch(() => {
						wxLogin().then(() => {
							resolve()
						})
					})
				} else {
					wxLogin().then(() => {
						resolve()
					})
				}
			})
		}

	}
}

const wxLogin = () => {
	return new Promise((resolve, reject) => {
		// 获取最新 res.code 到后台换取 微信用户信息
		wxLoginPromise()
			.then(async (code) => {
				// 是否强制手机号授权
				let didFocusLogin = await checkFocusLogin({app_version: Version})
				// 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
				let originUserInfo = await getWxInfo({code, app_id: APP_LET_ID.tx})
				// 缓存openId
				setLocalStorage(GLOBAL_KEY.openId, originUserInfo.openid)

				if (didFocusLogin) {
					// 获取用户手机号授权信息
					let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
					if ($notNull(accountInfo)) {

					} else {
						// 跳转到授权页面
						wx.navigateTo({
							url: '/pages/auth/auth'
						})
						reject()
					}
				}

				if ($notNull(originUserInfo) && originUserInfo.nickname) {
					// 服务端返回用户信息包含username，缓存在本地
					setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
					resolve()
				} else {
					// 跳转到授权页面
					wx.navigateTo({
						url: '/pages/auth/auth'
					})
					reject()
				}
			})
			.catch((error) => {
				console.error(error)
			})
	})
}

/**
 * wx.checkSession Promise
 * @returns {Promise<unknown>}
 */
function wxCheckSessionPromise() {
	return new Promise((resolve, reject) => {
		wx.checkSession({
			success() {
				// console.log('session_key valid')
				resolve()
			},
			fail() {
				// console.log('session_key invalid')
				reject()
			}
		})
	})
}

/**
 * wx.login Promise
 * @returns {Promise<unknown>}
 */
function wxLoginPromise() {
	return new Promise((resolve, reject) => {
		wx.login({
			success(res) {
				if (res.code) {
					resolve(res.code)
				} else {
					reject(res.errMsg)
				}
			}
		})
	})
}

/**
 * wx.getUserInfo Promise
 * @returns {Promise<unknown>}
 */
function wxGetUserInfoPromise() {
	return new Promise((resolve, reject) => {
		wx.getUserInfo({
			success(res) {
				resolve(res)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}

/**
 * wx.getSetting Promise
 * 微信授权记录
 * @param withSubscriptions
 * @returns {Promise<unknown>}
 */
function wxGetSettingPromise(withSubscriptions = false) {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			withSubscriptions,
			success(settings) {
				resolve(settings)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

export {
	wxCheckSessionPromise,
	wxLoginPromise,
	wxGetUserInfoPromise,
	wxGetSettingPromise,
	checkAuth
}
