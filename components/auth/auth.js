import {
  wxLoginPromise
} from "../../utils/auth"
import {
  agentUserBind,
  bindUserInfo,
  bindWxPhoneNumber,
  getWxInfo
} from "../../api/auth/index"
import {
  APP_LET_ID,
  GLOBAL_KEY
} from "../../lib/config"
import {
  $notNull,
  getLocalStorage,
  setLocalStorage,
  setWxUserInfoExpiredTime
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.setData({
            didVisible: newVal
          })
        } else {
          let timer = setTimeout(() => {
            this.setData({
              didVisible: newVal
            })
            clearTimeout(timer)
          }, 200)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    didVisible: false, // 控制显隐
    didGetPhoneNumber: false, // 授权类型
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 一键微信授权
     */
    getUserInfo() {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: async res => {
          let userInfo = res.userInfo
          wxLoginPromise()
            .then(async (code) => {
              // 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
              let wxOriginUserInfo = await getWxInfo({
                code,
                app_id: APP_LET_ID.tx
              })
              // openid
              setLocalStorage(GLOBAL_KEY.openId, wxOriginUserInfo.openid)
              let params = {
                open_id: wxOriginUserInfo.openid,
                avatar_url: userInfo.avatarUrl,
                city: userInfo.city,
                nickname: userInfo.nickName,
                province: userInfo.province,
                country: userInfo.country,
                gender: userInfo.gender
              }
              let originUserInfo = await bindUserInfo(params)
              setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)

              setWxUserInfoExpiredTime()

              bxPoint("applets_auth_status", {
                auth_type: "weixin",
                auth_result: "success"
              }, false)
              this.checkLogin()
            })
        },
        fail: () => {
          // 用户取消微信授权
          this.cancel()
          bxPoint("applets_auth_status", {
            auth_type: "weixin",
            auth_result: "fail"
          }, false)
        }
      })
    },
    /**
     * 一键获取微信手机号
     * @param e
     */
    async getPhoneNumber(e) {
      if (!e) return
      let {
        errMsg = '', encryptedData: encrypted_data = '', iv = ''
      } = e.detail

      if (errMsg.includes('ok')) {
        let open_id = getLocalStorage(GLOBAL_KEY.openId)
        let params = {
          open_id,
          encrypted_data,
          iv,
        }
        if (encrypted_data && iv) {
          if (getApp().globalData.super_user_id) {
            params = {
              ...params,
              invite_user_id: getApp().globalData.super_user_id
            }
          }
          // 代理商渠道标识
          if (getLocalStorage("distributorStorage")) {
            let info = JSON.parse(getLocalStorage('distributorStorage'))
            if (new Date().getTime() <= info.expire_at) {
              if (Number(info.mode) === 1) {
                agentUserBind({
                  agent_id: info.agent_id,
                  user_id: getLocalStorage(GLOBAL_KEY.userId)
                })
              }
            } else {
              removeLocalStorage('distributorStorage')
            }
          }

          let originAccountInfo = await bindWxPhoneNumber(params)
          setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
        }

        this.complete()

        setWxUserInfoExpiredTime()

        bxPoint("applets_auth_status", {
          auth_type: "phone",
          auth_result: "success"
        }, false)
      } else {
        // 用户拒绝手机号授权
        this.cancel()
        bxPoint("applets_auth_status", {
          auth_type: "phone",
          auth_result: "fail"
        }, false)
      }
    },
    jumpToPrivacy() {
      wx.navigateTo({
        url: '/pages/privacy/privacy'
      })
    },
    jumpToService() {
      wx.navigateTo({
        url: '/pages/service/service'
      })
    },
    // 用户拒绝授权
    cancel() {
      this.triggerEvent('authCancelEvent')
    },
    // 用户完成所有授权
    complete() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const url = `/${currentPage.route}`;
      if (getLocalStorage('hy_refresh_student_moments_list_expire') === true && url !== '/pages/studentMoments/studentMoments') {
        let expireTime = parseInt(new Date().getTime() / 1000) + 43200 //12小时
        setLocalStorage("hy_refresh_student_moments_list_expire", expireTime)
      }
      this.triggerEvent('authCompleteEvent')
    },
    checkLogin() {
      wxLoginPromise()
        .then(async (code) => {
          let originUserInfo = await getWxInfo({
            code,
            app_id: APP_LET_ID.tx
          })
          if ($notNull(originUserInfo) && originUserInfo.nickname) {
            // 缓存openId、userInfo
            setLocalStorage(GLOBAL_KEY.openId, originUserInfo.openid)
            setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
            // 用户已完成微信授权，引导用户手机号授权
            this.setData({
              didGetPhoneNumber: true
            })
          } else {
            this.setData({
              didGetPhoneNumber: false
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  attached() {
    this.checkLogin()
  }
})