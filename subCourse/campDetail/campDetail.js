// subCourse/trainingCampDetail/trainingCampDetail.js
import {
  getCampDetail,
  getCurentDayData,
  getHasJoinCamp,
  getCourseData,
  getArticileLink
} from "../../api/course/index"
import {
  dateAddDays,
  computeDate,
  simpleDurationSimple
} from "../../utils/util"
import bxPoint from '../../utils/bxPoint'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campData: "", //训练营信息
    campId: '', //训练营id
    showCover: true, //是否显示视频封面
    showPlayIcon: true, //是否显示播放按钮
    iconSrcList: {
      course: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925TZrmey.jpg',
      video: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925iFZICS.jpg',
      product: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925fmEUmR.jpg',
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925KAfZPv.jpg',
      lock: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596613255fHAzmw.jpg',
    }, //课程icon地址
    advertisingIndex: 0, //广告下标
    advertisingList: ['https://goss.veer.com/creative/vcg/veer/800water/veer-360547308.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-353816507.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-351568172.jpg'], //广告地址列表
    hasStartCampType: 1, //是否开营,1未开营，2开营中，3已结束
    joinDate: "", //加入训练营日期
    whatDay: "", //开营第n天
    courseList: [], //课程数组
    videoData: {
      src: "",
      pic: ""
    }, //视频地址以及封面
    articileLink: "", //引导私欲文章地址
  },

  // 获取引导私域地址
  getArticileLinkData() {
    getArticileLink({
      traincamp_id: this.data.campId
    }).then((res) => {
      this.setData({
        articileLink: res
      })
    })
  },

  // 添加班主任微信
  toArticleLink() {
    bxPoint('guide_wx', {}, false)
    let link = encodeURIComponent('https://www.baidu.com')
    wx.navigateTo({
      url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
    })
  },

  // 跳往课程详情
  toCoursedetail(e) {
    let item = e.currentTarget.dataset.item
    if (item.type === 'video') {
      this.playVideo()
      this.setData({
        videoData: {
          src: item.video,
          pic: item.cover
        }
      })
    }
  },

  // 轮播切换
  changeAdvertisingIndex(e) {
    this.setData({
      advertisingIndex: Number(e.detail.current)
    })
  },

  // 视频播放
  playVideo() {
    this.setData({
      showCover: false,
      showPlayIcon: false
    })
    this.videoContext.play()
    this.videoContext.requestFullScreen()
  },

  // 进/退全屏
  enterFull(e) {
    if (e.detail.fullscreen === false) {
      this.videoContext.pause()
      this.setData({
        showPlayIcon: true,
        showCover: true
      })
    }
  },

  // 判断是否加入训练营
  isJoinCamp() {
    getHasJoinCamp({
      traincamp_id: this.data.campId
    }).then(res => {
      this.setData({
        joinDate: res.date
      })
      this.getCampDetailData()
    })
  },

  // 获取训练营详情
  getCampDetailData() {
    getCampDetail({
      traincamp_id: this.data.campId
    }).then(res => {
      let startDate = new Date(this.data.joinDate).getTime()
      let nowDate = new Date().getTime()
      let endDateStr = dateAddDays(this.data.joinDate, res.period * 24 * 60 * 60, 'yyyy-MM-dd')
      let endDate = new Date(endDateStr).getTime()
      let whatDay = computeDate(new Date().getTime(), new Date(this.data.joinDate).getTime())
      let hasStartCampType = ''
      if (nowDate < startDate) {
        // 未开营
        hasStartCampType = 1
      } else if (nowDate > endDate) {
        // 已结束
        hasStartCampType = 3
      } else {
        // 开营中
        hasStartCampType = 2
      }
      console.log(nowDate, startDate, whatDay, this.data.joinDate)
      this.getNowCourse(whatDay)
      this.setData({
        campData: res,
        whatDay,
        hasStartCampType
      })
    })
  },

  // 获取当天课程
  getNowCourse(dayNum) {
    getCurentDayData({
      day_num: dayNum,
      traincamp_id: this.data.campId
    }).then(res => {
      let list = res.content ? JSON.parse(res.content) : []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].type === "kecheng") {
            getCourseData({
              kecheng_id: list[i].kecheng_id
            }).then(res => {
              list[i].duration = simpleDurationSimple(res.duration)
              this.setData({
                courseList: list
              })
            })
          } else if (list[i].type === "video" && this.data.videoData.src === '') {
            this.setData({
              videoData: {
                src: list[i].video,
                pic: list[i].cover,
              }
            })
          }
        }
      }
    })
  },

  // 跳转至训练营日期切换
  toChangeDate() {
    wx.navigateTo({
      url: '/subCourse/campPeriodList/campPeriodList',
    })
  },

  // 设置导航栏标题
  setTitile() {
    wx.setNavigationBarTitle({
      title: this.data.campData.name
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      campId: options.id
    })
    this.isJoinCamp()
    this.getArticileLinkData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})