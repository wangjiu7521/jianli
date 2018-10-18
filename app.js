const updateManager = wx.getUpdateManager()
App({

  //全局变量，每个页面都可以使用
  globalData: {
    init: false,
    domain: 'https://lezaixy.com',
    userPhotoUrl: "https://lezaixy.com/images/weixin/icon/photo.png",
    //请求头
    header: {
      'Cookie': '',
      "Content-type": "application/json;charset=UTF-8",
    },
    //用户ID
    userId: null,
    cookie: null,
    //分享者的ID
    referrerUserId: null,
    //用户个人信息
    user: null,
    //兼职信息
    parttimer: null,
    //兼职信息
    outworker: null,
    //兼职信息
    jobhunter: null,
    //分析数据
    options: null,
    citys: null,
    areas: null,
    jibenShow: { //基本信息
      userPhotoUrl: "",
      /************/
      userName: "", //名字
      userGender: "", //性别
      userTel: "", //电话
      userQq: "", //QQ
      userEmail: "", //邮箱
      schoolValue: "",
    },
    parttimerShow: { //兼职信息
      intentionparttimeValues: [],
      parttimeaddrValues: [],
      parttimerState: false,
      worktimeValues: [],
    },
    outworkerShow: { //技能信息
      skillIntroduction: "", //自我介绍
      specialtyValues: [],
    },
    jobhunterShow: {
      userSno: "", //学号
      userGraduatetime: "", //毕业时间
      userNativeplace: "", //籍贯
      specialdetailed: "", //具体专业
      userIntroduction: "", //自我介绍
      referrerValue: null,
      experienceValue: "",
      specialValue: "",
      educationValue: "",
      intentionjobValues: [],
      certificateValues: [],
      honorValues: [],
      intentioncitys: [],
    },

    parttimerForm: {
      intentionparttimeIds: [],
      parttimeaddrIds: [],
      parttimerState: 1,
      worktimeIds: [],
    },
    //表单
    jibenForm: {
      userPhotoUrl: "",
      /************/
      userName: "", //名字
      userGender: "", //性别
      userTel: "", //电话
      userQq: "", //QQ
      userEmail: "", //邮箱
      schoolId: 0, //毕业院校
      enterCodeC: "",
    },
    outworkerForm: {
      skillIntroduction: "", //自我介绍
      specialtyIds: [0, 0, 0] //特长
    },
    jobhunterForm: {
      userSno: "", //学号
      userGraduatetime: "", //毕业时间
      referrerId: 0, //伯乐
      experienceId: 0, //工作经验ID
      specialId: 0, //专业ID
      educationId: 0, //学历ID
      userNativeplace: "", //籍贯
      nativeplaceCodeA: "",
      specialdetailed: "", //具体专业
      userIntroduction: "", //自我介绍
      intentioncitys: ["", "", ""], //意向城市id数组
      intentioncityCodes: ["", "", ""], //意向城市id数组
      intentionjobIds: [0, 0, 0], //意向岗位
      honorIds: [0, 0, 0], //荣誉 
      certificateIds: [0, 0, 0] //证书
    },
  },

  //小程序启动后，开始执行的方法
  onLaunch: function(Object) {
    var that = this;
    //小程序加载
    console.log("检查更新");
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          } else {
            wx.navigateBack({
              delta: -5
            })
          }
        }
      })
    })

    console.log(Object.query);
    that.globalData.referrerUserId = Object.query.referrerUserId;
    if (Object.path != 'pages/welcome/welcome') {
      console.log("重定向到欢迎页");
      wx.redirectTo({
        url: '/pages/welcome/welcome', //正常逻辑
      })
    }
  },

  uploadPhoto: function(userPhotoUrl) {
    var that = this;
    var imgName = "照片";
    if (userPhotoUrl == null || userPhotoUrl == "" || userPhotoUrl == getApp().globalData.userPhotoUrl) {
      return;
    } //如果没选择照片，就返回
    if (getApp().globalData.user && getApp().globalData.user.userPhotoUrl && userPhotoUrl == getApp().globalData.user.userPhotoUrl) {
      return;
    } //如果照片和以前的相同
    wx.uploadFile({
      url: getApp().globalData.domain + '/weixin/user/uploadPhotoByUserId.action',
      filePath: userPhotoUrl,
      name: imgName,
      header: {
        'content-type': 'application/json', // 默认值
        'X-Requested-With': 'XMLHttpRequest'
      },
      formData: {
        'userId': getApp().globalData.userId,
        "imgName": imgName,
      },
      success: function(res) {
        var data = JSON.parse(res.data)
        console.log(data);
        if (data.msg == "ok") {
          getApp().globalData.user.userPhotoUrl = data.userPhotoUrl;
          getApp().showToast('保存成功了亲');
        } else {
          getApp().showToast("上传照片失败了亲", "none");
        }
      },
      fail: function() {
        getApp().showToast("上传照片失败了亲", "none");
      }
    })
  },
  updateUser: function(data, method, fun) {
    data.userId = getApp().globalData.userId;
    var userPhotoUrl = data.userPhotoUrl;
    if (userPhotoUrl == "" || userPhotoUrl == getApp().globalData.userPhotoUrl) {
      userPhotoUrl=null;
    } 
    if (getApp().globalData.user && getApp().globalData.user.userPhotoUrl && userPhotoUrl == getApp().globalData.user.userPhotoUrl) {
      userPhotoUrl = null;
    }
    data.userPhotoUrl = null; // 照片更改单独发起请求，不能用这个接口，因为照片缓存路径太长，会让数据库报错
    console.log("header:", getApp().globalData.header);
    if (method == 'add') { 
      wx.login({
        success: function(res) {
          data.code = res.code;
          data.referrerUserId = getApp().globalData.referrerUserId
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/addUser.action",
            method: "post",
            header: getApp().globalData.header,
            data: JSON.stringify(data),
            success: function(res) {
              if (res.data.msg == 'ok') {
                var user = res.data.user;
                getApp().globalData.user = user;
                if (userPhotoUrl != null) {
                  getApp().uploadPhoto(userPhotoUrl); // 上传照片
                } else {
                  getApp().showToast('保存成功了亲');
                }
                if (fun) {
                  fun();
                }
              } else {
                getApp().showToast('保存失败了亲', 'none');
              }
            },
            fail: function() {
              getApp().showToast('保存失败了亲', 'none');
            }
          })
        }
      })
    } else {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/updateUser.action",
        method: "post",
        header: getApp().globalData.header,
        data: JSON.stringify(data),
        success: function(res) {
          if (res.data.msg == 'ok') {
            getApp().globalData.user = res.data.user;
            if (userPhotoUrl != null) {
              console.log("传照片")
              getApp().uploadPhoto(userPhotoUrl); // 上传照片
            } else {
              console.log("直接提示")
              getApp().showToast('保存成功了亲');
            }
          } else if (res.data.msg == 'code') {
            getApp().showToast('验证码错误', 'none');
          } else {
            getApp().showToast('系统异常', 'none');
          }
        },
        fail: function() {
          getApp().showToast('系统异常', 'none');
        }
      })
    }
  },
  updateParttimer: function(data, method) {
    data.userId = getApp().globalData.userId;
    wx.showLoading({
      title: '保存中',
      mask: true, //显示透明蒙层，防止触摸穿透，默认：false
    })
    var timeout = true;
    wx.request({
      url: getApp().globalData.domain + "/weixin/parttimer/" + getApp().globalData.userId,
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify(data),
      success: res => {
        wx.hideLoading(); //关闭加载提示
        timeout = false;
        console.log(res.data);
        if (res.data.msg == "ok") {
          if (method == 'add') {
            getApp().globalData.user = res.data.user;
            getApp().globalData.parttimer = res.data.user.parttimer;
          } else {
            getApp().globalData.parttimer = res.data.parttimer;
          }
          getApp().showToast('保存成功了亲');
          if (method == "update") {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.switchTab({
              url: '../../pages/index/index',
            })
          }
        } else {
          getApp().showToast("保存失败", "none")
        }
      }
    })
    setTimeout(function() {
      if (timeout == true) {
        wx.hideLoading()
        getApp().showToast("保存失败", "none")
      }
    }, 5000)
  },
  updateOutworker: function(data, method) {
    data.userId = getApp().globalData.userId;
    if (method == 'add') {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/addOutworker.action",
        method: "post",
        header: {
          "Content-type": "application/json;charset=UTF-8",
        },
        data: JSON.stringify(data),
        success: function(res) {
          console.log(res.data)
          if (res.data.msg == 'ok') {
            var user = res.data.user;
            getApp().globalData.user = user;
            getApp().globalData.outworker = user.outworker;
            wx.switchTab({
              url: '../../pages/index/index',
            })
          } else {
            getApp().showToast('提交失败了亲', 'none');
          }
        },
        fail: function() {
          getApp().showToast('提交失败了亲', 'none');
        }
      })
    } else {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/updateOutworker.action",
        method: "post",
        header: {
          "Content-type": "application/json;charset=UTF-8",
        },
        data: JSON.stringify(data),
        success: function(res) {
          console.log(res.data)
          if (res.data.msg == 'ok') {
            getApp().globalData.outworker = res.data.outworker;
            getApp().showToast('提交成功了亲');
            getApp().delay(function() {
              wx.navigateBack({
                delta: 1
              })
              return false;
            }, 1000)
          } else {
            getApp().showToast('提交失败了亲', 'none');
          }
        },
        fail: function() {
          getApp().showToast('提交失败了亲', 'none');
        }
      })
    }

  },
  updateJobhunter: function(data, method) {
    data.userId = getApp().globalData.userId;
    var userPhotoUrl = data.userPhotoUrl;
    data.userPhotoUrl = null;
    if (method == 'add') {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/addJobhunter.action",
        method: "post",
        header: {
          "Content-type": "application/json;charset=UTF-8",
        },
        data: JSON.stringify(data),
        success: function(res) {
          console.log(res.data)
          if (res.data.msg == 'ok') {
            var user = res.data.user;
            getApp().globalData.user = user;
            getApp().globalData.jobhunter = user.jobhunter;
            getApp().showToast('提交成功了亲');
            wx.switchTab({
              url: '../../pages/index/index',
            })
          } else {
            getApp().showToast('提交失败了亲', 'none');
          }
        },
        fail: function() {
          getApp().showToast('提交失败了亲', 'none');
        }
      })
    } else {
      wx.request({
        url: getApp().globalData.domain + "/weixin/user/updateJobhunter.action",
        method: "post",
        header: {
          "Content-type": "application/json;charset=UTF-8",
        },
        data: JSON.stringify(data),

        success: function(res) {
          console.log(res.data)
          if (res.data.msg == 'ok') {
            getApp().globalData.jobhunter = res.data.jobhunter;
            getApp().showToast('提交成功了亲');
            getApp().delay(function() {
              wx.navigateBack({
                delta: 1
              })
              return false;
            }, 1000)
          } else {
            getApp().showToast('提交失败了亲', 'none');
          }
        },
        fail: function() {
          getApp().showToast('提交失败了亲', 'none');
        }
      })
    }
  },
  showToast: function(msg, style) {
    wx.hideLoading()
    var s = style || 'success';
    wx.showToast({
      title: msg,
      icon: s,
      duration: 1500
    })
  },
  showModal: function(title, msg, fun1, fun2) {
    wx.showModal({
      title: title,
      content: msg,
      success: function(res) {
        if (res.confirm) {
          if (fun1)
            fun1();
        } else if (res.cancel) {
          //点击取消回调
          if (fun2)
            fun2();
        }
      }
    })
  },
  delay: function(fun, time, loop) {
    setTimeout(function() {
      if (fun)
        loop = fun();
      if (loop) {
        getApp().delay(fun, time, loop);
      }
    }, time)
  },
  //验证手机号[1-9][0-9]{4,14}
  isPoneAvailable: function(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  //验证QQ
  isQqAvailable: function(str) {
    var myreg = /^[1-9][0-9]{4,14}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  //验证Email
  isEmailAvailable: function(str) {
    var myreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  getShareAppMessage: function(options) {
    var shareObj = {
      title: "大学生人才数据库", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/welcome/welcome?referrerUserId=' + getApp().globalData.userId, // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: 'https://lezaixy.com/images/weixin/bgimg/welcome.jpg',
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("转发小程序成功，请求服务器更新积分");
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/shareApp.action",
            data: {
              "userId": getApp().globalData.userId,
            },
            success: function(res) {
              if (res.data.msg == 'ok') {
                var userscore = res.data.userscore;
                getApp().globalData.userscore = userscore;
              }
            },
          })
        }
      },
      fail: function(res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },

    }
    return shareObj;
  }
})