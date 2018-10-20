var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: getApp().globalData.domain,
    openSearch: false,
    search: [],
    tabIndex: 0,
    companys: [],
    pageIndex: 0,
    limit: 10,
    count: 0,
    // 2.1用于记录是否还有更多的数据
    hasMore: true,
 
    regionIndex: [0, 0, 0],
    regionArray: [
      [],
      [],
      []
    ],
    citys: [], //初始化数组
    areas: [],
    address: "",
    searchForm: {
      categoryIds: [],
      sizeIds: [],
      wageIds: [],
      intentionjobIds: [],
      welfareIds: [],
      addressCodeP: "",
      addressCodeC: "",
      addressCodeA: "",
    }
  },


  onLoad: function() {
    _self = this;
    var {
      provinces
    } = getApp().globalData.options
    var {
      citys,
      areas
    } = getApp().globalData;

    //这里是引用，所以会一旦进入过这个页面，就会影响全局
    //citys.splice(0, 0, { codeC: "", id: "0", name: "不限" });
    //areas.splice(0, 0, { codeA: "", id: "0", name: "不限" });
    var cs = citys.map((item) => item)
    var ars = areas.map((item) => item)
    cs.splice(0, 0, { codeC: "", id: "0", name: "不限" })
    ars.splice(0, 0, { codeA: "", id: "0", name: "不限" })
    this.setData({
      "regionArray[0]": provinces,
      "regionArray[1]": cs,
      "regionArray[2]": ars,
      "citys": cs,
      "areas": ars,
    });
    this.initSearch(getApp().globalData.options);
    this.loadMore();
  },
  //显示已经选择的条件
  showSearch: function() {
    var that = this;
    var search = [];
    var {
      companycategorys,
      companysizes,
      wages,
      intentionjobs,
      welfares,
      address
    } = this.data
    var categoryIds=[], sizeIds=[], wageIds=[],intentionjobIds=[],welfareIds=[]
    companycategorys.forEach((item) => {
      if (item.selected){
        search.push({
          tabIndex: 0,
          id: item.categoryId,
          value: item.categoryValue
        })
        categoryIds.push(item.categoryId)
      } 
    })
    companysizes.forEach((item) => {
      if (item.selected){
        search.push({
          tabIndex: 1,
          id: item.sizeId,
          value: item.sizeValue
        })
        sizeIds.push(item.sizeId)
      } 
    })
    wages.forEach((item) => {
      if (item.selected){
        search.push({
          tabIndex: 2,
          id: item.wageId,
          value: item.wageValue
        })
        wageIds.push(item.wageId)
      } 
    })
    intentionjobs.forEach((item) => {
      if (item.selected){
        search.push({
          tabIndex: 3,
          id: item.intentionjobId,
          value: item.intentionjobValue
        })
        intentionjobIds.push(item.intentionjobId)
      } 
    })
    welfares.forEach((item) => {
      if (item.selected){
        search.push({
          tabIndex: 4,
          id: item.welfareId,
          value: item.welfareValue
        })
        welfareIds.push(item.welfareId)
      } 
    })

    if (address != "") search.push({
      tabIndex: 5,
      id: 0,
      value: address
    })
    that.setData({
      search,
      "searchForm.categoryIds": categoryIds,
      "searchForm.sizeIds": sizeIds,
      "searchForm.wageIds": wageIds,
      "searchForm.intentionjobIds": intentionjobIds,
      "searchForm.welfareIds": welfareIds
    })
  },


  openSearch: function() {
    var state = !this.data.openSearch
    this.setData({
      openSearch: state
    })
  },

  tabSelected: function(e) {
    var id = parseInt(e.currentTarget.id)
    this.setData({
      tabIndex: id
    })
  },

  //删除已经选择的
  itemDelete: function(e) {
    var tabIndex = parseInt(e.currentTarget.id.split("-")[0]);
    var id = parseInt(e.currentTarget.id.split("-")[1]);
    if (tabIndex == 5) { //地址
      this.setData({
        address: "",
        'searchForm.addressCodeP': "",
        'searchForm.addressCodeC': "",
        'searchForm.addressCodeA': "",
      });

    } else
      this.updateOption(tabIndex, id);
    this.showSearch();
  },
  //选项被选择是触发
  itemSelect: function(e) {
    var id = parseInt(e.currentTarget.id)
    if(id== null) return;
    var {
      tabIndex
    } = this.data;
    this.updateOption(tabIndex, id);
    this.showSearch();

  },
  resetSearch:function(){
    this.setData({
      search:[],
      address: "",
      'searchForm.addressCodeP': "",
      'searchForm.addressCodeC': "",
      'searchForm.addressCodeA': "",

      'searchForm.categoryIds': [],
      'searchForm.sizeIds': [],
      'searchForm.wageIds': [],
      'searchForm.intentionjobIds': [],
      'searchForm.welfareIds': [],
    })
    this.initSearch(getApp().globalData.options);
    this.startSearch();
  },
  startSearch:function(){
    this.setData({
      companys: [],
      pageIndex: 0,
      hasMore: true,

    })
    this.openSearch();
    this.loadMore();
  },
  updateOption: function(tabIndex, id) {
    var {
      companycategorys,
      companysizes,
      wages,
      intentionjobs,
      welfares
    } = this.data
    switch (tabIndex) {
      case 0:
        companycategorys = companycategorys.map((item) => {
          if (item.categoryId == id) item.selected = !item.selected;
          return item;
        })
        break;
      case 1:
        companysizes = companysizes.map((item) => {
          if (item.sizeId == id) item.selected = !item.selected;
          return item;
        })
        break;
      case 2:
        wages = wages.map((item) => {
          if (item.wageId == id) item.selected = !item.selected;
          return item;
        })
        break;
      case 3:
        intentionjobs = intentionjobs.map((item) => {
          if (item.intentionjobId == id) item.selected = !item.selected;
          return item;
        })
        break;
      case 4:
        welfares = welfares.map((item) => {
          if (item.welfareId == id) item.selected = !item.selected;
          return item;
        })
        break;
    }
    this.setData({
      companycategorys,
      companysizes,
      wages,
      intentionjobs,
      welfares
    })
  },



  regionChange: function(e) { //籍贯
    var that = this;
    var id = e.currentTarget.id;
    var indexs = e.detail.value;
    var province = that.data.regionArray[0][indexs[0]].name;
    var addressCodeP = that.data.regionArray[0][indexs[0]].codeP;
    var city = that.data.regionArray[1][indexs[1]].name;
    var addressCodeC = that.data.regionArray[1][indexs[1]].codeC;
    var area = that.data.regionArray[2][indexs[2]].name;
    var addressCodeA = that.data.regionArray[2][indexs[2]].codeA;
    var address = "";
    if (addressCodeP != "") {
      address = address + province;
      if (addressCodeC != "") {
        address = address + city;
        if (addressCodeA != "") {
          address = address + area;
        }
      }
    }
    this.setData({
      address: address,
      'searchForm.addressCodeP': addressCodeP,
      'searchForm.addressCodeC': addressCodeC,
      'searchForm.addressCodeA': addressCodeA,
    });
    this.setData({
      "regionArray[1]": that.data.citys,
      "regionArray[2]": that.data.areas,
      "regionIndex": [0, 0, 0],
    }); //恢复到初始态
    this.showSearch();
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉事件");
    // 下拉刷新页面
    // 3.1 把数据先设置回默认值
    this.setData({
      companys: [],
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
  onShareAppMessage: function(options) {
    var that = this;
    return getApp().getShareAppMessage(options);
  },

  initSearch: function(options) {
    var {
      companycategorys,
      companysizes,
      wages,
      intentionjobs,
      welfares
    } = options
    companycategorys = companycategorys.map((item) => {
      item.selected = false;
      return item;
    })
    companysizes = companysizes.map((item) => {
      item.selected = false;
      return item;
    })
    wages = wages.map((item) => {
      item.selected = false;
      return item;
    })
    intentionjobs = intentionjobs.map((item) => {
      item.selected = false;
      return item;
    }).reverse()
    welfares = welfares.map((item) => {
      item.selected = false;
      return item;
    }).reverse()
    this.setData({
      companycategorys,
      companysizes,
      wages,
      intentionjobs,
      welfares
    })

  },

  //加载更多
  loadMore: function() {
    var that = this;
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    var {searchForm} = this.data;
    var form = {
      count: this.data.count,
      limit: this.data.limit,
      page: ++this.data.pageIndex
    };
    if (searchForm.categoryIds.length > 0)
      form.categoryIds = searchForm.categoryIds;
    if (searchForm.sizeIds.length > 0)
      form.sizeIds = searchForm.sizeIds;
    if (searchForm.wageIds.length > 0)
      form.wageIds = searchForm.wageIds;
    if (searchForm.intentionjobIds.length > 0)
      form.intentionjobIds = searchForm.intentionjobIds;
    if (searchForm.welfareIds.length > 0)
      form.welfareIds = searchForm.welfareIds;
    if (searchForm.addressCodeA != "")
      form.addressCodeA = searchForm.addressCodeA;
    else if (searchForm.addressCodeC != "")
      form.addressCodeC = searchForm.addressCodeC;
    else if (searchForm.addressCodeP != "")
      form.addressCodeP = searchForm.addressCodeP;
    wx.request({
      url: getApp().globalData.domain + '/weixin/user/getCompanyListByPage.action',
      method: "post",
      header: {
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify(form),
      success: (res) => {
        if (res.data.msg == 'ok') {
          var newList = this.data.companys.concat(res.data.page.list);
          getApp().globalData.companys = newList;
          var count = res.data.page.total;
          var flag = this.data.pageIndex * this.data.limit < count;
          this.setData({
            count: count,
            companys: res.data.page.list.map((item) => that.initCompany(getApp().globalData.options, item)),
            hasMore: flag,
          });
        }
      },
    });
  },

  initCompany: (options, company) => {
    var {
      wages,
      intentionjobs
    } = options
    try{
      company.wageValue = wages.filter((item) => item.wageId == company.recruiter.wageId)[0].wageValue
      company.jobs = company.recruiter.jobs.map((item1) => {
        item1.intentionjobValue = intentionjobs.filter((item2) => item1.intentionjobId == item2.intentionjobId)[0].intentionjobValue;
        return item1
      })
			company.companyType = "company" //合作企业
      company.companyUpdatetime = company.recruiter.updatetime;
    }catch (e){
      console.log(e)
    }
    
    return company;
  },
  regionColumnChange: function(e) { //籍贯
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
        success: function(res) {
          res.data.splice(0, 0, { codeC: "", id: "0", name: "不限" });
          that.setData({
            "regionArray[1]": res.data,
          });
          wx.request({
            url: getApp().globalData.domain + "/weixin/options/getAreasByCityCode.action",
            data: {
              "cityCode": that.data.regionArray[1][0].codeC,
            },
            success: function(res) {
              res.data.splice(0, 0, { codeA: "", id: "0", name: "不限" });
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
        success: function(res) {
          res.data.splice(0, 0, { codeA: "", id: "0", name: "不限" });
          that.setData({
            "regionArray[2]": res.data,
          });
        }
      });
    }
  },
})