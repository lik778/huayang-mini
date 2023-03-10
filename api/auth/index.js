import request from "../../lib/request"
import {
	ErrorLevel,
	GLOBAL_KEY,
	ROOT_URL,
	URL
} from "../../lib/config"
import {
	getLocalStorage,
	setLocalStorage,
	toast
} from "../../utils/util"
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
		request._get(URL.checkFocusLogin, params).then(({
			data,
			code
		}) => {
			if (code === 0) {
				resolve(data)
			}
		})
	})
}


// 检查是否刚成为会员需要弹窗
export const checkBecomeVip = (params) => {
	return new Promise((resolve) => {
		request._get(URL.checkBecomeVip + "?" + params).then(({
			data,
			code
		}) => {
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
 * location # developer.page.api
 * level [ p0, p1, p2 ]
 * error_code [ 300(控制台错误), 400(p1错误), 500(p2错误) ]
 * error_message 完整错误信息
 * arguments 其他自定义参数
 * -------------------------------------------
 */
export const collectError = (params) => {
	if (request.baseUrl === ROOT_URL.dev) return

	let userInfoString = getLocalStorage(GLOBAL_KEY.userInfo)
	let accountInfoString = getLocalStorage(GLOBAL_KEY.accountInfo)
	let systemInfoString = getLocalStorage(GLOBAL_KEY.systemParams)
	let {
		user_id,
		nickname
	} = userInfoString ? JSON.parse(userInfoString) : {}
	let {
		user_id: userId,
		nick_name,
		mobile
	} = accountInfoString ? JSON.parse(accountInfoString) : {}
	let {
		model,
		system,
		SDKVersion,
		version
	} = systemInfoString ? JSON.parse(systemInfoString) : {}
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
		error_message: JSON.stringify({
			...commonParams,
			...params
		}),
		platform: "applets"
	}

	let url = ""
	switch (params.level) {
		case ErrorLevel.p0: {
			url = URL.collectP0Error
			break
		}
		case ErrorLevel.p1: {
			url = URL.collectP1Error
			break
		}
		default: {
			url = URL.collectError
		}
	}

	request._post(url, compoundParams)
}

/**
 * 设置小程序消息通知订阅状态
 * @param params
 * @returns {Promise<unknown>}
 */
export const updateSubscribeMessageStatus = (params) => {
	return new Promise((resolve, reject) => {
		request._post(URL.setSubscribeMessage, params).then(({
			data,
			code
		}) => {
			if (code === 0) {
				resolve(data)
			}
		}).catch((err) => {
			reject(err)
		})
	})
}


// 代理用户绑定
export const agentUserBind = params => {
	return request._post(URL.agentUserBind, params)
}