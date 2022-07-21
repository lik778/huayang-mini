import { getLocalStorage } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";
import { getMindfulnessCalendar, getMindfulnessStatistics } from "../../api/mindfulness/index";
import dayjs from "dayjs";

Page({

  /**
   * 页面的初始数据
   */
  data: {
		statusHeight: 0,

		targetDateObj: null,
		currentMonthFormat: "",
		weeks: ["日", "一", "二", "三", "四", "五", "六"],
		dates: [],
		isCurrentMonth: true,

		mindfulnessStatisticsData: {
			continuousDay: 0,
			totalDay: 0,
			totalOnlineMinute: 0
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
			targetDateObj: dayjs(),
			currentMonthFormat: ""
		})

		this.run()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {
	//
  // },

	run() {
		// 获取正念练习数据
		getMindfulnessStatistics({bizType: "PRACTISE", userId: getLocalStorage(GLOBAL_KEY.userId)})
			.then((data) => {
				if (data) {
					this.setData({mindfulnessStatisticsData: data})
				}
			})

		this.initCalendar()
	},

	// 初始化日历
	initCalendar() {
		this._calcCalendar(this.data.targetDateObj)
	},

	getOnlineCalendar() {
		let t = this.data.targetDateObj
		getMindfulnessCalendar({bizType: "PRACTISE", userId: getLocalStorage(GLOBAL_KEY.userId), startTime: t.date(1).unix(), endTime: t.date(dayjs(t).daysInMonth()).unix()})
			.then(({data}) => {
				console.log(data)
			})
	},

	// 计算日历
	_calcCalendar(d = dayjs()) {
		this.setData({currentMonthFormat: d.format("YYYY年MM月")})

		let daysNumberInCurrentMonth = dayjs(d).daysInMonth() // 当月的天数
		let firstDateInCurrentMonth = d.date(1).day() // 当月1号是周几
		let dates = []

		for (let i = 0; i < firstDateInCurrentMonth; i++) {
			dates.push("")
		}
		for (let i = 1; i <= daysNumberInCurrentMonth; i++) {
			dates.push(i)
		}
		for (let i = 0, len = dates.length % 7; i < 7 - len; i++) {
			dates.push("")
		}
		this.setData({dates})

		this.getOnlineCalendar()
	},

	toggleMonth(e) {
		let {item} = e.currentTarget.dataset
		let t = this.data.targetDateObj
		let n = null

		switch (item) {
			case "prev": {
				n = t.subtract(1, "month")
				break
			}
			case "next": {
				// 不能查看未来的月份
				if (dayjs().isAfter(t, "month")) {
					n = t.add(1, "month")
				}
				break
			}
		}

		if (n) {
			this._calcCalendar(n)
			this.setData({targetDateObj: n})

			// 检查是否当月
			this.setData({isCurrentMonth: dayjs().isSame(n, "month")})
		}
	},
})
