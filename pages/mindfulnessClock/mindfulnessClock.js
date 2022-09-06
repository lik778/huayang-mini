import { getLocalStorage, hasAccountInfo, hasUserInfo } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";
import dayjs from "dayjs";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    weeks: ['日','一','二','三','四','五','六'],
    targetObj: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      targetObj: dayjs()
    })
    this.run()
  },

  run() {
    // 获取正念联系的数据
    // 初始化
    this.initCalendar()
  },
  
  initCalendar(t = dayjs()) {
    
  }

 
})