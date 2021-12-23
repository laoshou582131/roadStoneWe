// pages/contactUs/contactUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //访问contact获取海报
  getContact(){
    wx.request({
      url:'https://qjnqrmlhidqj4nv8.jtabc.net/getContact',
      method:"GET",
      success(res){
        console.log(res)
      },
    })
  },
  //复制电话号码
  copyPhone(){
    var phone="027-68752313"
    wx.setClipboardData({
      data: phone,
      success(res){
        //获取其内容
        wx.getClipboardData({
          success(option){
            console.log(option.data)
          },
        })
      }
    })
  },
  copyEmail(){
    var email="ldyef@qq.com"
    wx.setClipboardData({
      data: email,
      success(res){
        //获取其内容
        wx.getClipboardData({
          success(option){
            console.log(option.data)
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContact()
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

})