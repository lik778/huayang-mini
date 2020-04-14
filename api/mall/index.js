import request from "../../lib/request"
import { URL } from "../../lib/config"

export function getProductInfo(params) {
	return new Promise((resolve) => {
		request._get(URL.getProductInfo, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getProductList(params) {
	return new Promise((resolve) => {
		request._get(URL.getProductList, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getCategory(params) {
	return new Promise(resolve => {
		request._get(URL.getCategory, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getBannerList(params) {
	return new Promise(resolve => {
		request._get(URL.mallBanner, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}
