// pages/showUserQRCode/showUserQRcode.js
//引入二维码生成js文件
let QRCode=require("../../utils/weapp.qrcode.min.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'', //用户的openID
    userID:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //画图
  drawCode:function(userID){
    QRCode({
      width:200,
      height:200,
      canvasId:"myQrcode",
      text:userID
    })
  },
  goBack(){
    //返回上一个页面
    wx.navigateBack({
      delta: 1,
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
    this.getUserID()
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
          //获取了userID后并画图
          that.drawCode(theUserID)
          
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