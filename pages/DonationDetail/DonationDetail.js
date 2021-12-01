// pages/DonationDetail/DonationDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //基本信息
    openID:"wxid_6j6ff0aaplne11",
    page:1,
    limit:10,
    DonateItemList:[],

    //获取的捐赠信息
    donateMoneyID:0,
    donateMoneyState:0,
    donateMoneyTime:0,
    donateMoneyValue:0,
    orderID:0,
    orderReturnTime:0,
    userID:0
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
        //获取过期的书籍列表
        this.getUserDonationInfo(this.data.openID,this.data.page,this.data.limit)
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
    this.getMoreDonations(this.data.openID,this.data.page,this.data.limit)
  },
  //获得更多有关搜索内容的信息
  getMoreDonations(openID,page,limit){
    console.log("getMoreDonations:"+openID+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllDonationMoneyRecord',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        open_id:openID,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log("getMoreDonationsInfo:")
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //重置参数
    //1获取openID
    this.getUserOpenID()
    //2，设置初始页面page=1
    
    // this.getUserDonationInfo(this.data.openID,this.data.page,this.data.limit)
  },
  //获取用户的合法借书列表
  getUserDonationInfo(openID,page,limit){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllDonationMoneyRecord',
      method:"POST",
      data:{
        open_id:openID,
        page:page,
        limit:limit
      },
      success:function(res){
        console.log(res.data) //donate_money_list
        var DonateItemList1=res.data.data.donate_money_list
        console.log(DonateItemList1)
        //赋值给bookItemList
        that.setData({
          DonateItemList:DonateItemList1
        })
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