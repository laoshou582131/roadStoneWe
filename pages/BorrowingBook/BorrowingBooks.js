// pages/BorrowingBook/BorrowingBooks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,//默认要第一页的准备借阅内容
    limit:10,//默认每一页内容为10个items
    // open_id:"wxid_6j6ff0aaplne11"
    openID:"",//用户的id。
    userID:"",

    //准备借阅的书籍列表
    booksList:[],
    bookID:"",

    //选中的准备要借阅的书籍
    selectedBookList:[],

    //滚动页面
    isTriggered:true
  },
  //准备借一堆书
  goBorrowTheseBook:function(e){
    //先检查看看能不能结束
    var userID=this.data.userID
    //若合法则借书，否则提示不可借书之原因。
    this.checkUserBorrowingRight(userID)

    //
    // var userID=that.data.userID
    // var bookIDs=that.data.selectedBookList.toString()
    // console.log(userID,bookIDs)
    // //生成二维码
    // wx.navigateTo({
    //   url: '../QRCodeProduce/QRCodeProduce?userID='+userID+'?bookIDs='+bookIDs,
    // })
    
  },
  //判断用户是否能够借书
  checkUserBorrowingRight(userID){
    var that=this
    console.log("userID:"+userID)
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserBorrowingStatus',
      method:"POST",
      data:{
        user_id:userID
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          //允许借书，将userID和bookIDs生成二维码
          var userID=that.data.userID
          var bookIDs=that.data.selectedBookList.toString()
          console.log(userID,bookIDs)
          // var list=[{"userID":userID},{"bookList":bookIDs}]
          // //生成二维码
          // wx.navigateTo({
          //   url: '../QRCodeProduce/QRCodeProduce?list='+list,
          // })
          
          
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
          // //不是会员，会员过期，不允许借书
          // wx.showToast({
          //   title: res.data.msg,
          //   icon:'error',
          //   duration:1500
          // })
          //请前往捐赠页面，成为会员
          wx.showModal({
            title:res.data.msg,
            content:"请前往捐赠页面",
            cancelColor: 'red',
            success:function(res){
              console.log(res)
              if(res.confirm){
                //为绑定手机，前往绑定
                wx.navigateTo({
                  url: '../Donation/Donation',
                })
              }else{
                console.log("选择了取消")
              }
            }
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
  //scroll-view的paging方法
  paging:function(){
    console.log("paging")
    var tempPage=this.data.page+1
    this.setData({
      page:tempPage
    })
    console.log(this.data.page)
    //获得更多有关搜索内容的信息
    this.getMoreBooks(this.data.userID,this.data.page,this.data.limit)
  },
  getMoreBooks(userID,page,limit){
    console.log("getMoreBooks:"+userID+","+page+","+limit)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getWholeReadyBorrowingBook',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        user_id:userID,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          //将第新页的内容给加进来
          var newBookItems=res.data.data.book_list
          var tempCurrentBookItems=that.data.booksList
          tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
          // console.log(tempCurrentBookItems)
          that.setData({
            booksList:tempCurrentBookItems
          })
        }else if(res.data.code==2){
          console.log(res.data.msg)
        }else{
          console.log(res.data.msg)
        }
      }
    })
  },
   //滚动页面上拉
   bindRefresherRefresh:function(){
    setTimeout(() => {
      this.setData({
        isTriggered:false
      })
    }, 600);
  },

  //前往删除页面
  goDeleteManage:function(){
    wx.navigateTo({
      url: '/pages/DeleteBorrowingBook/DeleteBorrowingBook',
    })
  },
  //监听用户选了哪些书籍并更新selectedBookList
  getSelectedBook:function(e){
    console.log(e.detail)
    console.log("选中的是："+e.detail.value)
    this.setData({
      selectedBookList:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户当前所选，准备要借阅的书籍
  getReadyBorrowingBooks(page,userID,limit){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getWholeReadyBorrowingBook',
      method:"POST",
      data:{
        //page.user_id,limit
        page:page, //新的页面
        user_id:userID,//用户的id
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        that.setData({
          booksList:res.data.data.book_list
        })
        console.log("待借书籍："+that.data.booksList)
      },
      fail:function(res){
        console.log("fail, "+res.data)
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
    //设置page的初始值
    this.setData({
      page:1
    })
    //获取用户的userID以及查询用户准备借阅的书籍列表。
    this.getUserID()
  },
  //获取用户的userID
  getUserID(){
    var that=this
    var page=this.data.page
    var limit=this.data.limit
    wx.getStorage({
      key:"userID",
      success(res){
        console.log("通过key拿到了其value:")
        console.log(res)
        var theUserID=res.data
        that.setData({
          userID:theUserID
        })
        //获取用户准备借阅的书籍列表
        that.getReadyBorrowingBooks(page,theUserID,limit)
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