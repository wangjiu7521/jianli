var jobhunterUtil = require('../../utils/jobhunterUtil.js');
Page({
  data: {
    //表单选项
    options: null,
    jobhunterForm: {
      referrerId:0,         //荣誉
    },
  },
  //表单页面初始化
  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var options = getApp().globalData.options;
    var jobhunter = getApp().globalData.jobhunter;
    var jobhunterForm = that.data.jobhunterForm;
    var back = false;
    if (jobhunter)
      back = true;
    options = jobhunterUtil.initOptions(options, back, jobhunter);
    jobhunterForm = jobhunterUtil.initJobhunterForm(jobhunterForm, jobhunter);
    that.setData({
      'options': options,
      "jobhunterForm": jobhunterForm,
    });
    if (jobhunter) {
      that.setData({
        "jobhunter": jobhunter,
      });
    }
    console.log(that.data);
  },

  referrerChange: function (e) {//意向岗位
    var that = this
    console.log('referrerChange', e)
    if (e.detail.value.length > 1) {
      e.detail.value.pop(1);//将最后一项移除
      getApp().showToast("只能选一项哦亲", 'none');
    }
    var referrers = that.data.options.referrers;
    var Id = e.detail.value[0];
    Id = parseInt(Id);
    for (var i = 0; i < referrers.length; i++) {
      if (referrers[i].referrerId == Id) {
          referrers[i].checked = true;
      }else{
        referrers[i].checked = false;
      }
    }
    that.setData({
      "options.referrers": referrers,
      "jobhunterForm.referrerId": Id,
    })
    console.log(that.data.jobhunterForm.referrerId);
  },


  submit: function () {
    var that = this;
    if (that.data.jobhunterForm.referrerId ==0 ) return;
    getApp().globalData.jobhunterForm.referrerId = that.data.jobhunterForm.referrerId
    getApp().showToast('保存成功了亲');
    getApp().delay(function () {
      wx.navigateBack({
        delta: 1
      })
      return false;
    }, 1000)

  }
})