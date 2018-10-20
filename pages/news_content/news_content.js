// pages/news_content/news_content.js
var WxParse = require('../../wxParse/wxParse.js');
var _self;
Page({
  data: {
    data:null,
    newsPageview:null  //访问量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    //获取缓存新闻数据
		wx.showLoading({ title: "加载中" });
    try {
      var news = getApp().globalData.news;
      if (news) {
        console.log(news)
        for(var i=0;i<news.length;i++){
          if(options.newsID==news[i].newsId){
            wx.setNavigationBarTitle({
              title: news[i].newsTitle,
            })
            _self.setData({
              data: news[i]
            })
            break;
          }
        }
      }
    } catch (e) {
      console.log("获取缓存失败！")
    }
    try{
      WxParse.wxParse('article', 'html', _self.data.data.newsContent, _self, 0);
			
    } catch (e) {
      console.log(e)
      console.log("解析富文本失败！")
    }
		
    //刷新访问量
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/updatePageview.action',
      method: 'GET',
      data:{
        newsId: options.newsID
      },
      success:function(res){
				wx.hideLoading();
        console.log(res.data)
        _self.setData({
          newsPageview: res.data.newsPageview
        })
      },
			complete:()=>{
				wx.hideLoading();
			}
    })

  },
})