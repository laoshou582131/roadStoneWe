// pages/UserInfo/UserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip:false,
    openID:"",
    userID:"",

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
    phoneIsBinded:false
  },
  //获得用户的openID
  getUserOpenID:function(e){
    const that =this
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          //"wxid_6j6ff0aaplne11"
          // openID:res.result.openid,
          openID:"wxid_6j6ff0aaplne11"
        })
        console.log("获取到OpenID: "+this.data.openID)
        //获得用户基本信息
        this.getUserBasicInfo(this.data.openID)
        //判断用户是否绑定了手机e
        this.checkUserBindingPhone()
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
  //判断用户是否绑定了手机
  checkUserBindingPhone:function(){
    // var openID=this.data.openID
    var that=this
    var openID="wxid_6j6ff0aaplne11" //
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserPhone',
      method:"POST",
      data:{
        open_id:openID
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          console.log(res.data.msg)
          //是绑定了
          that.setData({
            phoneIsBinded:true
          })
        }else if(res.data.code==2){
          wx.showModal({
            title:res.data.msg,
            content:"请前往绑定手机号",
            cancelColor: 'red',
            success:function(res){
              console.log(res)
              if(res.confirm){
                //为绑定手机，前往绑定
                wx.navigateTo({
                  url: '../phoneCertification/phoneCertification',
                })
              }else{
                console.log("选择了取消")
              }
            }
          })
        }
      }
    })
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
    var openID=this.data.openID
    wx.navigateTo({
      url: '../../pages/showUserQRCode/showUserQRcode?openID='+openID,
    })
  },
  
   //资助
   goDonate:function(){
    // this.checkUserBindingPhone()
    // var phoneIsBinded=this.data.phoneIsBinded
    // if(phoneIsBinded){
    //   wx.navigateTo({
    //     url: '../Donation/Donation',
    //   })
    // }else{
    //   console.log("不做事")
    // }
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
  //提示功能仍在开发
  functionConstruction(){
    wx.showModal({
      cancelColor: 'cancelColor',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserID()

    //获取用户的openID
    // this.getUserOpenID()
    // //获得用户基本信息
    // this.getUserPermmission()
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
        that.getUserBasicInfo(theUserID)
      }
    })
  },
  //获取用户的openID
  // getUserPermmission:function(){
  //   var that=this
  //   wx.login({
  //     timeout: 5000,
  //     success(res){
  //       console.log("获取临时凭证成功，")
  //       console.log(res.code)//获取登入的临时凭证
  //       var tempCode=res.code
  //       wx.request({
  //         url: "https://qjnqrmlhidqj4nv8.jtabc.net/getLogin",
  //         method:"POST",
  //         data:{
  //           js_code:tempCode
  //         },
  //         success(res){
  //           console.log("获取用户openID成功")
  //           console.log(res) //获得用户的openID
  //           var theOpenID=res.data.data.user_login.open_id
  //           console.log("id是："+theOpenID)
  //           that.setData({
  //             openID:theOpenID
  //           })
  //           //获取用户基本信息
  //           that.getUserBasicInfo(theOpenID)
  //         },
  //         fail(res){
  //           console.log("获取用户openID失败")
  //           console.log(res)
  //         }
  //       })
  //     }
  //   })
  // },
  //获取用户的基本信息
  getUserBasicInfo(userID){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getPersonalInfo',
      method:"POST",
      data:{
        user_id:userID//"wxid_6j6ff0aaplne11",
        // open_id:"wxid_6j6ff0aaplne11"
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