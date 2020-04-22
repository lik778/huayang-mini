// mine/joinVip/joinVip.js

import { GLOBAL_KEY } from "../../lib/config"
import { getLocalStorage, payVip, setLocalStorage } from "../../utils/util"
import { bindWxPhoneNumber } from "../../api/auth/index"
import { getUserInfo, getVipBg } from "../../api/mine/index"
import { checkAuth } from "../../utils/auth"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: "",
        statusHeight: 0,
        showBindPhoneButton: true,
        checked: false,
        fromAuth: false,
        fromReview:false,
        buyRepeat: true,
        bgList: '',
        roomId:''
    },
    // 选中
    onChange() {
        this.setData({
            checked: !this.data.checked
        })
    },
    // 用户购买协议
    toBuyBook() {
        wx.navigateTo({
            url: '/mine/buyAgreement/buyAgreement',
        })
    },
    // 购买会员
    buyVip() {
        if (this.data.showBindPhoneButton) return
        if (this.data.checked && this.data.buyRepeat) {
            this.setData({
                buyRepeat: false
            })
            payVip({
                id: this.data.userId
            }).then(res => {
                if (res === 0) {
                    this.setData({
                        buyRepeat: true
                    })
                } else {
                    if (this.data.fromAuth) {
                        wx.navigateTo({
                            url: '/mine/joinSchool/joinSchool',
                        })
                    }else if(this.data.fromReview){
                        wx.navigateTo({
                            url: `/subLive/review/review?zhiboRoomId=${this.data.roomId}`,
                        })
                    } else {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }
                }

            }).catch(() => {
                this.setData({
                    buyRepeat: true
                })
            })
        } else {
            wx.showToast({
                title: '请先同意会员服务协议',
                icon: "none"
            })
        }
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
                wx.hideLoading()
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
                wx.hideLoading()
            }, 500)
        }
        this.setData({
            showBindPhoneButton: showBindPhoneButton
        })
    },
    // 改变选择框
    changeChecked() {
        console.log(this.data.checked, 9999999)
        this.setData({
            checked: !this.data.checked
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
    // 获取背景图
    getVipBgData() {
        getVipBg().then(({
            data
        }) => {
            let arr = []
            let _this = this
            for (let i in data) {
                wx.getImageInfo({
                    src: data[i],
                    success(res) {
                        let obj = {
                            src: res.path,
                            height: res.height
                        }
                        arr.push(obj)
                        _this.setData({
                            bgList: arr
                        })
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        checkAuth({listenable: true,ignoreFocusLogin:true}).then(() => {
            let userId = options.scene ? decodeURIComponent(options.scene) : ""
            if (options.from === "article") {
                // 公众号文章跳转过来de
                this.setData({
                    fromAuth: true
                })
            }else if(options.from === "review"){
                // 回看跳转过来de
                this.setData({
                    fromReview: true,
                    roomId:options.zhiboRoomId
                })
            }

            this.setData({
                userId: userId,//分享跳转过来de
                statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
            })
            this.getUserInfoData()
            this.getVipBgData()
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
        console.log(111)
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
        return {
            title: "加入花样会员",
            path: '/mine/joinVip/joinVip'
        }
    }
})
