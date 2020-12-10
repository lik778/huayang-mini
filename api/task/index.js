import request from "../../lib/request"
import { URL } from "../../lib/config"

/**
 * 获取阿里云视频证书
 * @param params
 * @returns {Promise<unknown>}
 */
export function getOssCertificate(params) {
	return request._get(URL.queryOssCertificate, params)
}

/**
 * 获取作业发布时需要填写的所属课程
 * @param params
 * @returns {Promise<unknown>}
 */
export function getTaskBelongList(params) {
	return request._get(URL.queryTaskBelongList, params)
}

/**
 * 发布作业
 * @param params
 */
export function publishTask(params) {
	return request._post(URL.launchTask, params)
}

/**
 * 获取作业流
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function getTaskStream(params) {
	return request._get(URL.taskStream, params)
}
