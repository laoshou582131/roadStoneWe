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
    isBinded:false,

    //轮播图数组
    picList:[]
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
            isBinded:true
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
    this.checkUserBindingPhone()
    wx.navigateTo({
      url: '../Donation/Donation',
    })
  },


  //定义扫码方法
  goScan:function(){
    //判断是否绑定手机
    this.checkUserBindingPhone()
    //判断是否可以借书
    // this.checkUserBorrowingRight(this.data.openID)
    //scan书籍
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
    //获取openID
    this.getUserOpenID()
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