import bxPoint from "../../utils/bxPoint"
import {
  getLocalStorage,
  isIphoneXRSMax
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      value: false,
      type: Boolean,
      observer(newVal) {
        if (newVal) {
          this.setData({
            didShowContact: newVal
          })
        } else {
          let timer = setTimeout(() => {
            this.setData({
              didShowContact: newVal
            })
            clearTimeout(timer)
          }, 200)
        }
      }
    },
    contactImageSrc: {
      value: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1613793879bWSJjA.jpg",
      type: String
    }, //传你要发图片地址
    isRootPage: {
      value: false,
      type: Boolean
    }, //是否是tab页,如果是tab页距离底部高度需要兼容tab高度
    showMessageCard: {
      value: true,
      type: Boolean
    }, //是否显示猜你要发卡片
    buttonName: {
      value: '明白啦，点击加客服',
      type: String
    }, //引导按钮名称
    sendMessageTitle: {
      value: "请点击下方二维码，长按扫码加专属客服",
      type: String
    }, //猜你要发发送卡片标题
    sessionFrom: {
      value: "",
      type: String
    }, //猜你要发携带信息至后端
    sceneValue: {
      value: "distribute",
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    didShowContact: false,
    safePageSize: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onButtonTap() {
      bxPoint("join_contact", {}, false)
    },
    // 关闭
    close() {
      this.triggerEvent('closeContactModal')
    }
  },
  pageLifetimes: {
    show: function () {
      let {
        screenHeight,
        safeArea: {
          bottom
        }
      } = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
      this.setData({
        safePageSize: isIphoneXRSMax() ? 40 : 0
      })
    }
  }
})