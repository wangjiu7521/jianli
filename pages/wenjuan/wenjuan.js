// pages/wenjuan/wenjuan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //表单选项
    options: {},

    //用户Id
    userId: null,

    //自定义用户信息   
    workForm:{
      "userId": null,
      "companyName": null,
      "companyPostion": null,
      "accessionTime": null,
      "wageId": 0,
    },
    practiceForm: {
      "userId": null,
      "practiceContent": null,
      "practiceAddr": null,
      "practiceTime": null,
    },
    wageIndex: 0,  //学校Id
    time: null,
    wageValue: null,
    update:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (arg) {
    var that = this;
    console.log(arg);
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var options = getApp().globalData.options;
    that.setData({
      'options': options,
      "userId": userId,
      "workForm.userId": userId,
      "practiceForm.userId": userId,
      "update":arg.update,
    });
    console.log(that.data);
  },

  wageChange: function (e) {  //学校分类
    var that = this
    console.log('wageChange', e)
    var index = e.detail.value
    var Id = that.data.options.wages[index].wageId
    that.setData({
      "wageIndex": index,
      "workForm.wageId": Id,
      "wageValue": that.data.options.wages[index].wageValue,

    })
    console.log("已选工资Id：", that.data.form.wageId);
  },
  timeChange: function (e) {
    var that = this;
    console.log('timeChange', e)
    that.setData({
      "workForm.accessionTime": e.detail.value,
      "time": e.detail.value
    })
  },





  updateWork: function (event) {
    var that = this;
    console.log(that.data.userId)
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/updateQuestionnaireByUserId.action",
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify(that.data.workForm),
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {
          
        } else {

        }
      },
    })
  },
  updatePractice: function (event) {
    var that = this;
    console.log(that.data.userId)
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/updateQuestionnaireByUserId.action",
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify(that.data.practiceForm),
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {

        } else {

        }
      },
    })
  },
  submitForm:function(){
    var that = this;
    if(that.data.update == 'work'){
      this.updateWork();
    }else{
      this.updatePractice();
    }
  }

})