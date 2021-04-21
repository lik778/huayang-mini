export const Version = '1.0.38'

// 打点sdk参数
export const SHARE_PARAMS = {
	trackType: {
		pageView: 'pageview',
		event: 'event'
	},
	component: {
		btn: 'button',
		img: 'image'
	},
	clickType: {
		tel: 'telephone',
		url: 'url',
		map: 'map',
		pic: 'picture'
	},
	pageType: {
		common: 'common', // 普通页面类型
		webview: 'webview', // webview页面类型
	},
	pageLevel: {
		tabBarPage: 'tabbar_page', // 一级页面
		secondPage: 'second_page', // 二级页面
	},
	shareMethods: {
		wxFriend: 'wx_friend', // 微信好友或好友群
		wxFriendCircle: 'wx_friend_circle', // 微信朋友圈
		qrCode: 'qrcode_pic', // 用户选择生成带有二维码的图片
		other: 'other' // 无法判断方法
	},
	shareResultStatus: { // 分享结果状态
		success: 1,
		fail: 0
	}
}

// 全局key
export const GLOBAL_KEY = {
	userInfo: 'hy_zhi_de_applets_user_info', // token key
	userInfoExpireTime: 'hy_zhi_de_applets_user_info_expire_time', // user info expire time
	openId: 'hy_zhi_de_applets_openid', // openId
	token: 'hy_zhi_de_applets_token', // token
	userId: 'hy_zhi_de_applets_userId', // userId
	accountInfo: 'hy_zhi_de_account_info', // 积分账户
	statusBarHeight: 'hy_zhi_de_status_bar_height', // 设备状态栏高度
	systemParams: 'hy_zhi_de_system_params', // 所有设备状态字段
	schedule: 'hy_zhi_de_schedule', // 直播间状态集合
	vip: "hy_zhi_de_vip", //记录成为会员（成为会员三天，每天弹一次，三天后取消）
	addTeacher: "hy_zhi_de_add_teacher", //记录申请大学成功后首次弹窗
	updateAccountInfo: "hy_zhi_de_update_accountInfo", //记录申请大学成功后更细local
	repeatView: "hy_zhi_de_repeatView",
	vipupdateAccountInfo: "hy_zhi_de_vipupdate_accountInfo", //记录申请大学成功后更细local
	vipBack: "hy_zhi_de_vip_back", //解决收货地址购买会员返回到首页
	popupTimestamp: "hy_zhi_de_popup_timestamp", // 首页弹窗时间戳
	campHasShowList: "hy_camp_popup_id", //记录训练营已经展示过弹窗的id数组
	showFillMsg: "hy_show_fill_msg", //记录是否需要显示完善资料模块
	superiorDistributeUserId: "hy_superior_distribute_user_id", // 上级分销用户ID
	superiorDistributeExpireTime: "hy_superior_distribute_expire_time", // 上级分销过期时间
	discoveryGuideExpiredAt: "hy_discovery_guide_expired_at", // 首页入群引导过期时间
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
	prd: 'https://huayang.baixing.com'
}

// interface prefix
export const prefix = '/hy/zhide'

