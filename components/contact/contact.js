// components/contact/contact.js
import {
  getScene
} from "../../api/mine/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contactImageSrc: {
      value: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1613793879bWSJjA.jpg",
      type: String
    }, //猜你要发图片地址
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
    } //猜你要发携带信息至后端
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    close() {
      this.triggerEvent('closeContactModal', true)
    },
    // 设置场景值
    setScene() {
      getScene({
        open_id: getLocalStorage(GLOBAL_KEY.openId),
        scene: 'distribute'
      })
    }
  }
})