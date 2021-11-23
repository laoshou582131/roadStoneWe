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