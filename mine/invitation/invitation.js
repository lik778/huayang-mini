import { getLocalStorage, hasAccountInfo,
  hasUserInfo, } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import { getInvationNumber, setInvationNumber, getInvationList, getAlreadyDetail } from "../../api/mine/index"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      current: 0,
      list: ['我的邀请码','好友管理','填写邀请码'],
      invitationNumber: '', // 填写邀请码表单
      invitationList: [], // 已邀请用户列表
      isAlready: false, // 是否已经填写提交
      myInvitation: "", // 我的邀请码
      didShowAuth: false,
      userId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let invitationCode = options.invitationCode || ""
    if (!hasUserInfo() || !hasAccountInfo()) {
      return this.setData({
        didShowAuth: true,
        invitationCode
      })
    } else {
      this.initLoad(invitationCode)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: "花样百姓",
      path: `/mine/invitation/invitation?invitationCode=${this.data.myInvitation}`,
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1670478532TzNDJp.jpg"
    }
  },
  /**
   * 授权失败
   */
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
    // 授权失败跳转到首页
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },
  /**
   * 授权成功
   */
  authCompleteEvent() {
    this.setData({
      didShowAuth: false
    })
    this.initLoad(this.data.invitationCode)
  },
  /**
   * 自定义事件
  */
  apiRequestEvent(func,params,res) {
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    func(params).then((data) => {
      res(data)
      wx.hideLoading()
    }).catch((err) => {
      wx.hideLoading()
    })
  },


  initLoad(invitationCode) {
    let userId = JSON.parse(getLocalStorage(GLOBAL_KEY.userId))
    this.setData({
      userId
    })
    if(invitationCode) {
      let params = { userId }
      getAlreadyDetail(params).then(({ data }) => {
        if(data) {
          this.setData({
            current: 2,
            invitationNumber: data.code,
            isAlready: true
          })
        } else {
          this.setData({
            current: 2,
            invitationNumber: invitationCode
          })
        }
      })
    } else {
        this.init()
    }
  },
 
  init() {
    let params = { userId: this.data.userId }
    const res =  (source) => {
      this.setData({
        myInvitation: source.data
      })
    }
    this.apiRequestEvent(getInvationNumber,params,res)
  },

  getAlreadyInvation() {
    let params = { userId: this.data.userId }
    let flag = false
    const res = (source) => {
      console.log(source)
      if(source.data.nickname) {
        flag = true
        this.setData({
            invitationNumber: source.data.code,
            isAlready: true
          })
      }
    }
    this.apiRequestEvent(getAlreadyDetail,params,res)
    return flag
  },

  setInvation() {
    if(!this.data.invitationNumber.trim()) {
      return wx.showToast({
        title: '请先填写邀请码再提交',
        icon: 'error',
        duration: 1500
      })
    }  else if (this.data.invitationNumber == this.data.myInvitation ) {
      return wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 1500
      })
    } else {
      let params = {userId: this.data.userId, code: this.data.invitationNumber}
      const res = (source) => {
        if(source.message === "success") {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          this.setData({
            isAlready: true
          })
        } else {
          wx.showToast({
            title: source.message,
            icon: 'error'
          })
        }
      }
      this.apiRequestEvent(setInvationNumber,params,res)
    }
  },

  getAllReadyUser() {
    let params = { userId: this.data.userId }
    const res = (source) => {
        console.log(source)
        this.setData({
            invitationList: source.data
        })
    }
    this.apiRequestEvent(getInvationList,params,res)
  },
  
  changeTar(index) {
    if(index === 0 && !this.data.myInvitation) {
      this.init()
    }
    if(index === 1) {
      this.getAllReadyUser()
    }
    if(index === 2 &&  !this.data.isAlready && !this.data.invitationNumber) {
      this.getAlreadyInvation()
    }
  },

  handelTagItem(e) {
    let { index } = e.currentTarget.dataset
    if(index === this.data.current) return
    this.setData({
      current: Number(index)
    })
    this.changeTar(index)
  },

  bindblurInput(e) {
    this.setData({
      invitationNumber: e.detail.value,
    })
  },
  shareToFriend() {
		bxPoint("invitation_post_share", {}, false)
	},
})