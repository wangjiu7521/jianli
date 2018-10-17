
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: getApp().globalData.domain,
    news: [],
    typeId:1,
    pageIndex: 0,
    limit: 10,
    // 2.1用于记录是否还有更多的数据
    hasMore: true
  },


  onLoad: function (options) {
    _self = this;
    
    this.loadMore();
  },
  //加载更多
  loadMore: function () {
    var that = this;
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;

    wx.request({
      url: getApp().globalData.domain + '/weixin/user/getNewsListByPage.action',
      data: {
        limit: this.data.limit,
        page: ++this.data.pageIndex,
        typeId:this.data.typeId
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.msg == 'ok') {
          var newList = this.data.news.concat(res.data.news.list);
          getApp().globalData.news = newList;
          var count = res.data.news.total;
          var flag = this.data.pageIndex * this.data.limit < count;
          this.setData({
            count: count,
            news: newList,
            hasMore: flag,
          });
        }
      },
    });
  },
  btnclick: function (e) {
    var that = this;
    var typeId = parseInt(e.target.id)
    if (typeId != that.data.typeId){
      if (typeId == 1)
        wx.setNavigationBarTitle({ title: "每日兼职" })
      else if (typeId == 2)
        wx.setNavigationBarTitle({ title: "全职招聘" })
      else 
        wx.setNavigationBarTitle({ title: "乐在动态" })
      that.setData({
        news: [],
        pageIndex: 0,
        hasMore: true,
        typeId:typeId
      });
      that.loadMore();
    }
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("下拉事件");
    // 下拉刷新页面
    // 3.1 把数据先设置回默认值
    this.setData({
      news: [],
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
})