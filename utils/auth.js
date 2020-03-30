import { GLOBAL_KEY, WX_AUTH_TYPE } from "../lib/config"
import { $notNull, hasUserInfo, setLocalStorage } from "./util"
import { getWxInfo } from "../api/auth/index"

const checkAuth = () => {
	if (hasUserInfo()) return;
	// 获取最新 res.code 到后台换取 微信用户信息
	wxLoginPromise()
		.then(async (code) => {
			// 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
			let originUserInfo = await getWxInfo({code, app_id: "wx85d130227f745fc5"})
			// 缓存openId
			setLocalStorage(GLOBAL_KEY.openId, originUserInfo.openid)
			if ($notNull(originUserInfo) && originUserInfo.nickname) {
				// 服务端返回用户信息包含username，缓存在本地
				setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
			} else {
				// 跳转到授权页面
				wx.navigateTo({
					url: '/pages/auth/auth'
				})
			}
		})
		.catch((error) => {
			console.error(error)
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
				// session_key valid
				resolve()
			},
			fail() {
				// session_key invalid
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
 * @param authKey
 * @returns {Promise<unknown>}
 */
function wxGetSettingPromise(authKey = WX_AUTH_TYPE.userInfo) {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success({authSetting}) {
				resolve(authSetting)
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
