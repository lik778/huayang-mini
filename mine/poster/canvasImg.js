const wxml = `
<view class="container" >
  <view class="head-icon-line">
    <view class="head">
      <image class="img" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3582589792,4046843010&fm=26&gp=0.jpg"></image>
    </view>
    <view class="desc">
      <text class="desc-title">您的好友 樊悦</text>
      <text class="desc-bottom">邀您共同赢取花样会员</text>
    </view> 
  </view>
  <view class="invite-sign">
    <text class="invite-sign-one">享明星导师时尚直播课程</text>
    <text class="invite-sign-two">严选好物折购优惠</text>
    <text class="inviteS-sign-three">参与专属活动</text>
  </view>
</view>
`

const style = {
  container: {
    width: 400,
    height: 1000,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  headIconLine: {
    flexDirection:'row',
    marginLeft:20,
    paddingTOP:20,
    marginRight:10,
    marginBottom:20,
    width:360,
    height:960
  },
  head:{
    flexDirection:"row",
    justifyContent:"flex-start"
  },
  img:{
    width:30,
    height:30,
    
  }
}

module.exports = {
  wxml,
  style
}