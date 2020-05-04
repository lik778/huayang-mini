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

export function getProductListByCategory(params) {
	return new Promise((resolve) => {
		request._get(URL.getProductListByCategory, params).then(({ data }) => {
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

export function getYouZanAppId() {
	return new Promise(resolve => {
		request._get(URL.getYouZanAppId).then(({ data }) => {
			data = data || {}
			let validAppId = ""
			Object.entries(data).forEach(([key, value]) => {
				if (+value === 1) {
					validAppId = key
				}
			})
			resolve(validAppId)
		})
	})
}
