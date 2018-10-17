var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userPhotoUrl: "/images/photo.png",
    userId: null,
    usrCustom: null,
    form:null,
    options: null,
    img: "/images/photo.png",
    items5: [
      { name: 'xvzhi', value: '' },
    ],
    src: "../../image/photo.png", //绑定image组件的src
    xieyi:[],
    gou: false,
    an: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    
    var that = this;
    var options = getApp().globalData.options || wx.getStorageSync("options");
    var userId = getApp().globalData.userId;
    var jobhunter = getApp().globalData.jobhunter;
    var form = getApp().globalData.form;
    var jianli = utils.initJianli(getApp().globalData.jianli, jobhunter, options);
    form = utils.initForm(form, jobhunter);
    var userPhotoUrl =that.data.img;
    if (jobhunter && userCustom.userPhotoUrl && jobhunter.userPhotoUrl!="")
      {
      userPhotoUrl = getApp().globalData.domain + jobhunter.userPhotoUrl +"?time =" + Math.random();
      }else{
      userPhotoUrl = that.data.img;
      }
    that.setData({
      "userId": userId,
      "form": form,
      "jobhunter": jobhunter,
      "userPhotoUrl": userPhotoUrl,
      "options": options,
      "jianli":jianli,
    })
    if (!jobhunter) {
      var that = this
      that.setData({
        'gou': false,
        'an': false
      })
    } else {
      var that = this
      that.setData({
        'gou': true,
        'an': true
      })
    }
    console.log(that.data);
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that =this;
    this.onLoad();
  },

  jiben: function () {
      wx.navigateTo({
        url: '../jiben/jiben',
      })
  },
  schoolChange: function () {
      wx.navigateTo({
        url: '../study/study',
      })
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
  specialtyId: function () {
        wx.navigateTo({
          url: '../specialty/specialty',
        })
  },
  certificate: function () {  
      wx.navigateTo({
        url: '../certificate/certificate',
      })
  },
  honorId: function () {
      wx.navigateTo({
        url: '../honor/honor',
      })
  },
  referrer: function () {
    wx.navigateTo({
      url: '../referrer/referrer',
    })
  },
  intro: function () { 
      wx.navigateTo({
        url: '../intro/intro',
      })
  },
  checkboxChange6: function (e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      'xieyi': e.detail.value
    })
  },
  onTap1: function (event) {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },

  submit: function () {
    var that = this;
    //对提交的参数进行校验
    var form = getApp().globalData.form;
    if (form.userName == "") {
      getApp().showToast("基本信息没有编辑",'none');
      return false;
    }
    if (form.specialdetailed == "") {
      getApp().showToast("学习信息没有编辑",'none');
      return false;
    }
    if (form.intentioncitys[0] == "" && form.intentioncitys[1] == "" && form.intentioncitys[2] == "") {
      getApp().showToast("意向城市没有编辑", 'none');
      return false;
    }
    if (form.intentionjobIds[0] == 0 && form.intentionjobIds[1] == 0 && form.intentionjobIds[2] == 0) {
      getApp().showToast("意向岗位没有编辑", 'none')
      return false;
    }

    if (form.specialtyIds[0] == 0 && form.specialtyIds[1] == 0 && form.specialtyIds[2] == 0) {
      getApp().showToast("特长没有编辑", 'none');
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
    if (that.data.xieyi.length==0) {
      getApp().showToast("请勾选信息数据提交须知", 'none');
      return false;
    }
    //提交表单
    console.log("准备提交表单...")

    getApp().updateJobhunter({
      "userName": form.userName,
      "userGender": form.userGender,
      "userTel": form.userTel,
      "userQq": form.userQq,
      "userSno": form.userSno,//学号
      "userGraduatetime": form.userGraduatetime,
      "experienceId": form.experienceId,
      "userNativeplace": form.userNativeplace,
      "specialId": form.specialId,
      "specialdetailed": form.specialdetailed,
      "educationId": form.educationId,
      "schoolId": form.schoolId,
      "referrerId": form.referrerId,
      "userIntroduction": form.userIntroduction,
      "intentioncitys": form.intentioncitys,
      "intentionjobIds": form.intentionjobIds,
      "honorIds": form.honorIds,
      "certificateIds": form.certificateIds,
      "specialtyIds": form.specialtyIds,
    },"add");//添加用户
  }
})