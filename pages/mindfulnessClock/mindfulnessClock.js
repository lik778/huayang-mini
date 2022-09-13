import { getLocalStorage, $notNull } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";
import dayjs from "dayjs";
import { getMindfulnessCalendar, getMindfulnessStatistics } from "../../api/mindfulness/index";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mindfulnessStatisticsData: {
			continuousDay: 0,
			totalDay: 0,
			totalOnlineMinute: 0
    },
    statusHeight: 0,
    weeks: ['日','一','二','三','四','五','六'],
    targetObj: null,
    days: [],
    checkedNext: false,
    currentMonthFormat: '',
    lock: false,
    totalDuration: '',
    qrCode: '',
    actionName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let totalDuration = options.fixedShowTime
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      targetObj: dayjs(),
      totalDuration: totalDuration,
      qrCode: options.qrCode,
      actionName: options.actionName
    })
    this.run()
  },

  run() {
    // 获取正念联系的数据(训练时长-连续打卡天数)
    getMindfulnessStatistics({bizType: "PRACTISE", userId: getLocalStorage(GLOBAL_KEY.userId)})
    .then((data) => {
      if (data) {
        this.setData({mindfulnessStatisticsData: data});
      }
    })
    // 初始化
    this.initCalendar(this.data.targetObj)
  },
  

  // 制作月份表格
  initCalendar(t = dayjs()) {
    this.setData({currentMonthFormat: t.format("YYYY年MM月")})
    let cloneDays = []
    // 获取当前月份天数
    let allDays = t.daysInMonth()
    // 获取当前月份的第一天是周几
    let dayOne = t.date(1).day() // 从0开始表示周日
    // 计算1号之前有多少空格
    for(let i=0; i< dayOne; i++) {
      cloneDays.push('')
    }
    // 计算一个月的空格
    for(let i=1;i<=allDays;i++) {
      cloneDays.push({
        day: i,
        isChecked: false,
        isCurrent: false,
        isCurrentMonth: true
      })
    }
    // 计算月底之后有多少空格
    for(let i=1;i<= 42-allDays-dayOne;i++) {
      cloneDays.push({
        day: i,
        isChecked: false,
        isCurrent: false,
        isCurrentMonth: false
      })
    }
    this.setData({days: cloneDays})
    // 获取网络资源中的
    this.getOnlineClockData()
  },

  // 获取网络资源中的打卡天数并渲染
  getOnlineClockData() {
    // 今天
    let today  = dayjs().date()
    let  t = this.data.targetObj
    getMindfulnessCalendar({
      bizType: "PRACTISE",
      userId: getLocalStorage(GLOBAL_KEY.userId),
      startTime: t.date(1).unix() * 1000,
      endTime: t.date(t.daysInMonth()).unix() * 1000
    }).then((data) => {
      let res = data || []
      let nd = []
      let sd = [...this.data.days ]
      res = res.map(item => ({
        ...item,
        day: dayjs(item.checkinTime).date()
      }))

      for(let i=0;i<sd.length;i++) {
        let cur = sd[i]
        if(cur === '') {
          nd.push('')
        } else {
          if(cur.isCurrentMonth) {
            let isExitRes = res.find(ir => ir.day === cur.day)
            let isExitCurrent = res.find(ir => ir.day === cur.day && ir.day === today )
            nd.push({
              day: cur.day,
              isChecked: $notNull(isExitRes),
              isCurrent:  $notNull(isExitCurrent),
              isCurrentMonth: true
            })
          } else {
            nd.push({
              day: cur.day,
              isChecked: false,
              isCurrent:  false,
              isCurrentMonth: false
            })
          }
        }
      }
      this.setData({
        days: nd,
        lock: false
      })
      
    }).catch(() => {
      this.setData({lock: false})
    })
  },

  // 前进和后退加载不同的月份

  bindChangeMonth(e) {
    // 节流
    if(this.data.lock) return
    this.setData({
      lock: true
    })
    let change = e.target.dataset.change
    let lastTargetObj = dayjs(this.data.targetObj)
    if(change === 'next') {
      // 前进——需求判断当前月份是不是当月
      if(dayjs().isSame(lastTargetObj,'month')) {
        this.setData({
          lock: false,
        })
      } else {
        let nextMonth = lastTargetObj.add(1,'month')
        this.setData({
          targetObj: nextMonth,
          checkedNext: !dayjs().isSame(nextMonth,'month'),
        })
        this.initCalendar(nextMonth)
      }
    } else {
      let preMonth = lastTargetObj.subtract(1,'month')
      this.setData({
        targetObj: preMonth,
        checkedNext: true,
      })
      this.initCalendar(preMonth)
    }
  },

  // 格式化时间
  
  _formatTime(t) {
    if(t > 0) {
      return String(t/60).padStart(2,'0') + ':' + String(t%60).padStart(2,'0')
    }
    return '00:00'
  },

    // 分享好友
  bindSharing() {
    wx.navigateTo({
      url: `/pages/mindfulnessPoster/mindfulnessPoster?qrCode=${this.data.qrCode}&duration=${this.data.totalDuration}&continuesDay=${this.data.mindfulnessStatisticsData.continuousDay}&actionName=${this.data.actionName}`
    })
  }
})

