 Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户Id
    userId: null,
    //消息列表
    messagetypes: null,
    messages: [],
    detail:[],
    URL: getApp().globalData.domain,
    pageIndex: 0,
    pageSize: 30,
    // 2.1用于记录是否还有更多的数据
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    //加载userId
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var options = getApp().globalData.options;
    var messagetypes = options.messagetypes;
      that.setData({
        "userId": userId,
        messagetypes: messagetypes
      });
    this.loadMore();
    
    //加载用户消息
  },

  //删除按键触发方法
  deleteMessageById: function (event) {
    var that = this;
    //得到按键对应的messageId
    var messageId = event.currentTarget.id;
    getApp().showModal('',"确定要删除吗？", function () {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/removeMessageById.action",
        data: {
          "userId": that.data.userId,
          "messageId": messageId,
        },
        success: res => {
          if (res.data.msg == "ok") {
            console.log(res.data);
            var messages = that.data.messages;
            for (var i = 0; i < messages.length; i++) {
              if (messages[i].messageId == messageId) {
                messages.pop(i);
                break;
              }
            }
            getApp().globalData.messages = messages;
            if (messages.length == 0) {
              that.setData({
                "msg": "暂无消息",
                "messages": messages,
              });
            } else {
              that.setData({
                "msg": "我的消息",
                "messages": messages,
              });
            }
          }
        },
        fail: function () {
          getApp().showModal('',"删除失败了呢,刷新后重新试试哦亲");
        }
      })
    });

  },
   loadMore: function () {
     var that = this;
     // 2.2如果没有更多数据，就直接返回
     if (!this.data.hasMore) return;
     var detail = that.data.detail;
     wx.request({
       url: getApp().globalData.domain + "/weixin/message/getMessagesByUserIdWithPage.action",
       data: {
         "userId": that.data.userId,
         pageSize: this.data.pageSize,
         page: ++this.data.pageIndex
       },
       success: res => {
         console.log(res.data);
         var messages = this.data.messages.concat(res.data.messagePage.list);
         getApp().globalData.messages = messages;
         var count = res.data.messagePage.total;
         var flag = this.data.pageIndex * this.data.pageSize < count;  
         if(detail.length == 0){
           for (var i = 0; i < count; i++) {
             detail[i]=false;
           }
           that.setData({
             detail:detail
           });
         }
         that.setData({
           messages: messages,
           count: count,
           hasMore: flag,
         });
         
       },
     })
   },
   choose: function (e) {
     var that = this;
     var id = parseInt(e.currentTarget.id);

     var detail = that.data.detail;
     var flag = detail[id];
     for(var i = 0;i<detail.length;i++){
       detail[i] = false;
     }
     detail[id] = ~flag;
       that.setData({
         'detail': detail,
       })
   },
   /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
   onPullDownRefresh: function () {
     console.log("下拉事件");
     // 下拉刷新页面
     // 3.1 把数据先设置回默认值
     this.setData({
       messages: [],
       pageIndex: 0,
       hasMore: true,
     });
     // 3.2 再重新请求数据
     this.loadMore();
     // 3.3 记得停止，否则在手机端一直存在
     wx.stopPullDownRefresh();
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     console.log("上拉触底");
     // 1.5. 触底再调用加载数据的函数
     this.loadMore();
   },
   onShareAppMessage: function (options) {
     var that = this;
     return getApp().getShareAppMessage(options);
   },
})

