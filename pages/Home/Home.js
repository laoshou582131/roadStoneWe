// pages/Home/Home.js
Page({
  data: {
    //用户的基本信息
    UserBorrowingState:"",
    res:"",
    openID:"wxid_6j6ff0aaplne11",
    userNickName:"",
    userAvatarUrl:"",

    //愿望清单的书籍数量
    bookWishNum:0,

    //是否绑定了手机号码
    phoneIsBinded:false,

    //轮播图数组
    picList:[],
    tempRes:{},

    //用户地理位置
    latitude:0, //经度
    longitude:0, //纬度
  },
  //获取用户位置
  getUserPosition(){
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        var latitude1 = res.latitude //纬度
        var longitude1 = res.longitude //经度
        console.log("经纬度：",latitude1,longitude1)
        //保存用户的经纬度信息
        that.setData({
          latitude:latitude1, //纬度
          longitude:longitude1//经度
        })
      }
     })
  },

  //获取用户的授权
  getUserPermmission:function(){
    var that=this
    wx.login({
      timeout: 5000,
      success(res){
        console.log("获取临时凭证成功，")
        console.log(res.code)//获取登入的临时凭证
        var tempCode=res.code

        wx.request({
          url: "https://qjnqrmlhidqj4nv8.jtabc.net/getLogin",
          method:"POST",
          data:{
            js_code:tempCode
          },
          success(res){
            console.log("获取用户openID成功")
            console.log(res) //获得用户的openID
            var theOpenID=res.data.data.user_login.open_id
            console.log("id是："+theOpenID)
            that.setData({
              openID:theOpenID
            })
            //缓存openID
            // wx.setStorageSync('userOpenID', theOpenID)
            var theNickName=that.data.userNickName
            var theUserAvatarUrl=that.data.userAvatarUrl
            var theLatitude=that.data.latitude
            var theLongitude=that.data.longitude
            
            //将用户的昵称，ICON以及用户的openID保存近数据库。
            that.checkAndSaveUserInfo(theOpenID,theNickName,theUserAvatarUrl,theLatitude,theLongitude)

          },
          fail(res){
            console.log("获取用户openID失败")
            console.log(res)
          }
        })
      }
    })
  },
  //保存或更新旧用户信息
  //保存或更新用户的openID,昵称以及用户的头像。
  checkAndSaveUserInfo(openID,nickName,picUrl,latitude,longitude){
    var that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkNewUser',
      method:"POST",
      data:{
        //open_id,nickname,pic_url,longitude,latitude
        open_id:openID,
        nickname:nickName,
        pic_url:picUrl,
        latitude:latitude,
        longitude:longitude,
      },
      success(res){
        console.log("checkNewUser,保存用户信息成功")
        console.log("获取userid以及localID")
        // console.log(openID+","+nickName+","+picUrl)
        console.log(res)

        var theUserID=res.data.data.data.user_id
        var theLocalID=res.data.data.data.local_id
        console.log("userID以及localID",theUserID,theLocalID)
        //保存返回回来的user_id
        wx.setStorageSync('userID', theUserID)
        wx.setStorageSync('localID',theLocalID)

        //展示愿望清单中所借阅的书籍数量
        that.showBookWishNumber()
      }
    })
  },
  //获取用户的昵称和头像
  getUserNNameAndIcon(){
    var that=this
    wx.getUserProfile({
      desc: '展示用户信息',
      success(res){
        console.log(res)
        var nickName=res.userInfo.nickName
        var avatarUrl=res.userInfo.avatarUrl
        console.log("nickName:"+nickName+"url:"+avatarUrl)
        that.setData({
          //userInfo.avatarUrl nickName
          userNickName:nickName,
          userAvatarUrl:avatarUrl
        })
        //保存昵称和ICON
        wx.setStorageSync('userNickName',nickName)
        wx.setStorageSync('userIcon', avatarUrl)
        //获得了昵称和Icon之后，就去获得用户的openID
        that.getUserPermmission()
      },
      fail(res){
        console.log("error"+res)
      }
      
    })
  },
  //用户进入页面直接进行弹框提问
  askUserGetPermission(){
    var that=this
    wx.showModal({
      cancelColor: 'red',
      title:"获得基本信息",
      content:"将获取您的昵称和头像...",
      confirmText:"允许",
      success(res){
        console.log(res)
        if(res.confirm){
          console.log("允许了")
          //获取用户的昵称和头像
          that.getUserNNameAndIcon()
          //获取用户的经纬度
          that.getUserPosition()
        }else{
          console.log("不允许")
        }
      },
      fail(res){
        console.log("不允许"+res)
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

  //自定义导航方法
  //还书
  goReturning:function(){
    wx.navigateTo({
      url: '../ReturningBook/ReturningBook',
    })
  },
  //捐书
  goDonateBooks:function(){
    //检查是否绑定了手机
    this.checkUserBindingPhone()
  },

  //资助
  goDonate:function(){
    wx.navigateTo({
      url: '../Donation/Donation',
    })
    
  },


  //定义扫码方法
  goScan:function(){
    //判断是否绑定手机
    // this.checkUserBindingPhone()
    //判断是否可以借书
    // this.checkUserBorrowingRight(this.data.openID)
    //scan书籍
    var that =this
    wx.scanCode({
      onlyFromCamera: true,
      // scanType:['barCode'],
      success:function(res){
        that.setData({
          tempRes:res
        })
        console.log("扫描得到bookCode:")
        console.log(res.result)
        
        console.log("扫码的类型："+res.scanType)
        var theBookCode=res.result
        //前往详情页面
        that.goDetail(res.result)

      }
    })
    
  },
    //前往用户个人的借书码页面
    goShowUserCode:function(){
      wx.navigateTo({
        url: '../../pages/showUserQRCode/showUserQRcode',
      })
    },
   //前往该书籍的详情页面
   goDetail(bookCode){
    try{
      var bookCode1=bookCode
      console.log("进入goDetail的bookCode")
      console.log(bookCode)
      if(bookCode1!=null){
        //传递bookId参数到BookDetail页面
        wx.navigateTo({
          url: '../../pages/bookDetail/BookDetail?book_code='+bookCode,
        })
      }else{
        console.log("无。")
      }
    }catch(err){
      console.log("goBookDetail's error: "+err)
    }

  },
  //判断用户是否能够借书
  checkUserBorrowingRight(openID){
    var that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserBorrowingStatus',
      method:"POST",
      data:{
        //"wxid_6j6ff0aaplne11"
        // open_id:openID
        open_id:"wxid_6j6ff0aaplne11"
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          //允许借书,开启扫码
          wx.scanCode(
            {
              success:function(res){
                that.setData({res:res})
              }
            }
          )

        }else if(res.data.code==2)
        {
          //有图书超期未还，不允许借书
          console.log(res.data.msg)
          wx.showToast({
            title: res.data.msg,
            icon:'error',
            duration:1500
          })
        }else if(res.data.code==21)
        {
          //超出借书数量上限，不允许借书
          wx.showToast({
            title: res.data.msg,
            icon:'error',
            duration:1500
          })
        }else if(res.data.code==22)
        {
          //不是会员，会员过期，不允许借书
          wx.showToast({
            title: res.data.msg,
            icon:'error',
            duration:1500
          })
        }
        else{
          //借书失败
          console.log("不允许借书")
          wx.showToast({
            title: res.data.msg,
            icon:'error',
            duration:1500
          })
        }
      }
    })
    
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("hello")
    // this.myTabBar=this.selectComponent("#middleNum");

    //询问是否可以获取用户的信息使用权。
    this.askUserGetPermission()
    //刷新愿望清单书籍数量
    // this.showBookWishNumber()

    //获取轮播图
    this.getPics()
  },
  //获取轮播图的图片
  getPics:function(){
    var that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getPicURL',
      method:"GET",
      data:{

      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          that.setData({
            picList:res.data.data.pic_list
            
          })
          // console.log(that.data.picList)
        }else if(res.data.code==2){
          console.log(res.data.msg)
        }else{
          console.log(res.data.msg)
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
    // this.useComponentFn()
    //展示用户的愿望清单
    this.showBookWishNumber()
  },
  //展示用户的愿望清单
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

  //使用组件中的方法。
  useComponentFn(){
    this.myTabBar.getBorrowingBookNum();
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