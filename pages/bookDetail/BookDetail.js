// pages/bookDetail/BookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookID:"",
    openID:"",

    //该书籍的所有信息,一个对象。
    theBook:{}
  },
  //借阅书籍
  goBorrowTheBook:function(e){
    //检查用户是否能够结束
    this.checkUserBorrowingRight(this.data.openID)
    //判断是否绑定手机号
    
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
  //判断用户是否能够借书
  checkUserBorrowingRight(openID){
    var that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserBorrowingStatus',
      method:"POST",
      data:{
        open_id:openID
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
    console.log("传递的BookID参数："+options.bookId)
    let bookId=options.bookId
    this.setData({
      bookID:bookId
    })
    //获取用户openID
    this.getUserOpenID()
    //根据获取到的bookID去查找
    this.getBookDetailById(bookId)
  },
  //根据bookID获得书籍详情
  getBookDetailById(bookID){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBookDetailFromSearch',
      method:"GET",
      data:{
        //传递bookID 或bookCode给后台
        book_id:bookID
      },
      success:function(res){
        //获得该书的详情信息。
        console.log(res.data)
        if(res.data.code==1){
          var theBook1=res.data.data.book
          // console.log(theBook.book_author)
          that.setData({
            theBook:theBook1 //获得书的所有内容
          })
        }else{
          console.log("获取书籍详情信息失败")
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