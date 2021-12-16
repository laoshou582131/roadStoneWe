// pages/phoneCertification/phoneCertification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:"wxid_6j6ff0aaplne11",
    phoneNumber:"",
    code:"",
    isGettingTheCode:false,
    time:5,
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
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
  //提交验证码和手机号
  submitPhoneAndCode:function(e){
    console.log("上传手机号和code")
    console.log(e)
    var phoneNum=e.detail.value.thePhone
    var code=e.detail.value.theCode
    var openID=this.data.openID
    // console.log(phoneNum,code)
    if(phoneNum=="" ||code==""){
      console.log("手机号或验证码不能为空")
    }else{
      wx.request({
        url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkBindingCode',
        method:"POST",
        data:{
          code:code,
          phone_number:phoneNum,
          open_id:openID
        },
        success:function(res){
          console.log(res.data)
          if(res.data.code==1){
            // console.log("成功...")
            wx.showModal({
              title:"绑定手机成功！",
              // cancelColor: 'red',
              showCancel:false,
              success:function(res){
                if(res.confirm){
                  wx.navigateBack({
                    delta: 1,
                  })
                }else{
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              }
            })
          }else if(res.data.code==2){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==3){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==4){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==5){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==6){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }
        }
      })
    }
  },
  //获取验证码
  getTheCodeTest:function(){
    //设置验证码样式
    this.setGettingCodeStyle()
  },
  getTheCode:function(e){
    //判断是否输入电话号码
    var phoneNum=this.data.phoneNumber
    var openID=this.data.openID
    if(phoneNum==""){
      wx.showToast({
        title: '电话号码不能为空',
        icon:"error",
        duration:1000
      })
    }else{
      //设置验证码样式
      this.setGettingCodeStyle()

      wx.request({
        url: 'https://qjnqrmlhidqj4nv8.jtabc.net/bindingUserPhoneNumber',
        method:"POST",
        data:{
          phone_number:phoneNum,
          open_id:openID
        },
        success:function(res){
          console.log(res.data)
          if(res.data.code==1){
            console.log("成功，正在发送验证码")
          }else if(res.data.code==2){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==3){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else if(res.data.code==4){
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:"error",
              duration:1000
            })
          }
        }
      })
    }
  },
  //设置验证码样式
  setGettingCodeStyle:function(){
    var that =this
    this.setData({
      isGettingTheCode:true
    })
    var interval=setInterval(function(){
      var time=this.data.time
      console.log("hee")
      if(time>0){
        this.setData({
          time:time-1
        })
        console.log(this.data.time+"s")
      }else if(time==2){
        //60s后重置
        clearInterval(interval)
        this.setData({
          time:60,
          isGettingTheCode:false
        })
      }else{
        //60s后重置
        clearInterval(interval) //自己删除自己。
        this.setData({
          time:60,
          isGettingTheCode:false
        })
      }
      
      //每秒执行一次
    }.bind(this),1000)

  },
  inputThePhoneNumber:function(e){
    console.log(e)
    var phoneNumber=e.detail.value
    // console.log(phoneNumber)
    //传入电话参数
    this.setData({
      phoneNumber:phoneNumber
    })
  },
  inputTheCode:function(e){
    console.log(e)
    var code=e.detail.value
    // console.log(code)
    this.setData({
      code:code
    })
  },

  //取消回主页
  cancelBackHome:function(){
    wx.navigateBack({
      delta: 1,
    })
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

  }
})