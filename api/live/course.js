import request from "../../lib/request"
import { URL, GLOBAL_KEY } from "../../lib/config"
import { toast } from "../../utils/util"
import { setLocalStorage } from "../../utils/util"
// 获取课程列表
export function getCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getCourseList+params).then(({data}) => {
			data=data||[]
			resolve(data)
		})
	})
}
// 获取课程分类列表
export function getCourseTypeList() {
	return new Promise(resolve => {
		request._get(URL.getCourseTypeList).then(({data}) => {
			resolve(data)
		})
	})
}

// 统计直播观看人次
export function getWatchLiveNum(params) {
	return new Promise(resolve => {
		request._post(URL.getCourseTypeList,params).then(({data}) => {
			resolve(data)
		})
	})
}
// 获取观看直播权限
export function getWatchLiveAuth(params){
	return new Promise(resolve => {
		request._post(URL.getWatchLiveAuth,params).then(({data}) => {
			resolve(data)
		})
	})
}

// 用户订阅
export function subscription(params){
	return new Promise(resolve => {
		request._post(URL.subscription,params).then(({data}) => {
			resolve(data)
		})
	})
}


// 上传formID
export function uploadFormId(params){
	return new Promise(resolve => {
		request._post(URL.uploadFormId,params).then(({data}) => {
			resolve(data)
		})
	})
}
// 获取订阅状态
export function getSubscriptionStatus(params){
	return new Promise(resolve => {
		request._get(URL.getSubscriptionStatus+params).then(({data}) => {
			resolve(data)
		})
	})
}