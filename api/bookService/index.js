import request from "../../lib/request"
import { URL } from "../../lib/config"

export const uploadBookServiceResource = params => {
	return request._post(URL.bookServiceResourceUpload, params)
}

export const getMagazineTemplateList = params => {
	return request._get(URL.queryMagazineTemplate, params)
}

export const createMagazineOrder = params => {
	return request._post(URL.newMagazineOrder, params)
}

export const getUserMagazineList = params => {
	return request._get(URL.queryUserMagazineList, params)
}
