var jobhunterUtil = require('../../utils/jobhunterUtil.js');
Page({
  data: {
    userId: null,
    jobhunter: null,
    form: null,
    options: null,

    gou: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {

    var that = this;
    var jobhunter = getApp().globalData.jobhunter;
    var options = getApp().globalData.options;
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    if (jobhunter) {
      that.setData({
        "jobhunter": jobhunter,
        "userId": userId,
        "options": options,
      });
    }
    var jobhunterShow = jobhunterUtil.initJobhunterShow(getApp().globalData.jobhunterShow, jobhunter, options);
    that.setData({
      "jobhunterShow": jobhunterShow,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var jobhunter = getApp().globalData.jobhunter;
    var jobhunterShow = jobhunterUtil.initJobhunterShow(getApp().globalData.jobhunterShow, jobhunter, getApp().globalData.options);
    that.setData({
      "jobhunterShow": jobhunterShow,
    })
  },


  xieyi: function(e) {
    var that = this
    var gou = that.data.gou;
    that.setData({
      'gou': !gou
    })
  },
  onTap1: function(event) {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },

  submit: function() {
    var that = this;
    //对提交的参数进行校验
    var form = getApp().globalData.jobhunterForm;
    if (form.specialdetailed == "") {
      getApp().showToast("学习信息没有编辑", 'none');
      return false;
    }
    if (form.intentioncitys[0] == "" && form.intentioncitys[1] == "" && form.intentioncitys[2] == "") {
      getApp().showToast("意向城市没有编辑", 'none');
      return false;
    }
    if (form.userNativeplace == "") {
      getApp().showToast("籍贯没有编辑", 'none');
      return false;
    }
    if (form.intentionjobIds[0] == 0 && form.intentionjobIds[1] == 0 && form.intentionjobIds[2] == 0) {
      getApp().showToast("意向岗位没有编辑", 'none')
      return false;
    }
    if (form.certificateIds[0] == 0 && form.certificateIds[1] == 0 && form.certificateIds[2] == 0) {
      getApp().showToast("证书没有编辑", 'none');
      return false;
    }
    if (form.honorIds[0] == 0 && form.honorIds[1] == 0 && form.honorIds[2] == 0) {
      getApp().showToast("荣誉没有编辑", 'none');
      return false;
    }
    if (form.userIntroduction == "") {
      getApp().showToast("自我介绍没有编辑", 'none');
      return false;
    }
    if (!that.data.gou) {
      getApp().showToast("请勾选信息数据提交须知", 'none');
      return false;
    }
    //提交表单
    //伯乐必选bug
    if (getApp().globalData.user==null){
      getApp().updateUser(getApp().globalData.jibenForm, "add", function () {
        getApp().updateJobhunter({
          "referrerUserId": getApp().globalData.referrerUserId,
          "userSno": form.userSno, //学号
          "userGraduatetime": form.userGraduatetime,
          "experienceId": form.experienceId,
          "userNativeplace": form.userNativeplace,
          "nativeplaceCodeA": form.nativeplaceCodeA,
          "specialId": form.specialId,
          "specialdetailed": form.specialdetailed,
          "educationId": form.educationId,
          "schoolId": form.schoolId,
          "referrerId": form.referrerId,
          "userIntroduction": form.userIntroduction,
          "intentioncitys": form.intentioncitys,
          "intentioncityCodes": form.intentioncityCodes,
          "intentionjobIds": form.intentionjobIds,
          "honorIds": form.honorIds,
          "certificateIds": form.certificateIds,
        }, "add")
      });
    }else{
      getApp().updateJobhunter({
        "referrerUserId": getApp().globalData.referrerUserId,
        "userSno": form.userSno, //学号
        "userGraduatetime": form.userGraduatetime,
        "experienceId": form.experienceId,
        "userNativeplace": form.userNativeplace,
        "nativeplaceCodeA": form.nativeplaceCodeA,
        "specialId": form.specialId,
        "specialdetailed": form.specialdetailed,
        "educationId": form.educationId,
        "schoolId": form.schoolId,
        "referrerId": form.referrerId,
        "userIntroduction": form.userIntroduction,
        "intentioncitys": form.intentioncitys,
        "intentioncityCodes": form.intentioncityCodes,
        "intentionjobIds": form.intentionjobIds,
        "honorIds": form.honorIds,
        "certificateIds": form.certificateIds,
      }, "add")
    }
    //添加用户
  },

  onShareAppMessage: function(options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },

  

})