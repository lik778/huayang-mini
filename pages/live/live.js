// pages/live/live.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomId:[4],
        customParams :encodeURIComponent(JSON.stringify({ path: 'pages/live/live' }))
    },
    getReview(){
        let params={
            "action": "get_replay",
            "room_id": 3, 
            "start": 0, 
            "limit": 10 
        }
        console.log(wx.$request)
        wx.$request._get("http://api.weixin.qq.com/wxa/business/getliveinfo?access_token=ssssssadawqwdq",{type:"POST"})
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

    },
    statechange:(e)=>{
        console.log(e)
    }
})