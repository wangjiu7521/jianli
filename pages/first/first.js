// pages/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  zhuce:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../pages/jiben/jiben?zhuce='+id,
    })
  },
	voidfun: function () {
		getApp().showToast("该功能暂未开放", 'none');
	},
})