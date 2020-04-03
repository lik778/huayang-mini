import request from "../../lib/request"
import { URL, GLOBAL_KEY } from "../../lib/config"
import { toast } from "../../utils/util"
import { setLocalStorage } from "../../utils/util"

export function getLiveList(params) {
	return new Promise(resolve => {
		request._get(URL.liveList, params).then(({data}) => {
			data = data || []
			resolve(data)
		})
	})
}

