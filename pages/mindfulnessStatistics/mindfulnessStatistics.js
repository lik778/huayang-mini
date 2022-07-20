import { getLocalStorage } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";
import { getMindfulnessStatistics } from "../../api/mindfulness/index";
import dayjs from "dayjs";

Page({

  /**
   * 页面的初始数据
   */
  data: {
		statusHeight: 0,

		weeks: ["日", "一", "二", "三", "四", "五", "六"],
		dates: [],

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
  onShareAppMessage() {

  },

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
		let daysNumberInCurrentMonth = dayjs(dayjs()).daysInMonth() // 当月的天数
		let firstDateInCurrentMonth = dayjs().date(1).day() // 当月1号是周几
		console.log(daysNumberInCurrentMonth, firstDateInCurrentMonth)
	}
})
