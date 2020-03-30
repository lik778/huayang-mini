import request from "../../lib/request"
import {URL} from "../../lib/config"

export function getWxInfo(params) {
	return request._get(URL.getWxInfo, params)
}
