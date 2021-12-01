// pages/BorrowingBook/BorrowingBooks.js
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

    //选中的准备要借阅的书籍
    selectedBookList:[]
  },
  //准备借一堆书
  goBorrowTheseBook:function(e){
    //先检查看看能不能结束
    this.checkUserBorrowingRight()
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
  checkUserBorrowingRight(){
    var that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/checkUserBorrowingStatus',
      method:"POST",
      data:{
        open_id:"wxid_6j6ff0aaplne11"
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
  //前往删除页面
  goDeleteManage:function(){
    wx.navigateTo({
      url: '/pages/DeleteBorrowingBook/DeleteBorrowingBook',
    })
  },
  //监听用户选了哪些书籍并更新selectedBookList
  getSelectedBook:function(e){
    console.log("选中的是："+e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户openID
    this.getUserOpenID()
    let page=this.data.page
    let limit=this.data.limit
    let openID=this.data.openID
    this.getReadyBorrowingBooks(page,openID,limit)

  },
  //获取用户当前所选，准备要借阅的书籍
  getReadyBorrowingBooks(page,openID,limit){
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