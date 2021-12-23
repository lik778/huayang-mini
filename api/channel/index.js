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
 * 直播预告首页显示
 * @param params
 * @returns {Promise<unknown>}
 */
export function getHomeChannelLive(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryHomeChannelLive, params).then(({data}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

/**
 * 获取当前时间段的视频号直播信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getCurrentTimeChannelLiveInfo(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryCurrentTimeChannelLive, params).then(({data}) => {
			data = data || {}
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

/**
 * 获取用户预约的单场视频号直播间
 * @param params
 * @returns {Promise<unknown>}
 */
export function getHistorySubscribeLives(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryHistorySubscribeChannelLives, params).then(({data}) => {
			resolve(data)
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

