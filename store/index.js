import {
	observable,
	action
} from 'mobx-miniprogram'
import {
	getStudentCommentList,
	likeMoment,
	unLikeMoment,
	getCommentList,
	getBarrageList
} from "../api/studentComments/index"
import {
	GLOBAL_KEY
} from '../lib/config'
import {
	getLocalStorage,
	createAnimationFun
} from '../utils/util'

export const store = observable({
	// 数据
	studentMoments: [],
	studentMomentComments: [],
	studentBarrageTopArr: [],
	studentBarrageBottomArr: [],
	studentBarrageArr: [],

	// 获取动态列表
	getCommentsList: action(function (params, params1) {
		return new Promise(resolve => {
			let userId = getLocalStorage(GLOBAL_KEY.userId) ? getLocalStorage(GLOBAL_KEY.userId) : ''
			if (userId) {
				params.user_id = userId
			}
			getStudentCommentList(params).then(({
				data = []
			}) => {
				let list = data ? params1 ? this.studentMoments.concat(data) : data : this.studentMoments
				if (data) {
					list.map(item => {
						item.hasLike = item.hasLike ? item.hasLike : item.has_like
						item.likeCount = item.likeCount ? item.likeCount : item.bubble.like_count
						item.bubble.pics = typeof (item.bubble.pics) === 'object' ? item.bubble.pics : item.bubble.pics ? item.bubble.pics.split(',') : []
					})
				}
				this.studentMoments = list.concat([])
				if (data == null) {
					resolve({
						data: this.studentMoments,
						type: false
					})
				} else {
					if (data.length < params.limit) {
						resolve({
							data: this.studentMoments,
							type: false
						})
					} else {
						resolve({
							data: this.studentMoments,
							type: true
						})
					}
				}
			})
		})
	}),

	// 点赞&取消点赞
	like: action(function (params) {
		return new Promise(resolve => {
			let userId = getLocalStorage(GLOBAL_KEY.userId)
			if (params.hasLike === 0) {
				// 点赞
				likeMoment({
					bubble_id: params.id,
					user_id: userId
				})
			} else {
				// 取消点赞
				unLikeMoment({
					bubble_id: params.id,
					user_id: userId
				})
			}
		})
	}),

	// 本地更新点赞状态
	updateMomentsLikeStatus: action(function (params) {
		return new Promise(resolve => {
			if (this.studentMoments.length) {
				this.studentMoments.map(item => {
					if (item.bubble.id === params.id) {
						item.hasLike = params.hasLike
						item.likeCount = params.likeCount
					}
				})
				this.studentMoments = this.studentMoments.concat([])
				resolve(this.studentMoments)
			} else {
				let obj = Object.assign({}, params)
				obj.has_like = obj.has_like === 0 ? 1 : 0
				obj.bubble.like_count = params.has_like === 0 ? params.bubble.like_count + 1 : params.bubble.like_count - 1
				resolve(this.studentMoments)
			}
		})
	}),

	// 获取评论
	getMomentComment: action(function (params) {
		return new Promise(resolve => {
			getCommentList(params.data).then(({
				data
			}) => {
				if (params.type) {
					this.studentMomentComments = this.studentMomentComments.concat(data)
				} else {
					this.studentMomentComments = data
				}
				if (data.length < params.limit) {
					resolve({
						data: this.studentMomentComments,
						noCommentData: true
					})
				} else {
					resolve({
						data: this.studentMomentComments,
						noCommentData: false
					})
				}
			})
		})

	}),

	//更新动态评论数
	updateMomentsCommentCount: action(function (params) {
		this.studentMoments.map(item => {
			if (item.bubble.id === params) {
				item.bubble.comment_count += 1
			}
		})
		this.studentMoments = this.studentMoments.concat([])
	}),

	// 删除某条动态
	deleteStudentMoment: action(function (params) {
		let deleteIndex = ''
		this.studentMoments.filter((item, index) => {
			if (item.bubble.id === Number(params)) {
				deleteIndex = index
			}
		})
		this.studentMoments.splice(deleteIndex, 1)
		this.studentMoments = this.studentMoments.concat([])
	}),

	// 更新动态
	updateMomentList: action(function (params) {
		if (this.studentMoments.length) {
			let itemObj = Object.assign({}, params)
			this.studentMoments.map((item, index) => {
				if (item.bubble.id === params.bubble.id) {
					item.hasLike = itemObj.has_like
					item.likeCount = itemObj.bubble.like_count
					item.bubble.comment_count = itemObj.bubble.comment_count
				}
			})
			this.studentMoments = this.studentMoments.concat([])
		}
	}),

	// 获取弹幕信息
	getBarrageList: action(function (params, _this) {
		return new Promise(resolve => {
			getBarrageList(params).then(({
				data = []
			}) => {
				// let topArr = []
				// let bottomArr = []
				// data.map(item => {
				// 	if (topArr.length > bottomArr.length) {
				// 		bottomArr.push(item)
				// 	} else {
				// 		topArr.push(item)
				// 	}
				// })
				// createAnimationFun(data, _this)
				this.studentBarrageArr = data.slice()
				resolve(data)
			})
		})
	}),
})