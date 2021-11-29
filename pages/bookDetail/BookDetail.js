// pages/bookDetail/BookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookID:"",
    // nodes:[
    //   {
    //     name:'div',
    //     attrs:{
    //       style:'line-height:60rpx; color:black; font-size:12px;'
    //     },
    //     children:[
    //       {
    //         type:'text',
    //         text:"Hello world! This is a reall long passage, you might take a lot of time to do the following reading."
    //       }
    //     ]
    //   }
    // ]
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
  },
  //根据bookID获得书籍详情
  getBookDetailById(bookID){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBookDetail',
      method:"GET",
      data:{
        //传递bookID 或bookCode给后台
         //未完成
      },
      success:function(res){
        //获得该书的详情信息。
        //未完成
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