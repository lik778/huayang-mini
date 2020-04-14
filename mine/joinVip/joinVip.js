// mine/joinVip/joinVip.js

import { GLOBAL_KEY } from "../../lib/config"
import { getLocalStorage, payVip, setLocalStorage } from "../../utils/util"
import { bindWxPhoneNumber } from "../../api/auth/index"
import { getUserInfo } from "../../api/mine/index"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: "",
        statusHeight:0,
        showBindPhoneButton:true
    },
    // 购买会员
    buyVip() {
        payVip(this.data.userId).then(res => {
            console.log(res)
        })
    },
    // 获取用户信息
    getUserInfoData() {
        // 判断是否手机号登录，控制显示授权手机号按钮
        let showBindPhoneButton = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? true : false
        if (!showBindPhoneButton) {
            getUserInfo("scene=zhide").then(res => {
                if (res.code === -2) {
                    this.setData({
                        showBindPhoneButton: true
                    })
                } else {
                    this.setData({
                        userInfo: res || {}
                    })
                }
                console.log(res)
            })
        } else {
            setTimeout(() => {
                // 未手机号授权时取微信授权信息
                let userInfo = wx.getStorageSync(GLOBAL_KEY.userInfo) ? JSON.parse(wx.getStorageSync(GLOBAL_KEY.userInfo)) : {}
                JSON.stringify(userInfo) !== "{}" ? userInfo.nick_name = userInfo.nickname : ""
                this.setData({
                    userInfo: userInfo
                })
            }, 500)
        }
        this.setData({
            showBindPhoneButton: showBindPhoneButton
        })
    },
     // 一键获取手机号
     async getPhoneNumber(e) {
        if (!e) return
        let {
            errMsg = '', encryptedData: encrypted_data = '', iv = ''
        } = e.detail
        if (errMsg.includes('ok')) {
            let open_id = getLocalStorage(GLOBAL_KEY.openId)
            if (encrypted_data && iv) {
                let originAccountInfo = await bindWxPhoneNumber({
                    open_id,
                    encrypted_data,
                    iv
                })
                setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
                // 存储手机号信息后，隐藏授权手机号按钮
                this.setData({
                    showBindPhoneButton: false
                })
                this.getUserInfoData()
            }
        } else {
            console.error('用户拒绝手机号授权')
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userId = options.scene ? decodeURIComponent(options.scene) : ""
        this.setData({
            userId: userId,
            statusHeight:JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
        })
        console.log(getLocalStorage("sss"))
        if(getLocalStorage(GLOBAL_KEY.userInfo)===undefined){
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
        }
        this.getUserInfoData()
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

    }
})
