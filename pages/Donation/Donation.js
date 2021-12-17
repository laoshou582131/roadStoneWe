// pages/Donation/Donation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:"wxid_6j6ff0aaplne11",
    payResult:{},//获取的支付信息。
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
  //前往捐赠记录页面
  goDonationRecord:function(){
    wx.navigateTo({
      url: '/pages/DonationDetail/DonationDetail',
    })
  },
  //去捐赠
  doDonate:function(){
    var theResult=this.data.payResult
    var nonceStr=theResult.nonce_str
    var package1=theResult.package
    var paySign=theResult.pay_sign
    var timeStamp=theResult.time_stamp
    var signType=theResult.sign_type
    wx.requestPayment({
      nonceStr: nonceStr,
      package: package1,
      paySign: paySign,
      signType:signType,
      timeStamp: timeStamp,

      success:function(res){
        console.log(res.data)
      }
    })
  },
  //获取捐赠信息 成功并触发doDonate方法。
  getDonateSignInfoAndDonate:function(){
    var that =this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/doDonation',
      method:"POST",
      data:{
        open_id:"wxid_6j6ff0aaplne11",
        money_value:100
      },
      success:function(res){
        console.log(res)
        //获取信息成功
        if(res.data.data.result.code==1){
          //成功
          var theResult=res.data.data.result
          //获取到捐赠前的信息准备，时间戳，签名等信息。
          that.setData({
            payResult:theResult
          })
          //去捐赠
          that.doDonate()
          
        }else{
          //result的code为0，失败
          console.log("捐赠前的验证信息获取失败")
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得OpenID
    this.getUserOpenID()
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