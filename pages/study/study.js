// pages/study/study.js
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
 
      userGraduatetime: '',  //毕业时间
      experienceId: 0, //工作经验ID
      specialId: 0,//专业ID
      educationId: 0,//学历ID
      specialdetailed: '',//具体专业
      userSno:'',  //学号
    },

    experienceIndex: 0, //工作经验ID
    specialIndex: 0,//专业ID
    educationIndex: 0,//学历ID
    schoolIndex:0,  //学校Id
    userGraduatetime: null,
    experienceValue: null,
    educationValue: null,
    specialValue: null,
    schoolValue:null,
  },


  //表单页面初始化
  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var jobhunter = getApp().globalData.jobhunter;
    var options = getApp().globalData.options;
    var jobhunterForm = that.data.jobhunterForm;
    jobhunterForm = jobhunterUtil.initJobhunterForm(jobhunterForm, jobhunter);
    that.setData({
      'options': options,
      "userId": userId,
      "jobhunterForm": jobhunterForm,
      'jobhunter': jobhunter
    });
 
  },

  userSnoChange: function (e) {//联系方式
    var that = this
    console.log('userSnoChange', e);
    that.setData({
      "jobhunterForm.userSno": e.detail.value,
    })
    console.log("userSno：", that.data.jobhunterForm.userSno);
  },
  userGraduatetimeChange: function (e) {//毕业时间
    var that = this;
    console.log('userGraduatetimeChange', e)
    that.setData({
      "jobhunterForm.userGraduatetime": e.detail.value + "-06-01",
      "userGraduatetime": e.detail.value
    })
    console.log("毕业时间：", that.data.jobhunterForm.userGraduatetime);
  },

  experienceChange: function (e) {  //工作经验
    var that = this
    console.log('experienceChange', e)
    var index = e.detail.value
    var Id = that.data.options.experiences[index].experienceId
    that.setData({
      "experienceIndex": index,
      "jobhunterForm.experienceId": Id,
      "experienceValue": that.data.options.experiences[index].experienceValue,

    })
    console.log("已选工作经验Id：", that.data.jobhunterForm.experienceId);
  },

  specialChange: function (e) {//专业分类
    var that = this;
    console.log('specialChange', e)
    var index=e.detail.value;
    var Id = that.data.options.specials[index].specialId
    that.setData({
      "jobhunterForm.specialId": Id,
      'specialValue': that.data.options.specials[index].specialValue,
    })
    console.log("已选专业Id：", that.data.jobhunterForm.specialId);
  },
  specialdetailed: function (e) {//所学专业
    var that = this;
    console.log('specialdetailedChange', e)
    var value = e.detail.value;
    that.setData({
      "jobhunterForm.specialdetailed": value,
    })
    console.log("所学专业：", that.data.jobhunterForm.specialdetailed);
  },
  educationChange: function (e) {//学历
    var that = this
    console.log('educationChange', e)
    var index = e.detail.value
    var Id = that.data.options.educations[index].educationId
    that.setData({
      "educationIndex": index,
      "jobhunterForm.educationId": Id,
      "educationValue": that.data.options.educations[index].educationValue,
    })
    console.log("已选学历Id：", that.data.jobhunterForm.educationId);
  },

  submit: function () {
    var that=this
    if (that.data.jobhunterForm.userSno == null || that.data.jobhunterForm.userSno == '') {
      getApp().showToast("您的学号没填哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jobhunterForm.schoolId == 0) {
      getApp().showToast("毕业院校没选哦亲", 'none');

      return false;
    }
    if (that.data.jobhunterForm.userGraduatetime == null || that.data.jobhunterForm.userGraduatetime == '') {
      getApp().showToast("毕业时间没填哦亲", 'none');

      return false;
    }
    if (that.data.jobhunterForm.experienceId == 0) {
      getApp().showToast("工作经验没选哦亲", 'none');

      return false;
    }
    if (that.data.jobhunterForm.specialId == 0) {
      getApp().showToast("专业分类没选哦亲", 'none');

      return false;
    }
    if (that.data.jobhunterForm.educationId == 0) {
      getApp().showToast("学历没选哦亲", 'none');

      return false;
    }
   
    if (that.data.jobhunterForm.specialdetailed == null || that.data.jobhunterForm.specialdetailed == '')     {
      getApp().showToast("所学专业没填哦亲", 'none');
      //名字获取焦点
      return false;
    }

    if (that.data.jobhunter) {
      getApp().updateJobhunter(that.data.jobhunterForm);

    } else {
      getApp().globalData.jobhunterForm.userGraduatetime = that.data.jobhunterForm.userGraduatetime
      getApp().globalData.jobhunterForm.experienceId = that.data.jobhunterForm.experienceId
      getApp().globalData.jobhunterForm.specialId = that.data.jobhunterForm.specialId
      getApp().globalData.jobhunterForm.educationId = that.data.jobhunterForm.educationId
      getApp().globalData.jobhunterForm.specialdetailed = that.data.jobhunterForm.specialdetailed
      getApp().globalData.jobhunterForm.userSno = that.data.jobhunterForm.userSno
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