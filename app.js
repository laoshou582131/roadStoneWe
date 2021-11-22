// app.js
App({
  onLaunch() {
    //指定云开发环境
    wx.cloud.init({
      env:'cloud1-8gx6mw0v3144daf4',
      traceUser:true //保管用户信息。
    })
    // // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

  },
  onShow:function(){
    //隐藏小程序自己的tabBar
    wx.hideTabBar()
  },
  globalData: {
    userInfo: null
  }
})


