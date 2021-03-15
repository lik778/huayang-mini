import md5 from 'md5'
import { GLOBAL_KEY, ROOT_URL, URL, WeChatLiveStatus } from '../lib/config'
import { createOrder } from "../api/mine/payVip"
import { getWatchLiveAuth, statisticsWatchNo } from "../api/live/course"
import request from "../lib/request"
import { getUserInfo } from "../api/mine/index"

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
// 购买训练营课程
export const payCourse = function ({
	id,
	name
}) {
	// 调用获取支付凭证
	let getPaySignParams = {
		open_id: getLocalStorage(GLOBAL_KEY.openId),
		product_title: name,
		order_id: id,
		app_id: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).app_id
		// app_id:"wx5705fece1e1cdc1e"
	}
	let mallKey = "fx1d9n8wdo8brfk2iou30fhybaixingo" //商户key
	return new Promise((resolve, reject) => {
		request._post(URL.getPaySign, getPaySignParams).then(({
			data,
			code
		}) => {
			if (code === 0) {
				requestPayment({
					prepay_id: data,
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

// 购买花样畅学卡
export const payFluentCard = function ({id, name}) {
	// 调用获取支付凭证
	let getPaySignParams = {
		open_id: getLocalStorage(GLOBAL_KEY.openId),
		product_title: name,
		order_id: id,
		app_id: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).app_id
	}
	let mallKey = "fx1d9n8wdo8brfk2iou30fhybaixingo" //商户key
	return new Promise((resolve, reject) => {
		request._post(URL.getPaySign, getPaySignParams).then(({data,code}) => {
			if (code === 0) {
				requestPayment({
					prepay_id: data,
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
 * 账号信息是否存在
 * @returns {boolean}
 */
export const hasAccountInfo = function () {
	let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
	return $notNull(accountInfo)
}

/**
 * 批量获取直播间状态
 * @param roomIds
 * @returns {Promise<unknown[]>}
 */
export const getSchedule = async function (roomIds = []) {
	let delayTimes = 3 * 60 * 1000
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
				timestamp: +new Date() + delayTimes
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
				target.timestamp = +new Date() + delayTimes
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

// 处理日历显示
export const getTodayDate = (date) => {
	// console.log(date)
	let currentDate = date ? new Date(date) : new Date()
	let timesStamp = currentDate.getTime()
	let currenDay = currentDate.getDay()
	let dates = []
	let dateArr = []
	let dateArr1 = []
	for (let i = 0; i < 7; i++) {
		let newDate = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7))
		dates.push(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(newDate.getDate()).padStart(2, "0")}`)
	}
	for (let i in dates) {
		dateArr.push({
			id: dates[i].split("-")[2],
			dataNum: -1
		})
		dateArr1.push(dates[i])
	}
	// changeArrIndex(dateArr, 0, dateArr.length-1)
	return {
		one: dateArr,
		two: dateArr1
	}
}
// 处理日期
export const manageWeek = () => {
	let nowDate = new Date()
	let week = nowDate.getDay() === 0 ? 7 : nowDate.getDay()
	let weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	if (week === 7) {
		week = '周日'
	} else if (week === 1) {
		week = '周一'
	} else if (week === 2) {
		week = '周二'
	} else if (week === 3) {
		week = '周三'
	} else if (week === 4) {
		week = '周四'
	} else if (week === 5) {
		week = '周五'
	} else if (week === 6) {
		week = '周六'
	}
	return weekList
}

// 计算两个日期相差xx天
export const countDay = (nowDate, totalDate) => {
	// nowDate当前日期，totalDate目标日期
	nowDate = nowDate.replace(/-/g, "/")
	totalDate = totalDate.replace(/-/g, "/")
	var date1 = new Date(totalDate).getTime()
	var date2 = new Date(nowDate).getTime()
	let date3 = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24))
	let date = ''
	if (date3 === -1) {
		// 开营前一天
		date = 0
	} else if (date3 === 0) {
		// 开营当天
		date = 1
	} else if (date3 > 0) {
		// 开营后面
		date = date3 + 1
	} else {
		// 开营之前
		date = -1
	}
	return date
}

// 计算两个日期相差xx天
export const countDayOne = (nowDate, totalDate) => {
	// nowDate当前日期，totalDate目标日期
	nowDate = nowDate.replace(/-/g, "/")
	totalDate = totalDate.replace(/-/g, "/")
	var date1 = new Date(totalDate).getTime()
	var date2 = new Date(nowDate).getTime()
	let date3 = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24))
	let date = ''
	if (date3 === -1) {
		// 开营前一天
		date = 0
	} else if (date3 === 0) {
		// 开营当天
		date = 1
	} else if (date3 > 0) {
		// 开营后面
		date = date3 + 1
	} else {
		// 开营之前
		date = -1
	}
	return date
}

// 调换数组两个位置
export const changeArrIndex = (arr, index1, index2) => {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0]
	return arr
}
// 设置时间显示一分钟之内显示秒，一小时以内显示分，
export const simpleDurationSimple = (duration) => {
	let date = ''
	if (duration < 60) {
		date = duration + "秒"
	} else {
		date = Math.floor(duration / 60) + "分钟"
	}
	return date
}
// 设置时间显示一分钟之内显示秒，一小时以内显示分，
export const simpleDuration = (duration, type) => {
	if (type === 's') {
		duration = duration * 1000
	}
	let str = ''
	let days = '',
		hours = '',
		minutes = '',
		seconds = ''
	let day = 24 * 60 * 60 * 1000,
		hour = 60 * 60 * 1000,
		minute = 60 * 1000,
		second = 1000
	if (duration >= day) {
		days = Math.floor(duration / day) + '天'
		hours = Math.floor(duration % day / hour) + '小时'
	} else if (duration >= hour && duration < day) {
		hours = Math.floor(duration / hour) + '小时'
		minutes = Math.floor(duration % hour / minute) + '分钟'
	} else if (duration > minute && duration < hour) {
		minutes = Math.floor(duration / minute) + '分钟'
		seconds = Math.floor(duration % minute / second) + '秒'
	} else if (duration < minute) {
		seconds = Math.floor(duration / second) + '秒'
	}
	return days + hours + minutes + seconds
}
export const simpleDurationDate = (duration, type) => {
	if (type === 's') {
		duration = duration * 1000
	}
	let str = ''
	let days = '',
		hours = '',
		minutes = '',
		seconds = ''
	let day = 24 * 60 * 60 * 1000,
		hour = 60 * 60 * 1000,
		minute = 60 * 1000,
		second = 1000
	if (duration >= day) {
		days = Math.floor(duration / day) + ':'
		hours = Math.floor(duration % day / hour) + ':'
	} else if (duration >= hour && duration < day) {
		hours = Math.floor(duration / hour) + ':'
		minutes = Math.floor(duration % hour / minute) + ':'
	} else if (duration > minute && duration < hour) {
		minutes = Math.floor(duration / minute) + ':'
		seconds = Math.floor(duration % minute / second)
	} else if (duration < minute) {
		seconds = Math.floor(duration / second)
	}
	return days + hours + minutes + seconds
}

/**
 * 计算训练时长
 * @param times
 */
export const calculateExerciseTime = (times) => {
	times = +times
	let minutes = times / 60 | 0
	let seconds = times % 60
	if (times >= 60) {
		return minutes
	} else {
		return seconds
	}
}

/**
 * 查询微信授权状态
 * @param authKey
 * @returns {Promise<unknown>}
 */
export const queryWxAuth = function (authKey = WX_AUTH_TYPE.userInfo) {
	return new Promise((resolve, reject) => {
		wxGetSetting(authKey).then((authResult = {}) => {
			if (!authResult[authKey]) {
				wx.authorize({
					scope: authKey,
					success() {
						// 已同意
						resolve()
					},
					fail() {
						// 未同意
						reject()
					},
					complete(res) {
						console.log('wxGetSetting', res)
					}
				})
			}
		})
	})
}

/**
 * 微信授权记录检查
 */
export const wxGetSetting = function (authKey) {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success({
				authSetting
			}) {
				resolve(authSetting[authKey])
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

/**
 * 检查字符长度
 * @param string
 */
export const calcStringLen = function (string) {
	let strlen = 0
	for (let i = 0; i < string.length; i++) {
		if (string.charCodeAt(i) > 255)
			strlen += 2
		else
			strlen++
	}
	return strlen
}

/**
 * 截取指定长度字符
 */
export const splitTargetNoString = (str, len) => {
	let regexp = /[^\x00-\xff]/g // 正在表达式匹配中文
	// 当字符串字节长度小于指定的字节长度时
	if (str.replace(regexp, "aa").length <= len) {
		return str
	}
	// 假设指定长度内都是中文
	let m = Math.floor(len / 2)
	for (let i = m, j = str.length; i < j; i++) {
		// 当截取字符串字节长度满足指定的字节长度
		if (str.substring(0, i).replace(regexp, "aa").length >= len) {
			return str.substring(0, i)
		}
	}
	return str
}

//将数字（整数）转为汉字，从零到一亿亿，需要小数的可自行截取小数点后面的数字直接替换对应arr1的读法就行了
export const convertToChinaNum = (num) => {
	var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿']; //可继续追加更高位转换值
	if (!num || isNaN(num)) {
		return "零";
	}
	var english = num.toString().split("")
	var result = "";
	for (var i = 0; i < english.length; i++) {
		var des_i = english.length - 1 - i; //倒序排列设值
		result = arr2[i] + result;
		var arr1_index = english[des_i];
		result = arr1[arr1_index] + result;
	}
	//将【零千、零百】换成【零】 【十零】换成【十】
	result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
	//合并中间多个零为一个零
	result = result.replace(/零+/g, '零');
	//将【零亿】换成【亿】【零万】换成【万】
	result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
	//将【亿万】换成【亿】
	result = result.replace(/亿万/g, '亿');
	//移除末尾的零
	result = result.replace(/零+$/, '')
	//将【零一十】换成【零十】
	//result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
	//将【一十】换成【十】
	result = result.replace(/^一十/g, '十');
	return result;
}
// 将分钟转化成秒
export const secondToMinute = (s) => {
	//计算分钟
	//算法：将秒数除以60，然后下舍入，既得到分钟数
	var h;
	h = Math.floor(s / 60);
	//计算秒
	//算法：取得秒%60的余数，既得到秒数
	s = s % 60;
	//将变量转换为字符串
	h += '';
	s += '';
	//如果只有一位数，前面增加一个0
	h = (h.length == 1) ? '0' + h : h;
	s = (s.length == 1) ? '0' + s : s;
	return h + ':' + s;
}



/**
 * [dateAddDays 从某个日期增加n天后的日期]
 * @param  {[string]} dateStr  [日期字符串]
 * @param  {[int]} addTime [增加的秒数]
 * @param  returnFormat "yyyy-MM-dd HH:mm:ss" // "yyyy-MM-dd"
 * @return {[string]}[增加n天后的日期字符串]
 */
export const dateAddDays = (dateStr, addTime, returnFormat) => {
	let tempDate = new Date(dateStr.replace(/-/g, "/")); //把日期字符串转换成日期格式
	tempDate = tempDate / 1000 + addTime
	let resultDate = new Date(tempDate * 1000); //增加n天后的日期
	Date.prototype.dateFormat = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	return resultDate.dateFormat(returnFormat);
}


// 计算两个日期相差n天
export const computeDate = (date2, date1) => {
	// nowDate当前日期时间戳，totalDate目标日期时间戳
	let date3 = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24))
	if (date3 < 0) {
		// 还没开营的
		date3 = 0
	}
	return Math.abs(date3)
}

// 获取当天日期
//显示日期在页面上  yyy-MM-dd
export const getNowDate = (linkIcon) => {
	let date = new Date();
	//年
	let year = date.getFullYear();
	//月
	let month = date.getMonth() + 1;
	//日
	let day = date.getDate();
	//时
	let hh = date.getHours();
	//分
	let mm = date.getMinutes();
	//秒
	let ss = date.getSeconds();
	let rq = year + linkIcon + month + linkIcon + day
	return rq
}

// 获取当天日期
//显示日期在页面上  yyy-MM-dd
export const getNowDateAll = (linkIcon = '-') => {
	let date = new Date();
	//年
	let year = date.getFullYear();
	//月
	let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	//日
	let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	//时
	let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	//分
	let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	//秒
	let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	let rq = year + linkIcon + month + linkIcon + day + " " + hh + ":" + mm + ":" + ss
	return rq
}

//检查价格
export const checkIsPrice = e => {
	if (/(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/.test(e)) {
		return true;
	} else {
		return false;
	}
};

// 获取两个自然数之前的所有正整数
export function getAllNumber(a, b) {
	let arr = []
	for (var i = a; i <= b; i++) {
		arr.push(i)
	}
	return arr
}

export const isIphoneXRSMax = function () {
	// iPhone X、iPhone XS
	let params = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
	let isIPhoneX =
		/iPhone/gi.test(params.brand) &&
		params.pixelRatio &&
		params.pixelRatio === 3 &&
		params.screenWidth === 375 &&
		params.screenHeight === 812;
	// iPhone XS Max
	let isIPhoneXSMax =
		/iPhone/gi.test(params.brand) &&
		params.pixelRatio &&
		params.pixelRatio === 3 &&
		params.screenWidth === 414 &&
		params.screenHeight === 896;
	// iPhone XR
	let isIPhoneXR =
		/iPhone/gi.test(params.brand) &&
		params.pixelRatio &&
		params.pixelRatio === 2 &&
		params.screenWidth === 414 &&
		params.screenHeight === 896;
	// iphone 12
	let isIPhone12 =
		/iPhone/gi.test(params.brand) &&
		params.pixelRatio &&
		params.pixelRatio === 3 &&
		params.screenWidth === 390 &&
		params.screenHeight === 844;
	let isIphone12Max = /iPhone/gi.test(params.brand) &&
		params.pixelRatio &&
		params.pixelRatio === 3 &&
		params.screenWidth === 428 &&
		params.screenHeight === 926;
	return isIPhoneX || isIPhoneXR || isIPhoneXSMax || isIPhone12 || isIphone12Max;
};


/**
 * 时间戳格式化函数
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
export const formatDate = (format, timestamp) => {
	var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
	var pad = function (n, c) {
		if ((n = n + "").length < c) {
			return new Array(++c - n.length).join("0") + n;
		} else {
			return n;
		}
	};
	var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var txt_ordin = {
		1: "st",
		2: "nd",
		3: "rd",
		21: "st",
		22: "nd",
		23: "rd",
		31: "st"
	};
	var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var f = {
		// Day
		d: function () {
			return pad(f.j(), 2)
		},
		D: function () {
			return f.l().substr(0, 3)
		},
		j: function () {
			return jsdate.getDate()
		},
		l: function () {
			return txt_weekdays[f.w()]
		},
		N: function () {
			return f.w() + 1
		},
		S: function () {
			return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
		},
		w: function () {
			return jsdate.getDay()
		},
		z: function () {
			return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
		},

		// Week
		W: function () {
			var a = f.z(),
				b = 364 + f.L() - a;
			var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
			if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
				return 1;
			} else {
				if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
					nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
					return date("W", Math.round(nd2.getTime() / 1000));
				} else {
					return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
				}
			}
		},

		// Month
		F: function () {
			return txt_months[f.n()]
		},
		m: function () {
			return pad(f.n(), 2)
		},
		M: function () {
			return f.F().substr(0, 3)
		},
		n: function () {
			return jsdate.getMonth() + 1
		},
		t: function () {
			var n;
			if ((n = jsdate.getMonth() + 1) == 2) {
				return 28 + f.L();
			} else {
				if (n & 1 && n < 8 || !(n & 1) && n > 7) {
					return 31;
				} else {
					return 30;
				}
			}
		},

		// Year
		L: function () {
			var y = f.Y();
			return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
		},
		//o not supported yet
		Y: function () {
			return jsdate.getFullYear()
		},
		y: function () {
			return (jsdate.getFullYear() + "").slice(2)
		},

		// Time
		a: function () {
			return jsdate.getHours() > 11 ? "pm" : "am"
		},
		A: function () {
			return f.a().toUpperCase()
		},
		B: function () {
			// peter paul koch:
			var off = (jsdate.getTimezoneOffset() + 60) * 60;
			var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
			var beat = Math.floor(theSeconds / 86.4);
			if (beat > 1000) beat -= 1000;
			if (beat < 0) beat += 1000;
			if ((String(beat)).length == 1) beat = "00" + beat;
			if ((String(beat)).length == 2) beat = "0" + beat;
			return beat;
		},
		g: function () {
			return jsdate.getHours() % 12 || 12
		},
		G: function () {
			return jsdate.getHours()
		},
		h: function () {
			return pad(f.g(), 2)
		},
		H: function () {
			return pad(jsdate.getHours(), 2)
		},
		i: function () {
			return pad(jsdate.getMinutes(), 2)
		},
		s: function () {
			return pad(jsdate.getSeconds(), 2)
		},
		//u not supported yet

		// Timezone
		//e not supported yet
		//I not supported yet
		O: function () {
			var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
			if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
			else t = "+" + t;
			return t;
		},
		P: function () {
			var O = f.O();
			return (O.substr(0, 3) + ":" + O.substr(3, 2))
		},
		//T not supported yet
		//Z not supported yet

		// Full Date/Time
		c: function () {
			return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
		},
		//r not supported yet
		U: function () {
			return Math.round(jsdate.getTime() / 1000)
		}
	};

	return format.replace(/[\\]?([a-zA-Z])/g, function (t, s) {
		let ret = ''
		if (t != s) {
			// escaped
			ret = s;
		} else if (f[s]) {
			// a date function exists
			ret = f[s]();
		} else {
			// nothing special
			ret = s;
		}
		return ret;
	});
}
