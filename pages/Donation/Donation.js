// pages/Donation/Donation.js
Page({
  data: {
    openID:"",
    payResult:{},//获取的支付信息。
    
    moneyAmount:0,
    needNote:"true",

    //基本信息
    userName:"",
    userPhone:"",
    userEmail:"",
  },
  //设置金钱数量
  set200Amount(){
    this.setData({
      moneyAmount:200
    })
  },
  set500Amount(){
    this.setData({
      moneyAmount:500
    })
  },
  set1000Amount(){
    this.setData({
      moneyAmount:1000
    })
  },
  
    //判断用户是否绑定了手机
    // checkUserBindingPhone:function(){
    //   // var openID=this.data.openID
    //   var that=this
    //   var openID="wxid_6j6ff0aaplne11" //
    //   wx.request({
    //     url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserPhone',
    //     method:"POST",
    //     data:{
    //       open_id:openID
    //     },
    //     success:function(res){
    //       console.log(res.data)
    //       if(res.data.code==1){
    //         console.log(res.data.msg)
    //         //是绑定了
    //         that.setData({
    //           phoneIsBinded:true
    //         })
    //       }else if(res.data.code==2){
    //         wx.showModal({
    //           title:res.data.msg,
    //           content:"请前往绑定手机号",
    //           cancelColor: 'red',
    //           success:function(res){
    //             console.log(res)
    //             if(res.confirm){
    //               //为绑定手机，前往绑定
    //               wx.navigateTo({
    //                 url: '../phoneCertification/phoneCertification',
    //               })
    //             }else{
    //               console.log("选择了取消")
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // },

  //前往捐赠记录页面
  goDonationRecord:function(){
    wx.navigateTo({
      url: '/pages/DonationDetail/DonationDetail',
    })
  },
  //获取捐赠的基本信息，金额，姓名，电话，邮箱
  submitTheDonateInfo(e){
    //检查内容是否为空
    console.log(e) //value: {moneyAmount: "0", userName: "1", userPhone: "1", userEmail: "1"}
    var moneyAmount=e.detail.value.moneyAmount
    var userName=e.detail.value.userName
    var userPhone=e.detail.value.userPhone
    var userEmail=e.detail.value.userEmail

    //设置数据
    this.setData({

    })
  },
  //是否需要电子发票
  needNoteOrNot:function(e){
    console.log(e)
    var needNote=e.detail.value
    console.log("needNote:"+needNote)
  },
  //去捐赠
  doDonate:function(){
    console.log("进入doDonate")
    var theResult=this.data.payResult //里面含有用户的基本捐赠信息，姓名，金额，电话
    var nonceStr=theResult.nonce_str.toString()
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
        console.log("doDonate成功！")
        console.log(res.data)
      },
      fail:function(res){
        console.log("支付失败")
        console.log(res)
      }
    })
  },
  //获取捐赠信息 成功并触发doDonate方法。
  getDonateSignInfoAndDonate:function(){
    var that =this
    var openID=this.data.openID
    var moneyValue=this.data.moneyAmount
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/doDonation',
      method:"POST",
      data:{
        // "wxid_6j6ff0aaplne11"
        open_id:openID,
        // money_value:0.1
        money_value:moneyValue
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
    //获取用户的openID
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
              //得到openID后，可以进行捐赠
              that.getDonateSignInfoAndDonate()
            },
            fail(res){
              console.log("获取用户openID失败")
              console.log(res)
            }
          })
        }
      })
    },

    //输入时刷新金额
    updateMoney(e){
      console.log(e)
      var currentMoney=e.detail.value
      this.setData({
        moneyAmount:currentMoney
      })
    },
    updateName(e){
      console.log(e)
      var currentName=e.detail.value
      this.setData({
        userName:currentName
      })
    },

    //点击捐赠按钮时的预检查
    readyToDonate(){
      //判断金额是否为0，以及名字是否填写
      var moneyAmount=parseInt(this.data.moneyAmount)
      console.log(moneyAmount)
      var userName=this.data.userName
      if(moneyAmount!=0){
        if(userName!=""){
          //若金额不为0且名字不为空，则可以捐款
          console.log("成功捐款")
          // this.getUserPermmission()
        }else{
          wx.showToast({
            title: '请填写名字',
            icon:"error"
          })
        }
      }else{
        wx.showToast({
          title: '金额不能为0',
          icon:"error"
        })
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得OpenID
    // this.getUserOpenID()
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