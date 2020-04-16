// pages/mine/mine.js
import {
    createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
    getScene,
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
import {
    checkAuth
} from "../../utils/auth"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        width: 200,
        showBindPhoneButton: true,
    },
    // 跳转至课程列表
    toCourseList() {
        let officialRoomId = 207
        wx.navigateTo({
            url: `/subLive/courseList/courseList?id=${officialRoomId}`,
        })
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
            balance: this.data.userInfo.amount / 100 || 0, //余额
            point: this.data.userInfo.zhide_point, //花豆
            isVip: this.data.userInfo.is_zhide_vip, //是否为vip
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
            url: `/mine/joinSchool/joinSchool`,
        })
    },
    // 一键获取手机号
    getPhoneNumber(e) {
        if (!e) return
        let {
            errMsg = '', encryptedData: encrypted_data = '', iv = ''
        } = e.detail
        if (errMsg.includes('ok')) {
            let open_id = getLocalStorage(GLOBAL_KEY.openId)
            if (encrypted_data && iv) {
                checkAuth().then(async () => {
                    let originAccountInfo = await bindWxPhoneNumber({
                        open_id,
                        encrypted_data,
                        iv
                    })
                    setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
                    // 存储手机号信息后，隐藏授权手机号按钮
                    // this.setData({
                    //     showBindPhoneButton: false
                    // })
                    this.getUserInfoData()
                })
            }
        } else {
            console.error('用户拒绝手机号授权')
        }
    },
    // 加入会员群
    changeScene(e) {
        let params = {
            scene: "vip",
            open_id: getLocalStorage(GLOBAL_KEY.openId)
        }
        getScene(params)
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
                        showBindPhoneButton: true,
                        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
                    })

                } else {
                    res.mobile = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
                    this.setData({
                        showBindPhoneButton: false,
                        userInfo: res || {}
                    })
                    if (getLocalStorage(GLOBAL_KEY.updateAccountInfo) === "true" || getLocalStorage(GLOBAL_KEY.vipupdateAccountInfo) === "true") {
                        setLocalStorage(GLOBAL_KEY.accountInfo, res.data)
                        setLocalStorage(GLOBAL_KEY.updateAccountInfo, "false")
                        setLocalStorage(GLOBAL_KEY.vipupdateAccountInfo, "false")
                    }
                }
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
        checkAuth().then(() => {
            if (getLocalStorage(GLOBAL_KEY.accountInfo)) {
                this.setData({
                    userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
                })
            } else {
                this.setData({
                    userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
                })
            }
            this.getUserInfoData()
            this.changeScene()
        })
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
        return {
            title: "花样值得买",
            desc: "花样",
            path: '/pages/mine/mine',
            imgUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586870905SEwHoX.jpg"
        }
    }
})