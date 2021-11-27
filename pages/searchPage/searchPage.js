// pages/searchPage/searchPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索的基本信息
    searchContent:"",
    searchPage:1,
    limit:10

  },
  //搜索
  onSubmitSearch:function(e){
    console.log(e.detail.value)
    var searchContent1=e.detail.value
    if(searchContent1==null)
    {
      wx.showToast({
        title: '搜索不能为空...',
      })
      this.setData({
        searchContent:""
      })
    }else{
      this.setData({
        searchContent:searchContent1
      })
      this.goSearching(searchContent1,this.data.searchPage,this.data.limit)
    }
    // console.log(this.data.searchContent)
  },
  goSearching(search,page,limit){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getSearchBookName',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        search:search,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        
      }
    })
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