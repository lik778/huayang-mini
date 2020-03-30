// 全局key
export const GLOBAL_KEY = {
	userInfo: 'hy_zhi_de_applets_user_info', // token key
	openId: 'hy_zhi_de_applets_openid', // openId
	token: 'hy_zhi_de_applets_token', // token
	userId: 'hy_zhi_de_applets_userId', // userId
	accountInfo: 'hy_zhi_de_account_info', // 积分账户
	statusBarHeight: 'hy_zhi_de_status_bar_height', // 设备状态栏高度
	systemParams: 'hy_zhi_de_system_params', // 所有设备状态字段
}

// 请求来源
export const APP_ID = {
	h5: '1',
	pc: '2',
	applets: '3',
	app: '4',
	admin: '5'
}

// secret config
export const SECRET = {
	h5: 'hyh5@2019',
	pc: 'hypc@2019',
	app: 'hyapp@2019',
	applets: 'hyapplets@2019',
	crm: 'hycrm@2019'
}

// root url
export const ROOT_URL = {
	dev: 'https://huayang.baixing.cn',
	prd: 'https://huayang.baixing.com/'
}

// interface prefix
export const prefix = '/hy/zhide'

// interface
export const URL = {
	getWxInfo: '/hy/wx/applets/login', // 授权
	bindUserInfo: '/hy/wx/applets/user/bind', // 绑定用户信息
	bindWxPhoneNumber: '/hy/wx/applets/phone/bind'
}

// 临时键
export const TEMPORARY_KEY = {
	openid: 'temporary_user_openid' // 访客token
}

// applet ids
export const APP_LET_ID = {
	bx: 'wx2340a4f2bcb09576',
	tx: 'wxe892a319545c9b45'
}

// 微信授权类型
export const WX_AUTH_TYPE = {
	userInfo: 'scope.userInfo',
	writePhotosAlbum: 'scope.writePhotosAlbum'
}
