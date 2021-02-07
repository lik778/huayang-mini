// subCourse/videoCourseDetail/videoCourseDetail.js
import { ErrorLevel, FluentLearnUserType, GLOBAL_KEY } from "../../lib/config"
import {
  checkJoinVideoCourse,
  checkNeedSpecialManage,
  createFissionTask,
  getIosCustomerLink,
  getVideoArticleLink,
  getVideoCourseDetail,
  inviteFriend,
  joinVideoCourse,
  recordStudy
} from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"
import {
  $notNull,
  convertToChinaNum,
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  payCourse,
  secondToMinute,
} from "../../utils/util"
import { collectError } from "../../api/auth/index"
import { getFluentCardInfo, getKechengWithFluentCard } from "../../api/mine/index"

const ButtonType = {
  noLogin: 1, //未登录
  ios: 2, //ios平台
  free: 3, //完全免费
  freeAndLevelLimit: 4, //免费但有等级限制
  chargeAndDiscount: 5, //收费但有折扣
  chargeAndNoDiscount: 6, //原价
  fissionAndCountLimitAndFreeDiscount: 7, // 营销活动 & 需要助力 & 0折
  fissionAndCountLimitAndDiscountLimit: 8, // 营销活动 & 需要助力 & N折（N>0）
  joined: 9, //已加入
}

