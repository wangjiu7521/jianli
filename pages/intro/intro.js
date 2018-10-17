var jobhunterUtil = require('../../utils/jobhunterUtil.js');
var outworkerUtil = require('../../utils/outworkerUtil.js');
Page({

  data: {
    //表单选项
    options: {},

    //用户Id
    userId: null,

    //自定义用户信息   
    jobhunterForm: {
      userIntroduction: "",//自我介绍
    },
    outworkerForm: {
      skillIntroduction: "",//自我介绍
    },
  },

  onLoad: function (parm) {
    var that = this
    var page = parm.page;
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    that.setData({
      "userId": userId,
      "page":page,
    });
    var form =null;
    if(page == "outworker"){
      form = outworkerUtil.initOutworkerForm(that.data.outworkerForm, getApp().globalData.outworker);
      that.setData({
        "outworkerForm": form,
        "outworker": getApp().globalData.outworker
      });
    }
    else{
      form = jobhunterUtil.initJobhunterForm(that.data.jobhunterForm, getApp().globalData.jobhunter);
      that.setData({
        "jobhunterForm": form,
        "jobhunter": getApp().globalData.jobhunter
      });
    }
    console.log(that.data);
  },
  introduction: function (e) {//自我介绍
    var that = this;
    console.log('introductionChange', e)
    var value = e.detail.value;
    if (that.data.page == "outworker") {
      that.setData({
        "outworkerForm.skillIntroduction": value,
      });
    }
    else {
      that.setData({
        "jobhunterForm.userIntroduction": value,
      });
    }
  },
 submit:function(){
   var that = this;
   if (that.data.page == "outworker"){
     if (that.data.outworkerForm.skillIntroduction == "") {
       getApp().showToast("自我介绍没有填哦亲", 'none');
       return false;
     }
     if (that.data.outworker) {
       getApp().updateOutworker(that.data.outworkerForm);
     } else {
       getApp().globalData.outworkerForm.skillIntroduction = that.data.outworkerForm.skillIntroduction
       getApp().showToast('保存成功了亲');
       getApp().delay(function () {
         wx.navigateBack({
           delta: 1
         })
         return false;
       }, 1000)
     }
   }else{
      if (that.data.jobhunterForm.userIntroduction == "") {
        getApp().showToast("自我介绍没有填哦亲", 'none');
        return false;
      }
     if (that.data.jobhunter) {
       getApp().updateJobhunter(that.data.jobhunterForm);
     } else {
       getApp().globalData.jobhunterForm.userIntroduction = that.data.jobhunterForm.userIntroduction
       getApp().showToast('保存成功了亲');
       getApp().delay(function () {
         wx.navigateBack({
           delta: 1
         })
         return false;
       }, 1000)
     }
    }
   console.log("提交自我介绍", that.data.page == "outworker"?that.data.outworkerForm.skillIntroduction:that.data.jobhunterForm.userIntroduction);
   
 
 }
})