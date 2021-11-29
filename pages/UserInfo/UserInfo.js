// pages/UserInfo/UserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip:false,
    openID:"wxid_6j6ff0aaplne11",
    //用户基本信息
    donateSumMoney:0,
    donateBookCount:0,
    borrowBookCount:0,
    returnBookCount:0,
    userNickName:"",
    userPhoneNumber:"",
    userPicUrl:"",
    userVipState:0
  },
   //资助
   goDonate:function(){
    wx.navigateTo({
      url: '../Donation/Donation',
    })
  },
  //正常还书
  goReturning:function(){
    wx.navigateTo({
      url: '../ReturningBook/ReturningBook',
    })
  },
  //期限内的借阅的书籍列表
  goReturningInDate:function(){
    wx.navigateTo({
      url: '../ReturningBookInDate/ReturningBookInDate',
    })
  },
   //过期的借阅的书籍列表
  goReturningOutDate:function(){
    wx.navigateTo({
      url: '../ReturningBookOutDate/ReturningBookOutDate',
    })
  },
  //我的证书
  goCertification:function(){
    wx.navigateTo({
      url: '../myCertification/myCertification',
    })
  },
  goMyReading:function(){
    wx.navigateTo({
      url: '../MyReading/MyReading',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得用户基本信息
    this.getUserBasicInfo(this.data.openID)
  },
  //获取用户的基本信息
  getUserBasicInfo(openID){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getPersonalInfo',
      method:"POST",
      data:{
        open_id:openID
      },
      success:function(res){
        console.log(res.data)
        // console.log(donateSumMoney)
        var borrowBookCount=res.data.data.user_info.borrow_book_count
        var donateBookCount=res.data.data.user_info.donate_book_count
        var donateSumMoney=res.data.data.user_info.donate_sum_money
        var returnBookCount=res.data.data.user_info.return_book_count
        var userNickName=res.data.data.user_info.user_nickname
        var userPhoneNumber=res.data.data.user_info.user_phonenumber
        var userPicUrl=res.data.data.user_info.user_pic_url
        var userVipState=res.data.data.user_info.user_vipState
        // console.log(borrowBookCount,donateBookCount,donateSumMoney,returnBookCount,userNickName,userPhoneNumber,userPicUrl,userVipState)
        //赋值
        that.setData({
          borrowBookCount:borrowBookCount,
          donateBookCount:donateBookCount,
          donateSumMoney:donateSumMoney,
          returnBookCount:returnBookCount,
          userNickName:userNickName,
          userPhoneNumber:userPhoneNumber,
          userPicUrl:userPicUrl,
          userVipState:userVipState
        })
        
      }
    })
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