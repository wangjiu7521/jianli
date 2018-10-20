// pages/index/index.js
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: getApp().globalData.domain,
    swiperImgs: ["https://lezaixy.com/images/weixin/swiperimg/swiper1.jpg", "https://lezaixy.com/images/weixin/swiperimg/swiper2.jpg", "https://lezaixy.com/images/weixin/swiperimg/swiper3.jpg"],
    companys: null,
    news: null,
  },


  onLoad: function(options) {
    var that = this;
    _self = that;

    var swiperImgs = that.data.swiperImgs.map((item) => item + "?time=" + (new Date()).getDate());
    that.setData({
      swiperImgs: swiperImgs
    })
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/getCompanyListByPage.action',
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify({
        page: 1,
        limit: 8
      }),
      success: function(res) {
        console.log(res.data)
        if (res.data.msg == 'ok') {
          var companys = res.data.page.list;
          _self.setData({
						companys: res.data.page.list.map((item) => that.initCompany(item)),
          });
          getApp().globalData.companys = companys;
        }
      }
    });
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/getNewsListByPage.action',
      method: 'GET',
      data: {
        page: 1,
        limit: 2
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.msg == 'ok') {
          var news = res.data.news.list;
          _self.setData({
            news: news,
          });
          getApp().globalData.news = news;
        }
      }
    });
  },
 
  voidfun: function() {
    getApp().showToast("该功能暂未开放", 'none');
  },

  onShareAppMessage: function(options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },

	initCompany: (company) => {
		company.companyType = "company" //合作企业
		return company;
	},
})