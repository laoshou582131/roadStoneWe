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
            "text":"待借阅书单"
          },
          {
            "pagePath": "/pages/BookClassification/BookClassification",
            "iconPath": "../images/tabBarIcon/books.png",
            "selectedIconPath": "../images/tabBarIcon/books.png",
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
    borrowingBookNum:0
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
    //前往借阅书籍的页面
    goBorrow:function(){
      wx.navigateTo({
        url: '/pages/BorrowingBook/BorrowingBooks',
      })
    },
    //获取当前准备借阅的图书数量
    getBorrowingBookNum(){
      const that=this
      console.log("This is from component")
      wx.request({
        url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBorrowingBookNum',
        method:"POST",
        data:{
          open_id:"wxid_6j6ff0aaplne11"
        },
        success:function(res){
          console.log(res.data.data) //结果为{book_count: 0}
          //设置目前待借阅的书籍数量
          that.setData({
            borrowingBookNum:res.data.data.book_count
            // borrowingBookNum:5
          })
          console.log("传进来的值为:"+that.data.borrowingBookNum)
          
          
        }
      })
    },
      
  }
})
