var parttimerUtil = require('../../utils/parttimerUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parttimerShow: null,
    parttimer:null,
    //页面效果
    job_detail: true,
    addr_detail: true,
    worktime_detail: true,
  },
  /*注册按钮*/
  signin: function () {
    wx.navigateTo({ 
            url: '/pages/signin/signin?state=1',   //state：1 注册，2 修改
    })
  },
  
  choose: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    if (id == "job") {
      var hidden = !that.data.job_detail;
      that.setData({
        job_detail: hidden,
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
  /*兼职状态*/
  stateChange:function(e){
    var that  =this;
    var state = 1;
    var msg ='';
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
          getApp().showToast(msg , 'none');
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var options = getApp().globalData.options;
    var parttimer = getApp().globalData.parttimer;
    var parttimerShow = parttimerUtil.initParttimerShow(getApp().globalData.parttimerShow, parttimer, options);
    if(parttimer!=null){
      that.setData({
        "parttimer": parttimer,
      })
    }
    that.setData({
      "parttimerShow": parttimerShow,
      "options": options,
    })
    console.log(that.data)
  },

  onShow:function(){
    var that = this;
    that.onLoad();
  }
})