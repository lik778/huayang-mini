import request from "../../lib/request"
import { URL } from "../../lib/config"

/**
 * 获取个人相册集详情
 * @param params
 * @returns {Promise<unknown>}
 */
export function getPersonAlbumDetail(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryPersonAlbumDetail, params)
			.then(({data}) => {
				resolve(data)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

/**
 * 获取个人相册所属活动信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getPeronAlbumInActivity(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryPersonAlbumMessage, params)
			.then(({data}) => {
				resolve(data)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

/**
 * 获取相册信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getPhotoAlbumDetail(params) {
	return new Promise((resolve, reject) => {
		request._get(URL.queryAlbumDetail, params)
			.then(({data}) => {
				resolve(data)
			})
			.catch((err) => {
				reject(err)
			})
	})
}
