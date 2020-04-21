import request from "../../lib/request"
import {
	URL,
	GLOBAL_KEY
} from "../../lib/config"
import {
	toast
} from "../../utils/util"
import {
	setLocalStorage,
	getLocalStorage
} from "../../utils/util"
/**
 * 微信会员下单
 * @param params
 * @returns {Promise<unknown>}
 */
export function createOrder(params) {
	return new Promise((resolve,reject) => {
		request._post(URL.createOrder, params).then(({
			data,
			code,
			message
		}) => {
			if (code === 0) {
				// 调用获取支付凭证
				let getPaySignParams = {
					open_id: getLocalStorage(GLOBAL_KEY.openId),
					product_title: "花样会员",
					order_id: data.id,
					app_id: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).app_id
					// app_id:"wx5705fece1e1cdc1e"
				}
				getPaySign(getPaySignParams).then(res => {
					resolve(res)
				})
			} else {
				wx.showToast({
					title: message,
					icon: "none",
					duration: 3000
				})
				resolve(0)
			}
		}).catch(err=>{
			reject(err)
		})
	})
}
/**
 * 获取微信支付凭证
 * @param params
 * @returns {Promise<unknown>}
 */
export function getPaySign(params) {
	return new Promise(resolve => {
		request._post(URL.getPaySign, params).then(({
			data,
			code
		}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}