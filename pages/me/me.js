Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户Id
    userId: null,
    userPhotoUrl:null,
    level: ['校园学渣', '校园学酥', '校园学霸', '职场小白', '职场新秀', '职场达人', '都市金领', '城市精英','霸道总裁'],
    scorelevel:[100,200,300,500,800,1200,1800,2400],
    levelIndex:0,
    levelProgress:0,
    //消息列表
		recruiters:[],
    messages:[],
		recruitertotal:0,
		messagetotal:0,
    signIn:false,
    userscore:null,
    userNum:null,
    userCustom:null,
    detail: [false, false, false, false, false],
    checkstateValue: "待审核"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userCustom = getApp().globalData.user;
    var checkstateValue = "待审核"
    if(userCustom){
      if(userCustom.checkstateId == 2)
        checkstateValue = "未通过"
      else if (userCustom.checkstateId == 3)
        checkstateValue = "已通过"
      that.setData({
        userCustom: userCustom,
        checkstateValue: checkstateValue
      });
    }else{
      return;
    }
    //加载userId
    var userId = getApp().globalData.userId;
    var userNum = getApp().globalData.user.userNum;
    var options = getApp().globalData.options;
    var messagetypes = options.messagetypes;
    that.setData({
      "userId": userId,
      "userNum":userNum,
      "messagetypes":messagetypes,
    });
    var user = getApp().globalData.user;
    var userPhotoUrl = that.data.userPhotoUrl;
    if (user && user.userPhotoUrl && user.userPhotoUrl != "") {
      userPhotoUrl = getApp().globalData.domain + user.userPhotoUrl + "?time=" + Math.random();
    } else if (getApp().globalData.jibenForm.userPhotoUrl && getApp().globalData.jibenForm.userPhotoUrl != "") {
      userPhotoUrl = getApp().globalData.jibenForm.userPhotoUrl;
    }
    that.setData({
      "userPhotoUrl": userPhotoUrl,
      "user":user,
    });

    //加载用户消息
  },

//初始化企业列表
  initCompany: (options, company) => {
    var {
      wages,
      intentionjobs
    } = options
    company.wageValue = wages.filter((item) => item.wageId == company.recruiter.wageId)[0].wageValue
    company.jobs = company.recruiter.jobs.map((item1) => {
      item1.intentionjobValue = intentionjobs.filter((item2) => item1.intentionjobId == item2.intentionjobId)[0].intentionjobValue;
      return item1
    })
    company.companyUpdatetime = company.recruiter.updatetime;
    return company;
  },
  choose: function (e) {
    var that = this;
    var id = parseInt(e.currentTarget.id);

    var detail = that.data.detail;

    var flag = detail[id];
    for (var i = 0; i < detail.length; i++) {
      detail[i] = false;
    }
    detail[id] = ~flag;
    that.setData({
      'detail': detail,
    })
  },
  signInTap: function (event){
    var that = this;
    if(that.data.signIn){
      getApp().showToast("已经签到，不用再签了哦", 'none');
      return;
    }
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/signIn.action",
      data: {
        "userId": that.data.userId,
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {
          getApp().globalData.userscore = res.data.userscore;
          that.setData({
            userscore: res.data.userscore,
            signIn:true,
          });
        }
      },
    })
  },
 
  onShow: function () {
    var that = this;
    var userCustom = getApp().globalData.user;
    if (userCustom) {
      that.setData({
        "userCustom": userCustom,
      });
    } else {
      return;
    }
    
    wx.request({
      url: getApp().globalData.domain + "/weixin/user/getUserscore.action",
      data: {
        "userId": that.data.userId,
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {
          var userscore = res.data.userscore;
          getApp().globalData.userscore = userscore;
          that.setData({
            userscore: userscore,
          });
          var levelIndex = 0;
          var levelProgress = 0;
          if (userscore.score >= that.data.scorelevel[7]){
            levelIndex = 8;
            levelProgress = 100;
          } else if (userscore.score >= that.data.scorelevel[6]){
            levelIndex = 7;
            levelProgress = (userscore.score - that.data.scorelevel[6])/(that.data.scorelevel[7] - that.data.scorelevel[6])*100;
          } else if (userscore.score >= that.data.scorelevel[5]){
            levelIndex = 6;
            levelProgress = (userscore.score - that.data.scorelevel[5]) / (that.data.scorelevel[6] - that.data.scorelevel[5]) * 100;
          } else if (userscore.score >= that.data.scorelevel[4]){
            levelIndex = 5;
            levelProgress = (userscore.score - that.data.scorelevel[4]) / (that.data.scorelevel[5] - that.data.scorelevel[4]) * 100;
          } else if (userscore.score >= that.data.scorelevel[3]){
            levelIndex = 4;
            levelProgress = (userscore.score - that.data.scorelevel[3]) / (that.data.scorelevel[4] - that.data.scorelevel[3]) * 100;
          } else if (userscore.score >= that.data.scorelevel[2]){
            levelIndex = 3;
            levelProgress = (userscore.score - that.data.scorelevel[2]) / (that.data.scorelevel[3] - that.data.scorelevel[2]) * 100;
          } else if (userscore.score >= that.data.scorelevel[1]){
            levelIndex = 2;
            levelProgress = (userscore.score - that.data.scorelevel[1]) / (that.data.scorelevel[2] - that.data.scorelevel[1]) * 100;
          } else if (userscore.score >= that.data.scorelevel[0]){
            levelIndex = 1;
            levelProgress = (userscore.score - that.data.scorelevel[0]) / (that.data.scorelevel[1] - that.data.scorelevel[0]) * 100;
          }else{
            levelIndex = 0;
            levelProgress = userscore.score /that.data.scorelevel[0] * 100;
          }
          
          that.setData({
            levelIndex: levelIndex,
            levelProgress: levelProgress,
          });
          var now = new Date();
          var time = new Date(Date.parse(res.data.userscore.signinTime));
          if (now.getDate() == time.getDate()) {
            that.setData({
              signIn: true,
            });
          }
        }
      },
    })
		wx.request({
			url: getApp().globalData.domain + '/weixin/user/getResumeCompanyListByPage.action',
			method: 'GET',
			data: {
				page: 1,
				limit: 2,
				userId: that.data.userId,
			},
			success: function (res) {
				console.log(res.data)
				if (res.data.msg == 'ok') {
					if (that.data.recruitertotal != res.data.page.total){
						var recruiters = res.data.page.list;
						that.setData({
							recruiters: recruiters.map((item) => that.initCompany(getApp().globalData.options, item)),
							recruitertotal: res.data.page.total,
						});
						getApp().globalData.recruiters = recruiters;
					}
					
				}
			}
		});
    wx.request({
      url: getApp().globalData.domain + "/weixin/message/getMessagesByUserIdWithPage.action",
      data: {
        "userId": that.data.userId,
        pageSize: 5,
        page: 1
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'ok') {
					if (that.data.messagetotal != res.data.messagePage.total) {
						var messages = res.data.messagePage.list;
						that.setData({
							messages: messages,
							messagetotal: res.data.messagePage.total,
						});
						getApp().globalData.messages = messages;
        }
				}
      },
    })
  },

  voidfun: function () {
    getApp().showToast("该功能暂未开放", 'none');
  },

  onShareAppMessage: function (options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },

})