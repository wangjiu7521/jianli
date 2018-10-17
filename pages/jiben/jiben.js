// pages/jiben/jiben.js
var jibenUtil = require('../../utils/jibenUtil.js');

Page({

  data: {
    options: {},
    codeBtnText: "获取验证码",
    delay: 0,
    codeInputHidden: true,
    userId: null,
    userPhotoUrl: "https://lezaixy.com/images/weixin/icon/photo.png",
    img: 'https://lezaixy.com/images/weixin/icon/photo.png',
    jibenForm: {
      userPhotoUrl: "",
      userName: "", //名字
      userGender: "", //性别
      schoolId: 0,
      enterCodeC: "",
      userTel: "", //电话
      userQq: "", //QQ号
      userEmail: "", //籍贯
      verificationCode:"",//验证码
    },
    
    arraysex: ['男', '女'],
    userGender: null,
    zhuce: null,
  },
  //表单页面初始化
  onLoad: function(arg) {
    //引用页面对象
    console.log("页面参数:")
    console.log(arg)
    var that = this
    if (arg.zhuce) {
      var zhuce = arg.zhuce
      that.setData({
        zhuce: zhuce
      })
    }

    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var user = getApp().globalData.user;
    var options = getApp().globalData.options;
    var jibenForm = that.data.jibenForm;

    var userPhotoUrl = that.data.userPhotoUrl;
    jibenForm = jibenUtil.initJibenForm(jibenForm, user);
    var jibenShow = jibenUtil.initJibenShow(user, options);
    if (user && user.userPhotoUrl && user.userPhotoUrl != "") {
      userPhotoUrl = getApp().globalData.domain + user.userPhotoUrl + "?time=" + Math.random();
    } else if (getApp().globalData.jibenForm.userPhotoUrl && getApp().globalData.jibenForm.userPhotoUrl != "") {
      userPhotoUrl = getApp().globalData.jibenForm.userPhotoUrl;
    }
    that.setData({
      'options': options,
      "userId": userId,
      "jibenForm": jibenForm,
      "jibenShow": jibenShow,
      'user': user,
      "userPhotoUrl": userPhotoUrl,
    });
    console.log(that.data);
  },
  username: function(e) { //姓名
    var that = this
    console.log('usernameChange', e);
    that.setData({
      "jibenForm.userName": e.detail.value,
    })
    console.log("姓名：", that.data.jibenForm.userName);
  },
  userTel: function(e) { //联系方式
    var that = this
    console.log('userTelChange', e);
    that.setData({
      "jibenForm.userTel": e.detail.value,
    })
    console.log("联系方式：", that.data.jibenForm.userTel);
  },
  userEmail: function (e) { //联系方式
    var that = this
    console.log('userEmailChange', e);
    that.setData({
      "jibenForm.userEmail": e.detail.value,
    })
    console.log("联系方式：", that.data.jibenForm.userEmail);
  },
  userQq: function(e) { //联系方式
    var that = this
    console.log('userQqChange', e);
    that.setData({
      "jibenForm.userQq": e.detail.value,
    })
    console.log("Qq：", that.data.jibenForm.userQq);
  },
  verificationCode: function (e) { //联系方式
    var that = this
    console.log('verificationCodeChange', e);
    that.setData({
      "jibenForm.verificationCode": e.detail.value,
    })
    console.log("验证码：", that.data.jibenForm.verificationCode);
  },
  userGender: function(e) { //性别
    var that = this
    console.log('userGenderChange', e);
    var index = e.detail.value;
    that.setData({
      "jibenForm.userGender": that.data.arraysex[index],
      'userGender': that.data.arraysex[index]
    })
    console.log("性别：", that.data.jibenForm.userGender);
  },
  schoolChange: function(e) { //学校分类
    var that = this
    console.log('schoolChange', e)
    var index = e.detail.value
    var Id = that.data.options.schools[index].schoolId
    that.setData({
      "schoolIndex": index,
      "jibenForm.schoolId": Id,
      "jibenForm.enterCodeC": that.data.options.schools[index].codeC,
      "jibenShow.schoolValue": that.data.options.schools[index].schoolValue,

    })
    console.log("已选学校Id：", that.data.jibenForm.schoolId);
  },

  choosePhoto: function(e) {
    var that = this
    getApp().showModal("选择照片", "请选择1MB以内的，否则会失败哦亲", function() {
      wx.chooseImage({
        sizeType: ['compressed'], //限定压缩图
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        count: 1,
        success: function(res) {
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function(res) {
              console.log(res)
              if (res.type == 'jpeg') {
                var tempFilePaths = res.path;
                that.setData({
                  "userPhotoUrl": tempFilePaths,
                  "jibenForm.userPhotoUrl": tempFilePaths,
                })
              } else {
                getApp().showToast('请上传jpg格式的图片', 'none');
              }
            },
          })

        }
      })
    });
  },
  disabledMsg:function(){
    getApp().showToast("这一项不可更改", 'none');
  },

  getCode: function() {
    var that = this;
    if (that.data.delay > 0) return;
    if (that.data.jibenForm.userTel ==null || that.data.jibenForm.userTel == "") {
      getApp().showToast("联系方式没填哦亲", 'none');
      return;
    }
    if (!getApp().isPoneAvailable(that.data.jibenForm.userTel)) {
      getApp().showToast("手机号格式不对哦亲", 'none');
      //名字获取焦点
      return;
    }
    console.log(that.data.jibenForm.userTel);
    console.log("获取验证码");
    var delay = that.data.delay;
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/getTelCode.action",
      header: getApp().globalData.header,
      data: {
        userTel: that.data.jibenForm.userTel
      },
      success: function(res) {
        console.log(res);
        if (res.data.msg == "ok")
          getApp().globalData.header.Cookie = 'JSESSIONID='+res.data.sessionId;
        else
          getApp().showToast("验证码获取次数频繁，请稍后重试", 'none');
      }
    });
    delay = 60
    that.setData({
      delay: delay
      , codeInputHidden:false
    })
    getApp().delay(function() {
      delay--;
      that.setData({
        delay: delay
      })
      if (delay <= 0) return false;
      return true;
    }, 1000);

  },

  submit: function() {
    var that = this
    console.log("提交表单",that.data.jibenForm);
    if (that.data.jibenForm.userName == null || that.data.jibenForm.userName == '') {
      getApp().showToast("姓名没填哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jibenForm.userGender == null || that.data.jibenForm.userGender == '') {
      getApp().showToast("性别没选哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jibenForm.schoolId == 0) {
      getApp().showToast("学校没选哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jibenForm.userTel == null || that.data.jibenForm.userTel == '') {
      getApp().showToast("手机号没填哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (!getApp().isPoneAvailable(that.data.jibenForm.userTel)) {
      getApp().showToast("手机号格式不对哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jibenForm.userQq != '' && !getApp().isQqAvailable(that.data.jibenForm.userQq)) {
      getApp().showToast("QQ号格式不对哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jibenForm.userEmail == null || that.data.jibenForm.userEmail == '') {
      getApp().showToast("邮箱没填哦亲", 'none');
      return false;
    }
    if (!getApp().isEmailAvailable(that.data.jibenForm.userEmail)) {
      getApp().showToast("邮箱格式不对哦亲", 'none');
      return false;
    } 
    if (that.data.jibenForm.verificationCode == null || that.data.jibenForm.verificationCode == '') {
      getApp().showToast("验证码没有填哦亲", 'none');
      return false;
    }
    if (that.data.user) {
      getApp().updateUser({
        "userName": that.data.jibenForm.userName,
        "userGender": that.data.jibenForm.userGender,
        "userTel": that.data.jibenForm.userTel,
        "userQq": that.data.jibenForm.userQq,
        "userPhotoUrl": that.data.jibenForm.userPhotoUrl,
        "userEmail": that.data.jibenForm.userEmail,
        "verificationCode": that.data.jibenForm.verificationCode,
      });

    } else {
      getApp().globalData.jibenForm.userName = that.data.jibenForm.userName
      getApp().globalData.jibenForm.userGender = that.data.jibenForm.userGender
      getApp().globalData.jibenForm.userTel = that.data.jibenForm.userTel
      getApp().globalData.jibenForm.userQq = that.data.jibenForm.userQq
      getApp().globalData.jibenForm.schoolId = that.data.jibenForm.schoolId
      getApp().globalData.jibenForm.enterCodeC = that.data.jibenForm.enterCodeC
      getApp().globalData.jibenForm.userEmail = that.data.jibenForm.userEmail
      getApp().globalData.jibenForm.userPhotoUrl = that.data.jibenForm.userPhotoUrl
      getApp().globalData.jibenForm.verificationCode = that.data.jibenForm.verificationCode
      if(that.data.zhuce == '1'){
        wx.navigateTo({
          url: '../../pages/signin/signin?zhuce=' + that.data.zhuce,
        })
      } else if (that.data.zhuce == '2'){
        wx.navigateTo({
          url: '../../pages/techang/techang?zhuce=' + that.data.zhuce,
        })
      }else{
        wx.navigateTo({
          url: '../../pages/jianli/jianli?zhuce=' + that.data.zhuce,
        })
      }
    }

  }
})