Page({

  /**
   * 页面的初始数据
   */

  data: {
    showStudyToast: true, //学习到x节课提示toast
    videoCourseData: "", //视频课程信息
    videoCourseId: "", //视频课程id
    shareIndex: '', //分享/分销课程下表(0开始)
    showSuccess: "", //是否显示好友分享顶部弹窗
    promoteUid: "", //分销分享人userId
    nowCoursePlayIndex: '', //当前播放视频课程下表（0开始）
    showPromotionButton: false, //分销按钮
    hasLogin: false, //是否登录
    userInfo: "", //用户信息
    studiedIndex: 0, //课程学习记录下标（1开始，0代表未学过）
    videoPlayerSrc: '', //视频播放器视频地址
    videoPlayerLock: true, //视频播放器锁定状态
    isIos: false, //是否是
    playDurationsList: [], //打点数组
    buttonType: '', //按钮类型
    didShowAuth: false, //授权弹窗
    payLock: true, //支付按钮锁
    systemParams: "", //设备信息
    videoPlayStyle: {
      width: '',
      height: ""
    }, //视频播放器信息
    tabIndex: 0, //tab下标
    inPlaying: false, //播放器正在播放
    noPayForCourse: false, //是否购买课程
    showLevelLimit: false, //显示等级限制弹窗
    inviteFriendLock: true, //请好友看按钮lock
    onlySelected: false,
    needRecordPlayTime: false, //是否需要记录播放打点时长
    from_co_channel: false,
    special: false, //该课程是否是安卓特殊处理课程
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      source,
      videoId,
      promote_uid = '',
      showSuccess = false,
      series_invite_id = '',
      playIndex = '',
      from_co_channel = false
    } = options

    // 如果之前播放过或好友分享进入
    if (playIndex) {
      let index = Number(options.playIndex)
      this.setData({
        nowCoursePlayIndex: index,
        shareIndex: index
      })
    }

    // 如果是分销进入
    if (promote_uid !== '') {
      this.setData({
        promoteUid: promote_uid
      })
    }

    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/');
      let [sceneSource = '', sceneId = 0] = sceneAry;
      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
      this.setData({
        videoCourseId: sceneId
      })
    } else {
      // 通过卡片进入
      if (source) {
        getApp().globalData.source = source
      }
      this.setData({
        videoCourseId: videoId
      })
    }
    let systemParams = getLocalStorage(GLOBAL_KEY.systemParams) ? JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)) : ''

    // 是否显示好友分享顶部弹窗
    this.setData({
      showSuccess,
      systemParams,
      from_co_channel
    })

    // 5s后自动关闭好友分享顶部弹窗
    if (this.data.showSuccess) {
      setTimeout(() => {
        this.setData({
          showSuccess: false
        })
      }, 5000)
    }

    // 检查是否加入过该课程
    this.checkHasJoined()
  },
  /**
   * 跳转到加入畅学卡页面
   */
  goToJoinFluentLearn() {
    bxPoint("series_changxue", {series_id: this.data.videoCourseId}, false)
    wx.navigateTo({url: "/mine/joinFluentLearn/joinFluentLearn"})
  },
  /**
   * 畅学卡会员，兑换课程
   * @param
   */
  exchangeKechengWithFluentCard(kechengId) {
    return new Promise((resolve) => {
      let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data}) => {
        if ($notNull(data) && data.status === FluentLearnUserType.active) {
          getKechengWithFluentCard({
            user_snow_id: accountInfo.snow_id,
            kecheng_series_id: kechengId
          }).then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  },

  // 播放视频
  playVideo(e) {
    let index = Number(e.currentTarget.dataset.index)
    if (index >= 0) {
      let series_detail = this.data.videoCourseData.series_detail.video_detail
      // 2021-01-14上线
      let paramsData = {
        series_id: this.data.videoCourseId,
        kecheng_title: series_detail[index].title
      }
      if (this.data.from_co_channel) {
        paramsData.co_channel_tag = 'co_lndx'
      }
      bxPoint("series_content_click", paramsData, false)

      this.setData({
        ['videoCourseData.series_detail.video_detail']: series_detail,
        inPlaying: true,
        videoPlayerSrc: series_detail[index].url,
        nowCoursePlayIndex: index
      })
      setTimeout(() => {
        this.videoContext.play()
      }, 200)
    } else {
      this.setData({
        nowCoursePlayIndex: this.data.nowCoursePlayIndex === '' ? '' : this.data.nowCoursePlayIndex
      })
      this.videoContext.play()
    }

    this.setData({
      // studiedIndex: '',
      needRecordPlayTime: true
    })

    // 记录学习到第几课
    if (this.data.nowCoursePlayIndex !== '' & this.data.hasLogin) {
      recordStudy({
        kecheng_series_id: this.data.videoCourseId,
        kecheng_num: this.data.nowCoursePlayIndex + 1
      })
    }

  },

  // 播放视频中
  videoPlaying() {
    this.setData({
      inPlaying: true,
      onlySelected: false
    })
  },

  // 视频播放结束
  endVideo(e) {
    let videoData = this.data.videoCourseData.series_detail.video_detail
    this.setData({
      inPlaying: false,
      ['videoCourseData.series_detail.video_detail']: videoData,
    })
  },

  // 未授权，点击授权
  login() {
    this.setData({
      didShowAuth: true
    })
  },

  // 检查是否加入过该课程
  checkHasJoined() {
    if (hasAccountInfo() && hasUserInfo()) {
      // 已经登录
      this.setData({
        hasLogin: true,
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      })
      checkJoinVideoCourse({
        kecheng_series_id: this.data.videoCourseId
      }).then(res => {
        // 登录校验失败
        if (res.code === 0) {
          let buttonType = ""
          if (res.data === null) {
            // 未加入过
            this.setData({
              nowCoursePlayIndex: this.data.nowCoursePlayIndex ? this.data.nowCoursePlayIndex : '',
              noPayForCourse: false,
              showStudyToast: false,
              studiedIndex: ''
            })

            // 畅学卡用户未领取过当前课程，自动领取
            this.exchangeKechengWithFluentCard(this.data.videoCourseId).then(() => {
              checkJoinVideoCourse({
                kecheng_series_id: this.data.videoCourseId
              }).then((res) => {
                buttonType = ButtonType.joined
                this.setData({
                  showStudyToast: this.data.shareIndex ? false : this.data.nowCoursePlayIndex ? true : res.data.last_visit_num === 0 ? false : true,
                  nowCoursePlayIndex: this.data.shareIndex ? this.data.shareIndex : this.data.nowCoursePlayIndex ? this.data.nowCoursePlayIndex : res.data.last_visit_num - 1 >= 0 ? res.data.last_visit_num - 1 : '',
                  studiedIndex: res.data.last_visit_num === 0 ? '' : res.data.last_visit_num,
                  noPayForCourse: true,
                  videoPlayerLock: false
                })
                if (this.data.showStudyToast) {
                  setTimeout(() => {
                    this.setData({
                      showStudyToast: false
                    })
                  }, 5000)
                }
                // 获取训练营详情
                this.getVideoCourseData(buttonType)
              }).catch(() => {
                this.getVideoCourseData(-1)
              })
            })
          } else {
            // 加入过
            buttonType = ButtonType.joined
            this.setData({
              showStudyToast: this.data.shareIndex ? false : this.data.nowCoursePlayIndex ? true : res.data.last_visit_num === 0 ? false : true,
              nowCoursePlayIndex: this.data.shareIndex ? this.data.shareIndex : this.data.nowCoursePlayIndex ? this.data.nowCoursePlayIndex : res.data.last_visit_num - 1 >= 0 ? res.data.last_visit_num - 1 : '',
              studiedIndex: res.data.last_visit_num === 0 ? '' : res.data.last_visit_num,
              noPayForCourse: true,
              videoPlayerLock: false
            })
            if (this.data.showStudyToast) {
              setTimeout(() => {
                this.setData({
                  showStudyToast: false
                })
              }, 5000)
            }
            // 获取训练营详情
            this.getVideoCourseData(buttonType)
          }
        } else {
          this.setData({
            showStudyToast: false,
            studiedIndex: '',
            noPayForCourse: false,
            nowCoursePlayIndex: this.data.nowCoursePlayIndex ? this.data.nowCoursePlayIndex : '',
            userInfo: ""
          })
          this.getVideoCourseData(ButtonType.noLogin)
        }
      })
    } else {
      // 未登陆
      this.getVideoCourseData(ButtonType.noLogin)
    }
  },

  // 获取视频课程详情信息
  getVideoCourseData(buttonType = '') {
    // 请求详情接口
    getVideoCourseDetail({
      series_id: this.data.videoCourseId,
      user_id: this.data.userInfo.id
    }).then(res => {
      buttonType = buttonType === '' ? ButtonType.noLogin : buttonType === -1 ? -1 : buttonType
      let videoCourseList = []
      let userGrade = this.data.userInfo === '' ? this.data.userInfo.user_grade : 0
      let videoPlayerLock = true
      let videoPlayerSrc = ''
      let isIos = false
      let nowCoursePlayIndex = this.data.nowCoursePlayIndex
      res.series_detail.detail_pics = res.series_detail.detail_pics.split(",")
      checkNeedSpecialManage({
        kecheng_series_id: this.data.videoCourseId
      }).then((result) => {
        if (result.data === 'link') {
          this.setData({
            special: true
          })
        } else {
          this.setData({
            special: false
          })
        }
        wx.getSystemInfo({
          success: (res1) => {
            // 设置加入按钮状态
            if (buttonType === ButtonType.joined) {
              // 已购买
              buttonType = ButtonType.joined
            } else {
              // 未购买||未登录
              if (res1.platform === 'ios') {
                // ios平台
                isIos = true
                if ((res.series_detail.price === 0 || res.series_detail.discount_price === '') && userGrade >= res.series_detail.user_grade) {
                  // 如果是免费课程则直接显示加入按钮
                  buttonType = ButtonType.free
                } else {
                  buttonType = ButtonType.ios
                }
              } else {
                // 安卓平台
                isIos = false
                if (this.data.special) {
                  isIos = true
                  buttonType = ButtonType.ios
                } else {
                  if (res.series_detail.discount_price === 0 || res.series_detail.price === 0) {
                    // 完全免费
                    buttonType = ButtonType.free
                  } else {
                    // 收费
                    if (res.series_detail.discount_price > 0) {
                      // 有折扣
                      buttonType = ButtonType.chargeAndDiscount
                    } else {
                      // 无折扣=>原价
                      buttonType = ButtonType.chargeAndNoDiscount
                    }
                  }
                }

              }
            }
            // 价格处理
            res.series_detail.price = Number((res.series_detail.price / 100).toFixed(2))
            res.series_detail.discount_price = res.series_detail.discount_price === -1 ? '' : Number((res.series_detail.discount_price / 100).toFixed(2))
            res.series_detail.sharePrice = res.series_detail.distribution_ratio > 0 ? res.series_detail.discount_price === '' ? res.series_detail.price * res.series_detail.distribution_ratio / 100 : res.series_detail.discount_price * res.series_detail.distribution_ratio / 100 : ''
            // 处理视频课程列表
            videoCourseList = JSON.parse(res.series_detail.video_detail) || []
            let recordList = new Array(videoCourseList.length).fill('lock')
            // 处理课程列表不同状态
            videoCourseList.map((item, index) => {
              item.timeSecond = item.time
              item.time = secondToMinute(item.time)
              item.type = 'lock'
              item.Index = convertToChinaNum(index + 1)
              if (buttonType === ButtonType.joined) {
                // 已购买
                item.type = 'play'
                recordList[index] = 'play'
              } else {
                // 未购买||未授权
                if (item.canReplay) {
                  // 试看课
                  item.type = '试看'
                  recordList[index] = '试看'
                } else if (item.status === 'unlock') {
                  item.type = '好友相送'
                  recordList[index] = '好友相送'
                }
              }
            })
            // 判断&设置播放器地址
            if (this.data.noPayForCourse) {
              let onlySelected = false
              // 已购买该课程
              if (this.data.shareIndex) {
                // 分享进来
                onlySelected = true
                nowCoursePlayIndex = this.data.shareIndex
                videoPlayerSrc = videoCourseList[this.data.shareIndex].url
              } else if (this.data.studiedIndex) {
                // 学习过
                onlySelected = true
                nowCoursePlayIndex = this.data.studiedIndex - 1
                videoPlayerSrc = videoCourseList[this.data.studiedIndex - 1].url
              } else {
                videoPlayerSrc = videoCourseList[0].url
                nowCoursePlayIndex = 0
              }
              videoCourseList.map(item => {
                item.type = 'play'
              })
              this.setData({
                onlySelected
              })
            } else {
              let has_free_visit = recordList.indexOf('试看')
              let has_friend_visit = recordList.indexOf('好友相送')
              if (this.data.showSuccess) {
                // 请好友看课进入
                videoPlayerSrc = videoCourseList[nowCoursePlayIndex].url
                nowCoursePlayIndex = nowCoursePlayIndex
              } else if (this.data.shareIndex) {
                // 分享进入
                if (recordList[this.data.shareIndex] !== 'lock') {
                  videoPlayerSrc = videoCourseList[this.data.shareIndex].url
                  nowCoursePlayIndex = this.data.shareIndex
                } else {
                  if (res.series_detail.promotion_video) {
                    // 存在宣传视频
                    videoPlayerSrc = res.series_detail.promotion_video
                    nowCoursePlayIndex = ''
                  } else if (has_free_visit !== -1) {
                    // 有试看课
                    videoPlayerSrc = videoCourseList[has_free_visit].url
                    nowCoursePlayIndex = has_free_visit
                  } else if (has_friend_visit !== -1) {
                    // 有好友相送课
                    videoPlayerSrc = videoCourseList[has_friend_visit + 1].url
                    nowCoursePlayIndex = has_friend_visit
                  } else {
                    videoPlayerSrc = ''
                    nowCoursePlayIndex = ''
                  }
                }
              } else if (!this.data.shareIndex) {
                if (res.series_detail.promotion_video) {
                  // 存在宣传视频
                  videoPlayerSrc = res.series_detail.promotion_video
                  nowCoursePlayIndex = ''
                } else if (has_free_visit !== -1) {
                  // 有试看课
                  videoPlayerSrc = videoCourseList[has_friend_visit + 1].url
                  nowCoursePlayIndex = has_free_visit
                } else if (has_friend_visit !== -1) {
                  // 有好友相送课
                  videoPlayerSrc = videoCourseList[has_friend_visit + 1].url
                  nowCoursePlayIndex = has_friend_visit
                } else {
                  videoPlayerSrc = ''
                  nowCoursePlayIndex = ''
                }
              }
            }
            // 邀请助力
            if (this.data.hasLogin) {
              // 已登录
              if (res.series_detail.invite_open === 1 && (res.series_detail.price > 0 || res.series_detail.discount_price > 0)) {
                if (res.series_detail.invite_count > 0 && +res.series_detail.invite_discount === 0) {
                  // 邀请人数不为0 & 优惠价格为0
                  buttonType = ButtonType.fissionAndCountLimitAndFreeDiscount
                } else if (res.series_detail.invite_count > 0 && res.series_detail.invite_discount > 0) {
                  // 邀请人数不为0 & 优惠折扣不为0
                  res.series_detail.fission_price = Number((+res.series_detail.discount_price * res.series_detail.invite_discount / 100).toFixed(2))
                  buttonType = ButtonType.fissionAndCountLimitAndDiscountLimit
                }
              }
            } else {
              // 未登录
              buttonType = ButtonType.noLogin
            }
            res.series_detail.video_detail = videoCourseList
            this.setData({
              videoCourseData: res,
              videoPlayerSrc,
              nowCoursePlayIndex,
              videoPlayerLock,
              isIos,
              buttonType
            })
            // 未购买直接播放
            if (!this.data.noPayForCourse && videoPlayerSrc !== '') {
              setTimeout(() => {
                this.videoContext.play()
              }, 1000)
            }
            // 页面pv打点
            this.pageViewPoint()
          }
        })
      })
    })
  },

  //猜你喜欢=>查看更多
  toVisitMore() {
    // 20210114上线
    let paramsData = {
      series_id: this.data.videoCourseId,
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_detail_find_more", paramsData, false)
    let type = this.data.videoCourseData.series_detail.category
    let index = type === 'quality_life' ? 3 : type === 'fitness' ? 1 : type === 'fashion' ? 2 : 0
    if (getCurrentPages().length > 6) {
      wx.reLaunch({
        url: `/subCourse/videoCourseList/videoCourseList?index=${index}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/videoCourseList/videoCourseList?index=${index}`,
      })
    }
  },

  // 猜你喜欢=>训练营点击
  toCampPage() {
    // 20210114上线
    let paramsData = {
      series_id: this.data.videoCourseId,
      traincamp_is_recom_id: this.data.videoCourseData.recommend_traincamp.id,
      traincamp_is_recom_title: this.data.videoCourseData.recommend_traincamp.name
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_recommend_traincamp_click", paramsData, false)
    if (getCurrentPages().length > 8) {
      wx.reLaunch({
        url: `/subCourse/joinCamp/joinCamp?id=${this.data.videoCourseData.recommend_traincamp.id}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/joinCamp/joinCamp?id=${this.data.videoCourseData.recommend_traincamp.id}`,
      })
    }
  },

  // 猜你喜欢=>视频课程点击
  toCoursePage(e) {
    // 20210114上线
    let item = e.currentTarget.dataset.item
    let paramsData = {
      series_id: this.data.videoCourseId,
      kecheng_is_recom_id: item.kecheng_series.id,
      kecheng_is_recom_name: item.kecheng_series.teacher_desc,
      kecheng_is_recom_subname: item.kecheng_series.name,
      kecheng_is_recom_label: item.kecheng_series.series_tag === 0 ? "无" : item.kecheng_series.series_tag === 1 ? "口碑课程" : '新课',
      kecheng_is_recom_teacher: item.kecheng_series.teacher_id
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_recommend_lesson_click", paramsData, false)
    if (getCurrentPages().length > 8) {
      wx.reLaunch({
        url: `/subCourse/videoCourse/videoCourse?videoId=${item.kecheng_series.id}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/videoCourse/videoCourse?videoId=${item.kecheng_series.id}`,
      })
    }
  },

  // 请好友看课点击
  inviteFriend(e) {
    if (this.data.inviteFriendLock) {
      this.setData({
        inviteFriendLock: false
      })
      let index = e.currentTarget.dataset.index + 1
      let videoId = Number(this.data.videoCourseId)
      let userId = this.data.userInfo.id
      let params = {
        user_id: userId,
        kecheng_series_id: videoId,
        kecheng_series_num: index
      }
      // 请好友看-按钮打点（2020-12-28上线）
      let paramsData = {
        series_id: videoId,
        kecheng_title: this.data.videoCourseData.series_detail.video_detail[index - 1].title
      }
      if (this.data.from_co_channel) {
        paramsData.co_channel_tag = 'co_lndx'
      }
      bxPoint("share_friend_learn", paramsData, false)

      inviteFriend(params).then(res => {
        this.setData({
          inviteFriendLock: true
        })
        if (res.code === 0) {
          wx.navigateTo({
            url: `/subCourse/inviteFriendStudy/inviteFriendStudy?inviteId=${res.data.gift.id}`,
          })
        }
      }).catch(() => {
        this.setData({
          inviteFriendLock: true
        })
      })
    }
  },

  // 获取视频课程引流文章地址
  getArticleLink() {
    getVideoArticleLink({
      series_id: this.data.videoCourseId
    }).then(res => {
      this.setData({
        articleLink: res
      })
    })
  },

  // 加班主任按钮
  toAddteacher() {
    let link = this.data.articleLink
    // 2021-01-14上线
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_consult_chat_click", paramsData, false)
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${link}`,
    })
  },

  // 分享好友拼团
  initFissionTask() {
    createFissionTask({
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      kecheng_series_id: this.data.videoCourseId,
    }).then((fissionData) => {
      wx.navigateTo({
        url: `/subCourse/invitePage/invitePage?series_invite_id=${fissionData.id}&videoId=${this.data.videoCourseId}&fissionPrice=${this.data.videoCourseData.series_detail.fission_price}`
      })
    })
  },

  // 切换tab
  changeTab(e) {
    let index = Number(e.currentTarget.dataset.index)
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    if (index === 0) {
      // 2021-01-14上线
      bxPoint("series_cont_click", paramsData, false)
    } else {
      // 2021-01-14上线
      bxPoint("series_desc_click", paramsData, false)
    }

    this.setData({
      tabIndex: index
    })
  },

  // 安卓调起微信支付
  pay() {
    // 2021-01-14上线
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_join", paramsData, false)
    if (this.data.userInfo !== '' && this.data.payLock) {
      this.setData({
        payLock: false
      })
      let openid = getLocalStorage(GLOBAL_KEY.openId)
      joinVideoCourse({
        open_id: openid,
        series_id: this.data.videoCourseData.series_detail.id,
        promote_uid: this.data.promoteUid
      }).then(res => {
        if (res === 'success') {
          // 免费直接加入成功
          wx.showToast({
            title: '加入成功',
            icon: "success",
            duration: 2000
          })
          this.checkHasJoined()
        } else if (res.num) {
          payCourse({
            id: res.id,
            name: '加入视频课程'
          }).then(res => {
            // 设置顶部标题
            if (res.errMsg === "requestPayment:ok") {
              // 免费直接加入成功
              wx.showToast({
                title: '加入成功',
                icon: "success",
                duration: 2000
              })
              this.checkHasJoined()
            } else {
              this.setData({
                payLock: true
              })
              wx.showToast({
                title: '支付失败',
                icon: "none",
                duration: 2000
              })
            }
          }).catch(err => {
            if (err.errMsg !== "requestPayment:fail cancel") {
              collectError({
                level: ErrorLevel.p0,
                page: "jj.videoCourse.requestPayment",
                error_code: 500,
                error_message: err
              })
            }
            this.setData({
              payLock: true
            })
            wx.showToast({
              title: '支付失败',
              icon: "none",
              duration: 2000
            })
          })
        }
      })
    }
  },

  // 授权弹窗取消回调
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 授权弹窗确认回调
  authCompleteEvent() {
    this.checkHasJoined()
    setTimeout(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      this.setData({
        didShowAuth: false,
        userInfo
      })
    }, 200)
  },

  // 分享好友按钮打点
  share() {
    // 2021-01-14上线
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_share", paramsData, false)
  },

  // 分销按钮打点
  shareCourse() {
    let paramsData = {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      isPromoter: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).kecheng_user.is_promoter === 1 ? true : false
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint('promotion_videoCourse_page', paramsData, false)
  },

  // 播放进度变化
  processChange(e) {
    let arr = this.data.playDurationsList
    let time = Math.floor(e.detail.currentTime)
    if (this.data.playDurationsList.indexOf(time) === -1) {
      arr.push(time)
    }
    this.setData({
      playDurationsList: arr,
    })
  },

  // 记录播放时长打点
  recordPlayDuration() {
    let VideoSrcHost = 'http://video.huayangbaixing.com/sv' //视频地址前缀
    let arr = this.data.playDurationsList.sort((a, b) => {
      return a - b
    })
    let time = this.data.videoCourseData.series_detail.video_detail[this.data.nowCoursePlayIndex].timeSecond //视频总时长
    let splitIndexArr = []
    let index = 0
    let timeSnippetArr = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1] - arr[i] > 1) {
        splitIndexArr.push(i + 1)
      }
    }
    while (splitIndexArr.length > 0) {
      let data = arr.slice(index, splitIndexArr[0])
      timeSnippetArr.push(data)
      index = splitIndexArr[0]
      splitIndexArr.splice(0, 1)
      if (splitIndexArr.length === 0) {
        timeSnippetArr.push(arr.slice(index, arr.length))
      }
    }
    let timeList = []
    for (let i in timeSnippetArr) {
      let str1 = timeSnippetArr[i][0]
      let str2 = timeSnippetArr[i][timeSnippetArr[i].length - 1]
      timeList.push(`${str1}-${str2}`)
    }
    let listData = []
    if (arr.length <= 1) {
      listData = arr[0]
    } else {
      listData = [`${arr[0]}-${arr[arr.length-1]}`]
    }
    let paramsData = {
      scene: 'page_series',
      series_id: this.data.videoCourseId,
      video_src: this.data.videoPlayerSrc.split(VideoSrcHost)[1],
      lesson_num: `第${this.data.nowCoursePlayIndex + 1}节课`,
      kecheng_title: this.data.videoCourseData.series_detail.video_detail[this.data.nowCoursePlayIndex].title,
      time_snippet: timeList.length === 0 ? listData : timeList, //事件片段
      total_duration: time, //视频总时间
      total_visit_duration: arr.length, // 总观看时间
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("page_series", paramsData, false)
  },

  // 跳往ios购买私域文章
  toPayArticle() {
    // 2021-01-14上线
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_join", paramsData, false)
    getIosCustomerLink({
      kecheng_series_id: this.data.videoCourseId
    }).then(res => {
      let link = encodeURIComponent(res.data)
      wx.navigateTo({
        url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
        fail(err) {
          collectError({
            level: ErrorLevel.p0,
            page: "dd.videoCourse.navigateToH5ForPay",
            error_code: 500,
            error_message: err
          })
        }
      })
    })
  },

  // 打开等级限制弹窗
  openLevelLimitBox() {
    // 2021-01-14上线
    let paramsData = {
      series_id: this.data.videoCourseId
    }
    if (this.data.from_co_channel) {
      paramsData.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_join", paramsData, false)
    this.setData({
      showLevelLimit: true
    })
  },

  //等级弹窗跳转
  toUserCenter() {
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },

  // 关闭等级弹窗
  closeLevelLimit() {
    this.setData({
      showLevelLimit: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //页面pv打点
  pageViewPoint() {
    // 2021-01-14上线
    let data = this.data.videoCourseData.series_detail
    let params = {
      series_id: data.id,
      kecheng_name: data.teacher_desc,
      kecheng_subname: data.name,
      kecheng_label: data.series_tag === 0 ? "无" : data.series_tag === 1 ? '口碑好课' : "新课",
      kecheng_total_amount: data.visit_count,
      kecheng_ori_price: data.price,
      kecheng_dis_price: data.discount_price,
      kecheng_teacher: data.teacher_id, //待改善
    }
    if (this.data.from_co_channel) {
      params.co_channel_tag = 'co_lndx'
    }
    bxPoint("series_detail", params)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      videoPlayStyle: {
        width: parseInt(this.data.systemParams.screenWidth),
        height: parseInt((this.data.systemParams.screenWidth) / 1.78),
        campHeight: parseInt((this.data.systemParams.screenWidth) / 2.15)
      }
    })
    // 注册视频播放器
    this.videoContext = wx.createVideoContext('videoPlayer')
    // 获取视频课程引流文章地址
    this.getArticleLink()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 记录播放时长打点
    if (this.data.needRecordPlayTime) {
      this.recordPlayDuration()
      this.setData({
        needRecordPlayTime: false
      })
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 记录播放时长打点
    if (this.data.needRecordPlayTime) {
      this.recordPlayDuration()
    }
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
    let shareLink = `/subCourse/videoCourse/videoCourse?videoId=${this.data.videoCourseId}&playIndex=${this.data.nowCoursePlayIndex}`
    if (this.data.promoteUid !== '') {
      shareLink += `&promote_uid=${this.data.promoteUid}`
    } else {
      if (this.data.userInfo !== '' && this.data.userInfo.kecheng_user.is_promoter && this.data.userInfo.kecheng_user.is_promoter === 1) {
        shareLink += `&promote_uid=${this.data.userInfo.id}`
      }
    }
    let title = this.data.nowCoursePlayIndex === '' ? this.data.videoCourseData.series_detail.video_detail[0].title : this.data.videoCourseData.series_detail.video_detail[this.data.nowCoursePlayIndex].title
    return {
      title: title,
      path: shareLink
    }
  }
})