// interface
export const URL = {
	// 授权模块
	getWxInfo: '/hy/wx/applets/login', // 授权
	bindUserInfo: '/hy/wx/applets/user/bind', // 绑定用户信息
	bindWxPhoneNumber: '/hy/wx/applets/phone/bind', // 记录微信用户信息至服务端
	checkFocusLogin: prefix + '/user/login/check', // 检查是否需要强制校验
	checkBecomeVip: "/hy/zhide/user/vip/remind", //检查是否刚成为会员显示弹窗
	getRemind: prefix + "/user/vip/remind/v2", // 获取消息弹窗
	queryAttemptTimes: prefix + "/user/vip/try/days", // 查询试用会员天数
	getAttempt: prefix + "/user/vip/try/get", // 领取试用
	// 会员模块
	createOrder: "/hy/order/create", // 购买会员下单
	getPaySign: "/hy/pay/wx/prepare", // 获取支付凭证
	getUserInfo: '/hy/user/info', // 获取会员用户信息
	getZhideUserInfo: prefix + '/user/info', // 获取会员用户信息
	getInviteCode: "/hy/zhide/user/invite/applets/qrcode", // 获取会员邀请小程序码
	getInviteList: "/hy/invite/history", //获取邀请列表
	getVipNum: "/hy/zhide/user/invite/num", //获取会员编号
	getScene: "/hy/zhide/user/custom/message/set", //获取客服消息场景
	getUniversityCode: "/hy/zhide/user/info", //获取大学Id跳转课程列表
	getMineOrder: "/hy/zhide/user/order/list", //获取我的订单列表
	getVipBg: "/hy/zhide/user/vip/introduction", //获取加入会员背景图
	getVipShow: "/hy/zhide/user/right/check", //获取会员权益开关
	pointjoinVipFrom: "/hy/zhide/user/vip/from/record", //打点会员购买路径来源
	getActivityTime: "/hy/zhide/user/invite/playbill/date", //获取邀请海报日期
	withDraw: "/hy/zhide/account/takeout", //余额提现
	// 直播模块
	liveList: prefix + '/zhibo/list', // 直播列表
	recommendLiveList: '/hy/zhibo/recommend/list', // 获取推荐直播间
	getLiveBannerList: prefix + '/zhibo/banner', // 获取直播首页轮播图
	getCourseTypeList: prefix + '/kecheng/category', // 获取课程分类列表
	getCourseList: prefix + '/kecheng/list', // 获取课程列表
	statisticsWatchNo: prefix + '/zhibo/visit', // 统计直播观看人次
	getWatchLiveAuth: prefix + '/zhibo/permission/check', // 获取观看直播权限
	subscription: prefix + '/user/subscribe', // 订阅课程
	unSubscribe: prefix + '/user/subscribe/cancel', // 取消订阅
	uploadFormId: '/hy/wx/applets/formId', // 上传formID
	getSubscriptionStatus: prefix + '/user/subscribe', // 获取订阅状态
	updateLiveStatus: prefix + '/zhibo/room/status/update', // 更新已结束的直播间状态
	getLiveInfo: prefix + '/zhibo/get', // 查询直播间详情
	getCourseInfo: prefix + '/kecheng/detail', // 查询课程详情
	// 游学模块
	getTravelList: "/hy/travel/product/list", // 获取游学产品列表
	addTravelVisitNo: "/hy/travel/product/visit", // 增加游学产品访问数量
	getTodayRecommendCourse: "/hy/kecheng/series/boutique/today", // 获取今日推荐课程
	getQualityVideoList: "/hy/kecheng/series/boutique/list", // 获取精品课程列表
	getSectionCourseList: "/hy/kecheng/series/section/list", // 获取专栏课程
	// 商品模块
	getProductInfo: '/hy/product/info', // 获取导购商品详情
	getCategory: '/hy/category/list', // 获取商品类目
	getProductList: prefix + '/product/list', // 获取商品列表
	getProductListByCategory: prefix + '/product/list/by/category', // 根据商品
	mallBanner: '/hy/banner/list', // 商城banner
	getYouZanAppId: prefix + '/youzan/app/list', // 获取有赞商城appId
	/********* 训练营 *********/
	// DD
	getBootCampCourseInfo: "/hy/action/kecheng/info", // 获取训练营课程详情
	visitPracticeBehavior: "/hy/kecheng/visit", // 记录用户训练行为
	getRecentVisitor: "/hy/kecheng/visit/user/list", // 获取某节课程最近的训练行为列表
	getBootCampCourseList: "/hy/kecheng/list", // 在引导层获取推荐课程
	didUserNeedCoopen: prefix + "/user/recommend/kecheng/check", // 检查用户是否需要课程引导
	joinCourse: "/hy/kecheng/join", // 加入课程
	getUserHaveClassesInfo: "/hy/kecheng/user", // 获取用户上课信息
	getUserJoinedClasses: "/hy/kecheng/joined/list", // 获取用户已加入的课程
	getRecommendCourseList: "/hy/kecheng/recommend/list", // 获取推荐课程
	recordPracticeInToday: "/hy/pratice/user/log/record", // 创建当日练习记录
	getUserRecentPracticeLog: "/hy/pratice/user/log/list", // 获取用户最近练习记录
	donePractice: "/hy/kecheng/pratice/record", // 完成训练
	getBootCampDetail: "/hy/kecheng/traincamp/detail", // 获取当日训练营内容
	getUserJoinedBootCamp: "/hy/traincamp/joined/list", // 获取用户已经加入的训练营
	quitBootCamp: "/hy/traincamp/quit", // 放弃训练营
	quitCourse: "/hy/kecheng/quit", // 放弃课程
	increaseExperience: prefix + "/user/grade/incr/experience", // 提升经验值
	punchCardBgImage: prefix + "/kecheng/pratice/playbill/pic", // 结构化练习海报背景图
	punchCardQrCode: "/hy/kecheng/pratice/qrcode", // 结构化练习海报二维码
	collectError: "/hy/frontend/error/data", // p2错误捕获接口
	collectP0Error: "/hy/frontend/P0/error/data", // p0错误捕获接口
	collectP1Error: "/hy/frontend/P1/error/data", // p1错误捕获接口
	getOrderDetail: "/hy/order/get", // 查询订单信息
	queryRecommendBootcampInMine: "/hy/kecheng/traincamp/listByRank", // 在我的模块，获取推荐训练营列表
	queryActivityInMine: "/hy/activity/apply/mine", // 在我的模块，获取活动列表
	queryActivityDetail: "/hy/activity/detail", // 获取活动详情
	queryUserOwnerClasses: "/hy/zhide/user/kecheng/data", // 获取用户主题营、课程、活动数量
	// queryUserPracticeRecentRecord: "/hy/user/study/list", // 查询用户最近练习记录（老版）
	queryUserPracticeRecentRecord: "/hy/user/study/list/v2", // 查询用户最近练习记录
	queryUserGuideLink: "/hy/zhide/user/customer/link", // 获取用户中心引导私域链接
	setBootcampStudyTime: "/hy/traincamp/study/update", // 训练营学习时间更新
	getBootcampFeatureList: "/hy/kecheng/traincamp/feature/list", // 获取训练营特色列表
	// getVideoCourseListByBuyTag: "/hy/kecheng/series/with/buytag/list", // 获取视频系列课程列表(带已购标签=>老版)
	getVideoCourseListByBuyTag: "/hy/kecheng/series/with/buytag/list/v2", // 获取视频系列课程列表(带已购标签)

	// JJ
	joinCamp: "/hy/traincamp/join", //加入训练营
	getCampDetail: "/hy/kecheng/traincamp", //获取训练营内容
	getHasJoinCamp: '/hy/traincamp/join/check', //判断用户是否加入训练营
	getCampList: "/hy/kecheng/traincamp/list", //获取训练营列表
	getFindBanner: "/hy/banner/list", //获取发现页banner
	getShowCourseList: "/hy/zhide/kecheng/zouxiu/list", //获取走秀课程列表
	getActivityList: '/hy/activity/list', //获取活动列表
	getCurentDayData: "/hy/kecheng/traincamp/detail", //获取单日课程
	getTaskList: "/hy/zhide/user/center/grade/task", //获取任务列表
	taskCheckIn: "/hy/checkin/make", //任务签到
	getSignData: "/hy/checkin/check", //获取签到信息
	needUpdateUserInfo: "/hy/zhide/user/profile/update/check", //个人中心是否需要填写资料
	getMenyCourseList: "/hy/kecheng/traincamp/detail/list", //批量获取训练营内容
	getPhoneNumber: "/hy/zhide/call/center/phone", //获取客服电话
	getWxRoomData: "/hy/zhide/zhibo/get", //获取微信直播间信息
	getArticileLink: "/hy/zhide/traincamp/customer/link", //获取引导私域公众号文章
	getCourseData: "/hy/action/kecheng/info", //获取课程信息
	// getVideoCourseList: "/hy/kecheng/series/list", // 获取视频课程列表（老版）
	getVideoCourseList: "/hy/kecheng/series/list/v2", // 获取视频课程列表
	// getVideoCourseDetail: "/hy/kecheng/series/detail", // 获取视频课程详情（老版）
	getVideoCourseDetail: "/hy/kecheng/series/detail/v2", // 获取视频课程详情
	checkJoinVideoCourse: "/hy/kecheng/series/join/check", //判断用户是否购买课程
	joinVideoCourse: "/hy/kecheng/series/join", //加入用户视频课程
	getVideoTypeList: "/hy/kecheng/series/category/list", //获取视频课程类目
	// getVideoPracticeData: "/hy/kecheng/series/joined/list", //练习页获取视频练习列表(老版)
	getVideoPracticeData: "/hy/kecheng/series/joined/list/v2", //练习页获取视频练习列表
	recordStudy: "/hy/kecheng/series/video/visit", //记录学习到第几节课程
	getVideoArticleLink: "/hy/zhide/kecheng/series/customer/link", //获取视频课引流私域文章link
	liveTotalNum: "/hy/zhide/kecheng/zhibo/count", //获取直播课程数
	// ********* 视频系列课营销 *********
	fissionCreate: "/hy/kecheng/series/invite/create", // 系列课程邀请创建
	fissionDetail: "/hy/kecheng/series/invite/detail", // 获取系列课邀请详情
	fissionJoin: "/hy/kecheng/series/invite/join", // 系列课程邀请加入
	fissionUnlock: "/hy/kecheng/series/invite/unlock", // 系列课程邀请解锁
	fissionJudge: "/hy/kecheng/series/invite/lock/check", // 判断用户是否已解锁过系列课邀请
	fissionCourseList: "/hy/kecheng/series/invite/guide/list", // 裂变课程
	// 抽奖
	getLotteryActivityData: "/hy/award/activity/get", //获取抽奖活动信息
	// 课程分销
	getTakeoutList: "/hy/kecheng/promote/list", //可推广课程列表
	kechengTakeout: "/hy/kecheng/promote/takeout/create", // 课程分销提现
	getPromotionRecord: "/hy/kecheng/promote/record/list", // 获取推广记录
	// 学员信息录入
	daxueEnter: "/hy/zhide/user/daxue/enter", //学员信息录入
	getCampStageMessgae: "/hy/traincamp/stage", //获取训练营分期详情
	classCheckin: '/hy/traincamp/class/checkin', //班级报道
	studyLogCreate: "/hy/traincamp/study/log/create", //创建学习日志
	// 检查获取学员信息
	checkNeedToFillInfo: "/hy/zhide/student/profile/update/check", //检查获取学员信息
	// 训练营打卡
	dailyStudyCheck: "/hy/traincamp/daily/study/check", //判断用户当日是否学习
	// 获取班级logo
	getClassLogo: "/hy/traincamp/stage/logo",
	// 学员信息获取
	getClassStudentData: "/hy/zhide/user/student/info",

	// 获取IOS虚拟支付下引导私域的链接
	getIosCustomerLink: "/hy/zhide/ios/customer/link",

	/* 请好友看课版本 */
	// 创建邀请记录
	inviteFriend: "/hy/kecheng/series/gift",
	// 获取请好友看课信息
	getInviteFriendInfo: "/hy/kecheng/series/gift/receiver/list",
	// 创建用户领取记录
	receiveCreate: "/hy/kecheng/series/gift/receive/create",
	// 用户是否已领取校验
	checkReceiveCreate: '/hy/kecheng/series/gift/user/receive/check',

	/* 作业秀 */
	queryOssCertificate: "/hy/video/upload/certificate", // 获取阿里云OSS上传凭证
	queryTaskBelongList: "/hy/kecheng/work/belong/list", // 获取作业发布时需要填写的所属课程
	launchTask: "/hy/kecheng/work/create", // 发布作业
	taskStream: "/hy/kecheng/work/feed/list", // 作业流
	thumb: "/hy/kecheng/work/like", // 点赞
	unThumb: "/hy/kecheng/work/unlike", // 取消点赞
	removeSelfTask: "/hy/kecheng/work/delete", // 删除作业
	queryTaskUserInfo: "/hy/kecheng/work/user/info", // 获取用户的作业信息
	queryTaskDetail: "/hy/kecheng/work/detail", // 获取作业详情
	queryTaskEntranceStatus: "/hy/kecheng/work/user/study/page/entrance/status/get", // 获取作业秀入口状态
	getCooperationById: "/hy/zhide/university/collaborate/get", //根据ID获取资源合作机构信息
	cooperationJoinVideoCourse: '/hy/zhide/university/collaborate/kecheng/join', //资源分享平台点击加入系列课
	checkNeedSpecialManage: '/hy/zhide/kecheng/series/buy/type', //获取系列课的购买方式

	/* 学生卡 */
	queryFlunetLearnInfo: "/hy/zhide/card/fluentLearn/info", // 查询学生卡权益
	queryFluentCardHotkecheng: "/hy/zhide/card/fluentLearn/recommend/kecheng", // 查询学生卡热门课程
	queryFluentCardNewkecheng: "/hy/zhide/card/fluentLearn/new/kecheng", // 查询学生卡最新课程
	payFluentCard: "/hy/zhide/card/fluentLearn/pay", // 学生卡下单
	queryFluentCardInfo: "/hy/zhide/user/card/fluentLearn", // 查询用户学生卡信息
	queryFluentQrCode: "/hy/zhide/card/fluentLearn/share/qrcode", // 获取学生卡分销二维码
	queryDistributeRecordList: "/hy/account/record/list", // 获取用户余额记录
	acceptKechengWithFluentCard: "/hy/zhide/card/fluentLearn/kecheng/join", // 学生卡会员免费领取视频课程
	queryFluentDistributeGuide: "/hy/zhide/card/fluentLearn/guid/link", // 获取学生卡引导私域配置信息
	queryPartnerInfo: "/hy/distribute/user/get", // 获取合伙人信息
	queryDistributeFirstList: "/hy/distribute/first/child/list", // 获取直接合伙人
	queryDistributeSecondList: "/hy/distribute/second/child/list", // 获取间接合伙人
	// cps
	douyinWxPay: "/hy/temp/cps/page/pay", //抖音cps落地页下单获取orderId

	queryDiscoveryRemindData: "/hy/zhide/user/remind/get", // 请求首页弹窗任务

	// 线下精品课
	queryOfflineCourseAllData: "/hy/kecheng/offline/getAllCourses", // 获取所有线下精品课数据
	queryOfflineCourseList: "/hy/kecheng/offline/GetAllExceptRecommendation", // 获取线下精品课列表
	queryRecommendOfflineCourse: '/hy/kecheng/offline/GetRecommendation', // 线下推荐课
	queryOfflineCourseDetail: "/hy/kecheng/offline/getOfflineCourseById", // 查询线下精品课详情
	createOfflineCourseOrder: "/hy/kecheng/offline/order/create", // 线下课下单接口
	queryModelDataList: "/hy/kecheng/modelTraining", // 获取模特训练列表
	queryJoinedOfflineCourseList: "/hy/kecheng/offline/joined/list", // 获取用户已购线下课程

	/*线上免费课*/
	queryFreeOnlineCourse:"/hy/kecheng/onlineFree/getAllCourses",
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
	record: 'scope.record',
	camera: 'scope.camera'
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
	subscriptMessage: '-U3ZLf6HojDP7SiGPOwEwoyb5UqB8PSsKQy2lY2qjnA',
	inivteMessage: "P0oFlfYXQwhP_we7hCwL4L3_FZQmINKVPbPC00yEFTw"
}

// 第三方小程序配置
export const THIRD_APPLETS_SOURCE = {
	xinXuan: {
		label: "花样心选",
		appId: "wx95fb6b5dbe8739b7"
	},
	maiDeZhi: {
		label: "花样买的值",
		appId: "wx6593cf087b7686dd"
	},
	zhiDeMai: {
		label: "花样百姓+",
		appId: "wx85d130227f745fc5"
	}
};

// 订阅key
export const SubscribeKey = {
	zhibo: 'zhibo'
}

// 训练营课程等级
export const CourseLevels = ["", "初级", "中级", "高级"]

// 线上错误捕获等级
export const ErrorLevel = {
	p0: 'p0',
	p1: 'p1'
}

// 学生卡会员状态
export const FluentLearnUserType = {
	normal: 0, // 默认
	active: 1, // 激活
	deactive: 2 // 过期
}
