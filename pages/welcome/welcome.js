// pages/index/index.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "乐在人才平台",
    logo: "../../images/logo1.png",
    initCount: 0,
    //需要加载四项：options,userId,userCustom,partimer
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    getApp().globalData.init = true;
    console.log("进入欢迎页");
    console.log(getApp().globalData.referrerUserId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("进入小程序，开始初始化...");
    var that = this
    var initCount = 0;
    //初始化完成了几项
    var options = null;
    var citys = null;
    var areas = null;
    var optionsInit = false;
    wx.request({
      url: getApp().globalData.domain + "/weixin/options/getAllOptions.action",
      success: function(res) {
        console.log(res.data)
        if (res.data.msg == "ok") {
          options = res.data.options
          getApp().globalData.options = options
          wx.setStorageSync("options", options)
          wx.request({
            url: getApp().globalData.domain + "/weixin/options/getCitysByProCode.action",
            data: {
              "proCode": options.provinces[0].codeP,
            },
            success: function(res) {
              console.log(res.data);
              citys = res.data;
              getApp().globalData.citys = citys;
              wx.setStorageSync("citys", citys);

              wx.request({
                url: getApp().globalData.domain + "/weixin/options/getAreasByCityCode.action",
                data: {
                  "cityCode": citys[0].codeC,
                },
                success: function(res) {
                  optionsInit = true;
                  console.log(res.data);
                  areas = res.data;
                  getApp().globalData.areas = areas;
                  wx.setStorageSync("areas", areas);
                }
              });
            }
          });
        }
      }
    })

    //同步获取缓存中的userId
    var userId = wx.getStorageSync("userId");
    if (userId) {
      getApp().globalData.userId = userId;
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: getApp().globalData.domain + '/weixin/user/getUserId.action',
              data: {
                code: res.code
              },
              success: function(res) {
                console.log(res.data);
                var userId = res.data.userId;
                //存到缓存中
                wx.setStorageSync('userId', userId);
                //存到全局变量中
                getApp().globalData.userId = userId;
              },
              fail: function() {
                getApp().showToast("系统维护中", 'none');
              }
            })
          }
        }
      });
    }

    //获取人才数据库用户信息
    getApp().delay(function() {
      if (getApp().globalData.userId && optionsInit) {
        wx.request({
          url: getApp().globalData.domain + "/weixin/user/getUserCustomByUserId.action",
          data: {
            "userId": getApp().globalData.userId,
          },
          //接口调用成功后，将接受到的用户信息存储到全局变量中，
          success: function(res) {
            initCount = 1;
            console.log(res.data);
            if (res.data.msg == "ok") {
              //如果得到自己的用户信息，将用户信息保存到全局变量中
              getApp().globalData.user = res.data.user;
              getApp().globalData.outworker = res.data.user.outworker;
              getApp().globalData.parttimer = res.data.user.parttimer;
              getApp().globalData.jobhunter = res.data.user.jobhunter;
            }
          },
          fail: function() {
            getApp().showToast("系统维护中", 'none');
          }
        })

      } else {
        return true;
      }
    }, 100)

    getApp().delay(function() {
      if (initCount == 1) {
        if (getApp().globalData.user) {
          wx.request({
            url: getApp().globalData.domain + "/weixin/user/getUserscore.action",
            data: {
              "userId": getApp().globalData.userId,
            },
            success: function(res) {
              console.log("获取积分信息");
              console.log(res.data);
              if (res.data.msg == 'ok') {
                var userscore = res.data.userscore;
                getApp().globalData.userscore = userscore;
                var now = new Date();
                var time = new Date(Date.parse(userscore.signinTime));
                if (now.getDate() == time.getDate()) {
                  getApp().globalData.signIn = true;
                  // wx.redirectTo({
                  //   url: '/pages/message/message',
                  // })
                  wx.switchTab({
                    url: '/pages/index/index', //正常逻辑
                  })
                } else {
                  wx.request({
                    url: getApp().globalData.domain + "/weixin/user/signIn.action",
                    data: {
                      "userId": getApp().globalData.userId,
                    },
                    success: function(res) {
                      console.log(res.data);
                      if (res.data.msg == 'ok') {
                        getApp().globalData.userscore = res.data.userscore;
                        getApp().globalData.signIn = true;
                        wx.redirectTo({
                          url: '/pages/qiandao/qiandao',
                        })
                      }
                    },
                  })
                }
              }
            },
          })
        } else {
          wx.redirectTo({
            url: '/pages/first/first',
          })
        }
        return false;
      } else {
        return true;
      }
    }, 500)


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})