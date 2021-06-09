import { FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import baseUrl from "../../lib/request"
import dayjs from "dayjs"
import { getFindBanner, getPhoneNumber } from "../../api/course/index"
import {
	checkUserHasAddress,
	getFluentCardInfo,
	getFluentDistributeGuide,
	getFluentLearnInfo,
	getPartnerInfo,
	getUserInfo,
	getUserOwnerClasses
} from "../../api/mine/index"
import {
	$notNull,
	getLocalStorage,
	hasAccountInfo,
	hasUserInfo,
	setLocalStorage,
	splitTargetNoString
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { getTaskEntranceStatus } from "../../api/task/index"
import { getYouZanAppId } from "../../api/mall/index"

const Level = [{
    label: "准合伙人",
    value: 0,
  }, {
    label: "初级合伙人",
    value: 1,
  },
  {
    label: "中级合伙人",
    value: 2,
  },
  {
    label: "高级合伙人",
    value: 3,
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    fluentLearnUserInfo: null,
    didShowAuth: false,
    didVisibleVIPIcon: false,
    statusHeight: 0,
    nodata: true,
    phoneNumber: "",
    existNo: undefined,
    activity_count: 0,
    kecheng_count: 0,
    traincamp_count: 0,
    showPromotion: true,
    visibleTaskEntrance: false,
    cardBtnText: "授权登录",
    bannerList: [],
    disHasFluentLearnUserInfo: false, // 是否有畅学卡会员信息
    isFluentLearnExpired: false, // 畅学卡依然有效
    cardName: "", // 畅学卡名称
    cardDesc: "", // 畅学卡描述
    auditInfo: null, // 畅学卡引导私域配置信息
    didVisibleAuditBtn: false, // 是否展示成为花样合伙人按钮
    partnerInfo: null, // 合伙人信息
    isPartner: false, // 当前用户是否是合伙人
    didShowContact: false,
    showMoneyNotice: false,
    showMoneyNoticeTop: '',
    changeMoneyNoticeClass: true,
    showClubVipAlert: false,
    showClubVipAlertType: ''
  },
  // 关闭加入花样俱乐部弹窗
  closeClubVipAlert() {
    this.setData({
      showClubVipAlert: false,
      showClubVipAlertType: ''
    })
  },

  onCloseContactModal() {
    this.setData({
      didShowContact: false
    })
  },
  /**
   * 指导按钮点击事件
   */
  onGuideBtnTap() {
    this.setData({
      didShowContact: true
    })
    bxPoint("join_chat", {})
  },
  /**
   * 处理长昵称
   * @param name
   * @returns {*}
   */
  handleNickname(name) {
    return splitTargetNoString(name, 16)
  },
  /**
   * 跳转到提现页
   */
  goToConvertCashPage() {
    bxPoint("mine_finalamount", {
      mine_finalamount: $notNull(this.data.userInfo) ? this.data.userInfo.amount : 0
    }, false)
    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({
        didShowAuth: true
      })
    }
    wx.navigateTo({
      url: "/mine/convertCash/convertCash"
    })
  },
  /**
   * 处理广告位点击事件
   * @param e
   */
  onBannerItemTap(e) {
    let {
      link,
      link_type,
      id,
      pic_url
    } = e.currentTarget.dataset.item
    bxPoint("mine_banner", {
      mine_banner_id: id,
      mine_banner_src: pic_url,
      mine_banner_url: link,
      mine_banner_mode: link_type,
    }, false)
    if (e.currentTarget.dataset.item.need_auth === 1) {
      if (!hasUserInfo() || !hasAccountInfo()) {
        return this.setData({
          didShowAuth: true
        })
      }
    }
    if (link_type === 'youzan') {
      getYouZanAppId().then(appId => {
        wx.navigateToMiniProgram({
          appId,
          path: link
        })
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  // 处理畅叙卡按钮点击事件
  onFluentCardTap() {
    if (!hasUserInfo() || !hasAccountInfo()) {
      this.setData({
        didShowAuth: true
      })
    } else {
      if (this.data.disHasFluentLearnUserInfo && !this.data.isFluentLearnExpired) {
        this.data.fluentLearnUserInfo && bxPoint("mine_changxue_find", {
          changxue_id: this.data.fluentLearnUserInfo.id,
          changxue_buy_date: this.data.fluentLearnUserInfo.created_at,
          changxue_expire_date: this.data.fluentLearnUserInfo.expire_time,
        }, false)
        wx.navigateTo({
          url: "/mine/fluentLearnInfo/fluentLearnInfo"
        })
      } else {
        bxPoint("mine_changxue_buy", {}, false)
        wx.navigateTo({
          url: "/mine/joinFluentLearn/joinFluentLearn"
        })
      }
    }
  },
  // 跳往我的推广
  toPromotion() {
    bxPoint("mine_promotion", {}, false)
    getUserInfo("scene=zhide").then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      wx.navigateTo({
        url: '/mine/promotion/promotion',
      })
    }).catch(() => {
      this.setData({
        showPromotion: false
      })
    })
  },

  // 获取用户主题营、课程、活动数量数据
  queryContentInfo() {
    if (hasUserInfo() && hasAccountInfo()) {
      getUserOwnerClasses({
        user_id: getLocalStorage(GLOBAL_KEY.userId)
      }).then((data) => {
        let {
          activity_count = 0, kecheng_count = 0, traincamp_count = 0
        } = data
        this.setData({
          activity_count,
          kecheng_count,
          traincamp_count
        })
      })
    }
  },
  // 加私域
  joinPrivateDomain() {
    this.setData({
      didShowContact: true
    })
    bxPoint("mine_sign_in_private_group", {}, false)
  },
  // 计算用户帐号创建日期
  calcUserCreatedTime() {
    if (hasUserInfo() && hasAccountInfo()) {
      let {
        created_at
      } = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      let nowDate = dayjs()
      let no = nowDate.diff(created_at, "day")
      this.setData({
        existNo: no || 1
      })
    }
  },
  // 处理用户卡片点击
  handleCardTap(e) {
    if (hasUserInfo() && hasAccountInfo()) {
      switch (e.currentTarget.dataset.ele) {
        case "bootcamp": {
          bxPoint("applet_mine_click_bootcamp", {}, false)
          wx.navigateTo({
            url: "/mine/personBootcamp/personBootcamp"
          })
          return
        }
        case "course": {
          bxPoint("applet_mine_click_course", {}, false)
          wx.navigateTo({
            url: "/mine/personCourse/personCourse"
          })
          return
        }
        case "activity": {
          bxPoint("applet_mine_click_activity", {}, false)
          wx.navigateTo({
            url: "/mine/personActivity/personActivity"
          })
          return
        }
      }
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 获取用户信息
  getUserSingerInfo() {
    if (!hasUserInfo() || !hasAccountInfo()) return Promise.reject()
    return new Promise((resolve, reject) => {
      getUserInfo('scene=zhide').then(res => {
        res.amount = Number((res.amount / 100).toFixed(2))
        setLocalStorage(GLOBAL_KEY.accountInfo, res)
        res.nick_name = this.handleNickname(res.nick_name)
        // 判断是否成为俱乐部会员，未成为则跳转填写信息
        // if (!$notNull(res.student)) {
        //   let hasShowClubVipAlertSign = getLocalStorage('hy_daxue_show_club_vip_alert_sign')
        //   let threeDayTime = 259200 //s
        //   let threeDayLaterTimeStr = parseInt(new Date().getTime() / 1000) + threeDayTime
        //   if (!hasShowClubVipAlertSign) {
        //     setTimeout(() => {
        //       this.setData({
        //         showClubVipAlert: true,
        //         showClubVipAlertType: 1
        //       })
        //       setLocalStorage("hy_daxue_show_club_vip_alert_sign", threeDayLaterTimeStr)
        //     }, 1000)
        //   }
        // }
        this.setData({
          userInfo: res
        })

        resolve()
      }).catch((err) => {
        if (err === -2) {
          setTimeout(() => {
            this.setData({
              isPartner: false,
              nodata: true,
              userInfo: null,
              cardBtnText: "授权登录",
              disHasFluentLearnUserInfo: false,
              traincamp_count: 0,
              kecheng_count: 0,
              activity_count: 0,
              didVisibleAuditBtn: false
            })
          }, 1000)
          return
        }
        reject(err)
      })
    })
  },

  getBanner() {
    getFindBanner({
      scene: 18
    }).then((list) => {
      this.setData({
        bannerList: list
      })
    })
  },


  // 检查是否填写收获地址表单
  checkHasFillAddress() {
    checkUserHasAddress({
      user_id: this.data.userInfo.id
    }).then(res => {
      if (res.code === 0) {
        let data = res.data.hasAddr
        if (!data) {
          let hasShowClubVipAlertSign = getLocalStorage('hy_daxue_show_club_vip_alert_sign')
          let threeDayTime = this.data.disHasFluentLearnUserInfo ? 86400 : 259200 //买了畅学卡1天1显示没买3天一显示
          let threeDayLaterTimeStr = parseInt(new Date().getTime() / 1000) + threeDayTime
          let rootUrl = baseUrl.baseUrl
          let userId = this.data.userInfo.id
          let type = this.data.disHasFluentLearnUserInfo ? 2 : 1
          if (!hasShowClubVipAlertSign) {
            setTimeout(() => {
              this.setData({
                showClubVipAlert: true,
                showClubVipAlertType: type,
                showClubVipAlertLink: encodeURIComponent(`${rootUrl}/#/home/huayangClubForm?id=${userId}&from=daxue&type=${type}`)
              })
              setLocalStorage("hy_daxue_show_club_vip_alert_sign", threeDayLaterTimeStr)
            }, 1000)
          }
        }
      }
    })
  },

  /**
   * 请求畅学卡信息
   */
  getFluentInfo() {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    getFluentCardInfo({
      user_snow_id: accountInfo.snow_id
    }).then(({
      data
    }) => {
      if ($notNull(data)) {
        // 畅学卡是否已过期
        let isFluentLearnExpired = data.status === FluentLearnUserType.deactive

        // 畅学卡有效的用户引导加私域
        if (!isFluentLearnExpired) {
          getFluentDistributeGuide().then(({
            data
          }) => {
            this.setData({
              didVisibleAuditBtn: data.status === 1,
              auditInfo: data
            })
          })
        }

        this.setData({
          fluentLearnUserInfo: data,
          disHasFluentLearnUserInfo: !!data,
          isFluentLearnExpired,
          didVisibleVIPIcon: accountInfo.tag_list ? accountInfo.tag_list.includes("vip") : false,
          cardBtnText: isFluentLearnExpired ? "立即加入" : "查看权益"
        })
        this.setData({
          ['fluentLearnUserInfo.expire_time'] : this.data.fluentLearnUserInfo.expire_time.match(/\S+/)[0]
        })

      } else {
        this.setData({
          cardBtnText: "立即加入"
        })
      }
    })
  },
  // 获取授权
  getAuth() {
    if (this.data.nodata) {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 用户授权取消
  authCancelEvent() {
    this.run()

    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.reloadUserCenter()
    this.init()
    this.setData({
      didShowAuth: false
    })
  },

  // 处理
  init() {
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    })
    getFluentCardInfo({
      user_snow_id: this.data.userInfo.snow_id
    }).then(({
      data
    }) => {
      this.setData({
        disHasFluentLearnUserInfo: !!data
      })
      this.checkHasFillAddress()
    })
  },

  reloadUserCenter() {
    this.run()
    this.queryContentInfo()
    this.getUserSingerInfo().then(() => {
      this.getFluentInfo()
    })
    this.queryUserPartnerInfo()
    // 获取加入学习群高度，用来判断显示余额显示
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      setTimeout(() => {
        let query = wx.createSelectorQuery();
        query.select('.function-list').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          this.setData({
            showMoneyNoticeTop: parseInt(res[0].top) - 350,
          })
        })
      }, 500)
    }
  },
  // 我的作业
  goToTaskLaunchPage() {
    if (hasUserInfo() && hasAccountInfo()) {
      bxPoint("mine_task_layout", {}, false)
      let userId = getLocalStorage(GLOBAL_KEY.userId)
      wx.navigateTo({
        url: `/subCourse/personTask/personTask?visit_user_id=${userId}`,
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 我的订单
  toOrder() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({
        url: '/mine/mineOrder/mineOrder',
      })
    } else {
      this.setData({
        didShowAuth: true
      })
    }
  },
  // 获取客服号码
  getNumber() {
    getPhoneNumber().then(phoneNumber => {
      this.setData({
        phoneNumber
      })
    })
  },
  // 公用方法
  kingOfTheWorld() {
    this.getUserSingerInfo()
  },
  // 联系客服
  callPhone(e) {
    bxPoint("mine_contact", {}, false)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  // 查询用户合伙人信息
  queryUserPartnerInfo() {
    if (!hasAccountInfo()) return
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    getPartnerInfo({
      user_snow_id: accountInfo.snow_id,
      with_child: 1
    }).then(({
      data
    }) => {
      if ($notNull(data)) {
        let lv = Level.find(_ => _.value === +data.distribute_user.level)
        let partnerData = {
          firstNo: data.distribute_user.first_num,
          secondNo: data.distribute_user.second_num,
          firstUserAvatars: $notNull(data.first_list) ? data.first_list.filter(_ => _.user).map(_ => _.user.avatar_url) : [],
          secondUserAvatars: $notNull(data.second_list) ? data.second_list.filter(_ => _.user).map(_ => _.user.avatar_url) : [],
          level: $notNull(lv) ? lv.label : "",
          exclusiveCode: data.distribute_user.num,
          distribute_user: data.distribute_user
        }
        this.setData({
          partnerInfo: partnerData,
          isPartner: data.distribute_user.status === 2
        })

      }
    })
  },
  // 跳转到分销人列表页
  goToDistributeListPage(e) {
    wx.navigateTo({
      url: `/mine/distributeRecord/distributeRecord?index=${e.currentTarget.dataset.index}`
    })
  },
  // 生成海报
  generatePoster() {
    bxPoint("mine_distributer_post", {}, false)

    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({
        didShowAuth: true
      })
    }

    // 04.25之前成为花样学生的用户，点击获取专属海报按钮时跳转老带新海报，反之跳转畅学卡海报页
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    // wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
    wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    // if ($notNull(this.data.fluentLearnUserInfo)) {
    //   let createdAt = dayjs(this.data.fluentLearnUserInfo.created_at)
    //   if (createdAt.isBefore(dayjs("2021-04-25"))) {
    //     wx.navigateTo({url: "/mine/oldInviteNew/oldInviteNew?inviteId=" + accountInfo.snow_id})
    //   } else {
    //     wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    //   }
    // } else {
    //   wx.navigateTo({url: "/mine/fluentCardDistribute/fluentCardDistribute?inviteId=" + accountInfo.snow_id})
    // }
  },
  run() {
    // 检查是否展示作业秀入口
    getTaskEntranceStatus().then(({
      data
    }) => {
      this.setData({
        visibleTaskEntrance: data == 1
      })
    })


    if (hasUserInfo() && !hasAccountInfo()) {
      // 有微信信息没有手机号信息
      let info = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
      info.nickname = this.handleNickname(info.nickname)
      this.setData({
        userInfo: info,
        nodata: false,
      })
    } else if (hasUserInfo() && hasAccountInfo()) {
      // 有微信信息且有手机号信息
      this.kingOfTheWorld()
      this.setData({
        nodata: false,
        showPromotion: true,
      })
    } else {
      // nothing
      this.setData({
        nodata: true
      })
    }

    this.calcUserCreatedTime()

    // 获取畅学卡文案
    getFluentLearnInfo().then(({
      data
    }) => {
      this.setData({
        cardName: data.card_name,
        cardDesc: data.description,
      })
    })
    // 获取加入学习群高度，用来判断显示余额显示
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    if (userId) {
      setTimeout(() => {
        let query = wx.createSelectorQuery();
        query.select('.function-list').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          this.setData({
            showMoneyNoticeTop: parseInt(res[0].top) - 350,
          })
        })
      }, 500)
    }
  },


  // 初始化指示图
  initIndicatePic(type = 0) {
    let sign = getLocalStorage("need_show_mine_sign")
    if (type === 0) {
      // 首次进入我的，加上标识
      if (sign === undefined) {
        setLocalStorage("need_show_mine_sign", true)
      }
    } else if (type === 1) {
      // 成为会员首次进入我的，删除标识,显示指示图
      if (sign === true) {
        // 获取加入学习群高度，用来判断显示余额显示
        this.setData({
          showMoneyNotice: true
        })
        setTimeout(() => {
          this.setData({
            showMoneyNotice: false
          })
        }, 2000)
        setLocalStorage('need_show_mine_sign', 'false')
      }
    }
  },

  // 关闭指示弹窗
  closeMoneyNotice() {
    this.setData({
      changeMoneyNoticeClass: false
    })
    setTimeout(() => {
      this.setData({
        showMoneyNotice: false,
        changeMoneyNoticeClass: true
      })
    }, 200)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getLocalStorage("need_show_mine_sign") === undefined) {
      this.initIndicatePic()
    }
    let nowTimeStr = parseInt(new Date().getTime() / 1000)
    let threeDayLaterTimeStr = getLocalStorage('hy_daxue_show_club_vip_alert_sign')
    if (threeDayLaterTimeStr && nowTimeStr > threeDayLaterTimeStr) {
      wx.removeStorageSync('hy_daxue_show_club_vip_alert_sign')
    }
    let data = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    this.setData({
      statusHeight: data,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.run()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    this.calcUserCreatedTime()
    bxPoint("applets_mine", {})
    this.queryContentInfo()
    this.getBanner()
    this.getNumber()
    this.setData({
      showMoneyNotice: false
    })

    if (hasAccountInfo() && hasUserInfo()) {
      // 每次访问个人中心更新最新的账户数据和畅学卡信息
      this.init()
      this.getUserSingerInfo().then(() => {
        this.getFluentInfo()
      })

      // 检查用户合伙人状态
      this.queryUserPartnerInfo()

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.didShowContact) {
      wx.nextTick(() => {
        this.setData({
          didShowContact: false
        })
      })
    }
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
  onShareAppMessage: function (res) {
    return {
      title: '我在花样百姓，和我一起学习、游玩吧，开心每一天！',
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  },
  onPageScroll(res) {
    let userId = !!getLocalStorage(GLOBAL_KEY.userId)
    let distribute_user = this.data.partnerInfo
    if (userId && distribute_user && distribute_user.distribute_user && distribute_user.distribute_user.status === 2 && res.scrollTop > this.data.showMoneyNoticeTop) {
      this.initIndicatePic(1)
    }
  }
})
