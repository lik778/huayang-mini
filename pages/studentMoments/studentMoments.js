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
  getLocalStorage,
  createAnimationFun,
  setLocalStorage,
  removeLocalStorage
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
import dayjs from "dayjs"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commonIcon: {
      likeIcon: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1619081085PVPpNp.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1619081056zZxwVz.jpg'],
      commentIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1619081102RGkhiY.jpg',
      playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618535781FCwFCm.jpg',
      shareIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1619081117EJyhKf.jpg'
    }, //点赞+评论+分享icon
    likeUserInfo: [], //点赞人信息
    interval: 10000, //点赞翻转自动滑动时间
    swiperCurrent: 0, //当前swiper下标 
    doommList: [],
    nowBarrageTextNum: 0,
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
      bottomArr: [],
      topWidth: 0,
      bottomWidth: 0,
      allElementWidth: 0,
      speed: 40
    }, //弹幕列表
    reasonHeight: 0,
    commentsList: [], //动态列表
    doommDataTop: [], //弹幕一楼数组
    doommDataBottom: [], //弹幕二楼数组
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
    authType: '', //0是点赞授权，1是评论授权，控制授完权的自动请求数据操作,2是发布弹幕
    authData: "", //点赞函导致授权的类型
    didShowContribute: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化一切数据+mobx
    this.initData()
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

    // 04-25晚上16点前不显示入群引导
    if (dayjs().isBefore(dayjs("2021-04-25 16:00:00"))) {
      this.setData({
        didShowContribute: false
      })
    }

    if (!getLocalStorage(GLOBAL_KEY.accountInfo)) {
      setLocalStorage("hy_refresh_student_moments_list_expire", true)
    } else {
      let expire = getLocalStorage("hy_refresh_student_moments_list_expire")
      let now = parseInt(new Date().getTime() / 1000)
      if (now <= expire) {
        wx.pageScrollTo({
          duration: 0,
          scrollTop: 0
        })
        this.setData({
          getCommentsPageData: {
            offset: 0,
            limit: 10
          }
        })
        this.getMomentList()
        removeLocalStorage('hy_refresh_student_moments_list_expire')
      }
    }

    // 初始化本地用户信息
    this.initUserInfo()
    // pv打点
    bxPoint("bbs_visit", {})
    this.videoContext = wx.createVideoContext('my-video')
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
      // 点击分享按钮
      src += `?id=${res.target.dataset.item.bubble.id}`
    } else {
      // 胶囊分享按钮
      src = '/pages/studentMoments/studentMoments'
    }
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
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true,
        authType: 2
      })
      return
    }
    // 发布弹幕打点-4.19-JJ
    bxPoint("bbs_screen_comment", {}, false)
    this.setData({
      changeAnimationClass: true,
      showPublishBarrage: true,
      createBarrageContent: '',
      nowBarrageTextNum: 0
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
    let nowDateStr = new Date().getHours()
    let num1 = ''
    let num2 = ''
    if (0 < nowDateStr && nowDateStr < 6) {
      num1 = 1
      num2 = 5
    } else if (6 < nowDateStr && nowDateStr < 7) {
      num1 = 20
      num2 = 50
    } else if (7 < nowDateStr && nowDateStr < 23) {
      num1 = 100
      num2 = 300
    } else {
      num1 = 20
      num2 = 50
    }
    if (start) {
      randomNum = getRandomNumberByRange(start, start + 10) > num2 ? getRandomNumberByRange(num2 / 2, num2 / 2 + 10) : getRandomNumberByRange(start, start + 10)
    } else {
      randomNum = getRandomNumberByRange(num1, num2)
    }
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
    userInfo = userInfo ? JSON.parse(userInfo) : ''
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
    this.initVisitData()
    //mobx初始化
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['studentMoments', 'studentBarrageBottomArr', 'studentBarrageTopArr'],
      actions: ['getCommentsList', 'getBarrageList', 'change', 'like', 'updateMomentsLikeStatus'],
    })
    // 获取弹幕
    this.getBarrage()
    // 获取动态列表
    this.getMomentList()
  },

  bindfocusDialog(e) {
    this.setData({
      reasonHeight: e.detail.height || 0
    })
  },

  bindblurDialog() {
    this.setData({
      reasonHeight: 0
    })
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
      })
      setTimeout(() => {
        // 初始化点赞
        this.initLikeMessage()
      }, 300)
    })

  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false,
      authType: '',
      authData: ''
    })
  },

  // 控制非视图区域停止视频显示
  estimateVideoLocation() {
    for (let i = 0; i < this.data.studentMoments.length; i++) {
      wx.createIntersectionObserver().relativeToViewport({
        top: -50,
        bottom: -50
      }).observe('.module-' + i, res => {
        if (res && res.intersectionRatio <= 0) {
          this.setData({
            playingIndex: ''
          })
        }
      })
    }
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
    if (this.data.authType === 0) {
      if (this.data.authData.hasLike === 0) {
        this.toLike(this.data.authData)
      }
    } else if (this.data.authType === 1) {
      let item = this.data.authData.currentTarget.dataset.item
      wx.navigateTo({
        url: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${item.bubble.id}&showCommentBox=true`,
      })
    } else if (this.data.authType === 2) {
      this.openBarrage()
    }
    setTimeout(() => {
      this.setData({
        authData: '',
        authType: ''
      })
    }, 1000)
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
      if (!this.data.userInfo) {
        this.setData({
          didShowAuth: true,
          authType: 1,
          authData: e
        })
        return
      }
      wx.navigateTo({
        url: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${id}&showCommentBox=true`,
      })
    } else {
      wx.navigateTo({
        url: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${id}`,
      })
    }

  },

  // 播放视频
  playVideo(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      playingIndex: index,
    })
    setTimeout(() => {
      this.videoContext.play()
      this.estimateVideoLocation()
    }, 350)
  },

  // 更新弹幕评论内容
  updateTextareaText(e) {
    let value = e.detail.value
    value = value.substring(0, 40);
    this.setData({
      createBarrageContent: value,
      nowBarrageTextNum: value.length
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
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            mask: true
          })
          this.updateBarrageAnimate(this.data.createBarrageContent)
          this.setData({
            createBarrageContent: '',
            nowBarrageTextNum: 0,
            createBarrageLock: true
          })
        } else {
          this.setData({
            createBarrageLock: true
          })
        }
      }).catch(() => {
        this.setData({
          createBarrageLock: true
        })
      })
    }

  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    this.clearBarrageFun()
    this.setData({
      swiperCurrent: 0,
      likeUserInfo: this.data.likeUserInfo.slice()
    })
  },

  // 清除弹幕倒计时
  clearBarrageFun() {
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
        didShowAuth: true,
        authType: 0,
        authData: e
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

  // 获取弹幕列表
  getBarrage() {
    this.getBarrageList(this.data.getBarragePageData, this).then(res => {
      const huayangLogo = 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618451480ZWGEID.jpg'
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.font = 'normal 400 12px PingFangSC-Regular, PingFang SC'
      let topWidth = 0
      let bottomWidth = 0
      let topArr = []
      let bottomArr = []
      let topAllElementWidth = 0
      let bottomAllElementWidth = 0
      let allElementWidth = 0
      for (let i = 0; i < res.length; i++) {
        let item = res[i]
        let textWidth = parseInt(ctx.measureText(item.content).width)
        let image = getNElmentFromArray(userList, 1)[0].headImage
        let bg = getNElmentFromArray(['#FFE0E0', '#DFECFF', '#D7ECDB', '#FFEED6'], 1)[0]
        item.text = item.content
        item.src = item.user ? item.user.avatar_url : image
        item.bg = bg
        if (topWidth < bottomWidth) {
          topAllElementWidth = topAllElementWidth + textWidth + 105
          topArr.push(item)
          topWidth = topWidth + textWidth + 105
          item.position = topWidth
        } else {
          bottomAllElementWidth = bottomAllElementWidth + textWidth + 105
          bottomArr.push(item)
          bottomWidth = bottomWidth + textWidth + 105
          item.position = bottomWidth
        }
      }
      allElementWidth = topAllElementWidth > bottomAllElementWidth ? topAllElementWidth : bottomAllElementWidth + 100
      this.setData({
        barrageList: {
          topArr,
          bottomArr,
          topWidth,
          bottomWidth,
          allElementWidth,
          speed: 40
        }
      })
      setTimeout(() => {
        this.changeTranslate()
      }, 30)
    })
  },

  // 本人发弹幕时处理弹幕函数
  updateBarrageAnimate(text) {
    let speed = this.data.barrageList.speed
    let startTime = this.data.barrageList.animateStartTime
    let nowTime = parseInt(new Date().getTime() / 1000)
    const systemInfoWidth = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
    let translateWidth = (nowTime - startTime) * speed + systemInfoWidth
    let src = this.data.userInfo.avatar_url
    const ctx = wx.createCanvasContext('myCanvas')
    let textWidth = parseInt(ctx.measureText(text).width)
    let obj = {}
    ctx.font = 'normal 400 12px PingFangSC-Regular, PingFang SC'
    if (this.data.barrageList.topWidth < this.data.barrageList.bottomWidth) {
      let list = this.data.barrageList.topArr.concat([])
      let findIndex = list.findIndex((item, index) => {
        if (item.position > translateWidth) {
          return index
        }
      })
      let index = findIndex === -1 ? list.length - 1 : findIndex
      obj.position = list[index - 1].position + textWidth
      obj.text = text
      obj.src = src
      list.splice(index, 0, obj)
      if (findIndex !== -1) {
        for (let i = index; i < list.length; i++) {
          list[i].position = list[i].position + textWidth + 105
        }
      }
      this.setData({
        ['barrageList.topArr']: list,
        ['barrageList.allElementWidth']: this.data.barrageList.allElementWidth + textWidth + 105,
        ['barrageList.topWidth']: this.data.barrageList.topWidth + textWidth + 105
      })
    } else {
      let list = this.data.barrageList.bottomArr.concat([])
      let findIndex = list.findIndex((item, index) => {
        if (item.position > translateWidth) {
          return index
        }
      })
      let index = findIndex === -1 ? list.length - 1 : findIndex

      obj.position = list[index - 1].position + textWidth

      obj.text = text
      obj.src = src

      list.splice(index, 0, obj)

      if (findIndex !== -1) {
        for (let i = index; i < list.length; i++) {
          list[i].position = list[i].position + textWidth + 105
        }
      }

      this.setData({
        ['barrageList.bottomArr']: list,
        ['barrageList.allElementWidth']: this.data.barrageList.allElementWidth + textWidth + 105,
        ['barrageList.bottomWidth']: this.data.barrageList.bottomWidth + textWidth + 105
      })
    }
  },

  // 递归控制动画结束
  changeTranslate() {
    let speed = this.data.barrageList.speed
    let allElementWidth = this.data.barrageList.allElementWidth
    this.setData({
      ['barrageList.animateStartTime']: parseInt(new Date().getTime() / 1000)
    })
    this.animate('.barrage-scroll-module', [{
        translateX: "100%",
        opacity: 1
      },
      {
        translateX: -allElementWidth,
        opacity: 1
      }
    ], allElementWidth / speed * 1000, () => {
      this.changeTranslate()
    })
  },

})