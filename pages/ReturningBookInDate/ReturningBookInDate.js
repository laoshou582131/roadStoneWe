// pages/ReturningBookInDate/ReturningBookInDate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:8,
    //基本信息
    openID:"wxid_6j6ff0aaplne11",
    page:1,
    limit:10,
    bookItemList:[],
    selectToReturnBooksList:[]//选择要选择还书的list
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
        //获取用户的合法借书列表
        this.getUserBorrowInDate(this.data.openID,this.data.page,this.data.limit) //"wxid_6j6ff0aaplne11",
        // this.getUserBorrowInDate("wxid_6j6ff0aaplne11",this.data.page,this.data.limit) 
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },
  //翻页
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
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllLegalBorrowingBooks',
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
        // var newBookItems=res.data.data.book_list
        // var tempCurrentBookItems=that.data.searchReturnContent
        // tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
        // // console.log(tempCurrentBookItems)
        // that.setData({
        //   searchReturnContent:tempCurrentBookItems
        // })

      }
    })
  },

  //选择要还的书籍
  selectReadyToReturnBooks:function(e){
    console.log(e.detail.value) //checkBox的所选的数组，其元素为value.
    var readyToReturnList=e.detail.value
    this.setData({
      selectToReturnBooksList:readyToReturnList
    })
  },
  //点击还书按钮
  returnTheBook:function(e){
    const that=this
    var openID=this.data.openID
    var selectToReturnBooksList=this.data.selectToReturnBooksList.toString()
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/returnBooks',
      method:"POST",
      data:{
        open_id:openID,//用户的id
        book_list:selectToReturnBooksList
      },
      success:function(res){
        console.log(res.data)
      },
      fail:function(res){
        console.log("fail, "+res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取user的openID
    this.getUserOpenID()
    //因为onLoad函数里面是异步的，所以最好将获取的书籍信息放在getUserOpenID中的success函数中。
    // //获取用户的合法借书列表
    // this.getUserBorrowInDate(this.data.openID,this.data.page,this.data.limit)
  },
  //获取用户的合法借书列表
  getUserBorrowInDate(openID,page,limit){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllLegalBorrowingBooks',
      method:"POST",
      data:{
        open_id:openID,
        page:page,
        limit:limit
      },
      success:function(res){
        console.log(res.data)
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