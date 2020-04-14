// 全局key
export const GLOBAL_KEY = {
	userInfo: 'hy_zhi_de_applets_user_info', // token key
	openId: 'hy_zhi_de_applets_openid', // openId
	token: 'hy_zhi_de_applets_token', // token
	userId: 'hy_zhi_de_applets_userId', // userId
	accountInfo: 'hy_zhi_de_account_info', // 积分账户
	statusBarHeight: 'hy_zhi_de_status_bar_height', // 设备状态栏高度
	systemParams: 'hy_zhi_de_system_params', // 所有设备状态字段
	schedule: 'hy_zhi_de_schedule', // 直播间状态集合
	vip:"hy_zhi_de_vip",//记录成为会员（成为会员三天，每天弹一次，三天后取消）
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
	// 授权模块
	getWxInfo: '/hy/wx/applets/login', // 授权
	bindUserInfo: '/hy/wx/applets/user/bind', // 绑定用户信息
	bindWxPhoneNumber: '/hy/wx/applets/phone/bind', // 记录微信用户信息至服务端
	// 会员模块
	createOrder: "/hy/order/create",// 购买会员下单
	getPaySign: "/hy/pay/wx/prepare",// 获取支付凭证
	getUserInfo: '/hy/user/info',// 获取会员用户信息
	getInviteCode:"/hy/zhide/user/invite/applets/qrcode",// 获取会员邀请小程序码
	getInviteList:"/hy/invite/history",//获取邀请列表
	getVipNum:"/hy/zhide/user/invite/num",//获取会员编号
	// 直播模块
	liveList: prefix + '/zhibo/list', // 直播列表
	getLiveBannerList: prefix + '/zhibo/banner',  // 获取直播首页轮播图
	getCourseTypeList: prefix + '/kecheng/category', // 获取课程分类列表
	getCourseList: prefix + '/kecheng/list', // 获取课程列表
	statisticsWatchNo: prefix + '/zhibo/visit', // 统计直播观看人次
	getWatchLiveAuth: prefix + '/zhibo/permission/check', // 获取观看直播权限
	subscription: prefix + '/user/subscribe', // 订阅课程
	uploadFormId: '/hy/wx/applets/formId', // 上传formID
	getSubscriptionStatus: prefix + '/user/subscribe', // 获取订阅状态
	updateLiveStatus: prefix + '/zhibo/room/status/update', // 更新已结束的直播间状态
	getLiveInfo: prefix + '/zhibo/get', // 查询直播间详情直播间详情
	// 商品模块
	getProductInfo: '/hy/product/info', // 获取导购商品详情
	getCategory: '/hy/category/list', // 获取商品类目
	getProductList: prefix + '/product/list', // 获取商品列表
}

// 临时键
export const TEMPORARY_KEY = {
	openid: 'temporary_user_openid' // 访客token
}

// applet ids
export const APP_LET_ID = {
	tx: 'wx85d130227f745fc5'
}

// 微信授权类型
export const WX_AUTH_TYPE = {
	userInfo: 'scope.userInfo',
	writePhotosAlbum: 'scope.writePhotosAlbum',

}

// 微信直播状态
export const WeChatLiveStatus = {
	0: '无状态',
	101: '直播中',
	102: '未开始',
	103: '已结束',
	104: '禁播',
	105: '暂停中',
	106: '异常',
	107: '已过期'
}

// 微信消息订阅类型
export const SubscriptType = {
	subscriptMessage: 'kNzTTum944inyyV_NFXkjiR7ZtGr8E1FNUadYJQPu1c'
}

// 第三方小程序配置
export const THIRD_APPLETS_SOURCE = {
	youZan: {
		name: "youzan",
		label: "有赞",
		appId: "wx95fb6b5dbe8739b7"
	}
};

