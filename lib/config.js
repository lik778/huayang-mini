// 全局key
export const GLOBAL_KEY = {
	userInfo: 'hy_applets_user_info', // token key
	openId: 'hy_applets_openid', // openId
	token: 'hy_applets_token', // token
	userId: 'hy_applets_userId', // userId
	adImageList: 'hy_ad_images_list', // ad image list
	formIdNo: 'hy_form_id_no', // 缓存formId的条数
	accountInfo: 'hy_account_info', // 积分账户
	exchangeResult: 'hy_exchange_result', // 兑换结果
	statusBarHeight: 'hy_status_bar_height', // 设备状态栏高度
	systemParams: 'hy_system_params', // 所有设备状态字段
	mediaInfoImageTips: 'hy_media_info_image_tips', // 内容详情页查看图片提示
	mediaInfoShareTips: 'hy_media_info_share_tips' // 内容详情页分享功能提示
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
	getWxInfo: prefix + '/wx/applets/login', // 授权
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
