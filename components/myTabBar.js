// components/myTabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabBar:{
      type:Object,
      value:{
        "list":[
          {
            "pagePath": "/pages/Home/Home",
            "iconPath": "../images/tabBarIcon/home.png",
            "selectedIconPath": "../images/tabBarIcon/home.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/Ranking/Ranking",
            "iconPath": "../images/tabBarIcon/ranking.png",
            "selectedIconPath": "../images/tabBarIcon/ranking.png",
            "text": "排行榜"
          },
          {
            "isSpecial":true,
            "iconPath":"../images/tabBarIcon/plus3.png",
            "text":"扫码"
          },
          {
            "pagePath": "/pages/BookClassification/BookClassification",
            "iconPath": "../images/tabBarIcon/book.png",
            "selectedIconPath": "../images/tabBarIcon/book.png",
            "text": "书籍"
          },
          {
            "pagePath": "/pages/UserInfo/UserInfo",
            "iconPath": "../images/tabBarIcon/mine.png",
            "selectedIconPath": "../images/tabBarIcon/mine.png",
            "text": "我的"
          },
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //调用扫码方法。
    scanCode:function(){
      var that =this
      wx.scanCode({
        onlyFromCamera: true,
        success:function(res){
          that.setData({res:res})
        }
      })
    },
    goBorrow:function(){
      wx.navigateTo({
        url: '/pages/BorrowingBook/BorrowingBooks',
      })
    }
  }
})
