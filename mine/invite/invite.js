// mine/invite/invite.js
import {
  createCanvas
} from "./canvas"
import {
  getInviteCode,
  getVipNum
} from "../../api/mine/index"
import {
  subscription
} from "../../api/live/course"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY,
  SubscriptType
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcCode: "",
    canvasUrl: "",
    posturl: "",
    userInfo: {},
    statusHeight: 0,
    num: 0, //会员编号
    posterWidth: 0, //海报宽度
    posterHeigt: 0, //海报高度
    radio: 0, //海报缩放比
    showDialog: false
  },
  // 订阅
  show() {
    this.order()
  },
  show1() {
    this.setData({
      showDialog: true
    })
  },
  // 订阅封装
  order() {
    wx.requestSubscribeMessage({
      tmplIds: [SubscriptType.inivteMessage],
      success(res) {
        if (res[SubscriptType.inivteMessage] === 'accept') {
          subscription({
            open_id: getLocalStorage(GLOBAL_KEY.openId),
            user_id: getLocalStorage(GLOBAL_KEY.userId),
            sub_key: "invite"
          }).then(() => {
            wx.showToast({
              title: '订阅成功',
            })
          })
        }
      },
      fail(err) {
        console.log(err, 'requestSubscribeMessage error callback')
      }
    })
  },
  // 计算宽高,自适应海报
  calculate() {
    wx.getSystemInfo({
      complete: (res) => {
        let info = {
          width: res.screenWidth,
          height: res.screenHeight
        }
        if ((info.height - 311) / 1.33 < info.width - 32) {
          this.setData({
            posterWidth: (info.height - 311) / 1.33,
            posterHeigt: info.height - 311,
            radio: (info.height - 311) / 356
          })
        } else {
          this.setData({
            posterWidth: info.width - 32,
            posterHeigt: info.width * 1.33,
            radio: (info.width - 32) / 267
          })
        }
        console.log(this.data.radio)
      },
    })
  },
  // getImgUrl
  getImgUrl() {
    let arr = ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586746698uNTYez.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586746556RRsZWh.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586747541IzaDvb.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586747562GBKDfI.jpg"
    ];
    let index = Math.floor((Math.random() * arr.length))
    this.setData({
      posturl: arr[index]
    })
  },
  // 获取用户信息
  getUserInfo() {
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
    })
  },
  // 获取小程序邀请码
  inviteCode() {
    getInviteCode(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(res => {
      this.setData({
        qcCode: res
      })
    })
  },
  // 保存到相册
  saveAlbum() {
    let _this = this
    wx.downloadFile({
      url: this.data.canvasUrl,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
              _this.setData({
                showDialog: true
              })
            } else {
              wx.showToast({
                title: '保存失败',
                icon: "none",
                duration: 3000
              })
            }
          },
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    this.getUserInfo()
    // 获取设备宽高
    this.calculate()
    // 随机生成背景图
    this.getImgUrl()
    // 获取小程序二维码
    this.inviteCode()
    // 获取会员编号
    getVipNum(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(({
      data
    }) => {
      this.setData({
        num: data
      })
      // 绘制canvas
      createCanvas({
        bgUrl: this.data.posturl,
        nickname: this.data.userInfo.nickname,
        num: data,
        headicon: this.data.userInfo.avatar_url
      }).then(res => {
        console.log(res, 11111)
        this.setData({
          canvasUrl: res
        })
      })
    })

    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
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
  onShareAppMessage: function (res) {
    // console.log(res)
    return {
      success: (data) => {
        console.log(data)
      }
    }
  }
})