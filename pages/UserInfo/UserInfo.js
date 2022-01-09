// pages/UserInfo/UserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip:false,
    openID:"",
    userID:"",
    nickName:"",
    userIcon:"",

    //用户基本信息
    donateSumMoney:0,
    donateBookCount:0,
    borrowBookCount:0,
    returnBookCount:0,
    userInvalidityTime:"",
    userNickName:"",
    userPhoneNumber:"",
    userPicUrl:"",
    userVipState:0,

    //是否绑定了手机
    phoneIsBinded:false,

    bookWishNum:0
  },
  //去绑定手机的页面
  goBindingPhone:function(){
    var phoneIsBinded=this.data.phoneIsBinded
    if(phoneIsBinded)
    {
      wx.showToast({
        title: '您已绑定手机',
      })
    }else{
      wx.navigateTo({
        url: '../phoneCertification/phoneCertification',
      })
    }
    
  },
  //前往用户个人的借书码页面
  goShowUserCode:function(){
    // var openID=this.data.openID
    wx.navigateTo({
      url: '../../pages/showUserQRCode/showUserQRcode',
    })
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
    this.stillConstructing()
    // wx.navigateTo({
    //   url: '../myCertification/myCertification',
    // })
  },
  goMyReading:function(){
    this.stillConstructing()
    // wx.navigateTo({
    //   url: '../MyReading/MyReading',
    // })
  },
  //提示功能仍在开发
  stillConstructing(){
    wx.showModal({
      cancelColor: 'red',
      title:"功能仍在开发中",
      content:"敬请期待...",
      showCancel:false
    })
  },
  goContactUs(){
    wx.navigateTo({
      url: '../contactUs/contactUs',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //获取用户的userID
  getUserID(){
    var that=this
    wx.getStorage({
      key:"userID",
      success(res){
        console.log("通过key拿到了其value:")
        console.log(res)
        var theUserID=res.data
        that.setData({
          userID:theUserID
        })
        //获得用户的基本信息，捐赠的书籍数量，捐赠信息等。
        that.getUserBasicInfo(theUserID)
      }
    })
  },
  //获得用户的nickName
  getUserNickName(){
    var that=this
    wx.getStorage({
      key:"userNickName",
      success(res){
        console.log("通过key拿到了其value:")
        console.log(res)
        var userNickName=res.data
        that.setData({
          nickName:userNickName
        })
      }
    })
  },
  //获得用户Icon
  getUserIcon(){
    var that=this
    wx.getStorage({
      key:"userIcon",
      success(res){
        console.log("通过key拿到了其value:")
        console.log(res)
        var userIcon=res.data
        that.setData({
          userIcon:userIcon
        })
      }
    })
  },
  //获取用户的基本信息
  getUserBasicInfo(userID){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getPersonalInfo',
      method:"POST",
      data:{
        user_id:userID
      },
      success:function(res){
        if(res.data.code==1){
          console.log(res.data)
          // console.log(donateSumMoney)
          var borrowBookCount=res.data.data.user_info.borrow_book_count
          var donateBookCount=res.data.data.user_info.donate_book_count
          var donateSumMoney=res.data.data.user_info.donate_sum_money
          var returnBookCount=res.data.data.user_info.return_book_count
          var userInvalidityTime=res.data.data.user_info.user_invalidity_time
          var userNickName=res.data.data.user_info.user_nickname
          var userPhoneNumber=res.data.data.user_info.user_phonenumber
          var userPicUrl=res.data.data.user_info.user_pic_url
          var userVipState=res.data.data.user_info.user_vip_state
          // console.log(borrowBookCount,donateBookCount,donateSumMoney,returnBookCount,userNickName,userPhoneNumber,userPicUrl,userVipState)
          //赋值
          that.setData({
            borrowBookCount:borrowBookCount,
            donateBookCount:donateBookCount,
            donateSumMoney:donateSumMoney,
            returnBookCount:returnBookCount,
            userInvalidityTime:userInvalidityTime,
            userNickName:userNickName,
            userPhoneNumber:userPhoneNumber,
            userPicUrl:userPicUrl,
            userVipState:userVipState
          })
        }else if(res.data.code==2){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          wx.showToast({
            title: '信息错误',
          })
        }
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
    //每当页面展示时，就获取这三个信息。
    this.getUserID()
    this.getUserNickName()
    this.getUserIcon()

    this.showBookWishNumber()
  },

  //获得bookWishNum
  showBookWishNumber(){
    console.log("进入showBookWishNumber")
    var that=this
    var userID=wx.getStorageSync('userID')
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBorrowingBookNum',
      method:"POST",
      data:{
        user_id:userID
      },
      success(res){
        console.log("showBookWishNumber",res)
        console.log("bookWishNum:",res.data.data.book_count)
        var theBookWishNum=res.data.data.book_count
        
        if(res.data.code==1){
          //保存数据
          //设置num
          that.setData({
            bookWishNum:theBookWishNum
          })
        }
      }
    })
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