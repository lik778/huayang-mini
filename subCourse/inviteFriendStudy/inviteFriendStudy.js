// subCourse/inviteFriendStudy/inviteFriendStudy.js
import { checkReceiveCreate, getInviteFriendInfo, receiveCreate } from "../../api/course/index"
// canvas
import { drawCircleFill, drawCircleHeadIcon, drawFont, drawImage, measureTextWidth } from "../../utils/canvas"
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"
import { getLocalStorage, isIphoneXRSMax } from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import { collectError } from "../../api/auth/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInviter: true,
    inviteInfo: "",
    inviteId: "",
    userId: '',
    didShowAuth: false,
    hasRecieve: false,
    canShow: false,
    nickName: "",
    width: "", //海报宽度
    height: "", //海报高度-邀请人
    height1: "", //海报高度-被邀请人
    height3: "", //设备高
    lineWithdh: "",
    getLock: true,
    isIphoneXRSMax: false
  },

  // 保存到相册
  saveToAblum() {
    wx.showLoading({
      title: '绘制中...',
      mask: true
    })
    // 学课分享海报-保存相册按钮（2020-12-28上线）
    bxPoint("share_save_click", {
      series_id: this.data.inviteInfo.kecheng_series.id,
      kecheng_title: this.data.kechengShareTitle,
      qr_code: this.data.inviteInfo.gift.qrcode,
      limit_num: this.data.inviteInfo.gift.limit_count,
    }, false)
    this.drawPoster()
  },

  // 海报分享打点
  sharePoster() {
    // 请学课分享海报-分享给好友按钮（2020-12-28上线）
    bxPoint("share_click", {
      series_id: this.data.inviteInfo.kecheng_series.id,
      kecheng_title: this.data.kechengShareTitle,
      qr_code: this.data.inviteInfo.gift.qrcode,
      limit_num: this.data.inviteInfo.gift.limit_count,
    }, false)
  },

  // 绘制canvas
  drawPoster() {
    let ctx = wx.createCanvasContext('canvas')
    let posterBg = 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608715550jaBfZC.jpg'
    let bg = 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608629140Qrjdly.jpg'
    let teacherIcon = this.data.inviteInfo.teacher.avatar || 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1608716478HmwDBq.jpg'
    let fontFamily = 'PingFangSC-Regular, PingFang SC;'
    let title = this.data.kechengShareTitle
    let nickName = this.data.inviteInfo.nick_name
    let teacherInfo = `${this.data.inviteInfo.teacher.name||'花样老师'}·${this.data.inviteInfo.kecheng_series.teacher_desc}`
    let studyNum = `${this.data.inviteInfo.kecheng_series.visit_count}人学过`
    ctx.font = 'bold 18px PingFangSC-Medium, PingFang SC'
    let kechengtitleX = parseInt((375 - measureTextWidth(ctx, title)) / 2)
    let limitNum = `${this.data.inviteInfo.gift.limit_count}`
    let qrcode = this.data.inviteInfo.gift.qrcode
    ctx.scale(3, 3)
    drawImage(ctx, bg, 0, 0, 375, 576).then(() => {
      drawImage(ctx, posterBg, 30, 39, 315, 498).then(() => {
        ctx.font = 'bold 18px PingFangSC-Medium, PingFang SC'
        let nickNameX = 302 - measureTextWidth(ctx, nickName)
        drawFont(ctx, nickName, '#8C5419', '400', fontFamily, 14, nickNameX, 168)
        drawFont(ctx, title, '#000000', 'bold', 'PingFangSC-Medium, PingFang SC', 18, kechengtitleX, 225).then(() => {
          drawCircleHeadIcon(ctx, teacherIcon, 98, 280, 20).then(() => {
            drawFont(ctx, teacherInfo, '#000000', '400', fontFamily, 14, 128, 260).then(() => {
              drawFont(ctx, studyNum, 'rgba(0,0,0,0.4)', '400', fontFamily, 14, 128, 286)
              drawCircleFill(ctx, "#fff", 188, 390, 64).then(() => {
                drawCircleHeadIcon(ctx, qrcode, 188, 390, 60).then(() => {
                  ctx.font = 'normal 14px PingFangSC-Regular, PingFang SC'
                  let limitText1 = measureTextWidth(ctx, "限量")
                  ctx.font = 'normal 30px PingFangSC-Regular, PingFang SC'
                  let limitText2 = measureTextWidth(ctx, limitNum)
                  ctx.font = 'normal 14px PingFangSC-Regular, PingFang SC'
                  let limitText3 = measureTextWidth(ctx, '个名额，速速领取')
                  let limitX = (375 - limitText1 - limitText2 - limitText3) / 2
                  drawFont(ctx, '限量', '#fff', '400', fontFamily, 14, limitX, 490).then(() => {
                    drawFont(ctx, limitNum, '#fff', '400', fontFamily, 30, limitX + limitText1, 480).then(() => {
                      drawFont(ctx, '个名额，速速领取', '#fff', '400', fontFamily, 14, limitX + limitText1 + limitText2, 490)
                      ctx.draw(false, () => {
                        wx.canvasToTempFilePath({
                          canvasId: 'canvas',
                          success: (res) => {
                            let tempFilePath = res.tempFilePath;
                            wx.hideLoading()
                            wx.getSetting({
                              success: (res) => {
                                if (res.authSetting['scope.writePhotosAlbum']) {
                                  wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success: () => {
                                      wx.saveImageToPhotosAlbum({
                                        filePath: tempFilePath,
                                        success: (res) => {
                                          if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                                            wx.showToast({
                                              title: '保存成功',
                                              duration: 2000,
                                              mask: true
                                            })
                                          }
                                        },
                                        fail(err) {
                                          collectError({
                                            level: ErrorLevel.p1,
                                            page: "jj.inviteFriendStudy.saveImageToPhotosAlbum",
                                            error_code: 400,
                                            error_message: err
                                          })
                                        }
                                      })
                                    }
                                  })
                                } else {
                                  wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success: () => {
                                      wx.saveImageToPhotosAlbum({
                                        filePath: tempFilePath,
                                        success: (res) => {
                                          if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                                            wx.showToast({
                                              title: '保存成功',
                                              duration: 2000,
                                              mask: true
                                            })
                                          }
                                        },
                                        fail(err) {
                                          collectError({
                                            level: ErrorLevel.p1,
                                            page: "jj.inviteFriendStudy.saveImageToPhotosAlbum",
                                            error_code: 400,
                                            error_message: err
                                          })
                                        }
                                      })
                                    }
                                  })
                                }
                              }
                            })
                          },
                          fail: function (res) {
                            console.log(res);
                          }
                        }, this);
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  },

  // 返回首页
  toIndex() {

    // 领取课程详情页-查看更多课程按钮（2020-12-28上线）
    bxPoint("receive_discovery_more", {
      series_id: this.data.inviteInfo.kecheng_series.id,
      kecheng_title: this.data.kechengShareTitle,
      qr_code: this.data.inviteInfo.gift.qrcode,
      limit_num: this.data.inviteInfo.gift.limit_count,
      share_uid: this.data.inviteInfo.gift.user_id,
      remain_num: this.data.inviteInfo.gift.limit_count - this.data.inviteInfo.user_list.length,
    })

    wx.switchTab({
      url: '/pages/discovery/discovery',
    })
  },

  // 立即领取
  get() {
    if (this.data.userId === '') {
      this.setData({
        didShowAuth: true
      })
      return
    }

    if (!this.data.getLock) return
    this.setData({
      getLock: false
    })
    receiveCreate({
      gift_id: this.data.inviteId,
      user_id: this.data.userId
    }).then(res => {
      if (res.code === 0) {
        // 点击领取课程（2020-12-28上线）
        bxPoint("receive_click", {
          series_id: this.data.inviteInfo.kecheng_series.id,
          kecheng_title: this.data.kechengShareTitle,
          qr_code: this.data.inviteInfo.gift.qrcode,
          limit_num: this.data.inviteInfo.gift.limit_count,
          share_uid: this.data.inviteInfo.gift.user_id,
          receive_num: res.data,
        },false)



        wx.redirectTo({
          url: `/subCourse/videoCourse/videoCourse?videoId=${this.data.inviteInfo.gift.kecheng_series_id}&showSuccess=true&playIndex=${this.data.inviteInfo.gift.kecheng_series_num-1}`,
        })

        this.setData({
          getLock: true
        })
        // this.getInviteData()
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000,
          mask: true
        })
        this.setData({
          getLock: true
        })
        this.getInviteData()
      }
    }).catch(err => {
      this.setData({
        getLock: true
      })
      wx.showToast({
        title: err.message,
        icon: "none",
        duration: 2000,
        mask: true
      })
    })
  },

  // 获取邀请信息
  getInviteData() {
    getInviteFriendInfo({
      gift_id: this.data.inviteId
    }).then(res => {
      if (res.code === 0) {
        let courseData = JSON.parse(res.data.kecheng_series.video_detail)
        let title = courseData[Number(res.data.gift.kecheng_series_num) - 1].title
        this.setData({
          inviteInfo: res.data,
          kechengShareTitle: title
        })
        // 学课分享海报（2020-12-28上线）
        bxPoint("share_detail", {
          series_id: this.data.inviteInfo.kecheng_series.id,
          kecheng_title: this.data.kechengShareTitle,
          qr_code: this.data.inviteInfo.gift.qrcode,
          limit_num: this.data.inviteInfo.gift.limit_count,
          share_uid: this.data.inviteInfo.gift.user_id,
          remain_num: this.data.inviteInfo.gift.limit_count - this.data.inviteInfo.user_list.length,
        })

        if (this.data.userId === '' || this.data.isInviter) {
          this.setData({
            canShow: true
          })
        } else {
          checkReceiveCreate({
            gift_id: this.data.inviteId,
            user_id: this.data.userId
          }).then(res1 => {
            if (res1.code === 0) {
              if (res1.data) {
                wx.redirectTo({
                  url: `/subCourse/videoCourse/videoCourse?videoId=${res.data.gift.kecheng_series_id}&playIndex=${this.data.inviteInfo.gift.kecheng_series_num-1}`,
                })
                // this.setData({
                //   canShow: true
                // })
              } else {
                this.setData({
                  canShow: true
                })
              }
            }
          })
        }

      }
    })
  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 同意授权
  authCompleteEvent() {
    this.setData({
      userId: getLocalStorage(GLOBAL_KEY.userId),
      didShowAuth: false
    })
    this.getInviteData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inviteId = ''
    if (options.scene) {
      let sceneAry = decodeURIComponent(options.scene).split('/');
      let [id = '', isInviter = true] = sceneAry;
      inviteId = Number(id)
      this.setData({
        isInviter: isInviter === 'false' ? false : true
      })
    } else {
      inviteId = Number(options.inviteId)
    }

    if (options.isInviter) {
      this.setData({
        isInviter: false
      })
    }

    let width = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
    let height3 = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight
    let height = ((width - 60) / 7 * 11).toFixed(2)
    let height1 = ((width - 60) / 2 * 3).toFixed(2)
    this.setData({
      inviteId,
      width,
      height,
      height1,
      height3,
      lineWithdh: ((width - 196) / 2).toFixed(2),
      userId: getLocalStorage(GLOBAL_KEY.userId) || ''
    })
    // 兼容x以上机型底部按钮触碰区
    if (isIphoneXRSMax()) {
      this.setData({
        isIphoneXRSMax: true
      })
    }
    this.getInviteData(inviteId)
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
    return {
      title: `我在花样百姓学习了一门好课，邀请你一起来学习，快来吧！`,
      path: `/subCourse/inviteFriendStudy/inviteFriendStudy?inviteId=${this.data.inviteInfo.gift.id}&isInviter=false`
    }
  }
})
