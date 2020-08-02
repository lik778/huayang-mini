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

// 获取某节课程最近的训练行为列表
export function getRecentVisitorList(params) {
	return new Promise(resolve => {
		request._get(URL.getRecentVisitor, params).then(({data}) => {
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

// [在引导阶段] - 获取推荐课程列表
export function queryBootCampCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseList, params).then(({data}) => {
			resolve(data)
		})
	})
}

// [在引导阶段] - 加入推荐课程
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

// 创建当日练习记录
export function createPracticeRecordInToday(params) {
	return new Promise(resolve => {
		request._post(URL.recordPracticeInToday, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取用户练习打卡记录
export function queryUserRecentPracticeLog(params) {
	return new Promise(resolve => {
		request._get(URL.getUserRecentPracticeLog, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 完成训练
export function completePractice(params) {
	return new Promise(resolve => {
		request._post(URL.donePractice, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取用户已经加入的训练营
export function queryUserJoinedBootCamp(params) {
	return new Promise(resolve => {
		request._get(URL.getUserJoinedBootCamp, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 获取当日训练营内容
export function queryBootCampContentInToday(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampDetail, params).then(({data}) => {
			resolve(data)
		})
	})
}

// 放弃训练营
export function exitBootCamp(params) {
	return new Promise(resolve => {
		request._post(URL.quitBootCamp, params).then(() => {
			resolve()
		})
	})
}

// 放弃课程
export function exitCourse(params) {
	return new Promise(resolve => {
		request._post(URL.quitCourse, params).then(() => {
			resolve()
		})
	})
}
