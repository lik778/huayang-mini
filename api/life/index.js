import request from "../../lib/request"
import { URL } from "../../lib/config"

// 请求生活馆产品列表
export function getGoodLifeProductList(params) {
	return new Promise((resolve) => {
		request._get(URL.queryGoodLifeProducts, params)
			.then(({data}) => {
				resolve(data)
			})
	})
}
