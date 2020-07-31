import request from "../../lib/request"
import { GLOBAL_KEY, URL } from "../../lib/config"
import { getLocalStorage, setLocalStorage, toast } from "../../utils/util"

// 获取训练营课程详情
export function getBootCampCourseInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseInfo, params).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 记录用户训练行为
export function recordPracticeBehavior(params) {
	return new Promise(() => {
		request._post(URL.visitPracticeBehavior, params)
	})
}

// 获取某课程的最近的训练用户列表
export function getRecentVisitorList(params) {
	return new Promise(resolve => {
		request._get(URL.getRecentVisitor, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 在引导阶段获取推荐课程列表
export function queryBootCampCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseList, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 检查用户是否需要课程引导页动画
export function checkUserDidNeedCoopen(params) {
	return new Promise(resolve => {
		request._get(URL.didUserNeedCoopen, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 在引导阶段 - 加入推荐课程
export function joinCourseInGuide(params) {
	return new Promise(resolve => {
		request._post(URL.joinCourse, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取用户上课的信息
export function queryUserHaveClassesInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getUserHaveClassesInfo, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取用户已加入的课程
export function queryUserJoinedClasses(params) {
	return new Promise(resolve => {
		request._get(URL.getUserJoinedClasses, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 在个人课程页 - 获取推荐课程
export function queryRecommendCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getRecommendCourseList, params).then(({data}) => {
			resolve(data)
		})
	})
}
