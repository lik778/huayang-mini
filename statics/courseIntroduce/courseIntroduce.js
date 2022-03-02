import { getChannelLives } from "../../api/channel/index";
import { getActivityList, queryVideoCourseListByBuyTag } from "../../api/course/index";
import request from "../../lib/request";
import { ROOT_URL } from "../../lib/config";
import { getYouZanKeChengList, queryTravelList } from "../../api/live/index";
import dayjs from "dayjs";
import bxPoint from "../../utils/bxPoint";
import {offlineTrainList} from "../../utils/mock"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		reviewLiveList: [],
		publicList: [],
		offlineList: [],
		travelList: [],
		onlineList: [],
		playingDays: ["", "半日游", "一日游", "二日游", "三日游", "四日游", "五日游", "六日游", "七日游", "八日游", "九日游", "十日游"],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.run();
		 bxPoint("university_course_introduction", {})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	run() {
		// 往期视频号直播回放
		getChannelLives({status: 3, is_show: 1, limit: 3}).then((data) => {
			this.setData({reviewLiveList: data});
		});

		// 活动平台-公开课
		getActivityList({title: "花样公开课", offset: 0, limit: 3, platform: 1, status: 1, sort: "begin_time"})
			.then(({list}) => {
				if (list.length < this.data.limit) {
					this.setData({hasMore: false});
				}
				list = list || [];
				list = list.map(n => ({
					...n,
					year: dayjs(n.start_time).year(),
					month: dayjs(n.start_time).month() + 1,
					date: dayjs(n.start_time).date(),
				}));
				this.setData({publicList: list});
			});

		// 线下培训课
		let offlineListData=offlineTrainList.concat([])
		offlineListData = offlineListData.map(n => ({
			...n,
			price: (n.price / 100).toFixed(0)
		}))
		this.setData({
			offlineList:offlineListData
		})

		// getYouZanKeChengList({offset: 0, limit: 3})
		// 	.then(({data: {list}}) => {
		// 		list = list || [];
		// 		list = list.map(n => ({
		// 			...n,
		// 			price: (n.price / 100).toFixed(0)
		// 		}));
		// 		this.setData({offlineList: list});
		// 	});

		// 城市慢游
		queryTravelList({
			travel_type: 1,
			offset: 0,
			limit: 3
		}).then((data) => {
			this.setData({travelList: this.handleTravelData(data)});
		});

		// 获取精品课程
		queryVideoCourseListByBuyTag({offset: 0, limit: 3})
			.then(list => {
				list = list || [];
				list = list.map(_ => {
					return {
						..._.kecheng_series,
						teacher: _.teacher,
						didBought: _.buy_tag === "已购",
						buy_tag: _.buy_tag
					};
				});
				let handledList = list.map((res) => {
					if (res.visit_count >= 10000) {
						res.visit_count = (res.visit_count / 10000).toFixed(1) + "万";
						res.visit_count = res.visit_count.split('.')[1] === '0万' ? res.visit_count[0] + "万" : res.visit_count;
					}
					res.price = (res.price / 100); // .toFixed(2)
					if (res.discount_price === -1 && res.price > 0) {
						// 原价出售
						// 是否有营销活动
						if (+res.invite_open === 1) {
							res.fission_price = (+res.price * res.invite_discount / 10000); // .toFixed(2)
						}
					} else if (res.discount_price >= 0 && res.price > 0) {
						// 收费但有折扣
						res.discount_price = (res.discount_price / 100); // .toFixed(2)
						// 是否有营销活动
						if (+res.invite_open === 1) {
							res.fission_price = (+res.discount_price * res.invite_discount / 10000); // .toFixed(2)
						}
					} else if (+res.discount_price === -1 && +res.price === 0) {
						res.discount_price = 0;
					}

					// 只显示开启营销活动的数据
					if (+res.invite_open === 1 && (res.price > 0 || res.discount_price > 0)) {
						res.tipsText = res.fission_price == 0 ? "邀好友免费学" : `邀好友${(res.invite_discount / 10)}折购`;
					}

					return res;
				});
				this.setData({onlineList: handledList});
			});
	},

	// 处理游学数据
	handleTravelData(data) {
		data = data.map((item) => {
			return {
				...item,
				cover: item.pics.split(",")[0],
				zh_day_count: this.data.playingDays[item.day_count],
				discount_price: item.discount_price > 0 ? item.discount_price : item.price,
				price: item.discount_price > 0 ? item.price : item.discount_price,
			};
		});
		return data;
	},

	// 查看视频号直播回放
	onReviewTap(e) {
		let {video_url, id, title} = e.currentTarget.dataset.item;
		bxPoint("university_llive_notice_page_reply_list", {live_replay_id: id, live_replay_title: title}, false)
		wx.navigateTo({url: "/pages/channelReview/channelReview?link=" + video_url});
	},

	// 查看公开课
	goToPureWebview(e) {
		let {item} = e.currentTarget.dataset;
		let link = "";
		switch (request.baseUrl) {
			case ROOT_URL.dev: {
				link = 'https://dev.huayangbaixing.com';
				break;
			}
			case ROOT_URL.prd: {
				link = 'https://huayang.baixing.com';
				break;
			}
		}

		link += `/#/home/detail/${item.id}`;

		bxPoint("university_activity_list_click", {activity_id: item.id}, false)

		if (+item.pay_online === 1) {
			// 收费活动
			wx.navigateTo({url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}`});
		} else {
			// 免费活动
			wx.navigateTo({url: `/pages/pureWebview/pureWebview?link=${link}`});
		}
	},

	// 查看线下课
	onAdsItemTap(e) {
		let {
			item
		} = e.currentTarget.dataset
		if (item) {
			bxPoint("university_course_enroll_click", {course_id: item.id, course_title: item.title}, false)

			wx.navigateTo({
				url: `/subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse?id=${item.id}`,
			})
			// wx.navigateToMiniProgram({
			// 	appId: "wx95fb6b5dbe8739b7",
			// 	path: `${item.page_url}?alias=${item.alias}`,
			// })
		}

		// let {item} = e.currentTarget.dataset;
		// bxPoint("university_course_enroll_click", {course_id: item.id, course_title: item.title}, false)
		// if (item) {
		// 	wx.navigateToMiniProgram({
		// 		appId: "wx95fb6b5dbe8739b7",
		// 		path: `${item.page_url}?alias=${item.alias}`,
		// 	});
		// }
	},

	// 查看游学线路
	onTravelItemTap(e) {
		let {id, name, title} = e.currentTarget.dataset.item;
		bxPoint("university_travel_click", {edu_travel_id: id, edu_travel_name: name, edu_travel_title: title}, false)
		wx.navigateToMiniProgram({
			appId: "wx2ea757d51abc1f47",
			path: "/pages/travelDetail/travelDetail?productId=" + id
		});
	},

	// 查看线上课
	toVideoCourseDetail(e) {
		let item = e.currentTarget.dataset.item
		bxPoint("university_series_list_click", {series_id: item.id}, false)
		wx.navigateTo({url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`})
	},

	// 查看更多
	goToMorePage(e) {
		let type = e.currentTarget.dataset.key
		switch(type) {
			case "live": {
				// 直播
				bxPoint("university_llive_notice_page_more_click", {}, false)
				wx.navigateTo({url: "/pages/channelLive/channelLive"})
				break
			}
			case "public": {
				// 公开课
				bxPoint("university_activity_more_click", {}, false)
				wx.navigateTo({url: "/statics/publicActivities/publicActivities"})
				break
			}
			case "offline": {
				// 线下课
				bxPoint("university_course_more_click", {}, false)
				wx.navigateTo({url: "/pages/shopSubject/shopSubject"})
				break
			}
			case "travel": {
				// 游学
				bxPoint("university_travel_more_click", {}, false)
				wx.navigateToMiniProgram({appId: "wx2ea757d51abc1f47", path: "pages/index/index"})
				break
			}
			case "online": {
				// 线上课
				bxPoint("university_series_more_click", {}, false)
				wx.navigateTo({url: "/subCourse/qualityCourse/qualityCourse"})
				break
			}
		}
	}
});
