// pages/ReturningBook/ReturningBook.js
//引入二维码生成js文件
// let QRCode=require("../../utils/weapp.qrcode.min.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    length:8,

    //基本信息
    page:1,//默认要第一页的准备借阅内容
    limit:10,//默认每一页内容为10个items
    // open_id:"wxid_6j6ff0aaplne11"
    openID:"wxid_6j6ff0aaplne11",//用户的id。
    userID:"",

    //用户借阅情况
    booksList:[],
    selectToReturnBooksList:[],//用户所选择的即将要归还之书籍
    enCodeList:[],//用作还书的二维码生成的基本信息。

    //滚动页面
    isTriggered:true
  },
  //选择准备归还的书籍checkBox事件
  selectReadyToReturnBooks:function(e){
    console.log(e.detail.value) //checkBox的所选的数组，其元素为value.
    var readyToReturnList=e.detail.value //选择的书籍。
    this.setData({
      selectToReturnBooksList:readyToReturnList
    })
  },
  //点击还书按钮
  returnTheBook:function(e){
    const that=this
    var openID=this.data.openID
    var selectToReturnBooksList=this.data.selectToReturnBooksList.toString()
    //若有选择书籍
    if(selectToReturnBooksList!="")
    {
      wx.request({
        url: 'https://qjnqrmlhidqj4nv8.jtabc.net/returnBooks',
        method:"POST",
        data:{
          open_id:openID,//用户的id
          book_list:selectToReturnBooksList
        },
        success:function(res){
          console.log(res.data)
          try{
            if(res.data.code==1){
              //获取返回到的信息，并通过该信息传到QRCodeProduce页面生成二维码
              var enCodeList=res.data.data.book_encode_code_list
              console.log(enCodeList)
              wx.navigateTo({
                url: '../QRCodeProduce/QRCodeProduce?enCodeList='+enCodeList.toString(),
              })
              
            }else{
              console.log("获取数据失败")
            }
          }catch(err){
            console.log("点击还书时 error: "+err)
          }
        },
        fail:function(res){
          console.log("fail, "+res.data)
        }
      })
    }else{
      wx.showToast({
        title: '未选择归还书籍',
        icon:'error'
      })
    }
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
    this.getMoreBooks(this.data.userID,this.data.page,this.data.limit)
  },
  getMoreBooks(userID,page,limit){
    console.log("getMoreBooks:"+userID+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllBorrowingBooks',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        user_id:user_id,
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
    }, 600);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //获取用户当前所借阅的书籍
  getReadyBorrowingBooks(page,userID,limit){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllBorrowingBooks',
      method:"POST",
      data:{
        page:page, //新的页面
        user_id:userID,//用户的id
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        //赋值
        that.setData({
          booksList:res.data.data.book_list
        })
        console.log("当前借阅的书籍："+that.data.booksList)
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
    this.setData({
      page:1
    })
    this.getUserID()
  },
  //获取用户的userID
  getUserID(){
    var that=this
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
        //获得用户的基本信息，捐赠的书籍数量，捐赠信息等。
        that.getReadyBorrowingBooks(1,theUserID,limit)
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