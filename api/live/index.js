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
