import request from "../../lib/request"
import { URL } from "../../lib/config"

export function getLiveList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.liveList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 获取推荐直播课程
export function getRecommendLiveList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.recommendLiveList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 获取游学产品列表
export function queryTravelList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getTravelList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 获取近期游学产品列表
export function queryRecentTravelList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getRecentTravelList, params).then(({
			data
		}) => {
			data = data || []
			data = data.map(n => n.travel_product)
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 增加游学产品访问数量
export function addTravelVisitNumber(params) {
	request._post(URL.addTravelVisitNo, params)
}

// 获取今日推荐课程
export function queryTodayRecommendCourse(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getTodayRecommendCourse, params).then(({
			data
		}) => {
			data = data || {}
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 获取精品课程列表
export function queryQualityVideoList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getQualityVideoList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

// 获取专栏课程
export function querySectionCourseList(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.getSectionCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

export function getLiveBannerList(params) {
	return new Promise(resolve => {
		request._get(URL.getLiveBannerList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

export function updateLiveStatus(params) {
	request._post(URL.updateLiveStatus, params)
}

export function setPoint(params) {
	return new Promise((resolve, reject) => {
		request._post(URL.point, params).then(({
			code
		}) => {
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
		request._get(URL.getRemind, params).then(({
			data
		}) => {
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
		request._get(URL.queryAttemptTimes).then(({
			data
		}) => {
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
		request._post(URL.getAttempt, params).then((response) => {
			resolve(response)
		}).catch(() => {
			reject()
		})
	})
}

/**
 * 花样大学首页弹窗任务
 * @param params
 * @returns {Promise<unknown>}
 */
export function getDiscoveryRemindData(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryDiscoveryRemindData, params).then(({
			data
		}) => {
			data = data || {}
			resolve(data)
		}).catch((err) => {
			reject(err)
		})
	})
}

/* 获取最新活动列表 */
export const getNewActivityList = params => {
	return request._get(URL.getNewActivityList, params)
}

/* 获取早上好背景模版 */
export const getGoodMorningBgTemplate = params => {
	return request._get(URL.getGoodMorningBgTemplate, params)
}

/* 获取首页头部视频列表 */
export const getIndexHeaderVideoList = params => {
	return request._get(URL.getIndexHeaderVideoList, params)
}

/* 获取品质商品 */
export const queryQualityItems = params => {
	return request._get(URL.getGoodLifeProducts, params)
}
