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
      intentioncitys: ["", "", ""],   //意向城市id数组
      intentioncityCodes: ["", "", ""], //意向城市id数组
    },
   
    intentioncity1: ['省', '市', '区'],
    intentioncity2: ['省', '市', '区'],
    intentioncity3: ['省', '市', '区'],
   
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
    if (jobhunter){
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
    var intentioncity = province + city + area;
    if (id == 'intentioncity1') {
      if (intentioncity == that.data.jobhunterForm.intentioncitys[1] || intentioncity == that.data.jobhunterForm.intentioncitys[2]){
        getApp().showToast("意向城市重复哦亲", "none");
        return;
      }
      this.setData({
        'intentioncity1[0]': province,
        'intentioncity1[1]': city,
        'intentioncity1[2]': area,
        'jobhunterForm.intentioncitys[0]': intentioncity,
        'jobhunterForm.intentioncityCodes[0]': codeA,
      });
      console.log("已选意向城市1：", that.data.jobhunterForm.intentioncitys[0]);
    } else if (id == 'intentioncity2') {
      if (intentioncity == that.data.jobhunterForm.intentioncitys[0] || intentioncity == that.data.jobhunterForm.intentioncitys[2]) {
        getApp().showToast("意向城市重复哦亲", "none");
        return;
      }
      this.setData({
        'intentioncity2[0]': province,
        'intentioncity2[1]': city,
        'intentioncity2[2]': area,
        'jobhunterForm.intentioncitys[1]': intentioncity,
        'jobhunterForm.intentioncityCodes[1]': codeA,
      });
      console.log("已选意向城市2：", that.data.jobhunterForm.intentioncitys[1]);
    } else if (id == 'intentioncity3') {
      if (intentioncity == that.data.jobhunterForm.intentioncitys[0] || intentioncity == that.data.jobhunterForm.intentioncitys[1]) {
        getApp().showToast("意向城市重复哦亲", "none");
        return;
      }
      this.setData({
        'intentioncity3[0]': province,
        'intentioncity3[1]': city,
        'intentioncity3[2]': area,
        'jobhunterForm.intentioncitys[2]': intentioncity,
        'jobhunterForm.intentioncityCodes[2]': codeA,
      });
      console.log("已选意向城市3：", that.data.jobhunterForm.intentioncitys[2]);
    }
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
    var that=this
    if (that.data.jobhunterForm.intentioncitys[0] == null && that.data.jobhunterForm.intentioncitys[1] == null && that.data.form.intentioncitys[2] == null) {
      getApp().showToast("至少选一个意向城市哦亲", 'none');
      //名字获取焦点
      return false;
    }
    //对数组参数校验
    //意向城市
    var num = that.data.jobhunterForm.intentioncitys.length;
    for (var i = 0; i < (3 - num); i++) {
      that.data.jobhunterForm.intentioncitys.push("");//将数组补齐到三个,字符串数组补空字符
      that.data.jobhunterForm.intentioncityCodeAs.push("");
    }
    if (that.data.jobhunter) {
      getApp().updateJobhunter(that.data.jobhunterForm);
      // getApp().delay(function () {
      //   wx.navigateBack({
      //     delta: 1
      //   })
      //   return false;
      // }, 1000)
    } else {
      getApp().globalData.jobhunterForm.intentioncitys = that.data.jobhunterForm.intentioncitys
      getApp().globalData.jobhunterForm.intentioncityCodes = that.data.jobhunterForm.intentioncityCodes
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