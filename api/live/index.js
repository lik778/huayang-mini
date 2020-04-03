import request from "../../lib/request"
import { URL, GLOBAL_KEY } from "../../lib/config"
import { toast } from "../../utils/util"
import { setLocalStorage } from "../../utils/util"

export function getLiveList(params) {
	return new Promise(resolve => {
		request._get(URL.liveList, params).then(({data}) => {
			data = data || []
			// TODO 截取已创建的微信直播间
			data = data.filter((t) => [6, 7].includes(t.zhibo_room.num))
			const result = data.map(item => {
				return {
					id: item.zhibo_room.id,
					roomId: item.zhibo_room.num,
					roomType: item.zhibo_room.room_type,
					roomName: item.zhibo_room.title,
					userId: item.zhibo_room.user_id,
					visitCount: item.zhibo_room.visit_count,
					coverPicture: item.zhibo_room.cover_pic,
					sharePicture: item.zhibo_room.share_pic,
					status: item.zhibo_room.status,
					vipOnly: item.zhibo_room.vip_only
				}
			})
			resolve(result)
		})
	})
}

