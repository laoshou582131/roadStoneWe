// pages/ReturningBookInDate/ReturningBookInDate.js
Page({
  data: {
    length:8,
    //基本信息
    openID:"wxid_6j6ff0aaplne11",
    page:1,
    limit:10,
    bookItemList:[],
    selectToReturnBooksList:[],//选择要选择还书的list

    //滚动页面
    isTriggered:true
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
  getMoreBooks(userID,page,limit){
    console.log("getMoreBooks:"+openID+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllLegalBorrowingBooks',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        user_id:userID,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        //将第新页的内容给加进来
        var newBookItems=res.data.data.book_list
        var tempCurrentBookItems=that.data.bookItemList
        tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
        // console.log(tempCurrentBookItems)
        that.setData({
          bookItemList:tempCurrentBookItems
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
    }, 600);
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
    if(selectToReturnBooksList!=""){
      wx.request({
        url: 'https://qjnqrmlhidqj4nv8.jtabc.net/returnBooks',
        method:"POST",
        data:{
          open_id:openID,//用户的id
          book_list:selectToReturnBooksList
        },
        success:function(res){
          console.log(res.data)
          if(res.data.code==1){
            var enCodeList=res.data.data.book_encode_code_list
            wx.navigateTo({
              url: '../QRCodeProduce/QRCodeProduce?enCodeList='+enCodeList.toString(),
            })
          }else{
            console.log("还书失败")
          }
        },
        fail:function(res){
          console.log("fail, "+res.data)
        }
      })
    }else{
      wx.showToast({
        title: '未选择归还书籍',
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //获取用户的合法借书列表
  getUserBorrowInDate(userID,page,limit){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllLegalBorrowingBooks',
      method:"POST",
      data:{
        user_id:userID,
        page:page,
        limit:limit
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==1){
          console.log(res.data.msg)
        }else if(res.data.code==2){
          console.log(res.data.msg)
        }else{
          console.log(res.data.msg)
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
    this.getUserID()
  },
  //获取用户的userID并查找器借阅列表
  getUserID(){
    var that=this
    wx.getStorage({
      key:"userID",
      success(res){
        console.log("通过key拿到了其value:")
        console.log(res)
        var theUserID=res.data
        var limit=that.data.limit
        that.setData({
          userID:theUserID,
          //设置初始化page页面
          page:1
        })
        that.getUserBorrowInDate(theUserID,1,limit) //默认从page=1开始搜索
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