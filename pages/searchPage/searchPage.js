// pages/searchPage/searchPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索的基本信息
    searchContent:"",
    searchPage:1,
    limit:10,
    searchReturnContent:[],
    haveReturnContent:false

  },
  //进行搜索
  onSubmitSearch:function(e){
    console.log("按下搜索按钮")
    console.log(e.detail.value)
    var searchContent1=e.detail.value
    if(searchContent1!=null)
      {
        if(searchContent1!="")
        {
          //获得localID
          var theLocalID=wx.getStorageSync('localID')
          this.goSearching(searchContent1,this.data.searchPage,this.data.limit,theLocalID)
        }else{
          wx.showToast({
            title: '搜索不能为空...',
          })
          this.setData({
            searchContent:""
          })
        }
      }
    else{
      wx.showToast({
        title: '搜索不能为空...',
      })
      this.setData({
        searchContent:""
      })
    }
  },
  goSearching(search,page,limit,localID){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getSearchBookName',
      method:"GET",
      data:{
        //search,page,limit,local_id
        search:search,
        page:page, //新的页面
        limit:limit, //默认10个
        local_id:localID
      },
      success:function(res){
        console.log(res.data)
        //给searchReturnContent和haveReturnContent赋值
      },
      fail:function(res){
        //searchReturnContent赋空值
        that.setData({
          searchReturnContent:[],
          haveReturnContent:false
        })
      }
    })
  },

  //翻页
  paging:function(){
    console.log("paging")
    var tempPage=this.data.searchPage+1
    this.setData({
      searchPage:tempPage
    })
    console.log(this.data.searchPage)
    //获得更多有关搜索内容的信息
    this.getMoreBooks(this.data.searchContent,this.data.searchPage,this.data.limit)
  },
  //获得更多有关搜索内容的信息
  getMoreBooks(searchContent,page,limit){
    console.log("getMoreBooks:"+searchContent+","+page+","+limit)
    console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getSearchBookName',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        search:searchContent,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        //将第新页的内容给加进来
        var newBookItems=res.data.data.book_list
        var tempCurrentBookItems=that.data.searchReturnContent
        tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
        // console.log(tempCurrentBookItems)
        that.setData({
          searchReturnContent:tempCurrentBookItems
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