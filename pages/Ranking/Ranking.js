// pages/Ranking/Ranking.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rankType:"rank_reading", //rank_reading,rank_donate_money, rank_donate_book
    page:1,
    limit:10,

    //三个阅读选项
    isSelectedReading:true,
    isSelectedDBook:false,
    isSelectedDMoney:false,
    
    //用户排行榜Array
    userRankingList:[],

    //底部导航栏设置
    theSelected:1
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
    this.getMoreUserInfo(this.data.rankType,this.data.page,this.data.limit)
  },
  getMoreUserInfo(rankType,page,limit){
    console.log("getMoreUserInfo:"+rankType+","+page+","+limit)
    // console.log(searchContent)
    //去访问后端获取更多书籍
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllUserRanking',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        rank_type:rankType,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        //将第新页的内容给加进来
        var newUserRank=res.data.data.rank
        var tempCurrentRank=that.data.userRankingList
        tempCurrentRank=tempCurrentRank.concat(newUserRank) //与之前获取的书籍列表累加
        // console.log(tempCurrentBookItems)
        that.setData({
          userRankingList:tempCurrentRank
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


  //阅读磅
  selectReading:function(e){
    console.log(e.currentTarget.dataset.ranktype)
    var currentRankType=e.currentTarget.dataset.ranktype
    //设置当前要搜索的排行榜以及page的初始值
    this.setData({
      rankType:currentRankType,
      page:1,
      isSelectedReading:true,
      isSelectedDBook:false,
      isSelectedDMoney:false
    })
    var page=this.data.page
    var limit=this.data.limit
    //获取该排行榜
    this.getUserInfo(currentRankType,page,limit)
  },
  selectDonateBook:function(e){
    console.log(e.currentTarget.dataset.ranktype)
    var currentRankType=e.currentTarget.dataset.ranktype
    this.setData({
      rankType:currentRankType,
      page:1,
      isSelectedReading:false,
      isSelectedDBook:true,
      isSelectedDMoney:false
    })
    var page=this.data.page
    var limit=this.data.limit
    //获取该排行榜
    this.getUserInfo(currentRankType,page,limit)
  },
  selectDonateMoney:function(e){
    console.log(e.currentTarget.dataset.ranktype)
    var currentRankType=e.currentTarget.dataset.ranktype
    this.setData({
      rankType:currentRankType,
      page:1,
      isSelectedReading:false,
      isSelectedDBook:false,
      isSelectedDMoney:true
    })
    var page=this.data.page
    var limit=this.data.limit
    //获取该排行榜
    this.getUserInfo(currentRankType,page,limit)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //rank_reading,rank_donate_money, rank_donate_book
    
  },
  //获取用户的合法借书列表
  getUserInfo(rankType,page,limit){
    console.log("getUserINFO:")
    console.log(rankType+":"+page+":"+limit)
    //获取基本信息
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllUserRanking',
      method:"GET",
      data:{
        rank_type:rankType,
        page:page,
        limit:limit
      },
      success:function(res){
        console.log(res.data)
        //成功获得列表
        if(res.data.code==1){
          var userRankingList1=res.data.data.rank
          console.log(userRankingList1)
          that.setData({
            userRankingList:userRankingList1
          })
        }else{
          console.log("列表获取失败")
          that.setData({
            userRankingList:[]
          })
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
    // 设置默认的排行榜
    this.setData({
      rankType:"rank_reading",
      page:1 //默认设置为第一页
    })
    console.log(this.data.rankType)
    
    //获取初始默认的排行榜
    this.getUserInfo(this.data.rankType,this.data.page,this.data.limit)
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