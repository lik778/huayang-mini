// pages/mine/mine.js
import {
    createStoreBindings
} from 'mobx-miniprogram-bindings'
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
        inviteList: ["http://wx.qlogo.cn/mmhead/ver_1/elNO9PdibZmwiaSIvqhnPAA82r7o6Hnr0ibHwu0tsRF9925CN8X9ws4dx2hNc2Y4emaQ7KTUyQkF5giamfS3pa4BkW9ShfETbwoga96u7KAxxcM/132", 'http://wx.qlogo.cn/mmhead/ver_1/icNS8hT9WC6VmtqIAZXs3xia9iaeFwAbcWBV2lBoKhHrACduOR63vZTbDdkicvIOMceG1H1Ip9Q1SDAFicMH7icvIJHqKR5GPzdeATEOaZuXWKNQU/132', 'http://wx.qlogo.cn/mmhead/ver_1/O1AYCQEL5vF6zcQRGgvaPpn0yWs6iasFRsSIJ86FSWzA6ab0prkliaqKiajiarc5Cib88zWH8TxbhqpB9S4GYcPdQIA/132', 'http://wx.qlogo.cn/mmhead/ver_1/QwFET9thFpB7NAdcLibBg8G2TONicBLlanzJIicuyO1g0hBUxWpOMwlQHwgFVJwia9roVic1skxX3KHaw90jTDTibdRQIC6SqcqgZQE6niaJicFNFBI/132'],
        inviteNum: 4
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['numA', 'numB', 'sum'],
            actions: ['update'],
        })
        this.getUserInfo()
        // 判断是否手机号登录，控制显示授权手机号按钮
        let showBindPhoneButton = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? true : false
        this.setData({
            showBindPhoneButton: showBindPhoneButton
        })
    },
    /**
     *事件
     */
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
                    showBindPhoneButton:false
                })
            }
        } else {
            toast('用户拒绝手机号授权')
        }
    },
    // 本地缓存获取用户信息
    getUserInfo() {
        let userInfo = wx.getStorageSync(GLOBAL_KEY.userInfo)
        this.setData({
            userInfo: userInfo
        })
    },
    // 跳往会员权益页
    toVip() {
        wx.navigateTo({
            url: '/mine/joinVip/joinVip',
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
        // setTimeout(() => {
        //     console.log(this.data.sum)
        // }, 4000)
    },
    // 事件
    toMall() {
        wx.switchTab({
            url: '/pages/mall/mall',
        })
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