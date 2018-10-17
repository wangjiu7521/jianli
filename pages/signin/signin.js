var parttimerUtil = require('../../utils/parttimerUtil.js');
//模拟数据
Page({
  data: {
    underDots: [],
    sexArray: ['男','女'],
    sexIndex:0,
    schoolIndex: 0,
    ptjobIndex:0,
    jobsiteIndex: 0,
    parttimerForm: {
      intentionparttimeIds: [],
      parttimeaddrIds: [],
      parttimerState: 1,
      worktimeIds: [],
      parttimerState:2,
    },

    //页面效果
    job_detail:true,
    addr_detail:true,
    worktime_detail:true,
    parttimerState:false,
  },
  //选择器change事件
  pickerChange:function(e){
    var that = this;
    var value = e.detail.value;
    console.log(value);
    switch(e.target.id){
      case 'sex': that.setData({ "parttimerForm.parttimerGender": that.data.sexArray[value]});
        break;
      case 'school': 
        that.setData({ 
          "parttimerForm.schoolId": that.data.options.schools[value].schoolId,
          "schoolIndex": value 
        });
        break;
      case 'jobstate': 
        if (e.detail.value) {
          //打开
          that.setData({
            "parttimerForm.parttimerState": 2,
          });
        }else{
          //关闭
          that.setData({
            "parttimerForm.parttimerState": 1,
          });
        }
        break;
    }

  },

  choose:function(e){
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    if(id=="job"){
      var hidden = !that.data.job_detail;
      that.setData({
        job_detail:hidden,
        worktime_detail: true,
        addr_detail: true,
      })
    } else if (id == "addr") {
      var hidden = !that.data.addr_detail;
      that.setData({
        addr_detail: hidden,
        job_detail: true,
        worktime_detail: true,
      })
    } else if (id == "worktime") {
      var hidden = !that.data.worktime_detail;
      that.setData({
        worktime_detail: hidden,
        addr_detail: true,
        job_detail: true,
      })
    }
  },
  checkjob:function(e){
    var that = this;
    var id = parseInt(e.currentTarget.id);
    console.log(id);
    var intentionparttimes = that.data.options.intentionparttimes;
    var intentionparttimeIds = that.data.parttimerForm.intentionparttimeIds;
    
    intentionparttimes[id - 1].checked = !intentionparttimes[id - 1].checked;
    if (intentionparttimes[id - 1].checked){
      if (intentionparttimeIds.length >= 5) {
        getApp().showToast("最多选五个呦亲", 'none');
        intentionparttimes[id - 1].checked = !intentionparttimes[id - 1].checked;
      }else{
        intentionparttimeIds.push(id);
      }
    }else{
      intentionparttimeIds.splice(intentionparttimeIds.indexOf(id), 1);
    }
    that.setData({
      "options.intentionparttimes":intentionparttimes,
      "parttimerForm.intentionparttimeIds": intentionparttimeIds,
    })
  },
  checkaddr: function (e) {
    var that = this;
    var id = parseInt(e.currentTarget.id);
    console.log(id);
    var parttimeaddrs = that.data.options.parttimeaddrs;
    var parttimeaddrIds = that.data.parttimerForm.parttimeaddrIds;
    parttimeaddrs[id - 1].checked = !parttimeaddrs[id - 1].checked;
    if (parttimeaddrs[id - 1].checked) {
      parttimeaddrIds.push(id);
    } else {
      parttimeaddrIds.splice(parttimeaddrIds.indexOf(id), 1);
    }
    that.setData({
      "options.parttimeaddrs": parttimeaddrs,
      "parttimerForm.parttimeaddrIds": parttimeaddrIds,
    })
  },
  checkworktime: function (e) {
    var that = this;
    var id = parseInt(e.currentTarget.id);
    console.log(id);
    var worktimes = that.data.options.worktimes;
    var worktimeIds = that.data.parttimerForm.worktimeIds;
    worktimes[id - 1].checked = !worktimes[id - 1].checked;
    if (worktimes[id - 1].checked) {
      worktimeIds.push(id);
    } else {
      worktimeIds.splice(worktimeIds.indexOf(id), 1);
    }
    that.setData({
      "options.worktimes": worktimes,
      "parttimerForm.worktimeIds": worktimeIds,
    })
  },

  //表单提交事件
  submitForm:function(e){
    var that = this;
    var parttimerForm = that.data.parttimerForm;
    console.log('表单提交', that.data)

    if (parttimerForm.intentionparttimeIds.length == 0) {
      getApp().showToast("意向兼职没选哦亲", 'none');
      return;
    }
    if (parttimerForm.parttimeaddrIds.length == 0) {
      getApp().showToast("兼职地点没选哦亲", 'none');
      return;
    }
    if (parttimerForm.worktimeIds.length == 0) {
      getApp().showToast("兼职时间没选哦亲", 'none');
      return;
    }
    var method = "";
    if (getApp().globalData.user==null){
      console.log("从兼职信息入驻");
      console.log(getApp().globalData.jibenForm);
      method ="add";
      getApp().updateUser(getApp().globalData.jibenForm, "add",function(){   //先提交基本信息
        console.log("添加完基本信息,开始添加兼职信息");
        getApp().updateParttimer({
          "method": method,
          "parttimerState": parttimerForm.parttimerState,
          "intentionparttimeIds": parttimerForm.intentionparttimeIds,
          "parttimeaddrIds": parttimerForm.parttimeaddrIds,
          "worktimeIds": parttimerForm.worktimeIds,
        }, method)
      }); 
    } else if (getApp().globalData.user && that.data.parttimer == null) {
      console.log("开始添加兼职信息");
      method = "add";
      getApp().updateParttimer({
        "method": method,
        "parttimerState": parttimerForm.parttimerState,
        "intentionparttimeIds": parttimerForm.intentionparttimeIds,
        "parttimeaddrIds": parttimerForm.parttimeaddrIds,
        "worktimeIds": parttimerForm.worktimeIds,
      }, method)
    }else{
      method="update";
      getApp().updateParttimer({
        "method": method,
        "userId":that.data.userId,
        "parttimerState": parttimerForm.parttimerState,
        "intentionparttimeIds": parttimerForm.intentionparttimeIds,
        "parttimeaddrIds": parttimerForm.parttimeaddrIds,
        "worktimeIds": parttimerForm.worktimeIds,
      }, method)
    }
   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (arg) {
    var that = this;
    if (arg.zhuce) {
      var zhuce = arg.zhuce
      that.setData({
        zhuce: zhuce
      })
    }
    var userId = getApp().globalData.userId || wx.getStorageSync("userId");
    var options = getApp().globalData.options||wx.getStorageSync("options")
    var parttimer = getApp().globalData.parttimer
    var parttimerForm = parttimerUtil.initParttimerForm(that.data.parttimerForm,parttimer);
    options = parttimerUtil.initOptions(options,true, parttimer);
    console.log(options);
    if (parttimer) {
      that.setData({
        "parttimer": parttimer,
        "userId":userId,
      })
    }
    that.setData({
      "parttimerForm": parttimerForm,
      "options":options,
    })
    if (parseInt(parttimerForm.parttimerState) == 2){
      that.setData({
        "parttimerState":true,
      })
    }
    console.log(options)
  },

  onShareAppMessage: function (options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },
})