// pages/BookClassification/BookClassification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookClassification:[],//获得所有的书籍类型数据
    currentClass:"",//当前所选的书籍类型
    currentPage:1,//当前页面
    limit:10, //每一页的所要的书籍数量
    currentBookItems:[],//当前所获得的书籍信息列表


    value:[0], //picker默认下从选择第几个元素
    // menu:[]
  },
  
  //左边Picker的选择后变动方法
  pickerViewChange:function(e){
    let v=e.detail.value; //picker-view-column的下标数，从0开始。
    console.log("picker is changed, the choosen values are:"+v)
    console.log(this.data.bookClassification[v])
    var selectedClass=this.data.bookClassification[v]
    this.setData({
      currentClass:selectedClass,
      currentPage:1 //每一次选新的书籍类型时，初始化从第一页开始
    })
    console.log("currentClass is "+this.data.currentClass)

    //获取所选类型的书籍信息
    this.getClassBooks(this.data.currentClass,this.data.currentPage,this.data.limit)
    // let menu1=[];
    // menu1.push(this.data.bookClassification[v[0]]);
    // this.setData({menu:menu1});
    
  },

  //滚动换页
  paging:function(){
    var tempPage=this.data.currentPage+1
    this.setData({
      currentPage:tempPage
    })
    console.log(this.data.currentPage)
    this.getMoreBooks(this.data.currentClass,this.data.currentPage,this.data.limit)
  },
  //滚动时获取新的书籍内容
  getMoreBooks(bookType,page,limit){
    console.log("getMoreBooks:"+bookType+","+page+","+limit)
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getSpecificBooksList',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        book_type:bookType,
        page:page, //新的页面
        limit:limit //默认10个
      },
      success:function(res){
        // console.log(res.data)
        //将第新页的内容给加进来
        var newBookItems=res.data.data.book_list
        var tempCurrentBookItems=that.data.currentBookItems
        tempCurrentBookItems=tempCurrentBookItems.concat(newBookItems) //与之前获取的书籍列表累加
        // console.log(tempCurrentBookItems)
        that.setData({
          currentBookItems:tempCurrentBookItems
        })

      }
    })
  },


  goDetail:function(e){
    wx.navigateTo({
      url: '../../pages/bookDetail/BookDetail',
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
    //获得书籍分类数据
    this.getBooksClasses()
    //获取所选分类的书籍内容
    console.log("Hello")
    // this.getClassBooks(this.data.currentClass,this.data.page,this.data.limit)
    
  },
  //获取书籍分类数据
  getBooksClasses(){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getAllBookClass',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
      },

      success:function(res){
        console.log(res.data) 
        that.setData({
          bookClassification:res.data.data.book_type_list,
          currentClass:res.data.data.book_type_list[0], //设置当前所选的默认分类类型
        })
        // console.log("currentclass:"+that.data.currentClass) //Good
        //获取当前书籍类型的书本信息
        that.getClassBooks(that.data.currentClass,that.data.currentPage,that.data.limit)
        
      }
    })
  },
  //获得所选的对应书籍
  getClassBooks(bookType,page,limit){
    const that=this
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getSpecificBooksList',
      method:"GET",
      data:{
        // open_id:"wxid_6j6ff0aaplne11"
        book_type:bookType,
        page:page, //默认第一页
        limit:limit //默认10个
      },
      success:function(res){
        console.log(res.data)
        that.setData({
          currentBookItems:res.data.data.book_list
        })

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