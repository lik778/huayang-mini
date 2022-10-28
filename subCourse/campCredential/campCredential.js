// subCourse/campCredential/campCredential.js
import {
  getLocalStorage,
  isIphoneXRSMax,
  hasAccountInfo,
  hasUserInfo
} from "../../utils/util"
import {
  drawFont,
  drawImage,
  drawImageAuto,
  measureTextWidth,
} from "../../utils/canvas"
import {
  ErrorLevel,
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import {
  collectError
} from "../../api/auth/index"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemParams: '',
    statusBarHeight: 20,
    htmlBgHeight: "", //html模块动态高度
    isIphoneXRSMax: false, //是否是x以上系列手机
    canvasHeight: '', //canvas高度
    canvasWidth: "", //canvas宽度
    canvasSrc: '', //生成的canvas地址
    campData: "",
    userName: '',
    Nowdate: '',
    hostBg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1662462912ZgjZHI.jpg",
    LogoList: [],
    isRowStyle: false,
    didShowAuth: false,
    isShare: false,
    ctx:''
  },

  // 返回
  back() {
    if (this.data.isShare) {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    } else {
      wx.redirectTo({
        url: `/subCourse/campDetail/campDetail?id=${this.data.campData.id}&share=true`,
      })
    }
  },

  // 分享朋友
  savePoint() {
    bxPoint("page_camp_credential_share", {
      traincamp_id: this.data.campData.id
    }, false)
  },

  strLen(params){
    let str = params
    let len =0
    let i,c
    for(i=0;i<str.length;i++){
      c = str.charCodeAt(i)
      if((c>=0x0001 && c<= 0x007e) || (0xff60 <= c && c<= 0xff9f)){
        len++
      }else {
        len +=2
      }
    }
    return len
  },

  // 修改名称
  changeShowName(){
    var that= this
    wx.showModal({
      title: '您希望在证书上看到的名称',
      content: that.data.userName,
      editable : true,
      success (res) {
        if (res.confirm) {
          if(that.strLen(res.content)>12){
            wx.showModal({
              title: '温馨提醒',
              content: '名称超出一行啦，请适当缩短再试试吧，谢谢！',
              editable : false
            })
          }
          else{
            let ctx = that.data.ctx
            // 绘制前清空canvas
            ctx.clearRect(0, 0, ctx.width, ctx.height)
            that.setData({
              userName:res.content
            })
            console.log('用户点击确定'+res.content)
            that.drawCredential()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      } 
    })
  },

  // 保存到相册
  saveToAlbum() {
    bxPoint("page_camp_credential_save", {
      traincamp_id: this.data.campData.id
    }, false)
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.canvasSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                  }
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "jj.campCredential.saveImageToPhotosAlbum",
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
                filePath: this.data.canvasSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                  }
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "jj.campCredential.saveImageToPhotosAlbum",
                    error_code: 400,
                    error_message: err
                  })
                }
              })
            },
            fail() {
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
            }
          })
        }
      }
    })
  },

  // 绘制canvas
  drawCredential() {
    wx.showLoading({
      title: '证书绘制中...'
    })
    let ctx = this.data.ctx
    // 绘制前清空canvas
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    let userName = this.data.userName
    let campName = this.data.campData.name
    ctx.font = 'bold 22px SourceHanSerifCN-Bold, SourceHanSerifCN'
    let userNameX = (286 - measureTextWidth(ctx, String(userName))) / 2
    ctx.font = 'normal 12px PingFangSC-Regular, PingFang SC'
    let campNameX = (286 - measureTextWidth(ctx, `《${campName}》`)) / 2
    ctx.scale(3, 3)

    drawImage(ctx, this.data.hostBg, 0, 0, 286, 510).then(async () => {
      // if (this.data.campData.id !== this.data.sevenActivityCampId) {
      //   let res1 = await drawImageAuto(ctx, this.data.LogoList[0], this.data.LogoList[1])
      //   this.setData({
      //     isRowStyle: res1
      //   })
      // }
      drawFont(ctx, String(userName), '#0B0B0B', 'bold', 'SourceHanSerifCN-Bold, SourceHanSerifCN', 22, userNameX, 177)
      //console.log('username='+userName)
      drawFont(ctx, `《${campName}》`, '#730807', 'normal', 'PingFangSC-Regular, PingFang SC', 12, campNameX, 237)
      drawFont(ctx, this.data.Nowdate, '#000000', 'normal', 'PingFangSC-Light, PingFang SC', 10, 117, 342)
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: (res) => {
            let tempFilePath = res.tempFilePath;
            //console.log('canvasSrc'+tempFilePath)
            wx.hideLoading()
            this.setData({
              canvasSrc: tempFilePath
            })
          },
          fail: function (res) {
            wx.hideLoading()
            console.log(res);
          }
        }, this);
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options'+options)
    let logoList = ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606721434GSUkFm.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606721430eIijle.jpg']
    let campData = JSON.parse(decodeURIComponent(options.campData))
    campData.name = campData.name.length > 12 ? campData.name.slice(0, 12) : campData.name
    let logoData = options.logo === '' ? logoList : options.logo.split(",")
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let Nowdate = year + "年" + month + "月"
    let systemParams = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    let hostBg = (campData.type && campData.type === 'mindfulness') ? 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1662462912ZgjZHI.jpg' : 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg '
    //let hostBg = 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg'
    let ctx = wx.createCanvasContext('canvas')
    this.setData({
      statusBarHeight: systemParams.statusBarHeight,
      systemParams: systemParams,
      htmlBgHeight: ((systemParams.screenWidth - 90) * 1.78).toFixed(2),
      isIphoneXRSMax: isIphoneXRSMax(),
      canvasWidth: systemParams.screenWidth - 90,
      canvasHeight: Number(((systemParams.screenWidth - 90) * 1.78).toFixed(2)),
      mainHeight: isIphoneXRSMax() ? systemParams.screenHeight - systemParams.statusBarHeight - 117 : systemParams.screenHeight - systemParams.statusBarHeight - 97,
      radio: ((systemParams.screenWidth - 90) / 286).toFixed(2),
      campData,
      Nowdate,
      LogoList: logoData,
      hostBg: hostBg,
      isShare: options.isShare,
      ctx:ctx
    })
  },

  // 用户授权取消
  authCancelEvent() {
    wx.switchTab({
      url: '/pages/discovery/discovery',
      complete: () => {
        this.setData({
          didShowAuth: false
        })
      }
    })
  },

  // 用户确认授权
  authCompleteEvent() {
    let userName = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).nickname
    this.setData({
      didShowAuth: false,
      userName: userName.length > 15 ? userName.slice(0, 15) : userName
    }, () => {
      this.drawCredential()
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
    // console.log(encodeURIComponent(JSON.stringify({id:19,name:"14天模特走秀训练营"})))
    if (!hasAccountInfo() || !hasUserInfo()) {
      this.setData({
        didShowAuth: true
      })
    } else {
      let userName = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).nickname
      this.setData({
        userName: userName.length > 6 ? userName.slice(0, 6) : userName
      }, () => {
        this.drawCredential()
      })
    }
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
    let link = `subCourse/campCredential/campCredential?campData=${encodeURIComponent(JSON.stringify(this.data.campData))}&isShare=true&logo=`
    return {
      title: `我正在参加${this.data.campData.name}，正念让我遇见更好的生活！`,
      path: link
    }
  }
})