
Page({

  /**
  * 页面的初始数据
  */
  data: {
    userId: null,
    usrCustom: null,
    jobhunter:null,
    personalData:null,
    specialtyPercent: null,
    specialPercent: null,
    intentionjobPercent: null,
    userNativeplacePercent: null,
    schoolPercent: null,
    honorPercent: null,
    score:null,
    certificatePercent: null,
    random: null,
    comment: ["竞争加油", "竞争可观", "竞争有利"],
    commentIndex : 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var userCustom = getApp().globalData.userCustom;
    var jobhunter = getApp().globalData.jobhunter;
    if (jobhunter) {
      that.setData({
        "jobhunter": jobhunter,
      });
    } else {
      return;
    }
    var userId = getApp().globalData.userId;
    var personalData = getApp().globalData.personalData;  //这个分析数据要保证实时更新，所以不能放在缓存，但可以放在全局变量  
    that.setData({
      "userId": userId,
      "personalData":personalData,
    });
    if (personalData){
      that.initPersonalData(personalData);
    }
    wx.request({
        url: getApp().globalData.domain + "/weixin/user/getPersonalDataByUserId.action",
        data: {
          "userId": getApp().globalData.userId,
        },
        //接口调用成功后，将接受到的用户信息存储到全局变量中，
        success: function (res) {
          console.log(res.data);
          if (res.data.msg == "ok") {
            that.initPersonalData(res.data.personalData);
            console.log(that.data);
          }
        },
        fail: function () {
          getApp().showTitle("系统维护中");
        }
      })
  },

  initPersonalData: function (personalData){
    var that = this;
    if(personalData){
      getApp().globalData.personalData = personalData;
    }else{
      personalData = getApp().globalData.personalData;
    }
    var specialtyPercent = (personalData.sameSpecialtysCount / personalData.headCount) * 100;
    var specialPercent = (personalData.sameSpecialsCount / personalData.headCount) * 100;
    var intentionjobPercent = (personalData.sameIntentionjobCount / personalData.headCount) * 100;
    var userNativeplacePercent = (personalData.sameUserNativeplaceCount / personalData.headCount) * 100;
    var schoolPercent = (personalData.sameSchoolCount / personalData.headCount) * 100;
    var honorPercent = (personalData.sameHonorCount / personalData.headCount) * 100;
    var certificatePercent = (personalData.sameCertificateCount / personalData.headCount) * 100;
    var score = (specialtyPercent + specialPercent + intentionjobPercent + userNativeplacePercent + schoolPercent + honorPercent + certificatePercent) / 7;
    var commentIndex = 0;
    if(score >=85 ){
      commentIndex = 2;
    } else if (score >= 60){
      commentIndex = 1;
    }
    var userNumber = personalData.number + 200;
    var headCount = 1000;
    if (personalData.headCount > headCount) {
      headCount = (personalData.headCount / 500).toFixed(0) * 500;
    }
    var leadNumber = headCount - personalData.number;
    that.setData({
      "score": score.toFixed(0),
      "commentIndex": commentIndex,
      "leadNumber": leadNumber,
      "userNumber": userNumber,
      'personalData': personalData,
      'userNumber': userNumber,
      'specialtyPercent': specialtyPercent.toFixed(0),
      'specialPercent': specialPercent.toFixed(0),
      'intentionjobPercent': intentionjobPercent.toFixed(0),
      'userNativeplacePercent': userNativeplacePercent.toFixed(0),
      'schoolPercent': schoolPercent.toFixed(0),
      'honorPercent': honorPercent.toFixed(0),
      'certificatePercent': certificatePercent.toFixed(0),
    });
  },
  onShow: function () {
    var that = this;
    that.onLoad();
  },

  onShareAppMessage: function (options){
    var that = this;
    return getApp().getShareAppMessage(options);
  },


  /*注册按钮*/
  ruzhu: function () {
    wx.navigateTo({
      url: '/pages/jianli/jianli',   //state：1 注册，2 修改
    })
  },


})
