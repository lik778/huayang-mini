import md5 from 'md5'
import {
	GLOBAL_KEY,
	ROOT_URL,
	SHARE_PARAMS,
	WeChatLiveStatus
} from '../lib/config'
import {
	createOrder
} from "../api/mine/payVip"
import {
	getWatchLiveAuth,
	statisticsWatchNo
} from "../api/live/course"
import request from "../lib/request"
import {
	getUserInfo
} from "../api/mine/index"

const livePlayer = requirePlugin('live-player-plugin')

export const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 查询token
export const queryToken = () => {
	let token = getLocalStorage(GLOBAL_KEY.token) ? getLocalStorage(GLOBAL_KEY.token) : ""
	return token || ''
}

export const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 购买会员
 * @returns
 */
export const payVip = function ({
																	id
																}) {
	let createOrderParmas = {
		scene: "zhide_vip",
		recommend_user_id: id || "",
		product_id: request.baseUrl === ROOT_URL.dev ? 36 : 5,
		count: 1,
		open_id: getLocalStorage(GLOBAL_KEY.openId),
	}
	return new Promise((resolve, reject) => {
		createOrder(createOrderParmas).then(res1 => {
			if (res1 === 0) {
				// 库存不足
				resolve(res1)
			} else {
				let mallKey = "fx1d9n8wdo8brfk2iou30fhybaixingo" //商户key
				requestPayment({
					prepay_id: res1,
					key: mallKey
				}).then(res => {
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			}
		})
	})
}
// 唤起微信支付
export const requestPayment = (paramsData) => {
	return new Promise((resolve, reject) => {
		let params = getSign({
			prepay_id: paramsData.prepay_id,
			key: paramsData.key
		})
		wx.requestPayment({
			timeStamp: params.timeStamp,
			nonceStr: params.nonceStr,
			package: params.package,
			signType: params.signType,
			paySign: params.paySign,
			success(res) {
				if (res.errMsg === "requestPayment:ok") {
					setLocalStorage(GLOBAL_KEY.vip, true)
					setLocalStorage(GLOBAL_KEY.vipupdateAccountInfo, true)
					resolve(res)
				}
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
// 生成支付的一系列数据sign
export const getSign = (paramsData) => {
	let params = {
		appId: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).app_id,
		timeStamp: parseInt(new Date().getTime() / 1000).toString(),
		nonceStr: Math.random()
			.toString(36)
			.substring(2),
		signType: "MD5",
		package: `prepay_id=${paramsData.prepay_id}`
	}
	let paramsList = [
		"appId",
		"timeStamp",
		"nonceStr",
		"package",
		"signType"
	]
	paramsList = paramsList.sort()
	let paramStr = ""
	for (let i = 0; i < paramsList.length; i++) {
		paramStr += paramsList[i] + "=" + params[paramsList[i]] + "&"
	}
	let paySign = md5(
		paramStr + `key=${paramsData.key}` //商户Key
	)
	params["paySign"] = paySign.toUpperCase()
	return params
}


/**
 * 判断对象类型是否是空
 * @param obj
 * @returns {boolean} true => 不为空，false => 为空
 */
export const $notNull = (obj) => {
	if (obj == null) return false
	if (Array.isArray(obj)) {
		if (obj.length) {
			return true
		}
	} else if (Object.prototype.toString.call(obj) === "[object Object]") {
		if (Object.keys(obj).length) {
			return true
		}
	}
	return false
}

/**
 * 校验手机号是否正确
 * @param phone 手机号
 */
export const verifyPhone = (phone = '') => {
	const reg = /^1[3456789][0-9]{9}$/
	const _phone = phone.toString().trim()
	let toastStr =
		_phone === '' ? '手机号不能为空' : !reg.test(_phone) && '手机号不正确'
	return {
		errMsg: toastStr,
		done: !toastStr,
		value: _phone
	}
}

/**
 * 查询storage
 * @param key
 * @param noParse
 * @returns {{}}
 */
export const getLocalStorage = function (key, noParse = false) {
	try {
		let value = wx.getStorageSync(key)
		return value ? (noParse ? JSON.parse(value) : value) : (noParse ? {} : undefined)
	} catch (e) {
		console.error(e)
	}
}

/**
 * 设置storage
 * @param key
 * @param value
 */
export const setLocalStorage = function (key, value) {
	try {
		wx.setStorageSync(key, typeof value === 'object' ? JSON.stringify(value) : value)
	} catch (e) {
		console.error(e)
	}
}

/**
 * 清除token
 * @param key
 */
export const removeLocalStorage = function (key) {
	try {
		wx.removeStorageSync(key)
	} catch (e) {
		console.error(e)
	}
}

/**
 * toast
 * @param title
 * @param icon [ 'success', 'loading', 'none' ]
 * @param duration
 */
export const toast = function (title, duration = 3000, icon = 'none') {
	wx.showToast({
		title,
		icon,
		duration
	})
}

/**
 * token是否存在
 * @returns {boolean} true，存在；false，不存在
 */
export const hasToken = function () {
	return !!getLocalStorage(GLOBAL_KEY.token)
}

/**
 * 用户信息是否存在
 * @returns {boolean}
 */
export const hasUserInfo = function () {
	let userInfo = getLocalStorage(GLOBAL_KEY.userInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)) : {}
	return $notNull(userInfo)
}

/**
 * 批量获取直播间状态
 * @param roomIds
 * @returns {Promise<unknown[]>}
 */
export const getSchedule = async function (roomIds = []) {
	// 课程ID去重
	roomIds = Array.from(new Set(roomIds))
	let scheduleData = getLocalStorage(GLOBAL_KEY.schedule) ? JSON.parse(getLocalStorage(GLOBAL_KEY.schedule) || "") : []
	for (let i = 0; i < roomIds.length; i++) {
		let roomId = roomIds[i]
		let target = scheduleData.find(_ => _.roomId === roomId)
		// 1. globalData中无值
		if (!target) {
			let {
				liveStatus = 0
			} = await queryLiveStatus(roomId) || {}
			scheduleData.push({
				roomId: roomId,
				liveStatus: WeChatLiveStatus[liveStatus],
				timestamp: +new Date() + 5 * 60 * 1000
			})
		} else {
			let targetRoomId = target.roomId
			// 2. globalData中有值
			let nowTimestamp = +new Date()
			if (nowTimestamp < target.timestamp) {
				// 2.1 timestamp没过期
			} else {
				// 2.2 timestamp过期
				let {
					liveStatus
				} = await queryLiveStatus(targetRoomId)

				target.liveStatus = WeChatLiveStatus[liveStatus]
				target.timestamp = +new Date() + 5 * 60 * 1000
			}
		}
	}
	setLocalStorage(GLOBAL_KEY.schedule, scheduleData.slice())
	return scheduleData.slice()
}

// 判断是否是会员/是否入学
export const checkIdentity = function ({
																				 roomId,
																				 link,
																				 zhiboRoomId,
																				 customParams = {}
																			 }) {
	const userId = getLocalStorage(GLOBAL_KEY.userId)
	return new Promise((resolve, reject) => {
		if (userId == null) {
			resolve('no-phone-auth')
		} else {
			// 获取直播权限
			getWatchLiveAuth({
				room_id: zhiboRoomId,
				user_id: userId
			})
				.then(res => {
					if (res === 'vip') {
						// 非会员，跳往花样汇
						wx.navigateTo({
							url: '/subLive/unAuthorized/unAuthorized',
						})
					} else if (res === 'daxue') {
						// 未加入花样大学,跳往入学申请页
						resolve('no-auth-daxue')
					} else {
						// 反之，有权限查看
						// 优先统计观看人数
						statisticsWatchNo({
							zhibo_room_id: zhiboRoomId,
							open_id: getLocalStorage(GLOBAL_KEY.openId)
						}).then(() => {
							// link存在去跳转回看页
							if (link) {
								wx.navigateTo({
									url: `/subLive/review/review?zhiboRoomId=` + zhiboRoomId
								})
							} else {
								// 跳往前去直播间
								wx.navigateTo({
									url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
								})
							}
						})
						resolve('updateWatchNo')
					}
					resolve()
				})
		}
	})
}

/**
 * 查询直播间的状态
 * @param roomId
 * @returns {Promise<unknown>}
 */
function queryLiveStatus(roomId) {
	return new Promise((resolve, reject) => {
		livePlayer.getLiveStatus({
			room_id: roomId
		})
			.then(response => {
				resolve(response)
			})
			.catch(error => {
				console.error(error)
				reject(error)
			})
	})
}

/**
 * 保留2位小数
 * @param x
 * @returns {string|boolean}
 */
export function changeTwoDecimal_f(x) {
	var f_x = parseFloat(x)
	if (isNaN(f_x)) {
		console.error('f_x is not a number.')
		return false
	}
	var f_x = Math.round(x * 100) / 100
	let s_x = f_x.toString()
	let pos_decimal = s_x.indexOf('.')
	if (pos_decimal < 0) {
		pos_decimal = s_x.length
		s_x += '.'
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0'
	}
	return s_x
}

/**
 * 获取网络图片信息
 * @param src
 * @returns {Promise<unknown>}
 */
export function queryImageInfo(src) {
	return new Promise((resolve, reject) => {
		wx.getImageInfo({
			src,
			success(response) {
				resolve(response)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}

//获取用户信息,更新本地缓存
export function getUserInfoData() {
	return new Promise(resolve => {
		getUserInfo("scene=zhide").then(res => {
			if (Number.isInteger(res.amount / 100)) {
				res.amount = res.amount / 100 + ".00"
			} else {
				res.amount = res.amount / 100
			}
			setLocalStorage(GLOBAL_KEY.accountInfo, res)
			resolve(res)
		})
	})
}

// 处理js   37.5 *100=3970.0000000000005
export const parseNumber = (number, multiply = 100) => {
	return parseFloat((number * multiply).toFixed(2))
}


// 补0操作
export const returnFloat = (values) => {
	let value = Math.round(parseFloat(values) * 100) / 100
	let xsd = value.toString().split(".")
	if (xsd.length == 1) {
		value = value.toString() + ".00"
		return value
	}
	if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			value = value.toString() + "0"
		}
		return value
	}
}

// 批量下载文件
export const batchDownloadFiles = function (downloadUrls) {
	let downloadPromiseAry = []
	downloadUrls.forEach(url => {
		downloadPromiseAry.push(
			new Promise((resolve, reject) => {
				wx.downloadFile({
					url,
					success(res) {
						if (res.statusCode === 200) {
							resolve(res.tempFilePath)
						}
					},
					fail() {
						reject()
					}
				})
			})
		)
	})
	return Promise.all(downloadPromiseAry)
}

// 批量保存临时文件到本地缓存文件
export const batchSaveFiles = function (tempFiles) {
	let cachedFiles = []
	tempFiles.forEach((tempFilePath) => {
		cachedFiles.push(new Promise((resolve, reject) => {
			wx.saveFile({
				tempFilePath,
				success(res) {
					resolve(res.savedFilePath)
				},
				fail() {
					reject()
				}
			})
		}))
	})

	return Promise.all(cachedFiles)
}

// 清空本地缓存文件
export const batchRemoveSavedFiles = function (localFiles) {
	let removedFiles = []
	localFiles.forEach(filePath => {
		removedFiles.push(new Promise((resolve, reject) => {
			wx.removeSavedFile({
				filePath: filePath.filePath,
				success() {
					resolve()
				},
				fail() {
					reject()
				}
			})
		}))
	})

	return Promise.all(removedFiles)
}
