var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    var that = this;
    var options = getApp().globalData.options;
    var jobhunter = getApp().globalData.jobhunter;
    var jianli = utils.initJianli(getApp().globalData.jianli, jobhunter, options);
    that.setData({
      "jianli": jianli,
    })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    this.onLoad();
  },

  intention: function () {
    wx.navigateTo({
      url: '../intention/intention',
    })
  },
  intentionjobs: function () {
    wx.navigateTo({
      url: '../intentionjob/intentionjob',
    })
  },


})