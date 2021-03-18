import request from "../../lib/request"
import {
  URL
} from "../../lib/config"


// 抖音cps落地页下单获取orderId
export const douyinWxPay = params => {
  return request._post(URL.douyinWxPay, params)
}