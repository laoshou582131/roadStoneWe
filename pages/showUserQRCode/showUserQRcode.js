// pages/showUserQRCode/showUserQRcode.js
//引入二维码生成js文件
let QRCode=require("../../utils/weapp.qrcode.min.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'', //用户的openID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户的openID
    var openID=options.openID
    // console.log(openID)
    //将openID转化为二维码
    // this.drawCode(openID)
    this.drawCode(123)

  },
  //画图
  drawCode:function(openID){
    QRCode({
      width:200,
      height:200,
      canvasId:"myQrcode",
      text:openID
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