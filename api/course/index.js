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
