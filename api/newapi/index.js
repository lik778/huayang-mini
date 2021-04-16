// queryFreeOnlineCourse:"/hy/kecheng/onlineFree/getAllCourses",
// queryActivityColledgeList:"/hy/activity/list"
import request from "../../lib/request"
import { URL } from "../../lib/config"

export function getFreeOnlineCourse(params) {
	return new Promise((resolve) => {
		request._get(URL.queryFreeOnlineCourse, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getActivityColledgeList(params) {
	return new Promise((resolve) => {
		request._get(URL.queryActivityColledgeList, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}