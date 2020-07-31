import request from "../../lib/request"
import {
	GLOBAL_KEY,
	URL
} from "../../lib/config"
import {
	getLocalStorage,
	setLocalStorage,
	toast
} from "../../utils/util"

// 获取训练营课程详情
export function getBootCampCourseInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseInfo, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 加入训练营
export function joinCamp(params) {
	return new Promise(resolve => {
		request._post(URL.joinCamp, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取训练营详情
export function getCampDetail(params) {
	return new Promise(resolve => {
		request._get(URL.getCampDetail, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 判断用户是否已经加入训练营
export function getHasJoinCamp(params) {
	return new Promise(resolve => {
		request._get(URL.getHasJoinCamp, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取训练营列表

export function getCampList(params) {
	return new Promise(resolve => {
		request._get(URL.getCampList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取发现页banner
export function getFindBanner(params) {
	return new Promise(resolve => {
		request._get(URL.getFindBanner, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取发现页banner
export function getShowCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getShowCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取活动列表
export function getActivityList(params) {
	return new Promise(resolve => {
		request._get(URL.getActivityList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 获取单日活动内容
export function getCurentDayData(params) {
	return new Promise(resolve => {
		request._get(URL.getCurentDayData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}