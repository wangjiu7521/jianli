Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户Id
    userId: null,
    userSocialstate: false,
    userWorkstate: false,
    userSkillstate: false,
    userPtjobstate: false,
    //问卷调查相关
    practiceUpdate:false,
    workUpdate:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user = getApp().globalData.user;
    if (user) {
      that.setData({
        "user": user,
        userSocialstate: false,
        userWorkstate: false,
        userSkillstate: false,
        userPtjobstate: false,
        practiceUpdate: false,
        workUpdate: false,
      });
    } else {
      return;
    }
    //加载userId
    var userId = getApp().globalData.userId;

    that.setData({
      "userId": userId,
    });
    if (getApp().globalData.user.userSocialstate == 2) {
      that.setData({
        "userSocialstate": true,
      });
    }
    if (getApp().globalData.user.userPtjobstate == 2) {
      that.setData({
        "userPtjobstate": true,
      });
    }
    if (getApp().globalData.user.userWorkstate == 2) {
      that.setData({
        "userWorkstate": true,
      });
    }
    if (getApp().globalData.user.userSkillstate == 2) {
      that.setData({
        "userSkillstate": true,
      });
    }

    //加载问卷信息
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/getQuestionnaireByUserId.action",
      data: {
        "userId": that.data.userId,
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {
          var now = new Date().getTime();
          var questionnaire = res.data.questionnaire;
          if (questionnaire){
            that.setData({
              "questionnaire": questionnaire,
            })
          }else{
            that.setData({
              "workUpdate": true,
              "practiceUpdate": true,
            })
            return;
          }
          if(questionnaire.workUpdate == null){
            that.setData({
              "workUpdate": true,
            })
          }else{
            var UpdateTime = new Date(Date.parse(questionnaire.workUpdate)).getTime();
            if((now - UpdateTime)/1000/60/60/24 > 60 ){
              that.setData({
                "workUpdate": true,
              })
            }
          }
          if (questionnaire.practiceUpdate == null) {
            that.setData({
              "practiceUpdate": true,
            })
          } else {
            var UpdateTime = new Date(Date.parse(questionnaire.practiceUpdate)).getTime();
            if ((now - UpdateTime) / 1000 / 60 / 60 / 24 > 60) {
              that.setData({
                "practiceUpdate": true,
              })
            }
          }
        }
      },
      fail: function () {

      }
    })

  },
  onShow:function(){
    this.onLoad();
  },
  
  userSocialstateChange: function (event) {
    var that = this;
    var state = event.detail.value;
    console.log(state);
    if (state == true) {
      getApp().showModal(
        '提示',
        '您的社交状态已打开，您的基本信息会被查看',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateSocialState.action",
            data: {
              "userId": that.data.userId,
              "userSocialstate": 2,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userSocialstate = res.data.state;
                that.setData({
                  userSocialstate: true,
                });
              } else {
                that.setData({
                  userSocialstate: false,
                });
              }
            },
            fail: function () {
              that.setData({
                userSocialstate: false,
              });
            }
          })
        },
        function () {
          that.setData({
            userSocialstate: false,
          });
        });
    } else {
      getApp().showModal(
        '提示',
        '您的社交状态已关闭，您的基本信息不会被查看到',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateSocialState.action",
            data: {
              "userId": that.data.userId,
              "userSocialstate": 1,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userSocialstate = res.data.state;
                that.setData({
                  userSocialstate: false,
                });
              } else {
                that.setData({
                  userSocialstate: true,
                });
              }
            },
            fail: function () {
              that.setData({
                userSocialstate: true,
              });
            }
          })
        },
        function () {
          that.setData({
            userSocialstate: true,
          });
        });
    }
  },
  userPtjobstateChange: function (e) {
    var that = this;
    var state = 1;
    var msg = '';
    if (e.detail.value) {
      state = 2;
      msg = '您的兼职状态已打开，很快会有企业向您联系'
    } else {
      state = 1;
      msg = '您的兼职状态已关闭，企业将不会联系到您'
    }
    wx.showLoading({
      title: '保存中',
      mask: true,   //显示透明蒙层，防止触摸穿透，默认：false
    })
    var timeout = true;
    wx.request({
      url: getApp().globalData.domain + "/weixin/parttimer/" + getApp().globalData.userId,
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify({
        "method": "update",
        "parttimerId": getApp().globalData.userId,
        "parttimerState": state,
      }),
      success: res => {
        wx.hideLoading(); //关闭加载提示
        timeout = false;
        console.log(res.data);
        if (res.data.msg == "ok") {
          getApp().globalData.user.userPtjobstate = state;
          getApp().globalData.parttimer = res.data.parttimer;
          getApp().showToast(msg, 'none');
        }
      }
    })
  },
  userWorkstateChange: function (event) {
    var that = this;
    var state = event.detail.value;
    if (state == true) {
      getApp().showModal(
        '提示',
        '您的就业状态已打开，现在处于待就业状态，您可能很快会被企业挖掘',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateWorkState.action",
            data: {
              "userId": that.data.userId,
              "userWorkstate": 2,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userWorkstate = res.data.state;
                that.setData({
                  userWorkstate: true,
                });
              } else {
                that.setData({
                  userWorkstate: false,
                });
              }
            },
            fail: function () {
              that.setData({
                userWorkstate: false,
              });
            }
          })
        },
        function () {
          that.setData({
            userWorkstate: false,
          });
        });
    } else {
      getApp().showModal(
        '提示',
        '关闭您的就业状态，企业将不会与您联系',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateWorkState.action",
            data: {
              "userId": that.data.userId,
              "userWorkstate": 1,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userWorkstate = res.data.state;
                that.setData({
                  userWorkstate: false,
                });
                if (that.data.workUpdate){
                  wx.navigateTo({
                    url: '/pages/wenjuan/wenjuan?update=work',
                  })
                }
              } else {
                that.setData({
                  userWorkstate: true,
                });
              }
            },
            fail: function () {
              that.setData({
                userWorkstate: true,
              });
            }
          })
        },
        function () {
          that.setData({
            userWorkstate: true,
          });
        });
    }
  },

  userSkillstateChange: function (event) {
    var that = this;
    var state = event.detail.value;
    if (state == true) {
      getApp().showModal(
        '提示',
        '您的技能状态已打开，您的技能将会被查看',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateSkillState.action",
            data: {
              "userId": that.data.userId,
              "userSkillstate": 2,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userSkillstate = res.data.state;
                that.setData({
                  userSkillstate: true,
                });
              } else {
                that.setData({
                  userSkillstate: false,
                });
              }
            },
            fail: function () {
              that.setData({
                userSkillstate: false,
              });
            }
          })
        },
        function () {
          that.setData({
            userSkillstate: false,
          });
        });
    } else {
      getApp().showModal(
        '提示',
        '您的技能状态已关闭，您的技能将不会被查看',
        function () {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/updateSkillState.action",
            data: {
              "userId": that.data.userId,
              "userSkillstate": 1,
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.msg == 'ok') {
                getApp().globalData.user.userSkillstate = res.data.state;
                that.setData({
                  userSkillstate: false,
                });
                if (that.data.practiceUpdate) {
                  wx.navigateTo({
                    url: '/pages/wenjuan/wenjuan?update=practice',
                  })
                }
              } else {
                that.setData({
                  userSkillstate: true,
                });
              }
            },
            fail: function () {
              that.setData({
                userSkillstate: true,
              });
            }
          })
        },
        function () {
          that.setData({
            userSkillstate: false,
          });
        });
    }
  },
  onShareAppMessage: function (options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },
})