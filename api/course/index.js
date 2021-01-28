import request from "../../lib/request"
import {
	URL
} from "../../lib/config"


// 获取结构化练习海报背景图
export function queryPunchCardBg() {
	return new Promise(resolve => {
		request._get(URL.punchCardBgImage).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取结构化练习海报二维码
export function queryPunchCardQrCode(params) {
	return new Promise(resolve => {
		request._get(URL.punchCardQrCode, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取训练营课程详情
export function getBootCampCourseInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseInfo, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 记录用户训练行为
export function recordPracticeBehavior(params) {
	return new Promise(() => {
		request._post(URL.visitPracticeBehavior, params)
	})
}

// 获取某节课程最近的训练行为列表
export function getRecentVisitorList(params) {
	return new Promise(resolve => {
		request._get(URL.getRecentVisitor, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 检查用户是否需要课程引导页动画
export function checkUserDidNeedCoopen(params) {
	return new Promise(resolve => {
		request._get(URL.didUserNeedCoopen, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// [在引导阶段] - 获取推荐课程列表
export function queryBootCampCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampCourseList, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// [在引导阶段] - 加入推荐课程
export function joinCourseInGuide(params) {
	return new Promise(resolve => {
		request._post(URL.joinCourse, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取用户上课的信息
export function queryUserHaveClassesInfo(params) {
	return new Promise(resolve => {
		request._get(URL.getUserHaveClassesInfo, params).then(({
			data
		}) => {
			data = data || {}
			resolve(data)
		})
	})
}

// 获取用户已加入的课程
export function queryUserJoinedClasses(params) {
	return new Promise(resolve => {
		request._get(URL.getUserJoinedClasses, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 在个人课程页 - 获取推荐课程
export function queryRecommendCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getRecommendCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 创建当日练习记录
export function createPracticeRecordInToday(params) {
	return new Promise(resolve => {
		request._post(URL.recordPracticeInToday, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取用户练习打卡记录
export function queryUserRecentPracticeLog(params) {
	return new Promise(resolve => {
		request._get(URL.getUserRecentPracticeLog, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 完成训练
export function completePractice(params) {
	return new Promise(resolve => {
		request._post(URL.donePractice, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取用户已经加入的训练营
export function queryUserJoinedBootCamp(params) {
	return new Promise(resolve => {
		request._get(URL.getUserJoinedBootCamp, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取当日训练营内容
export function queryBootCampContentInToday(params) {
	return new Promise(resolve => {
		request._get(URL.getBootCampDetail, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 放弃训练营
export function exitBootCamp(params) {
	return new Promise(resolve => {
		request._post(URL.quitBootCamp, params).then(() => {
			resolve()
		})
	})
}

// 放弃课程
export function exitCourse(params) {
	return new Promise(resolve => {
		request._post(URL.quitCourse, params).then(() => {
			resolve()
		})
	})
}

// 加入训练营
export function joinCamp(params) {
	return new Promise(resolve => {
		request._post(URL.joinCamp, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取训练营详情
export function getCampDetail(params) {
	return new Promise(resolve => {
		request._get(URL.getCampDetail, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 判断用户是否已经加入训练营
export function getHasJoinCamp(params) {
	return new Promise(resolve => {
		request._get(URL.getHasJoinCamp, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取训练营列表

export function getCampList(params) {
	return new Promise(resolve => {
		request._get(URL.getCampList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取发现页banner
export function getFindBanner(params) {
	return new Promise(resolve => {
		request._get(URL.getFindBanner, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取发现页banner
export function getShowCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getShowCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取活动列表
export function getActivityList(params) {
	return new Promise(resolve => {
		request._get(URL.getActivityList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取单日活动内容
export function getCurentDayData(params) {
	return new Promise(resolve => {
		request._get(URL.getCurentDayData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取任务列表
export function getTaskList(params) {
	return new Promise(resolve => {
		request._get(URL.getTaskList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 任务签到
export function taskCheckIn(params) {
	return new Promise(resolve => {
		request._post(URL.taskCheckIn, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取任务签到信息
export function getSignData(params) {
	return new Promise(resolve => {
		request._get(URL.getSignData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 个人中心是否需要填写资料
export function needUpdateUserInfo(params) {
	return new Promise(resolve => {
		request._get(URL.needUpdateUserInfo, params).then(({
			data
		}) => {
			data = data
			resolve(data)
		})
	})
}


// 批量获取训练营课程内容
export function getMenyCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getMenyCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取课程信息
export function getCourseData(params) {
	return new Promise(resolve => {
		request._get(URL.getCourseData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 提升经验
export function increaseExp(params) {
	return new Promise(resolve => {
		request._post(URL.increaseExperience, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}
// 获取客服号码
export function getPhoneNumber(params) {
	return new Promise(resolve => {
		request._get(URL.getPhoneNumber, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}
// 获取引导公众号文章
export function getArticileLink(params) {
	return new Promise(resolve => {
		request._get(URL.getArticileLink, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

/***********视频课程*************/
// 获取视频课程列表
export function getVideoCourseList(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoCourseList, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取视频系列课程列表(带已购标签)
export function queryVideoCourseListByBuyTag(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoCourseListByBuyTag, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取视频课程详情
export function getVideoCourseDetail(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoCourseDetail, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}
// 判断用户是否已经加入课程
export function checkJoinVideoCourse(params) {
	return new Promise(resolve => {
		request._get(URL.checkJoinVideoCourse, params).then((res) => {
			resolve(res)
		})
	})
}

// 用户加入课程
export function joinVideoCourse(params) {
	return new Promise(resolve => {
		request._post(URL.joinVideoCourse, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

// 获取课程分类列表
export function getVideoTypeList(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoTypeList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}
// 练习页获取视频练习列表
export function getVideoPracticeData(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoPracticeData, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}
// 记录学习到第几节课程
export function recordStudy(params) {
	return new Promise(resolve => {
		request._post(URL.recordStudy, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}
// 获取视频课引流私域文章link
export function getVideoArticleLink(params) {
	return new Promise(resolve => {
		request._get(URL.getVideoArticleLink, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function liveTotalNum(params) {
	return new Promise(resolve => {
		request._get(URL.liveTotalNum, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function createFissionTask(params) {
	return new Promise(resolve => {
		request._post(URL.fissionCreate, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function getFissionDetail(params) {
	return new Promise(resolve => {
		request._get(URL.fissionDetail, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function joinFissionTask(params) {
	return new Promise(resolve => {
		request._post(URL.fissionJoin, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function unlockFissionTask(params) {
	return new Promise(resolve => {
		request._post(URL.fissionUnlock, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function checkFissionTaskStatus(params) {
	return new Promise(resolve => {
		request._get(URL.fissionJudge, params).then(({
			data
		}) => {
			resolve(data)
		})
	})
}

export function queryFissionList(params) {
	return new Promise(resolve => {
		request._get(URL.fissionCourseList, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

// 获取抽奖活动信息
export const getLotteryActivityData = (params) => {
	return new Promise(resolve => {
		request._get(URL.getLotteryActivityData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

export const getWxRoomData = (params) => {
	return new Promise(resolve => {
		request._get(URL.getWxRoomData, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

/**
 * 查询订单信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export function queryOrderDetail(params) {
	return request._get(URL.getOrderDetail, params)
}

/**
 * 查询用户最近学习记录
 * @param params
 * @returns {Promise<unknown>}
 */
export function getUserPracticeRecentRecord(params) {
	return new Promise((resolve) => {
		request._get(URL.queryUserPracticeRecentRecord, params).then(({
			data
		}) => {
			data = data || []
			resolve(data)
		})
	})
}

/**
 * 训练营学习时间更新
 * @param params
 * @returns {Promise<unknown>}
 */
export function updateBootcampStudyTime(params) {
	return request._post(URL.setBootcampStudyTime, params)
}

/**
 * 获取训练营特色标签列表
 * @returns {Promise<unknown>}
 */
export function queryBootcampFeatureList() {
	return request._get(URL.getBootcampFeatureList)
}
// 学员信息录入

export const daxueEnter = params => {
	return request._post(URL.daxueEnter, params)
}

// 获取训练营分期信息

export const getCampStageMessgae = params => {
	return request._get(URL.getCampStageMessgae, params)
}

// 班级报道

export const classCheckin = params => {
	return request._post(URL.classCheckin, params)
}

// 创建学习日志
export const studyLogCreate = params => {
	return request._get(URL.studyLogCreate, params)
}

// 获取学员信息
export const checkNeedToFillInfo = params => {
	return request._get(URL.checkNeedToFillInfo, params)
}


// 判断用户当日是否学习
export const dailyStudyCheck = params => {
	return request._get(URL.dailyStudyCheck, params)
}

// 获取班级logo
export const getClassLogo = params => {
	return request._get(URL.getClassLogo, params)
}

// 学员信息获取
export const getClassStudentData = params => {
	return request._get(URL.getClassStudentData, params)
}

// 获取IOS虚拟支付下引导私域的链接
export const getIosCustomerLink = params => {
	return request._get(URL.getIosCustomerLink, params)
}


// 请好友看课
export const inviteFriend = params => {
	return request._post(URL.inviteFriend, params)
}

// 获取请好友看课信息
export const getInviteFriendInfo = params => {
	return request._get(URL.getInviteFriendInfo, params)
}

// 创建用户领取记录
export const receiveCreate = params => {
	return request._post(URL.receiveCreate, params)
}

// 用户是否已领取校验
export const checkReceiveCreate = params => {
	return request._get(URL.checkReceiveCreate, params)
}

// 根据ID获取资源合作机构信息
export const getCooperationById = params => {
	return request._get(URL.getCooperationById, params)
}

// 资源分享平台点击加入系列课
export const cooperationJoinVideoCourse = params => {
	return request._post(URL.cooperationJoinVideoCourse, params)
}