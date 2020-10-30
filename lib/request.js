import { APP_ID, GLOBAL_KEY, ROOT_URL, SECRET, } from './config'
import { getLocalStorage, queryToken, toast } from "../utils/util"

// const baseUrl = ROOT_URL.prd
const baseUrl = ROOT_URL.dev
const md5 = require("md5")
const http = ({url = '', param = {}, ...other} = {}) => {
	return new Promise((resolve, reject) => {
		var timestamp = (+new Date() / 1000) | 0
		var token = queryToken() || ''
		var userId = getLocalStorage(GLOBAL_KEY.userId) || ''
		wx.request({
			url: getUrl(url),
			data: param,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'appid': APP_ID.applets,
				'nonce': timestamp,
				'signature': md5(
					'huayang' + '_' + APP_ID.applets + '_' + SECRET.applets + '_' + timestamp
				),
				't': token,
				'u': userId,
				's': APP_ID.applets,
			},
			...other,
			complete: (res) => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					if (res.data.code === -1) {
						reject(res.data.message)
						toast(res.data.message)
					} else if (res.data.code === -2) {
						// 登陆校验失败
						wx.removeStorageSync(GLOBAL_KEY.token)
						wx.removeStorageSync(GLOBAL_KEY.accountInfo)
						wx.removeStorageSync(GLOBAL_KEY.userId)
						wx.showToast({
							title: '登录校验失败',
							icon: "none",
							duration: 2000
						})
						resolve(res.data)
					} else {
						resolve(res.data)
					}
				} else {
					reject(res)
				}
			}
		})
	})
}

const getUrl = (url) => {
	if (url.indexOf('://') === -1) {
		url = baseUrl + url
	}
	return url
}

// get方法
const _get = (url, param = {}) => {
	return http({
		url,
		param
	})
}

const _post = (url, param = {}) => {
	return http({
		url,
		param,
		method: 'post'
	})
}

const _put = (url, param = {}) => {
	return http({
		url,
		param,
		method: 'put'
	})
}

const _delete = (url, param = {}) => {
	return http({
		url,
		param,
		method: 'put'
	})
}

export default {
	baseUrl,
	_get,
	_post,
	_put,
	_delete
}
