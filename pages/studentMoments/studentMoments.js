// pages/studentMoments/studentMoments.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  userList
} from "../../utils/mock"
import {
  isIphoneXRSMax,
  getRandomNumberByRange,
  getNElmentFromArray,
  getLocalStorage
} from "../../utils/util"
import {
  getBarrageList,
  createBarrage,
  getStudentCommentList
} from "../../api/studentComments/index"
import {
  store
} from '../../store/index'
import {
  GLOBAL_KEY
} from '../../lib/config'
import bxPoint from "../../utils/bxPoint"
var timer = null
var timerBottom = null
var i = 0;
var iBottom = 0
var doommList = []
var doommListBottom = []
var pageThis = null

class Doomm {
  constructor(text, time, src) {
    this.text = text;
    this.time = time;
    this.src = src
    this.display = true;
    this.id = i++;
    let that = this
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1); //动画完成，从列表中移除这项
      pageThis.setData({
        doommDataTop: doommList
      })
    }, this.time * 1000) //定时器动画完成后执行。
  }
}

class DoommBottom {
  constructor(text, time, src) {
    this.text = text;
    this.time = time;
    this.src = src
    this.display = true;
    this.id = iBottom++;
    let that = this
    setTimeout(function () {
      doommListBottom.splice(doommListBottom.indexOf(that), 1); //动画完成，从列表中移除这项
      pageThis.setData({
        doommDataBottom: doommListBottom
      })
    }, this.time * 1000) //定时器动画完成后执行。
  }
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    commonIcon: {
      likeIcon: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367647LTWDYU.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367660dslOOQ.jpg'],
      commentIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367678kxmCLk.jpg',
      playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618535781FCwFCm.jpg',
      shareIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367691MgBtuD.jpg'
    }, //点赞+评论+分享icon
    likeUserInfo: [], //点赞人信息
    interval: 5000, //点赞翻转自动滑动时间
    swiperCurrent: 0, //当前swiper下标 
    doommList: [],
    huayangLogo: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618451480ZWGEID.jpg',
    visitUserData: {
      visitUserList: [],
      visitNum: 0
    }, //N人在看列表
    getBarragePageData: {
      offset: 0,
      limit: 10
    }, //弹幕分页参数
    getCommentsPageData: {
      offset: 0,
      limit: 10
    }, //动态分页参数
    barrageList: {
      topArr: [],
      bottomArr: []
    }, //弹幕列表
    clickShare: false,
    commentsList: [], //动态列表
    doommDataTop: [], //弹幕一楼数组
    doommDataBottom: [], //弹幕二楼数组
    barrageIndex: 0,
    barrageIndex1: 0,
    isIphoneXRSMax: isIphoneXRSMax(), //是否是x系列以上手机
    showPublishBarrage: false, //发布弹幕弹窗
    didShowContact: false, //显示客服消息弹窗
    playingIndex: '', //视频播放下标
    likeLock: true, //点赞锁
    createBarrageLock: true, //创建弹幕锁
    userId: "",
    userInfo: '',
    changeAnimationClass: true,
    didShowAuth: false, //授权弹窗
    createBarrageContent: '', //发送弹幕弹窗内容
    noMomentData: false, //是否还有动态数据
    showStudentMomentLike: false, //显示点赞动画

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化一切数据+mobx
    this.initData()
    pageThis = this
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    // pv打点
    bxPoint("bbs_visit")

