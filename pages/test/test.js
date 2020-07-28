// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: null,

    index: 0,
    timer: null,
    audio: null,
    isInnerAudioPlaying: false,

    tAudio: null,
    isTInnerAudioPlaying: false,

    bgAudio: null
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
    this.data.video = wx.createVideoContext("myVideo", this)
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
  playVideo() {
    this.data.video.play();
  },
  stopVideo() {
    this.data.video.stop();
  },
  playTeacherAudio() {
    if (this.data.isTInnerAudioPlaying) return;
    this.data.isTInnerAudioPlaying = true;
    this.data.tAudio = wx.createInnerAudioContext()
    this.data.tAudio.volume = 1;
    this.data.tAudio.src = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2d368763-1735c0f61bd/2d368763-1735c0f61bd.mp3'
    this.data.tAudio.play()
  },
  stopTeacherAudio() {
    this.data.tAudio.stop();
    this.data.isTInnerAudioPlaying = false;
  },

  playNo() {
    if (this.data.isInnerAudioPlaying) return;
    this.data.isInnerAudioPlaying = true;
    this.data.audio = wx.createInnerAudioContext()
    this.data.audio.src = "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/3c054136-17380170bcc/3c054136-17380170bcc.mp3"
    this.data.audio.play()
  },
  stopNo() {
    clearInterval(this.data.timer)
    this.data.audio.stop();
    this.data.isInnerAudioPlaying = false;
  },

  playBgAudio() {
    this.data.bgAudio = wx.createInnerAudioContext()
    this.data.bgAudio.autoplay = true;
    this.data.bgAudio.src = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/4dd996ff-1735b7ed081/4dd996ff-1735b7ed081.mp3'
    this.data.bgAudio.play()
  },
  pauseBgAudio() {
    this.data.bgAudio.stop();
  },

  startGame() {
    this.data.video.play();
    this.playBgAudio()
    this.playNo()
    setTimeout(() => {
      // this.data.audio.volume = 0.2;
      // this.data.bgAudio.volume = 0.2;
      this.playTeacherAudio()
    }, 5000)
  },
  stopGame() {
    this.data.video.stop();
    this.pauseBgAudio()
    this.stopNo()
    this.stopTeacherAudio()
  }
})
