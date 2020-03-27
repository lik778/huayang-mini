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
	let memberUserInfo = "userInfo" // 普通平台成员用户信息,
	return wx.getStorageSync(memberUserInfo) || {}
}

export const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 判断对象类型是否是空
 * @param obj
 * @returns {boolean} true => 不为空，false => 为空
 */
export const $notNull = (obj) => {
  if (obj == null) return false;
  if (Array.isArray(obj)) {
    if (obj.length) {
      return true;
    }
  } else if (Object.prototype.toString.call(obj) === "[object Object]") {
    if (Object.keys(obj).length) {
      return true;
    }
  }
  return false;
}
