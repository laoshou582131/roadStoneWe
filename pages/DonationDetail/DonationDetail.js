// pages/DonationDetail/DonationDetail.js
Page({
  data: {
    //基本信息
    openID:"",
    userID:"",
    page:1,
    limit:20,
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
  //翻页
  paging:function(){
    console.log("paging")
    var tempPage=this.data.page+1
    this.setData({
      page:tempPage
    })
    console.log(this.data.page)
    //获得更多有关搜索内容的信息

    var userID=this.data.userID
    var page=this.data.page
    var limit=this.data.limit
    this.getMoreDonations(userID,page,limit)
  },
  //获得更多有关搜索内容的信息
  getMoreDonations(userID,page,limit){
    console.log("getMoreDonations:"+userID+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllDonationRecord',
      method:"POST",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        user_id:userID,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log("成功获取捐赠记录")
        console.log(res.data)
        //将第新页的内容给加进来
        var newBookItems=res.data.data.donate_money_list
        console.log(newBookItems.length)
        if(newBookItems.length!=0)
        {
          var tempCurrentBookItems=that.data.DonateItemList
          tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
          // console.log(tempCurrentBookItems)
          that.setData({
            DonateItemList:tempCurrentBookItems
          })
        }
      }
    })
  },

  //bindRefresherRefresh
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
    //重置参数
    //1获取openID
    // this.getUserOpenID()
    //2，设置初始页面page=1
    
    // this.getUserDonationInfo(this.data.openID,this.data.page,this.data.limit)
  },
  //获取用户的合法借书列表
  getUserDonationInfo(userID,page,limit){
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllDonationRecord',
      method:"POST",
      data:{
        user_id:userID,
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
    this.getUserID()
    //初始化page
    this.setData({
      page:1
    })
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
        //获得用户的基本信息，捐赠的书籍数量，捐赠信息等。
        var page=that.data.page
        var limit=that.data.limit
        //获取用户的捐赠信息
        that.getUserDonationInfo(theUserID,1,limit)
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