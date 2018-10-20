
Page({
  data: {
    URL: getApp().globalData.domain,
    data: null,
		sended:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (props) {
    var that = this;
		var companyType = props.companyType;
    //获取缓存公司数据
		var companys = []
		if (companyType == null ||companyType === "company" )
			companys = getApp().globalData.companys
		else if (companyType === "resume")
			companys = getApp().globalData.recruiters
    try {
      if (companys) {
        for (var i = 0; i < companys.length; i++) {
					if (props.companyID == companys[i].companyId) {
            wx.setNavigationBarTitle({
              title: companys[i].companyName,
            })
						that.checkSended(companys[i].companyId);//检查是否投递过这家公司
            that.initCompany(getApp().globalData.options, companys[i]);
            that.setData({
              data: companys[i],
              companyId: companys[i].companyId
            })
            break;
          }
        }
      }
    } catch (e) {
      console.log("获取缓存失败！")
    }
  },

	checkSended:function(companyId){
		var that = this;
		wx.request({
			url: getApp().globalData.domain + '/weixin/user/checkSended.action',
			data: {
				userId: getApp().globalData.userId,
				companyId:companyId
			},
			success: (res) => {
				console.log(res.data);
				if (res.data.msg == 'ok') {
					that.setData({
						sended: res.data.sended
					});
				}
			},
		});
	},
  //不是纯函数
  initCompany:(options,company)=>{
    var { wages, companycategorys, companysizes, intentionjobs } = options
    company.sizeValue = companysizes.filter((item) => item.sizeId == company.sizeId)[0].sizeValue
    company.categoryValue = companycategorys.filter((item) => item.categoryId == company.categoryId)[0].categoryValue
    company.wageValue = wages.filter((item) => item.wageId == company.recruiter.wageId)[0].wageValue
    company.jobs = company.recruiter.jobs.map((item1) => intentionjobs.filter((item2) => item1.intentionjobId == item2.intentionjobId)[0].intentionjobValue)
    company.recruitCount = company.recruiter.jobs.reduce((pre, next) =>{ pre.jobCount += next.jobCount; return pre}).jobCount
    company.companyImgs=company.recruiter.imgs.map((item)=>item.companyImg)
    company.companyWelfares = company.recruiter.welfares.map((item)=>item.welfareValue)
  },
  onShareAppMessage: function (options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },

  submit:function(){
    var that = this;
    //判断是否有投递简历的条件
    var { user } = getApp().globalData
    if (user.jobhunterState==false) {
      getApp().showToast('您的就业信息未填写，不能投递简历', 'none');
      return;
    }
		if (user.checkstateId != 3) {
			getApp().showToast('您的信息还未通过审核，暂时不能投递简历', 'none');
			return;
		}
    if (user.userWorkstate!=2) {
			getApp().showModal(
				'提示',
				'您的就业状态处于关闭状态，无法投递简历，是否打开就业状态',
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
								user.userWorkstate = res.data.state
								that.sendResume();//开始投递简历
							}
						},
					})
				},
				()=>{});
				return;
    }
		that.sendResume();//开始投递简历
  },
	sendResume:function(){
		var that = this
		wx.showLoading({ title: "投递中" });
		wx.request({
			url: getApp().globalData.domain + '/weixin/user/sendResume.action',
			data: {
				userId: getApp().globalData.userId,
				companyId: that.data.companyId
			},
			success: function (res) {
				wx.hideLoading()
				if (res.data.msg == 'ok') {
					that.setData({
						sended: true
					});
					getApp().showToast('简历投递成功！');
				} else {
					getApp().showToast('简历投递失败！');
				}
			},

		});
	},
  cancel:function(){
    var that = this
    var { user } = getApp().globalData
    wx.showLoading({title:"撤销中"});
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/cancelResume.action',
      data: {
        userId: user.userId,
        companyId: that.data.companyId
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.msg == 'ok') {
					that.setData({
						sended: false
					});
          getApp().showToast('简历已撤销！');
        }
      },

    });
  }
})