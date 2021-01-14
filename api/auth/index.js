import request from "../../lib/request"
import { ErrorLevel, GLOBAL_KEY, URL } from "../../lib/config"
import { getLocalStorage, setLocalStorage, toast } from "../../utils/util"
import dayjs from "dayjs"

/**
 * 用微信code换取服务端的用户信息
 * @param params
 * @returns {Promise<unknown>}
 */
export function getWxInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getWxInfo, params).then(({
																								data
																							}) => {
			resolve(data)
		})
	})
}

/**
 * 把微信用户信息绑定到服务端
 * @param params
 * @returns {Promise<unknown>}
 */
export function bindUserInfo(params) {
	return new Promise(resolve => {
		request._post(URL.bindUserInfo, params).then(({
																										code,
																										data
																									}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}

/**
 * 绑定用户手机号
 * @param params
 * @returns {Promise<unknown>}
 */
export function bindWxPhoneNumber(params) {
	return new Promise(resolve => {
		request._post(URL.bindWxPhoneNumber, params).then(({
																												 data,
																												 code
																											 }) => {
			// 服务端解析微信敏感数据失败
			if (code === 112) {
				toast('授权失败，请重试')
			} else {
				// 缓存token、userId
				setLocalStorage(GLOBAL_KEY.userId, data.id)
				setLocalStorage(GLOBAL_KEY.token, data.token)
				// 返回用户积分账户
				resolve(data)
			}
		})
	})
}


// 一键获取手机号
export async function getPhoneNumber(e) {
	if (!e) return
	let {
		errMsg = '', encryptedData: encrypted_data = '', iv = ''
	} = e.detail
	if (errMsg.includes('ok')) {
		let open_id = getLocalStorage(GLOBAL_KEY.openId)
		if (encrypted_data && iv) {
			let originAccountInfo = await bindWxPhoneNumber({
				open_id,
				encrypted_data,
				iv
			})
			setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			return 0
		}
	} else {
		console.error('用户拒绝手机号授权')
		return 1
	}
}

/**
 * 校验是否强制登陆
 * @param params
 * @returns {Promise<unknown>}
 */
export function checkFocusLogin(params) {
	return new Promise((resolve) => {
		request._get(URL.checkFocusLogin, params).then(({data, code}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}


// 检查是否刚成为会员需要弹窗
export const checkBecomeVip = (params) => {
	return new Promise((resolve) => {
		request._get(URL.checkBecomeVip + "?" + params).then(({data, code}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}

/**
 * 采集关键路径线上报错至sentry
 * @param params
 * userId 用户id
 * nickname 用户昵称
 * mobile 联系方式
 * device 平台+设备型号
 * wxVersion 微信客户端版本
 * wxSDK 微信基础库版本
 * create_at #YYYY-MM-DD HH:mm:ss
 * -------------------------------------------
 * location #page.api
 * level [ p0, p1 ]
 * error_code [ 400, wxminiprogram error code ]
 * error_message
 * arguments 其他自定义参数
 * -------------------------------------------
 */
export const collectError = (params) => {
	let userInfoString = getLocalStorage(GLOBAL_KEY.userInfo)
	let accountInfoString = getLocalStorage(GLOBAL_KEY.accountInfo)
	let systemInfoString = getLocalStorage(GLOBAL_KEY.systemParams)
	let { user_id, nickname } = userInfoString ? JSON.parse(userInfoString) : {}
	let { user_id: userId, nick_name, mobile } = accountInfoString ? JSON.parse(accountInfoString) : {}
	let { model, system, SDKVersion, version } = systemInfoString ? JSON.parse(systemInfoString) : {}
	let commonParams = {
		userId: user_id || userId,
		nickname: nickname || nick_name,
		mobile,
		device: `${system} ${model}`,
		wxVersion: version,
		wxSDK: SDKVersion,
		create_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
	}

	let compoundParams = {
		page: params.page,
		error_code: params.error_code,
		error_message: {...commonParams, ...params},
		platform: "applets"
	}
	request._post(params.level === ErrorLevel.p0 ? URL.collectP0Error : URL.collectError, compoundParams)
}

