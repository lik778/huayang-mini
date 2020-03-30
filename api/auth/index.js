import request from "../../lib/request"
import { URL, GLOBAL_KEY } from "../../lib/config"
import { toast } from "../../utils/util"
import { setLocalStorage } from "../../utils/util"

/**
 * 用微信code换取服务端的用户信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getWxInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getWxInfo, params).then(({data}) => {
			resolve(data)
		})
	})
}

/**
 * 把微信用户信息绑定到服务端
 * @param params
 * @returns {Promise<unknown>}
 */
export function bindUserInfo(params) {
	return new Promise(resolve => {
		request._post(URL.bindUserInfo, params).then(({code, data}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}

/**
 * 绑定用户手机号
 * @param params
 * @returns {Promise<unknown>}
 */
export function bindWxPhoneNumber(params) {
	return new Promise(resolve => {
		request._post(URL.bindWxPhoneNumber, params).then(({data, code}) => {
			// 服务端解析微信敏感数据失败
			if (code === 112) {
				toast('授权失败，请重试')
			} else {
				// 缓存token、userId
				setLocalStorage(GLOBAL_KEY.userId, data.id)
				setLocalStorage(GLOBAL_KEY.token, data.token)
				// 返回用户积分账户
				resolve(data)
			}
		})
	})
}
