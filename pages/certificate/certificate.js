var jobhunterUtil = require('../../utils/jobhunterUtil.js');
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
    jobhunterForm: {   
      certificateIds: [0,0,0],   //证书
    },
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
    var back = false;
    if (jobhunter)
      back = true;
    options = jobhunterUtil.initOptions(options, back, jobhunter);
    jobhunterForm = jobhunterUtil.initJobhunterForm(jobhunterForm, jobhunter);
    that.setData({
      'options': options,
      "userId": userId,
      "jobhunterForm": jobhunterForm,
      "jobhunter": jobhunter,
    });
    console.log(that.data);

  },

  certificateChange: function (e) {//意向岗位
    var that = this
    console.log('certificateChange', e)
    if (e.detail.value.length > 3) {
      e.detail.value.pop(3);//将最后一项移除
      getApp().showToast("最多选三项哦亲",'none');
    }
    var certificates = that.data.options.certificates;
    var Ids = e.detail.value;
    for (var i = 0; i < certificates.length; i++) {
      var j = 0;
      for (; j < Ids.length; j++) {
        Ids[j] = parseInt(Ids[j]);   //重要，
        if (certificates[i].certificateId == Ids[j]) {
          certificates[i].checked = true;
          break;
        }
      }
      if (j == Ids.length) {
        certificates[i].checked = false;
      }
    }
    that.setData({
      "options.certificates": certificates,
      "jobhunterForm.certificateIds": Ids,
    })
    console.log(that.data.jobhunterForm.certificateIds);
  },


  submit: function () {
    var that = this;
    if (that.data.jobhunterForm.certificateIds[0] == 0 && that.data.jobhunterForm.certificateIds[1] == 0 && that.data.jobhunterForm.certificateIds[2] == 0) {
      getApp().showToast("至少选一个证书哦亲", 'none');
      return false;
    }
    var that = this
    var num = that.data.jobhunterForm.certificateIds.length;
    for (var i = 0; i < (3 - num); i++) {
      that.data.jobhunterForm.certificateIds.push(0);//将数组补齐到三个
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
      getApp().globalData.jobhunterForm.certificateIds = that.data.jobhunterForm.certificateIds;
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