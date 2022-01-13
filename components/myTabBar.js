// components/myTabBar.js
Component({
  properties: {
    //page向component传递的theSelected
    //选中时，改变icon颜色
    theSelected:{
      type:String,
      value:"0" //默认值
    },
    //获得在清单中的书籍数量
    inCartBooks:{
      type:Number,
      value:0
    },

    tabBar:{
      type:Object,
      value:{
        "list":[
          {
            "pagePath": "/pages/Home/Home",
            "iconPath": "../components/images/Home.png",
            "selectedIconPath": "../components/images/Home_fill.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/Ranking/Ranking",
            "iconPath": "../components/images/rank.png",
            "selectedIconPath": "../components/images/rank_fill.png",
            "text": "排行榜"
          },
          {
            "isSpecial":true,
            "iconPath":"../components/images/bookWish.png",
            "text":"待借阅书单"
          },
          {
            "pagePath": "/pages/BookClassification/BookClassification",
            "iconPath": "../components/images/classfi.png",
            "selectedIconPath": "../components/images/classifi_fill.png",
            "text": "书籍"
          },
          {
            "pagePath": "/pages/UserInfo/UserInfo",
            "iconPath": "../components/images/User.png",
            "selectedIconPath": "../components/images/User_fill.png",
            "text": "我的"
          }
        ]
      }
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    borrowingBookNum:0,
    // selected:0, //下方选择栏0-4。
  },
  lifetimes:{
    // attached:function(){
    //   var bookWishNUm=wx.getStorageSync('bookWishNum')
    //   this.setData({
    //     borrowingBookNum:bookWishNUm
    //   })
    // },
    // moved:function(){
    //   var bookWishNUm=wx.getStorageSync('bookWishNum')
    //   this.setData({
    //     borrowingBookNum:bookWishNUm
    //   })
    // }
  },
    
  

  /**
   * 组件的方法列表
   */
  methods: {
    //前往借阅书籍的页面
    goBorrow:function(){
      // this.stillConstructing()
      wx.navigateTo({
        url: '/pages/BorrowingBook/BorrowingBooks',
      })
    },
    //提示功能仍在开发
    stillConstructing(){
      wx.showModal({
        cancelColor: 'red',
        title:"功能仍在开发中",
        content:"敬请期待...",
        showCancel:false
      })
    },
    switchTab(e){
      // console.log(e)
      console.log(e.currentTarget.dataset) //获得来自data-index的index值。
      var theIndex=e.currentTarget.dataset.index
    },
  },
  
})
