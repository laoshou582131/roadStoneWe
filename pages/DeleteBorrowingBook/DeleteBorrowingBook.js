// pages/DeleteBorrowingBook/DeleteBorrowingBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,//默认要第一页的准备借阅内容
    limit:10,//默认每一页内容为10个items
    // open_id:"wxid_6j6ff0aaplne11"
    openID:"wxid_6j6ff0aaplne11",//用户的id。

    //准备借阅的书籍列表
    booksList:[],
    bookID:"",

    //选中的准备要删除的书籍
    selectedBookList:[]
  },
  //获得用户的openID
  getUserOpenID:function(e){
    const that =this
    var page=this.data.page
    var limit=this.data.limit
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          openID:res.result.openid,
        })
        console.log("获取到OpenID: "+this.data.openID)
         //获取用户所要准备借阅的书籍
         //"wxid_6j6ff0aaplne11"
        this.getReadyBorrowingBooks(page,"wxid_6j6ff0aaplne11",limit)
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
  //完成删除，回到借阅页面
  finishDeletion:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  //删除选中的书籍
  selectReadyToDeleteBooks:function(e){
    console.log(e.detail.value) //checkBox的所选的数组，其元素为value.
    var readyToDeleteList=e.detail.value
    this.setData({
      selectedBookList:readyToDeleteList
    })
  },
  //删除所选择的书籍
  deleteTheseBooks:function(){
    // const that =this
    var openID=this.data.openID
    var selecctedBookList=this.data.selectedBookList.toString()
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/delBook',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        open_id:openID,
        book_list:selecctedBookList
      },
      success:function(res){
        console.log(res.data)
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
    this.getMoreBooks(this.data.openID,this.data.page,this.data.limit)
  },
  getMoreBooks(openID,page,limit){
    console.log("getMoreBooks:"+openID+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getWholeReadyBorrowingBook',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        open_id:openID,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        //将第新页的内容给加进来
        var newBookItems=res.data.data.book_list
        var tempCurrentBookItems=that.data.booksList
        tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
        // console.log(tempCurrentBookItems)
        that.setData({
          booksList:tempCurrentBookItems
        })

      }
    })
  },
   //滚动页面上拉
   bindRefresherRefresh:function(){
    setTimeout(() => {
      this.setData({
        isTriggered:false
      })
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户的openID
    this.getUserOpenID()
    // //获取用户所要准备借阅的书籍
    // this.getReadyBorrowingBooks(this.data.page,this.data.openID,this.data.limit)
  },
  //获取用户当前所选，准备要借阅的书籍
  getReadyBorrowingBooks(page,openID,limit){
    console.log("Ready...")
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getWholeReadyBorrowingBook',
      method:"POST",
      data:{
        page:page, //新的页面
        open_id:openID,//用户的id
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          that.setData({
            booksList:res.data.data.book_list
          })
          console.log("待借书籍："+that.data.booksList)
        }else if(res.data.code==2){
          console.log(res.data.msg)
        
        }else{
          console.log("获取待借书籍信息出错")
        }
        
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