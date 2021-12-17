import request from "../../lib/request"
import {URL} from "../../lib/config"

// 保存新年flag
export const saveNewYearFlag = params => {
	return request._post(URL.saveNewYearFlagIn2020, params)
}

// 获取新年flag列表
export const getNewYearList = params => {
	return request._get(URL.queryNewYearFlagListIn2020, params)
}
