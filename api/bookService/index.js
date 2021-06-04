import request from "../../lib/request"
import { URL } from "../../lib/config"

export const uploadBookServiceResource = params => {
	return request._post(URL.bookServiceResourceUpload, params)
}
