import {
  wxGetUserInfoPromise,
  wxLoginPromise
} from "../../utils/auth"
import {
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
  setLocalStorage
} from "../../utils/util"

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
      try {
        wxLoginPromise()
          .then(async (code) => {
            // 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
            let wxOriginUserInfo = await getWxInfo({
              code,
              app_id: APP_LET_ID.tx
            })
            // 缓存openId
            setLocalStorage(GLOBAL_KEY.openId, wxOriginUserInfo.openid)

            wxGetUserInfoPromise().then(async (response) => {
              const userInfo = response.userInfo
              let params = {
                open_id: getLocalStorage(GLOBAL_KEY.openId),
                avatar_url: userInfo.avatarUrl,
                city: userInfo.city,
                nickname: userInfo.nickName,
                province: userInfo.province,
                country: userInfo.country,
                gender: userInfo.gender
              }
              let originUserInfo = await bindUserInfo(params)
              setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
              this.checkLogin()
            })
          })
      } catch (error) {
        // 用户取消微信授权
        this.cancel()
      }
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
          console.log(getApp().globalData.invite_user_id)
          if (getApp().globalData.invite_user_id) {
            params = {
              ...params,
              invite_user_id: getApp().globalData.invite_user_id
            }
          }
          let originAccountInfo = await bindWxPhoneNumber(params)
          setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
        }
        this.complete()
      } else {
        // 用户拒绝手机号授权
        this.cancel()
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