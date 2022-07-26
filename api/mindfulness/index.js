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
			.then(({data}) => {
				resolve(data)
			})
	})
}

// 获取用户正念练习的统计信息
export function getMindfulnessStatistics(params) {
	return new Promise((resolve) => {
		request._get(URL.queryMindfulnessStatistics, params)
			.then(({data}) => {
				resolve(data)
			})
	})
}

// 获取正念练习历程
export function getMindfulnessCalendar(params) {
	return new Promise((resolve) => {
		request._get(URL.queryMindfulnessCalendar, params)
			.then(({data}) => {
				resolve(data)
			})
	})
}

// 请求游学列表
export function getTravelList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryTravelList, params).then(({data}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}
