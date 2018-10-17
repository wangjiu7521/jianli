var jobhunterUtil = require('../../utils/jobhunterUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //表单选项
    options: {},
    regionIndex: [0, 0, 0],
    regionArray: [[], [], []],
    //用户Id
    userId: null,
    /* photoUrl: "/images/photo.png",
     "img": '/images/photo.png',*/
    //自定义用户信息   
    jobhunterForm: {
      userNativeplace: "",   //籍贯值数组
      nativeplaceCodeA: "", //籍贯id数组
    },

    userNativeplace: ['省', '市', '区'],

    citys: [],//初始化数组
    areas: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */

  //表单页面初始化
  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var jobhunter = getApp().globalData.jobhunter;
    var options = getApp().globalData.options;
    var citys = getApp().globalData.citys;
    var areas = getApp().globalData.areas;
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
      "regionArray[0]": options.provinces,
      "regionArray[1]": citys,
      "regionArray[2]": areas,
      "citys": citys,
      "areas": areas,
    });
    if (jobhunter) {
      that.setData({
        "jobhunter": jobhunter,
      });
    }
    console.log(that.data);


  },

  regionChange: function (e) {//籍贯
    var that = this;
    console.log(e);
    var id = e.currentTarget.id;
    var indexs = e.detail.value;
    var province = that.data.regionArray[0][indexs[0]].name;
    var city = that.data.regionArray[1][indexs[1]].name;
    var area = that.data.regionArray[2][indexs[2]].name;
    var codeA = that.data.regionArray[2][indexs[2]].codeA;
    var userNativeplace = province + city + area;
    this.setData({
      'userNativeplace[0]': province,
      'userNativeplace[1]': city,
      'userNativeplace[2]': area,
      'jobhunterForm.userNativeplace': userNativeplace,
      'jobhunterForm.nativeplaceCodeA': codeA,
    });
    that.setData({
      "regionArray[1]": that.data.citys,
      "regionArray[2]": that.data.areas,
      "regionIndex": [0, 0, 0],
    });//恢复到初始态
  },
  regionColumnChange: function (e) {//籍贯
    var that = this;
    var id = e.currentTarget.id;
    var column = e.detail.column;
    var index = e.detail.value;
    if (column == 0) {
      that.setData({
        "regionArray[1]": [],
        "regionArray[2]": [],
      });
      wx.request({
        url: getApp().globalData.domain + "/weixin/options/getCitysByProCode.action",
        data: {
          "proCode": that.data.regionArray[0][index].codeP,
        },
        success: function (res) {
          that.setData({
            "regionArray[1]": res.data,
          });
          wx.request({
            url: getApp().globalData.domain + "/weixin/options/getAreasByCityCode.action",
            data: {
              "cityCode": that.data.regionArray[1][0].codeC,
            },
            success: function (res) {
              that.setData({
                "regionArray[2]": res.data,
              });
            }
          });
        }
      });
    } else if (column == 1) {
      that.setData({
        "regionArray[2]": [],
      });
      wx.request({
        url: getApp().globalData.domain + "/weixin/options/getAreasByCityCode.action",
        data: {
          "cityCode": that.data.regionArray[1][index].codeC,
        },
        success: function (res) {
          that.setData({
            "regionArray[2]": res.data,
          });
        }
      });
    }
  },


  submit: function () {
    var that = this
    if (that.data.jobhunterForm.userNativeplace == null ) {
      getApp().showToast("您的籍贯没选哦亲", 'none');
      //名字获取焦点
      return false;
    }
    if (that.data.jobhunter) {
      getApp().updateJobhunter(that.data.jobhunterForm);
    } else {
      getApp().globalData.jobhunterForm.userNativeplace = that.data.jobhunterForm.userNativeplace
      getApp().globalData.jobhunterForm.nativeplaceCodeA = that.data.jobhunterForm.nativeplaceCodeA
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