// pages/mine/mine.js
import { getScene, getUniversityCode, getUserInfo, getVipShow } from "../../api/mine/index"
import { bindWxPhoneNumber } from "../../api/auth/index"
import { GLOBAL_KEY } from '../../lib/config'
import { getLocalStorage, setLocalStorage } from "../../utils/util"
import { checkAuth } from "../../utils/auth"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        width: 200,
        showBindPhoneButton: true,
        showInviteLine: true,
        showVipEnter: false, //是否展示会员权益入口
    },
    // 跳往会员权益介绍
    toVipWelfare() {
        wx.navigateTo({
            url: '/mine/vipWelfare/vipWelfare',
        })
    },
    // 查询我的订单
    toMineOrder() {
        if (!this.data.showBindPhoneButton) {
            wx.navigateTo({
                url: '/mine/mineOrder/mineOrder',
            })
        }

    },
    // 跳转至课程列表
    toCourseList() {
        getUniversityCode(`user_key=daxue`).then(res => {
            wx.navigateTo({
                url: `/subLive/courseList/courseList?id=${res.data.id}`,
            })
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
            balance: this.data.userInfo.amount, //余额
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
                url: '/mine/joinVip/joinVip?from=mine',
            })
        }
    },
    // 获取会员权益开关
    getVipShowData() {
        getVipShow().then(res => {
            this.setData({
                showVipEnter: res.data
            })
        })
    },
    // 申请入学
    applyJoinSchool() {
        wx.navigateTo({
            url: `/mine/joinSchool/joinSchool`,
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
                // this.setData({
                //     showBindPhoneButton: false
                // })
                this.getUserInfoData()
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
            url: '/mine/joinVip/joinVip?from=mine',
        })
    },
    // 获取用户信息
    getUserInfoData() {
        // 判断是否手机号登录，控制显示授权手机号按钮
        let showBindPhoneButton = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? true : false
        this.setData({
            showBindPhoneButton: showBindPhoneButton
        })
        if (!showBindPhoneButton) {
            getUserInfo("scene=zhide").then(res => {
                if (res.code === -2) {
                    this.setData({
                        showBindPhoneButton: true,
                        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
                    })
                } else {
                    if (Number.isInteger(res.amount / 100)) {
                        res.amount = res.amount / 100 + ".00"
                    } else {
                        res.amount = res.amount / 100
                    }
                    res.mobile = res.mobile.substr(0, 3) + "****" + res.mobile.substr(7) //手机号中间四位数*
                    res.zhide_end_time = res.zhide_end_time === '' ? '' : res.zhide_end_time.split(' ')[0] //处理会员到期时间到分
                    setLocalStorage(GLOBAL_KEY.accountInfo, res)
                    this.setData({
                        showBindPhoneButton: false,
                        userInfo: res
                    })
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
    },
    // 初始化时间
    initDate() {
        let soldOutTime = 1590940800000 //2020.06.01时间戳（毫秒）
        let nowTime = Math.round(new Date())
        if (nowTime >= soldOutTime) {
            this.setData({
                showInviteLine: false
            })
        } else {
            this.setData({
                showInviteLine: true
            })
        }
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.getVipShowData()
        this.initDate()
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    // 生命周期函数--监听页面显示
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
          this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
        checkAuth({
            authPhone: true
        }).then(() => {
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
            title: "花样百姓",
            path: '/pages/index/index',
        }
    }
})
