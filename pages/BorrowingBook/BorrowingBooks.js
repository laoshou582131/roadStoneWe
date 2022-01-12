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
    bookingList:[],//正在被预约的书籍
    inCartBooks:[],//仍在购物车中的书籍

    //选中的准备要借阅的书籍
    selectedBookList:[],
    isBooking:false,

    //滚动页面
    isTriggered:true

  },
  //准备借一堆书
  goBorrowTheseBook:function(e){
    //先检查看看能不能结束
    var userID=this.data.userID
    //若合法则借书，否则提示不可借书之原因。
    this.checkUserBorrowingRight(userID)
    
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
          var bookIDs=that.data.selectedBookList
          var limit=that.data.limit
          console.log("允许借书")
          // console.log(userID,bookIDs)
          //组装JSON格式
          var BookingJson={"user_id":userID,"book_list":bookIDs}
          var BookingJsonStr=JSON.stringify(BookingJson)
          console.log("BookingJSON:")
          console.log(BookingJson)
          console.log(BookingJsonStr)
          
          //准备借阅书籍
          wx.request({
            url: 'https://qjnqrmlhidqj4nv8.jtabc.net/bookingBook',
            method:"POST",
            data:{
              // BookingJson,
              user_id:userID,
              book_list:bookIDs
            },
            success:function(res){
              console.log(res)
              if(res.data.code==1){
                //设置page的初始值
                that.setData({
                  page:1
                })
                //刷新页面
                that.getReadyBorrowingBooks(1,userID,limit)
                wx.showToast({
                  title: '借阅成功！',
                  icon:"success",
                  duration:1000
                })
              }else{
                console.log("借阅失败")
                wx.showModal({
                  title:"借阅失败",
                  content:res.data.msg
                })
              }
            }
          })
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
  //删除愿望清单
  goCancelTheseBook(){
    var userID=this.data.userID
    var bookIDs=this.data.selectedBookList
    var limit=this.data.limit
    var that=this
    console.log(userID,bookIDs)

    wx.showModal({
      title:"提示",
      content:"确定要删除所选书籍？",
      success(res){
        console.log(res)
        if(res.confirm){
          console.log("确定删除")
          //删除所选书籍
          wx.request({
            url: 'https://qjnqrmlhidqj4nv8.jtabc.net/delBook',
            method:"POST",
            data:{
              user_id:userID,
              book_list:bookIDs
            },
            success(res){
              console.log(res)
              if(res.data.code==1){
                //删除成功
                //设置page的初始值
                that.setData({
                  page:1
                })
                 //刷新页面
                that.getReadyBorrowingBooks(1,userID,limit)

              }else{
                console.log("删除失败")
                wx.showModal({
                  title:"删除失败",
                  content:res.data.msg
                })
              }
            }
          })
        }else{
          console.log("点击取消")
        }
      }
    })
  },
  //删除正在预约中的书籍
  goCancelBookingBooks(){
    let that=this
    let userID=wx.getStorageSync('userID')
    let limit=that.data.limit
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/cancelBooking',
      method:'POST',
      data:{
        user_id:userID
      },
      success(res){
        if(res.data.code==1){
          console.log("删除预约中的书籍成功",res)
          //刷新页面
          //设置page的初始值
          that.setData({
            page:1,
            isBooking:false //重新设置默认页面
          })
          //刷新页面
          that.getReadyBorrowingBooks(1,userID,limit)
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
          // var newBookItems=res.data.data.book_list
          var newBookItems=[]
          var newInCartBooks=res.data.data.book_list.in_cart_book_list
          var newBookingList=res.data.data.book_list.boking_book_list

          //全部的书籍
          newBookItems=newBookItems.concat(newBookingList)
          newBookItems=newBookItems.concat(newInCartBooks)

          var tempCurrentBookItems=that.data.booksList
          let tempCurrentBookingList=that.data.bookingList
          let tempCurrentInCartBooks=that.data.inCartBooks
          tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
          // console.log(tempCurrentBookItems)
          that.setData({
            booksList:tempCurrentBookItems,
            bookingList:tempCurrentBookingList,
            inCartBooks:tempCurrentInCartBooks
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
  //获取用户当前所选，准备要借阅的书籍列表
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
        if(res.data.code==1){
          //获得正在预约的书籍和在购物车中的书籍
          let wholeBookList=[]
          let bookingList=res.data.data.book_list.boking_book_list
          let inCartBooks=res.data.data.book_list.in_cart_book_list
          wholeBookList=wholeBookList.concat(bookingList)
          wholeBookList=wholeBookList.concat(inCartBooks)
          //判断是否有预约的书籍，若有，则改变button的样式和功能。
          if(bookingList.length!=0){
            //改变样式
            that.setData({
              isBooking:true
            })
          }

          that.setData({
            booksList:wholeBookList,
            bookingList:bookingList,
            inCartBooks:inCartBooks

          })

        }
        // that.setData({
        //   booksList:res.data.data.book_list
        // })
        // console.log("待借书籍："+that.data.booksList)
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