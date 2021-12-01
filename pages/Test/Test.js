// pages/Test/Test.js
Page({
  
  /**
   * 页面的初始数据
   */
  
  data: {
    list:["Red","Green","Blue"],
    num:0, //当前默认页面有多少条数据
    page:0, //当前是第几页
    lastPage:10, //最后一页是多少页。
    // userInfo:{},
    // openid:''

    toView:"Red",
    scrollTop:0
  },
  //获取用户openID
  onGotUserInfo:function(e){
    const that =this
    //调用云函数，因为openID属于比较私密的内容，只能通过云函数来获得
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        console.log("云函数调用成功")
        that.setData({
          openid:res.result.openid,
          userinfo:e.detail.userInfo
        })
        console.log("openid",that.data.openid)
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
  },

  //默认传入第一页内容
  getData(page){
    if(page==1){
      console.log("当前页面为第一页")
    }
    else{
      console.log("现在是第"+page+"页")
      var list1=this.data.list
      list1.push("newOne"+page)
      this.setData({
        list:list1
      })
      console.log("现在的List为:"+this.data.list)
    }
  },
  paging:function(){
    console.log("paging触发")
    if(this.data.page < this.data.lastPage){
      console.log("进入")
      //更改data中的参数
      var page1=this.data.page
      page1=page1+1
      this.setData({
        page:page1 //这里的page，就是data中的page，而page1则是我们的临时变量。
      })
      console.log("currentPage is :"+this.data.page)
      this.getData(this.data.page)
      
    }
    else{
      console.log("没有进入"+this.data.page+"lastPage:"+this.data.lastPage)
    }
  },

  onShow:function(){
    this.getData(1)
  },

  //测试request
  getSearch:function(){
    wx.request({
      url: 'https://qjnqrmlhidqj4nv8.jtabc.net/getBorrowingBookNum',
      method:"POST",
      data:{
        open_id:"wxid_6j6ff0aaplne11"
      },

      success:function(res){
        console.log(res.data) 
      }
    })
  }
})