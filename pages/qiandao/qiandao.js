// pages/qiandao/qiandao.js
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
    getApp().delay(function () {
      wx.switchTab({
        url: '/pages/index/index',  //正常逻辑
      })
      return false;
    }, 2000)
  },


})