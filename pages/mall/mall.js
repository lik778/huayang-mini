// pages/mall/mall.js
const untils=require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [{
                title: "粉底",
                price: 69,
                imgList: ["../../images/mall/1.jpg", "../../images/mall/2.jpg", "../../images/mall/3.jpg"]
            },
            {
                title: "睫毛膏",
                price: 45,
                imgList: ["../../images/mall/4.jpg", "../../images/mall/5.jpg", "../../images/mall/6.jpg"]
            },
            {
                title: "三色修容粉",
                price: 69,
                imgList: ["../../images/mall/7.jpg", "../../images/mall/8.jpg", "../../images/mall/9.jpg"]
            },
            {
                title: "十色眼影",
                price: 89,
                imgList: ["../../images/mall/10.jpg", "../../images/mall/11.jpg", "../../images/mall/12.jpg"]
            },
            {
                title: "香蕉散粉",
                price: 58,
                imgList: ["../../images/mall/13.jpg", "../../images/mall/14.jpg", "../../images/mall/15.jpg"]
            },
            {
                title: "英格芮眉膏",
                price: 45,
                imgList: ["../../images/mall/16.jpg", "../../images/mall/17.jpg", "../../images/mall/18.jpg"]
            },
            {
                title: "遮瑕粉底液（辛巴推荐）",
                price: 69,
                imgList: ["../../images/mall/19.jpg", "../../images/mall/20.jpg", "../../images/mall/21.jpg"]
            },
            {
                title: "妆前隔离",
                price: 79,
                imgList: ["../../images/mall/22.jpg", "../../images/mall/23.jpg", "../../images/mall/24.jpg"]
            },
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