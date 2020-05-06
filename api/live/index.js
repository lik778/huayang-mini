import request from "../../lib/request"
import { URL } from "../../lib/config"

export function getLiveList(params) {
	return new Promise(resolve => {
		request._get(URL.liveList, params).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getLiveBannerList(params) {
	return new Promise(resolve => {
		request._get(URL.getLiveBannerList, params).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

export function updateLiveStatus(params) {
	return new Promise((resolve, reject) => {
		request._post(URL.updateLiveStatus, params).then(({code}) => {
			if (code === 0) {
				resolve()
			}
			reject()
		}).catch(() => {
			reject()
		})
	})
}

export function setPoint(params) {
	return new Promise((resolve, reject) => {
		request._post(URL.point, params).then(({ code }) => {
			if (code === 0) {
				resolve()
			}
			reject()
		}).catch(() => {
			reject()
		})
	})
}

/**
 * 查询弹窗内容
 * @param params
 * @returns {Promise<unknown>}
 */
export function getRemind(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getRemind, params).then(({ data }) => {
			resolve(data)
		}).catch(() => {
			reject()
		})
	})
}

/**
 * 获取试用会员天数
 * @returns {Promise<unknown>}
 */
export function getAttemptTimes() {
	return new Promise((resolve, reject) => {
		request._get(URL.queryAttemptTimes).then(({data}) => {
			resolve(data)
		}).catch(() => {
			reject()
		})
	})
}

/**
 * 领取试用会员
 * @param params
 * @returns {Promise<unknown>}
 */
export function getAttempt(params) {
	return new Promise((resolve, reject) => {
		request._post(URL.getAttempt, params).then(({code}) => {
			if (code === 0) {
				resolve()
			}
			reject()
		}).catch(() => {
			reject()
		})
	})
}
