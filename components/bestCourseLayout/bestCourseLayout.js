import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import { getFluentCardInfo } from "../../api/mine/index"

Component({
	/**
	 * Component properties
	 */
	properties: {
		courseList: {
			type: Array,
			values: [],
			observer(newArray) {
				newArray = newArray.map(_ => {
					let tname = _.kecheng_series.name
					return {
						..._.kecheng_series,
						name: tname.length > 15 ? `${tname.slice(0, 15)}...` : tname,
						teacher: _.teacher,
						didBought: _.buy_tag === "已购",
						buy_tag: _.buy_tag
					}
				})

				let handledList = newArray.map((res) => {
					if (res.visit_count >= 10000) {
						res.visit_count = (res.visit_count / 10000).toFixed(1) + "万"
						res.visit_count = res.visit_count.split('.')[1] === '0万' ? res.visit_count[0] + "万" : res.visit_count
					}
					res.price = (res.price / 100) // .toFixed(2)
					if (res.discount_price === -1 && res.price > 0) {
						// 原价出售
						// 是否有营销活动
						if (+res.invite_open === 1) {
							res.fission_price = (+res.price * res.invite_discount / 10000) // .toFixed(2)
						}
						res.discount_price = res.price
					} else if (res.discount_price >= 0 && res.price > 0) {
						// 收费但有折扣
						res.discount_price = (res.discount_price / 100) // .toFixed(2)
						// 是否有营销活动
						if (+res.invite_open === 1) {
							res.fission_price = (+res.discount_price * res.invite_discount / 10000) // .toFixed(2)
						}
					} else if (+res.discount_price === -1 && +res.price === 0) {
						res.discount_price = 0
					}

					// 只显示开启营销活动的数据
					if (+res.invite_open === 1 && (res.price > 0 || res.discount_price > 0)) {
						res.tipsText = res.fission_price == 0 ? "邀好友免费学" : `邀好友${(res.invite_discount / 10)}折购`
					}

					return res
				})
				// handledList = handledList.filter(n => n.id && n.cover_pic && n.name && n.visit_count)
				this.setData({list: handledList})
			}
		},
		todayRecommendCourse: {
			type: Object,
			values: {},
			observer(newObject) {
				if ($notNull(newObject)) {
					this.setData({todayRecommend: newObject})
				} else {
					this.setData({todayRecommend: null})
				}
			}
		}
	},

	/**
	 * Component initial data
	 */
	data: {
		list: [],
		todayRecommend: null,
		previewLink: "",
		isIosPlatform: false,
		isFluentLearnVIP: false, // 是否是畅学卡会员
	},

	pageLifetimes: {
		show: function () {
			// 检查IOS
			this.checkIos()
			// 查询畅学卡信息
			this.getFluentInfo()
		}
	},

	/**
	 * Component methods
	 */
	methods: {
		/**
		 * 请求畅销卡信息
		 */
		getFluentInfo() {
			if (!hasUserInfo() || !hasAccountInfo()) return
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
			getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
				this.setData({isFluentLearnVIP: $notNull(data) && data.status === FluentLearnUserType.active})
			})
		},
		// 检查ios环境
		checkIos() {
			wx.getSystemInfo({
				success: (res2) => {
					if (res2.platform == 'ios') {
						this.setData({isIosPlatform: true})
					}
				}
			})
		},
		navigateToVideoDetail(e) {
			let item = e.currentTarget.dataset.item
			wx.navigateTo({
				url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`, complete() {
					bxPoint("homepage_jingpin_click", {
						is_jingpin: 1,
						jingpin_id: item.id,
						series_id: item.id,
						kecheng_name: item.teacher_desc,
						kecheng_subname: item.name,
						kecheng_teacher: item.teacher.name,
						kecheng_ori_price: item.price,
						kecheng_dis_price: item.discount_price,
						kecheng_total_amount: item.visit_count,
					}, false)
				}
			})
		},
		goToPractice() {
			wx.switchTab({
				url: "/pages/practice/practice", complete() {
					bxPoint("homepage_all_series_tab", {}, false)
				}
			})
		},
		goToJoinFluentLearn() {
			wx.navigateTo({
				url: "/mine/joinFluentLearn/joinFluentLearn", complete() {
					bxPoint("homepage_changxue_banner", {}, false)
				}
			})
		}
	}
})
