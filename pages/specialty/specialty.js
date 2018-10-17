var outworkerUtil = require('../../utils/outworkerUtil.js');
Page({

  data: {
    //表单选项
    options: {},

    //用户Id
    userId: null,

    //自定义用户信息   
    outworkerForm: {
      specialtyIds: [0,0,0],      //特长
    },
  },

  onLoad: function () {
    console.log("简历表单页面初始化.....")
    //引用页面对象
    var that = this
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var options = getApp().globalData.options;
    var outworker = getApp().globalData.outworker;
    var outworkerForm = that.data.outworkerForm;
    options = outworkerUtil.initOptions(options, true, outworker);
    outworkerForm = outworkerUtil.initOutworkerForm(outworkerForm, outworker);
    that.setData({
      'options': options,
      "userId": userId,
      "outworkerForm": outworkerForm,
    });
    if (outworker) {
      that.setData({
        "outworker": outworker,
      });
    }
    console.log(that.data);

  },

 specialtyChange: function (e) {//意向岗位
    var that = this
    console.log('specialtyChange', e)
    if (e.detail.value.length > 3) {
      e.detail.value.pop(3);//将最后一项移除
      getApp().showToast("最多选三项哦亲", 'none');
    }
    var specialtys = that.data.options.specialtys;
    var Ids = e.detail.value;
    for (var i = 0; i < specialtys.length; i++) {
      var j = 0;
      for (; j < Ids.length; j++) {
        Ids[j] = parseInt(Ids[j]);
        if (specialtys[i].specialtyId == Ids[j]) {
          specialtys[i].checked = true;
          break;
        }
      }
      if (j == Ids.length) {
        specialtys[i].checked = false;
      }
    }
    that.setData({
      "options.specialtys": specialtys,
      "outworkerForm.specialtyIds": Ids,
    })
   console.log(that.data.outworkerForm.specialtyIds);
  },


  submit: function () {
    var that = this;
    if (that.data.outworkerForm.specialtyIds[0] == 0 && that.data.outworkerForm.specialtyIds[1] == 0 && that.data.outworkerForm.specialtyIds[2] == 0) {
      getApp().showToast("至少选一个特长哦亲");
      return false;
    }
    var that = this
    var num = that.data.outworkerForm.specialtyIds.length;
    for (var i = 0; i < (3 - num); i++) {
      that.data.outworkerForm.specialtyIds.push(0);//将数组补齐到三个
    }
    if (that.data.outworker) {
      getApp().updateOutworker(that.data.outworkerForm);
    } else {
      getApp().globalData.outworkerForm.specialtyIds = that.data.outworkerForm.specialtyIds
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
