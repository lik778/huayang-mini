// components/contact/contact.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contactImageSrc: {
      value: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1613793879bWSJjA.jpg",
      type: String
    }, //猜你要发图片地址
    showMessageCard: {
      value: true,
      type: Boolean
    }, //是否显示猜你要发卡片
    buttonName: {
      value: '明白啦，点击加客服',
      type: String
    }, //引导按钮名称
    sendMessageTitle: {
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
    }
  }
})