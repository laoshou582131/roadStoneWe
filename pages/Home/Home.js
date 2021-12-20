// pages/Home/Home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserBorrowingState:"",
    res:"",
    openID:"wxid_6j6ff0aaplne11",

    //是否绑定了手机号码
    phoneIsBinded:false,

    //轮播图数组
    picList:[],
    tempRes:{}
  },
  //获取用户的授权
  getUserPermmission:function(){
    wx.login({
      timeout: 5000,
      success(res){
        console.log(res.code)//获取登入的临时凭证
        var tempCode=res.code
        var appID="wx33672cd0c62cd3cb"
        var secret="eb92a6fe12159ab1fe0b2fcd41533d8e"
        wx.request({
          // url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appID+'&secret='+secret+'&js_code='+tempCode+'&grant_type=authorization_code',
          url:'',
          method:"GET",
          data:{},
          success(res){
            console.log(res)  
          }
        })
      }
    })
  },
  //获得用户的openID
  getUserOpenID:function(e){
    const that =this
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          openID:res.result.openid,
        })
        console.log("获取到OpenID: "+this.data.openID)
        //判断用户是否绑定了手机
        that.checkUserBindingPhone()
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
    //检查是否绑定了手机
    // this.checkUserBindingPhone()
    // var phoneIsBinded=this.data.phoneIsBinded
    // if(phoneIsBinded){
    //   wx.navigateTo({
    //     url: '../Donation/Donation',
    //   })
    // }else{
    //   console.log("请绑定手机号码")
    // }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("hello")
    this.myTabBar=this.selectComponent("#middleNum");

    this.getUserPermmission()
    //获取openID
    // this.getUserOpenID()
    //
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