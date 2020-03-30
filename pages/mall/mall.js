// pages/mall/mall.js
const untils=require("../../utils/util.js")
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [{
                title: "粉底",
                price: 69,
                imgList: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020xMaixX.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020qAMChh.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020LgUNZr.jpg"]
            },
            {
                title: "睫毛膏",
                price: 45,
                imgList: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020KEOErV.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020bPvuuP.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020OJsLHM.jpg"]
            },
            {
                title: "三色修容粉",
                price: 69,
                imgList: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020PeoxQJ.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020vTmPkg.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585301020PZjCxj.jpg"]
            }
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        showAddressMedal:false
    },
    /**
     *事件
     */
    // 购买商品
    buy(e) {
        let item=e.currentTarget.dataset.item
        this.setData({
            showAddressMedal:true
        })
    },
    // 关闭弹窗
    closeMadel(e){
        this.setData({
            showAddressMedal:false
        })
    },
    // 购买
    buyNow(e){
        // 唤起支付
        untils.requestPayment({
            prepay_id: 12121,
            key: 123131
        })
        
        // this.setData({
        //     showAddressMedal:false
        // })
    },
    /**
     *事件
     */
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['numA', 'numB', 'sum'],
            actions: ['update'],
          })
          this.update()
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

    }
})