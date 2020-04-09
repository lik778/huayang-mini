// pages/mine/mine.js
import {
    createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
    getUserInfo
} from "../../api/mine/index"
import {
    bindWxPhoneNumber
} from "../../api/auth/index"
import {
    GLOBAL_KEY
} from '../../lib/config'
import {
    getLocalStorage,
    setLocalStorage
} from "../../utils/util"

import {
    store
} from '../../store'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        width: 200,
        showBindPhoneButton: true,
    },
    // 跳往邀请会员页
    toInvite() {
        wx.navigateTo({
            url: '/mine/invite/invite',
        })
    },
    // 跳往我的钱包
    toWallet() {
        let wolletData = {
            balance: this.data.userInfo.amount / 100, //余额
            point: this.data.userInfo.zhide_point //花豆
        }
        wx.navigateTo({
            url: `/mine/wallet/wallet?wolletData=${JSON.stringify(wolletData)}`,
        })
    },
    // 加入会员
    joinVip() {
        if (this.data.showBindPhoneButton) {
            wx.showToast({
                title: '请先手机号注册',
                icon: "none"
            })
        } else {
            wx.navigateTo({
                url: '/mine/joinVip/joinVip',
            })
        }
    },
    // 申请入学
    applyJoinSchool() {
        wx.navigateTo({
            url: `/mine/joinSchool/joinSchool?mobile=${this.data.userInfo.mobile}`,
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
            toast('用户拒绝手机号授权')
        }
    },
    // 加入会员群
    joinVipGroup(e) {
        console.log(e)
    },
    // 联系客服
    callPhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.mobile
        })
    },
    // 跳往会员权益页
    toVip() {
        wx.navigateTo({
            url: '/mine/joinVip/joinVip',
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
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['numA', 'numB', 'sum'],
            actions: ['update'],
        })

    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },
    // 生命周期函数--监听页面显示
    onShow: function () {
        this.getUserInfoData()
        // wx.navigateTo({
        //     url: '/mine/joinResult/joinResult',
        // })
    },
    // 生命周期函数--监听页面隐藏
    onHide: function () {

    },

    // 生命周期函数--监听页面卸载
    onUnload: function () {

    },

    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function () {

    },
    // 用户点击右上角分享
    onShareAppMessage: function () {

    }
})