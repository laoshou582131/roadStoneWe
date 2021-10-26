// pages/BookClassification/BookClassification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookClassification:['全部',"绘本故事","外文阅读","科学教育","人文艺术","历史文化","儿童文学","童话语言","儿童诗歌"],
    mainCourse:['煎小牛肉卷',"猪排","鸡排"],
    dessert:['坚果冰淇淋',"巧克力球"],
    value:[0],
    menu:[]
  },
  /*自定义事件*/
  pickerViewChange:function(e){
    let v=e.detail.value;
    console.log("picker is changed, the choosen values are:"+e.detail.value)
    let menu1=[];
    menu1.push(this.data.bookClassification[v[0]]);
    this.setData({menu:menu1});
    
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