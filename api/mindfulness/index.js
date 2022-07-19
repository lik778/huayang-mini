import request from "../../lib/request"
import { URL } from "../../lib/config"

// 请求生活馆产品列表
export function getMindfulnessList(params) {
	return new Promise((resolve) => {
		request._get(URL.queryMindfulnessList, params)
			.then(({data}) => {
				resolve(data)
			})
	})
}

// 获取单节正念练习详情
export function getMindfulnessDetail(params) {
	return new Promise((resolve) => {
		request._get(URL.queryMindfulnessDetail, params)
			.then(({data}) => {
				resolve(data)
			})
	})
}

// 正念打卡
export function checkInMindfulness(params) {
	return new Promise((resolve) => {
		request._post(URL.checkMindfulness, params)
			.then(() => {
				resolve()
			})
	})
}
