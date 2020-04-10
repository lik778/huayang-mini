import request from "../../lib/request"
import { URL } from "../../lib/config"
import { $notNull } from "../../utils/util"

// 获取课程列表
export function getCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getCourseList + params).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取课程分类列表
export function getCourseTypeList() {
	return new Promise(resolve => {
		request._get(URL.getCourseTypeList).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 统计直播观看人次
export function statisticsWatchNo(params) {
	return new Promise(resolve => {
		request._post(URL.statisticsWatchNo, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取观看直播权限
export function getWatchLiveAuth(params) {
	return new Promise(resolve => {
		request._post(URL.getWatchLiveAuth, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 用户订阅
export function subscription(params) {
	return new Promise(resolve => {
		request._post(URL.subscription, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 上传formID
export function uploadFormId(params) {
	return new Promise(resolve => {
		request._post(URL.uploadFormId, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取订阅状态
export function getSubscriptionStatus(params) {
	return new Promise(resolve => {
		request._get(URL.getSubscriptionStatus + params).then(({code, data}) => {
			if (code === 0) {
				resolve($notNull(data))
			}
		})
	})
}

// 查询用户信息
export function queryUserInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getUserInfo, params).then(({data: info}) => {
			resolve(info)
		})
	})
}

// 获取直播间详情
export function getLiveInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getLiveInfo, params).then(({data}) => {
			resolve(data)
		})
	})
}
