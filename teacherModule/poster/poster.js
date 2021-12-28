import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
import {

  drawImage,
  drawFont,
  drawManyText,
  drawCircleHeadIcon,
  drawCircleFill,
  drawRact
} from "../../utils/canvas"
import {
  getTeacherNewInfo,
  createQrcode
} from "../../api/teacherModule/index"
import bxPoint from "../../utils/bxPoint"
// teacherModule/poster/poster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo1: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639720620rzUaXZ.jpg",
    systemInfo: '',
    longScreen: true,
    teacherId: '',
    detailInfo: '',
    qrcode: "",
    elementWidth: '',
    elementHeight: ''
  },

  /* 分享好友 */
  shareTap() {
    bxPoint('teacher_poster_share_click', {
      teacher_id: this.data.teacherId
    }, false)
  },

  /* 保存海报 */
  async savePoster() {
    bxPoint('teacher_poster_save_click', {
      teacher_id: this.data.teacherId
    }, false)
    await this.drawPoster()
  },

  /* 绘制海报 */
  drawPoster() {
    return new Promise(async resolve => {
      wx.showLoading({
        title: '绘制中',
        mask: true
      })

      let elementWidth = this.data.elementWidth
      let elementHeight = this.data.elementHeight

      let ctx = wx.createCanvasContext('canvas')
      ctx.scale(3, 3)

      await drawRact(ctx, 0, 0, elementWidth, elementHeight, '#fff')

      await drawImage(ctx, this.data.detailInfo.headIcon, 0, 0, elementWidth / 3, elementWidth / 3)

      await drawFont(ctx, `花样百姓 - ${this.data.detailInfo.nickname}`, '#000', 'bold', 'PingFangSC-Medium, PingFang SC', 18, 20, elementWidth / 3 + 30)

      await drawManyText(ctx, this.data.detailInfo.introduce, '#000', 'normal', 'PingFangSC-Regular, PingFang SC', 13, 20, elementWidth / 3 + 64, 286, 18)

      await drawImage(ctx, this.data.logo1 + `?${new Date().getTime()}`, 20, (elementHeight / 3) - 75, 120, 40)

      await drawImage(ctx, this.data.qrcode + `?${new Date().getTime()}`, (elementWidth / 3) - 83, (elementHeight / 3) - 94, 60, 60)

      await drawFont(ctx, '长按识别查看', '#000', 'normal', 'PingFangSC-Regular, PingFang SC', 11, (elementWidth / 3) - 86, elementHeight / 3 - 32)

      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success(res) {
            wx.hideLoading()
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '保存成功',
                  duration: 1500,
                })
              },
              fail(res2) {
                wx.showModal({
                  title: '相册授权',
                  content: '保存失败，未获得您的授权，请前往设置授权',
                  confirmText: '去设置',
                  confirmColor: '#33c71b',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              },
            })
          },
        })
      })

    })

  },

  /* 获取老师详情 */
  async getTeacherDetail() {
    let detailInfo = await getTeacherNewInfo({
      tutor_id: this.data.teacherId
    })
    let qrcode = await createQrcode({
      tutor_id: this.data.teacherId,
      filename: "师资名片_qrcode" + new Date().getTime() + '.png',
      path: "teacherModule/index/index",
      // path: "pages/discovery/discovery",
      scene: `${this.data.teacherId}`
    })
    let info = detailInfo.data.tutor_info
    info.headIcon = info.photo_wall.split(',')[0]
    this.setData({
      detailInfo: detailInfo.data.tutor_info,
      qrcode: qrcode.data
    }, () => {
      let query = wx.createSelectorQuery();
      query.select('.poster-main').boundingClientRect(async rect => {
        let elementWidth = rect.width * 3
        let elementHeight = rect.height * 3;
        this.setData({
          elementWidth,
          elementHeight
        })
      }).exec();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          systemInfo: result,
          longScreen: result.screenHeight > 736 ? true : false
        })
      },
    })

    if (options.teacherId) {
      this.setData({
        teacherId: options.teacherId
      }, () => {
        bxPoint('teacher_poster_page', {
          teacher_id: this.data.teacherId
        })
        this.getTeacherDetail()
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "你点赞的老师动态更新了，一起来看看吧！",
      path: `/teacherModule/index/index?id=${this.data.teacherId}`
    }
  }
})