    this.videoContext = wx.createVideoContext('my-video')
    if (this.data.clickShare) {
      this.barrageCommonFunTop()
      this.barrageCommonFunBottom()
      this.setData({
        clickShare: false
      })
    }

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let src = `/studentMoments/studentMomentsDetail/studentMomentsDetail`
    if (res.from === 'button') {
      src += `?id=${res.target.dataset.item.bubble.id}`
    }
    this.setData({
      clickShare: true
    })
    return {
      title: "快来看看花样大学精彩的校友动态！",
      path: src,
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618803112KiZxTl.jpg"
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noMomentData) {
      this.setData({
        ['getCommentsPageData.offset']: this.data.getCommentsPageData.limit + this.data.getCommentsPageData.offset
      })
      this.getCommentsList(this.data.getCommentsPageData, true).then((data) => {
        this.setData({
          noMomentData: data.type
        })
      })
    }
  },

  // 关闭客服消息弹窗
  onCloseContactModal() {
    this.setData({
      didShowContact: false
    })
  },

  // 打开客服消息弹窗
  openContribute() {
    // 联系客服投稿打点-4.19-JJ
    bxPoint("bbs_contact_service", {}, false)
    this.setData({
      didShowContact: true
    })
  },

  // 分享打点-4.19-JJ
  shareMoment(e) {
    let item = e.currentTarget.dataset.item
    bxPoint("bbs_share", {
      message_id: item.bubble.id,
      message_title: item.bubble.title,
      message_type: item.bubble.content_type === 1 ? "图片" : "视频",
      message_time: item.bubble.created_at,
      message_publisher_id: item.bubble.user_id === 0 ? '' : item.bubble.user_id,
    }, false)
  },

  // 打开发布弹幕弹窗
  openBarrage() {
    // 发布弹幕打点-4.19-JJ
    bxPoint("bbs_screen_comment", {}, false)
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    this.setData({
      changeAnimationClass: true,
      showPublishBarrage: true,
      createBarrageContent: ''
    })
  },

  // 关闭发布弹幕弹窗
  closeBarrage() {
    this.setData({
      changeAnimationClass: false
    })
    setTimeout(() => {
      this.setData({
        showPublishBarrage: false,
      })
    }, 300)

  },

  // 改变swiper下标
  changeSwiperCurrent(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  // 动态设置N人在看(每10s刷新一次)
  initVisitData(start) {
    let randomNum = ''
    if (start) {
      randomNum = getRandomNumberByRange(start - 10, start + 10)
    } else {
      randomNum = getRandomNumberByRange(100, 300)
    }
    let userInfo = this.data.userInfo
    let userListData = []
    if (userInfo && start === undefined) {
      getNElmentFromArray(userList, 2).map(item => {
        userListData.push(item.headImage)
      })
      userListData.push(userInfo.avatar_url)
    } else {
      getNElmentFromArray(userList, 3).map(item => {
        userListData.push(item.headImage)
      })
    }
    this.setData({
      visitUserData: {
        visitUserList: userListData,
        visitNum: randomNum
      }
    })
    setTimeout(() => {
      this.initVisitData(randomNum + 1)
    }, 5000)
  },

  // 动态设置x点赞(每10s刷新一次)
  initLikeMessage() {
    let arr = getNElmentFromArray(userList, 40)
    let realArr = []
    for (let i in arr) {
      let randomNum = Math.floor(Math.random() * (0, this.data.studentMoments.length))
      let courseName = this.data.studentMoments[randomNum].bubble.title
      realArr.push({
        avator: arr[i].headImage,
        name: arr[i].name,
        courseName
      })
    }
    this.setData({
      likeUserInfo: realArr
    })
  },

  // 初始化本地用户信息
  initUserInfo() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    userInfo = userInfo ? JSON.parse(userInfo) : ''
    userId = userId ? userId : ''
    this.setData({
      userInfo,
      userId
    })
  },

  // 初始化一切假数据
  async initData() {
    // 初始化本地用户信息
    this.initUserInfo()
    this.initVisitData()
    //mobx初始化
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['studentMoments'],
      actions: ['getCommentsList', 'change', 'like', 'updateMomentsLikeStatus'],
    })
    // 获取弹幕
    this.getBarrage()
    // 获取动态列表
    this.getMomentList()
  },

  // 获取动态列表
  getMomentList(limit) {
    let pageData = Object.assign({}, this.data.getCommentsPageData)
    if (limit) {
      pageData.limit = limit
      pageData.offset = 0
    }
    this.getCommentsList(pageData).then((data) => {
      this.setData({
        noMomentData: data.type
      }, () => {
        // 初始化点赞
        this.initLikeMessage()
      })
    })

  },
  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 确认授权
  authCompleteEvent(e) {
    this.initUserInfo()
    this.setData({
      didShowAuth: false
    })
    let pageData = Object.assign({}, this.data.getCommentsPageData)
    let limit = pageData.offset + pageData.limit
    this.getMomentList(limit)
  },

  // 点击进入详情页
  toDetail(e) {
    let item = e.currentTarget.dataset.item
    let id = e.currentTarget.dataset.item.bubble.id
    let type = e.currentTarget.dataset.point
    if (type === "true") {
      //评论打点
      bxPoint("bbs_comment", {
        message_id: id,
        message_title: item.bubble.title,
        message_type: item.bubble.content_type === 1 ? "图片" : "视频",
        message_time: item.bubble.created_at,
        message_publisher_id: item.bubble.user_id === 0 ? '' : item.bubble.user_id,
      }, false)
    }
    wx.navigateTo({
      url: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${id}`,
    })
  },

  // 播放视频
  playVideo(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      playingIndex: index,
    })
    setTimeout(() => {
      this.videoContext.play()
    }, 500)
  },

  // 获取弹幕列表
  getBarrage() {
    getBarrageList(this.data.getBarragePageData).then(({
      data = []
    }) => {
      let topArr = []
      let bottomArr = []
      data.map(item => {
        if (topArr.length > bottomArr.length) {
          bottomArr.push(item)
        } else {
          topArr.push(item)
        }
      })
      this.setData({
        barrageList: {
          topArr,
          bottomArr
        }
      })
      // 初始化弹幕动画
      this.barrageCommonFunTop()
      this.barrageCommonFunBottom()
    })
  },

  // 更新弹幕评论内容
  updateTextareaText(e) {
    let value = e.detail.value
    this.setData({
      createBarrageContent: value
    })
  },

  // 发布弹幕
  createBarrageNow() {
    if (this.data.createBarrageContent.trim() === '') {
      wx.showToast({
        title: '请输入弹幕内容',
        icon: 'none'
      })
      return
    }
    if (this.data.createBarrageLock) {
      this.setData({
        createBarrageLock: false
      })
      createBarrage({
        content: this.data.createBarrageContent,
        user_id: this.data.userId
      }).then(res => {
        if (res.code === 0) {
          this.closeBarrage()
          this.setData({
            createBarrageContent: ''
          })
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            mask: true
          })
        }
      })
      setTimeout(() => {
        this.setData({
          createBarrageLock: true
        })
      }, 1500)
    }

  },

  // 第一行弹幕函数
  barrageCommonFunTop() {
    let arr = this.data.barrageList.topArr
    let index = this.data.barrageIndex
    let src = arr[index].user ? arr[index].user.avatar_url : this.data.huayangLogo
    let text = arr[index].content
    doommList.push(new Doomm(text, 5, src));
    let time = 1000 + Math.ceil((text.length - 5) / 5) * 400
    clearInterval(timer)
    timer = setInterval(() => {
      this.barrageCommonFunTop()
    }, time)
    this.setData({
      doommDataTop: doommList,
      barrageIndex: index > arr.length - 2 ? 0 : index + 1
    })
  },

  // 第二行弹幕函数
  barrageCommonFunBottom() {
    let arr = this.data.barrageList.bottomArr
    let index = this.data.barrageIndex1
    let src = arr[index].user ? arr[index].user.avatar_url : this.data.huayangLogo
    let text = arr[index].content
    doommListBottom.push(new DoommBottom(text, 5, src));
    let time = 1000 + Math.ceil((text.length - 5) / 5) * 400
    clearInterval(timerBottom)
    timerBottom = setInterval(() => {
      this.barrageCommonFunBottom()
    }, time)
    this.setData({
      doommDataBottom: doommListBottom,
      barrageIndex1: index > arr.length - 2 ? 0 : index + 1
    })
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    this.clearBarrageFun()
    this.setData({
      clickShare: true
    })
  },

  // 清除弹幕倒计时
  clearBarrageFun() {
    clearInterval(timer)
    clearInterval(timerBottom)
    i = 0
    iBottom = 0
    this.setData({
      didShowContact: false
    })
  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {
    this.storeBindings.destroyStoreBindings()
    this.clearBarrageFun()
  },


  // 点赞/取消点赞动态
  toLike(e) {
    let item = e.currentTarget.dataset.item
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true
      })
      return
    }

    // 点赞打点
    bxPoint("bbs_like", {
      message_id: item.bubble.id,
      message_title: item.bubble.title,
      message_type: item.bubble.content_type === 1 ? "图片" : "视频",
      message_time: item.bubble.created_at,
      message_publisher_id: item.bubble.user_id === 0 ? '' : item.bubble.user_id,
    }, false)

    // 处理延时点赞
    let {
      hasLike,
      likeCount
    } = item
    let nowHasLike = ''
    let nowLikeCount = ''
    if (hasLike === 1) {
      nowHasLike = 0
      nowLikeCount = likeCount - 1
    } else {
      nowHasLike = 1
      nowLikeCount = likeCount + 1
    }
    this.updateMomentsLikeStatus({
      id: item.bubble.id,
      hasLike: nowHasLike,
      likeCount: nowLikeCount
    })
    this.like({
      hasLike,
      id: item.bubble.id,
    })
    // 处理顶部点赞
    if (item.hasLike === 0) {
      this.setData({
        showStudentMomentLike: true
      })
      // 关闭点赞动画
      setTimeout(() => {
        this.setData({
          showStudentMomentLike: false
        })
      }, 1500)

      let arr = this.data.likeUserInfo.concat([])
      arr.splice(this.data.swiperCurrent + 1, 0, {
        avator: this.data.userInfo.avatar_url,
        name: this.data.userInfo.nick_name,
        courseName: item.bubble.title
      })
      this.setData({
        likeUserInfo: arr
      })
    }
  },

})