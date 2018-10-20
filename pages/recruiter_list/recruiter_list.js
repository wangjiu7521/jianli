var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: getApp().globalData.domain,
    resumeTypeId: 1,
    count: 0,
    recruiters: [],
    pageIndex: 0,
    pageSize: 10,
    // 2.1用于记录是否还有更多的数据
    hasMore: true
  },


  onLoad: function(options) {
    _self = this;
    var that = this;
    
    this.loadMore();
  },

  btnclick: function(e) {
    var that = this;
    var resumeTypeId = parseInt(e.target.id)
    if (resumeTypeId != that.data.resumeTypeId) {
      if(resumeTypeId == 1)
        wx.setNavigationBarTitle({title: "我关注的企业"})
      else
        wx.setNavigationBarTitle({ title: "关注我的企业" })
      that.setData({
        recruiters: [],
        pageIndex: 0,
        hasMore: true,
        resumeTypeId: resumeTypeId
      });
      that.loadMore();
    }
  },

  //加载更多
  loadMore: function() {
    var that = this;
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    console.log(that.data.resumeTypeId)
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/getResumeCompanyListByPage.action',
      data: {
        count: that.data.count,
        page: ++that.data.pageIndex,
        limit: that.data.pageSize,
        userId: getApp().globalData.userId,
        resumeTypeId: that.data.resumeTypeId
      },
      success: function(res) {
        console.log(res.data)

        if (res.data.msg == 'ok') {
          var newList = that.data.recruiters.concat(res.data.page.list);
          getApp().globalData.recruiters = newList;
          var count = res.data.page.total;
          var flag = that.data.pageIndex * that.data.pageSize < count;
          that.setData({
            count: res.data.page.total,
            recruiters: newList.map((item) => that.initCompany(getApp().globalData.options, item)),
            hasMore: flag,
          });
        }else{
          that.setData({
            count: 0,
            recruiters: [],
            hasMore: false,
          });
        }
      }
    });
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
		company.companyType = "resume" // 简历页面
    company.companyUpdatetime = company.recruiter.updatetime;
    return company;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉事件");
    // 下拉刷新页面
    // 3.1 把数据先设置回默认值
    this.setData({
      recruiters: [],
      pageIndex: 0,
      hasMore: true,
    });
    // 3.2 再重新请求数据
    this.loadMore();
    // 3.3 记得停止，否则在手机端一直存在
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉触底");
    // 1.5. 触底再调用加载数据的函数
    this.loadMore();
  },
})