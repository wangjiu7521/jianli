var outworkerUtil = require('../../utils/outworkerUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    outworker: null,
    form: null,
    options: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    var that = this;
    var options = getApp().globalData.options;
    var outworker = getApp().globalData.outworker;
    var outworkerShow = outworkerUtil.initOutworkerShow(getApp().globalData.outworkerShow, outworker, options);
    that.setData({
      "outworkerShow": outworkerShow,
      "outworker": outworker, 
    })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    this.onLoad();
  },

  specialtyChange: function () {
    wx.navigateTo({
      url: '../specialty/specialty',
    })
  },

  submit: function () {
    var that = this;
    //对提交的参数进行校验
    var outworkerForm = getApp().globalData.outworkerForm;
   
    if (outworkerForm.specialtyIds[0] == 0 && outworkerForm.specialtyIds[1] == 0 && outworkerForm.specialtyIds[2] == 0) {
      getApp().showToast("特长还没有选哦亲");
      return false;
    }
    if (outworkerForm.skillIntroduction == null || outworkerForm.skillIntroduction == null){
      getApp().showToast("技能介绍没有填写哦亲");
      return false;
    }
    //提交表单
    console.log("准备提交表单...")
    if (getApp().globalData.user==null){
      getApp().updateUser(getApp().globalData.jibenForm, "add", function () {    //先提交基本信息
        getApp().updateOutworker({
          "skillIntroduction": outworkerForm.skillIntroduction,
          "specialtyIds": outworkerForm.specialtyIds,
        }, "add")
      });
    }else{
      getApp().updateOutworker({
        "skillIntroduction": outworkerForm.skillIntroduction,
        "specialtyIds": outworkerForm.specialtyIds,
      }, "add")
    }
     //添加用户
  },


})