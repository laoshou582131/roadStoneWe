// pages/QRCodeProduce/QRCodeProduce.js
//引入二维码生成js文件
let QRCode=require("../../utils/weapp.qrcode.min.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //返回上一层
  goBack:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("传过来的参数为："+options.enCodeList)
    var enCodeList=options.enCodeList
    //生成二维码
    this.drawCode(enCodeList)
  },
  drawCode:function(theEnCode){
    QRCode({
      width:230,
      height:230,
      canvasId:"myQrcode",
      // text:"https://github.com/yingye",
      text:theEnCode
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