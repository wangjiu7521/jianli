var jobhunterUtil = require('../../utils/jobhunterUtil.js');
Page({
  data: {
    //表单选项
    options: {},
    //用户Id
    userId: null,

    //自定义用户信息   
    jobhunterForm: {   
      honorIds: [0,0,0],         //荣誉
    },
  },
  //表单页面初始化
  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
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

  honorChange: function (e) {//意向岗位
    var that = this
    console.log('honorChange', e)
    if (e.detail.value.length > 3) {
      e.detail.value.pop(3);//将最后一项移除
      getApp().showToast("最多选三项哦亲",'none');
    }
    var honors = that.data.options.honors;
    var Ids = e.detail.value;
    for (var i = 0; i < honors.length; i++) {
      var j = 0;
      for (; j < Ids.length; j++) {
        Ids[j] = parseInt(Ids[j]);
        if (honors[i].honorId == Ids[j]) {
          honors[i].checked = true;
          break;
        }
      }
      if (j == Ids.length) {
        honors[i].checked = false;
      }
    }
    that.setData({
      "options.honors": honors,
      "jobhunterForm.honorIds": Ids,
    })
    console.log(that.data.jobhunterForm.honorIds);
  },


  submit: function () {
    var that = this;
    if (that.data.jobhunterForm.honorIds[0] == 0 && that.data.jobhunterForm.honorIds[1] == 0 && that.data.jobhunterForm.honorIds[2] == 0) {
      getApp().showToast("至少选一个荣誉哦亲",'none');
      return false;
    }
    var that = this
    var num = that.data.jobhunterForm.honorIds.length;
    for (var i = 0; i < (3 - num); i++) {
      that.data.jobhunterForm.honorIds.push(0);//将数组补齐到三个
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
      getApp().globalData.jobhunterForm.honorIds = that.data.jobhunterForm.honorIds
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