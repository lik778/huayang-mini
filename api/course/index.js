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
