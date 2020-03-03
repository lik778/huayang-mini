// pages/list/list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listArr: [{
                src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1063561795,1339862726&fm=26&gp=0.jpg",
                grade: 5
            },
            {
                src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=178359767,2690148676&fm=26&gp=0.jpg",
                grade: 10
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1548119743,252552301&fm=26&gp=0.jpg",
                grade: 15
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2466039205,1314038107&fm=26&gp=0.jpg",
                grade: 20
            },
            {
                src: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1984735845,878034826&fm=11&gp=0.jpg",
                grade: 25
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1914378448,543639268&fm=26&gp=0.jpg",
                grade: 30
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3948368297,2527757443&fm=26&gp=0.jpg",
                grade: 35
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2925814043,2270250949&fm=26&gp=0.jpg",
                grade: 40
            },
            {
                src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2155983538,3860699715&fm=26&gp=0.jpg",
                grade: 45
            },
            {
                src: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1175179067,2902739431&fm=26&gp=0.jpg",
                grade: 50
            },
            {
                src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3004831859,2611273449&fm=26&gp=0.jpg",
                grade: 55
            },
            {
                src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1237908509,3402766423&fm=26&gp=0.jpg",
                grade: 100
            },
        ]
    },

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
        setTimeout(()=>{
            wx.stopPullDownRefresh()
        },1000)
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