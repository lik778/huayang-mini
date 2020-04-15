// components/mall/address.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        addressData: "",
        mobileData: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 地址输入框
        changeAddressData(e) {
            this.setData({
                addressData: e.detail.value
            })
        },
        // 手机输入框
        changeMobileData(e) {
            this.setData({
                mobileData: e.detail.value
            })
        },
        // 取消购买
        cancel() {
            this.triggerEvent("closeMadel", {
                status: true
            })
        },
        // 确认购买
        sure() {
            if(this.data.addressData===''){
                wx.showToast({
                  title: '请填写地址',
                  icon:"none"
                })
                return;
            }
            if(this.data.mobileData===''){
                wx.showToast({
                  title: '请填写手机号',
                  icon:"none"
                })
                return;
            }
            this.triggerEvent("buy", {
                sureBuy: true
            })
        }
    }
})