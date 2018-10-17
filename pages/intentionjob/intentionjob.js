var jobhunterUtil = require('../../utils/jobhunterUtil.js');
Page({
  data: {
    //表单选项
    options: {},

    //用户Id
    userId: null,
 
    //自定义用户信息   
    jobhunterForm: {    
      intentionjobIds: [0, 0, 0],  //意向岗位
    },
    intentionjobindex:0,
    intentionjobIds:[],
  },


  //表单页面初始化
  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var options = getApp().globalData.options || wx.getStorageSync("options");
    var jobhunter = getApp().globalData.jobhunter;
    var jobhunterForm = that.data.jobhunterForm;
    options = jobhunterUtil.initOptions(options, true, jobhunter);
    jobhunterForm = jobhunterUtil.initJobhunterForm(jobhunterForm, jobhunter);
    that.setData({
      'options': options,
      "userId": userId,
      "jobhunterForm": jobhunterForm,
    });
    if (jobhunter) {
      that.setData({
        "jobhunter": jobhunter,
      });
    }
      console.log(that.data);

  },

  intentionjobChange: function (e) {//意向岗位
    var that = this
    console.log('intentionjobChange', e)
    if (e.detail.value.length > 3) {
      e.detail.value.pop(3);//将最后一项移除
      getApp().showToast("最多选三项哦亲", 'none');
    }
    var intentionjobs = that.data.options.intentionjobs;
    var Ids = e.detail.value;
    for (var i = 0; i < intentionjobs.length; i++) {
      var j = 0;
      for (; j < Ids.length; j++) {
        Ids[j] = parseInt(Ids[j]);
        if (intentionjobs[i].intentionjobId == Ids[j]) {
          intentionjobs[i].checked = true;
          break;
        }
      }
      if (j == Ids.length) {
        intentionjobs[i].checked = false;
      }
    }
    that.setData({
      "options.intentionjobs": intentionjobs,
      "jobhunterForm.intentionjobIds": Ids,
    })
    console.log(that.data.jobhunterForm.intentionjobIds);
  },
 
   
  submit: function () {
    var that = this;
    if (that.data.jobhunterForm.intentionjobIds[0] == 0 && that.data.jobhunterForm.intentionjobIds[1] == 0 && that.data.jobhunterForm.intentionjobIds[2] == 0) {
      getApp().showToast("意向岗位没选哦亲", 'none');
      return false;
    }
    var that = this
    var num = that.data.jobhunterForm.intentionjobIds.length;
    for (var i = 0; i < (3 - num); i++) {
      that.data.jobhunterForm.intentionjobIds.push(0);//将数组补齐到三个
    }
    if (that.data.jobhunter) {
      getApp().updateJobhunter(that.data.jobhunterForm);
      // getApp().delay(function () {
      //   wx.navigateBack({
      //     delta: 1
      //   })
      //   return false;
      // }, 1000)
    } else {
      getApp().globalData.jobhunterForm.intentionjobIds = that.data.jobhunterForm.intentionjobIds
      getApp().showToast('保存成功了亲');
      getApp().delay(function () {
        wx.navigateBack({
          delta: 1
        })
        return false;
      }, 1000)
    }
  
  }
})