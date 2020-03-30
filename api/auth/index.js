import request from "../../lib/request"
import {URL} from "../../lib/config"

/**
 * 用微信code换取服务端的用户信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getWxInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getWxInfo, params).then(({ data }) => {
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
		request._post(URL.bindUserInfo, params).then(({ code }) => {
			if (code === 0) {
				resolve()
			}
		})
	})
}
