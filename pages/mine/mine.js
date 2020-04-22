// pages/mine/mine.js
import { getScene, getUniversityCode, getUserInfo } from "../../api/mine/index"
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
            url: '/mine/joinVip/joinVip',
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
                    res.mobile = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
                    setLocalStorage(GLOBAL_KEY.accountInfo, res)
                    this.setData({
                        showBindPhoneButton: false,
                        userInfo:res
                    })

                    // if (getLocalStorage(GLOBAL_KEY.updateAccountInfo) === "true" || getLocalStorage(GLOBAL_KEY.vipupdateAccountInfo) === "true") {
                    //     setLocalStorage(GLOBAL_KEY.accountInfo, res.data)
                    //     setLocalStorage(GLOBAL_KEY.updateAccountInfo, "false")
                    //     setLocalStorage(GLOBAL_KEY.vipupdateAccountInfo, "false")
                    // }
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
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    // 生命周期函数--监听页面显示
    onShow: function () {
        checkAuth({listenable: true, ignoreFocusLogin: true}).then(() => {
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
            path: '/pages/index/index',
        }
    }
})
