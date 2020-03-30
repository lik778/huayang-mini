import { GLOBAL_KEY, WX_AUTH_TYPE } from "../lib/config"
import { $notNull } from "./util"
import { getWxInfo } from "../api/auth/index"

const checkAuth = () => {
	// 获取最新 res.code 到后台换取 微信用户信息
	wxLoginPromise()
		.then((code) => {
			console.log(`返回的微信code = ${code}`)
			// 用code查询服务端是否有该用户信息，如果有直接使用，反之从微信获取用户信息保存到服务端
			// TODO 服务端获取用户信息，暂时使用本地缓存模拟
			getWxInfo({code, app_id: "wx85d130227f745fc5"}).then((res) => {
				console.log(res);
			})
			let originData = wx.getStorageSync(GLOBAL_KEY.userInfo)
			if ($notNull(originData)) {
				wx.setStorageSync(GLOBAL_KEY.userInfo, originData)
			} else {
				// 跳转到授权页面
				wx.redirectTo({
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
