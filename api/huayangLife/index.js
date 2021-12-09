import request from "../../lib/request"
import {
  URL
} from "../../lib/config"

/* 获取花样生活瀑布流列表 */
export const queryWaterfallList = params => {
  return request._get(URL.queryWaterfallList, params)
}

/* 获取花样生活瀑布流详情信息 */
export const queryWaterfallDetailInfo = params => {
  return request._get(URL.queryWaterfallDetailInfo, params)
}

/* 记录花样生活瀑布流浏览量 */
export const recordWaterfallVisitCount = params => {
  return request._post(URL.recordWaterfallVisitCount, params)
}