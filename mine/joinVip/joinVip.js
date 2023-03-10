import {
    GLOBAL_KEY
} from "../../lib/config"
import {
    getLocalStorage,
    payVip,
    setLocalStorage
} from "../../utils/util"
import {
    bindWxPhoneNumber
} from "../../api/auth/index"
import {
    getUserInfo,
    getVipBg,
    pointjoinVipFrom
} from "../../api/mine/index"
import {
    checkAuth
} from "../../utils/auth"

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
        fromReview: false,
        fromVipWelfare: false,
        buyRepeat: true,
        bgList: '',
        roomId: '',
        buttonText: "立即加入"
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
        let soldOutTime = 1590940800000 //2020.06.01时间戳（毫秒）
        let nowTime = Math.round(new Date())
        if (nowTime >= soldOutTime) {
            // 活动已过期
            wx.showModal({
                title: '提示',
                content: '第一期会员招募已结束',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }
                }
            })
            return
        }

        if (this.data.showBindPhoneButton) return
        if (this.data.checked && this.data.buyRepeat) {
            this.setData({
                buyRepeat: false
            })
            payVip({
                id: this.data.userId
            }).then(res => {
                let tmplId = 'vsh0jfKYs0-yM2q7ACUo-NjwNmTHEi7Caz60JCW30Bk'
                wx.requestSubscribeMessage({
                    tmplIds: [tmplId],
                    success: (res) => {
                        if (res.errMsg === "requestSubscribeMessage:ok") {
                            getUserInfo("scene=zhide").then(res1 => {
                                setLocalStorage(GLOBAL_KEY.accountInfo, res1)
                                if (res === 0) {
                                    this.setData({
                                        buyRepeat: true
                                    })
                                } else {
                                    if (this.data.fromAuth) {
                                        wx.navigateTo({
                                            url: '/mine/joinSchool/joinSchool',
                                        })
                                    } else if (this.data.fromReview) {
                                        wx.navigateTo({
                                            url: `/subLive/review/review?zhiboRoomId=${this.data.roomId}`,
                                        })
                                    } else if (this.data.fromVipWelfare) {
                                        wx.navigateTo({
                                            url: "/mine/vipWelfare/vipWelfare",
                                        })
                                    } else {
                                        setLocalStorage(GLOBAL_KEY.vipBack, true)
                                        wx.switchTab({
                                            url: '/pages/index/index',
                                        })
                                        // wx.navigateTo({
                                        //     url: '/mine/contact/contact',
                                        // })
                                    }
                                }
                            })
                        }
                    }
                })


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
                    setLocalStorage(GLOBAL_KEY.accountInfo, res)
                    this.setData({
                        userInfo: res || {}
                    })
                }
                wx.hideLoading()
                if (res.is_zhide_vip) {
                    wx.showModal({
                        title: "提示",
                        cancelText: "返回首页",
                        confirmText: "继续购买",
                        content: "你已是尊贵的花样汇超级会员",
                        success(res) {
                            if (res.cancel) {
                                wx.switchTab({
                                    url: "/pages/index/index"
                                })
                            }
                        }
                    })
                    this.setData({
                        buttonText: "立即续费",
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
                wx.hideLoading()
            }, 500)
        }
        this.setData({
            showBindPhoneButton: showBindPhoneButton
        })
    },
    // 改变选择框
    changeChecked() {
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
    // 打点路径来源
    pointFrom(e) {
        pointjoinVipFrom({
            from: e
        })
    },
    // 获取背景图
    getVipBgData() {
        getVipBg().then(({
            data
        }) => {
            this.setData({
                bgList: data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        checkAuth({
            authPhone: true
        }).then(() => {
            let userId = options.scene ? decodeURIComponent(options.scene) : ""
            if (options.from === "joinSchool") {
                // 公众号文章跳转过来de
                this.setData({
                    fromAuth: true
                })
            } else if (options.from === "review") {
                // 回看跳转过来de
                this.setData({
                    fromReview: true,
                    roomId: options.zhiboRoomId
                })
            } else if (options.from === "vipWelfare") {
                this.setData({
                    fromVipWelfare: true
                })
            }
            this.setData({
                userId: userId, //分享跳转过来de
                statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
            })
            if (options.from) {
                this.pointFrom(options.from)
            }
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
    onShow: function () {},

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
            path: '/mine/joinVip/joinVip?from=joinVipShare'
        }
    }
})