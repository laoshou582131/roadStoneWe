// pages/bookDetail/BookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookID:"",
    bookCode:"",

    openID:"",
    userID:"",

    //该书籍的所有信息,一个对象。
    theBook:{}
  },
  //加入愿望书单
  addBookWishList(){
    var that=this
    var userID=this.data.userID
    var bookID=this.data.bookID
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/addBook',
      method:"POST",
      data:{
        user_id:userID,
        book_id:bookID
      },
      success:function(res){
        console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: '已加入书单',
            icon:"success"
          })
        }else{
          wx.showToast({
            title: '加入失败',
            icon:"success"
          })
        }
       
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
    // console.log(options)
  },
  //根据bookID获得书籍详情
  getBookDetailById(bookID,localID){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBookDetailFromSearch',
      method:"GET",
      data:{
        //传递bookID 或bookCode给后台
        book_id:bookID,
        local_id:localID
      },
      success:function(res){
        //获得该书的详情信息。
        console.log("书籍详情:")
        console.log(res.data)
        if(res.data.code==1){
          var theBook1=res.data.data.book
          // console.log(theBook.book_author)
          that.setData({
            theBook:theBook1 //获得书的所有内容
          })
        }else{
          console.log("获取书籍详情信息失败")
          wx.showModal({
            title:"失败",
            content:res.data.msg
          })
        }
      }
    })
  },
  //
    //根据bookID获得书籍详情
    // getBookDetailByCode(bookCode){
    //   wx.showToast({
    //     title: '获取'+bookCode,
    //   })
    //   const that=this
    //   wx.request({
    //     url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBookDetailFromScan',
    //     method:"GET",
    //     data:{
    //       //传递bookID 或bookCode给后台
    //       book_code:bookCode
    //     },
    //     success:function(res){
    //       //获得该书的详情信息。
    //       console.log(res.data)
    //       if(res.data.code==1){
    //         var theBook1=res.data.data.book
    //         // console.log(theBook.book_author)
    //         that.setData({
    //           theBook:theBook1 //获得书的所有内容
    //         })
    //       }else{
    //         console.log("获取书籍详情信息失败")
    //       }
  
    //     }
    //   })
    // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取到了bookClassification传来的bookID
    let pages=getCurrentPages() //当前页面
    console.log(pages)
    let currentPage=pages[pages.length-1]
    console.log(currentPage.options) 
    var bookID1=currentPage.options.bookId
    //保存bookID
    this.setData({
      bookID:bookID1
    })

    //获取用户的userID
    this.getUserID()
    var localID=wx.getStorageSync('localID')
    //获得书籍的详情页面
    this.getBookDetailById(bookID1,localID)
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