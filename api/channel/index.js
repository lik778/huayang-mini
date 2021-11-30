import request from "../../lib/request"
import { URL } from "../../lib/config"

export function getChannelLives(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryChannelLives, params).then(({data: {list}}) => {
			list = list || []
			resolve(list)
		}).catch((err) => {
			reject(err)
		})
	})
}


/**
 * 订阅小程序消息通知
 * @param params
 * @returns {Promise<unknown>}
 */
export const subscribeMiniProgramMessage = (params) => {
	return new Promise((resolve, reject) => {
		request._post(URL.subscribeMiniMessage, params).then(({data,code}) => {
			if (code === 0) {
				resolve(data)
			}
		}).catch((err) => {
			reject(err)
		})
	})
}

