
module.exports = {
  initParttimerShow: initParttimerShow,
  initParttimerForm: initParttimerForm,
  initOptions: initOptions,
}


//初始化兼职信息
function initParttimerShow(parttimerShow, parttimer, options) {
  if (parttimer==null) {
    var parttimerForm = getApp().globalData.parttimerForm;

    //兼职状态
    if (parttimerForm.parttimerState == "2"){
      parttimerShow.parttimerState = true;
    }else{
      parttimerShow.parttimerState = false;
    }

    parttimerShow.intentionparttimeValues=[];
    for (var j = 0; j < options.intentionparttimes.length; j++) {
      for (var i = 0; i < parttimerForm.intentionparttimeIds; i++) {
        if (options.intentionparttimes[j].intentionparttimeId === parttimerForm.intentionparttimeIds[i])
          parttimerShow.intentionparttimeValues.push(options.intentionparttimes[j].intentionparttimeValue);
      }
    }
    parttimerShow.parttimeaddrValues = [];
    for (var j = 0; j < options.parttimeaddrs.length; j++) {
      for (var i = 0; i < parttimerForm.parttimeaddrIds;i++){
        if (options.parttimeaddrs[j].parttimeaddrId === parttimerForm.parttimeaddrIds[i])
          parttimerShow.parttimeaddrValues.push(options.parttimeaddrs[j].parttimeaddrValue);
      }
    }
    parttimerShow.worktimeValues = [];
    for (var j = 0; j < options.worktimes.length; j++) {
      for (var i = 0; i < parttimerForm.worktimeIds; i++) {
        if (options.worktimes[j].worktimeId === parttimerForm.worktimeIds[i])
          parttimerShow.worktimeValues.push(options.worktimes[j].worktimeValue);
      }
    }
    return parttimerShow;
  } else {
    //意向兼职
    parttimerShow.intentionparttimeValues.splice(0, parttimerShow.intentionparttimeValues.length);
    for (var i = 0; i < parttimer.parttimes.length; i++) {
      parttimerShow.intentionparttimeValues.push(parttimer.parttimes[i].intentionparttimeValue);
    }

    //兼职地点
    parttimerShow.parttimeaddrValues.splice(0, parttimerShow.parttimeaddrValues.length);
    for (var i = 0; i < parttimer.parttimeaddrs.length; i++) {
      parttimerShow.parttimeaddrValues.push(parttimer.parttimeaddrs[i].parttimeaddrValue);
    }
    //兼职时间
    parttimerShow.worktimeValues.splice(0, parttimerShow.worktimeValues.length);
    for (var i = 0; i < parttimer.worktimes.length; i++) {
      parttimerShow.worktimeValues.push(parttimer.worktimes[i].worktimeValue);
    }
    //兼职状态
    if (parttimer.parttimerState == "2") {
      parttimerShow.parttimerState = true;
    } else {
      parttimerShow.parttimerState = false;
    }
    return parttimerShow;
  }
}
//初始化兼职提交表单
function initParttimerForm(parttimerForm, parttimer) {
  if (!parttimer) {
    var globalform = getApp().globalData.parttimerForm;
    
    if (parttimerForm.intentionparttimeIds != null)
      parttimerForm.intentionparttimeIds = globalform.intentionparttimeIds;
    if (parttimerForm.worktimeIds != null)
      parttimerForm.worktimeIds = globalform.worktimeIds;
    if (parttimerForm.parttimeaddrIds != null)
      parttimerForm.parttimeaddrIds = globalform.parttimeaddrIds;
   
    if (parttimerForm.parttimerState != null)
      parttimerForm.parttimerState = globalform.parttimerState;
    return parttimerForm;
  }

  if (parttimerForm.intentionparttimeIds != null){
    for (var i = 0; i < parttimer.parttimes.length;i++){
      parttimerForm.intentionparttimeIds.push(parttimer.parttimes[i].intentionparttimeId)  
    }
  }
  if (parttimerForm.worktimeIds != null) {
    for (var i = 0; i < parttimer.worktimes.length; i++) {
      parttimerForm.worktimeIds.push(parttimer.worktimes[i].worktimeId)
    }
  }
  if (parttimerForm.parttimeaddrIds != null) {
    for (var i = 0; i < parttimer.parttimeaddrs.length; i++) {
      parttimerForm.parttimeaddrIds.push(parttimer.parttimeaddrs[i].parttimeaddrId)
    }
  }

  if (parttimerForm.parttimerState != null)
    parttimerForm.parttimerState = parttimer.parttimerState;
  return parttimerForm;
}


function initOptions(options, back, parttimer) {
  if (!parttimer) {
    back = false;
  }

  var parttimerForm = getApp().globalData.parttimerForm;
  //意向兼职
  for (var i = 0; i < options.intentionparttimes.length; i++) {
    options.intentionparttimes[i].checked = false;
    if (back == true && parttimer.parttimes) {
      for (var j = 0; j < parttimer.parttimes.length; j++) {
        if (options.intentionparttimes[i].intentionparttimeId == parttimer.parttimes[j].intentionparttimeId) {
          options.intentionparttimes[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < parttimerForm.intentionparttimeIds.length; j++) {
        if (options.intentionparttimes[i].intentionparttimeId == parttimerForm.intentionparttimeIds[j]) {
          options.intentionparttimes[i].checked = true;
          break;
        }
      }
    }
  }
  //兼职地点
  for (var i = 0; i < options.parttimeaddrs.length; i++) {
    options.parttimeaddrs[i].checked = false;
    if (back == true && parttimer.parttimeaddrs) {
      for (var j = 0; j < parttimer.parttimeaddrs.length; j++) {
        if (options.parttimeaddrs[i].parttimeaddrId == parttimer.parttimeaddrs[j].parttimeaddrId) {
          options.parttimeaddrs[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < parttimerForm.parttimeaddrIds.length; j++) {
        if (options.parttimeaddrs[i].parttimeaddrId == parttimerForm.parttimeaddrIds[j]) {
          options.parttimeaddrs[i].checked = true;
          break;
        }
      }
    }
  }
  //兼职时间
  for (var i = 0; i < options.worktimes.length; i++) {
    options.worktimes[i].checked = false;
    if (back == true && parttimer.worktimes) {
      for (var j = 0; j < parttimer.worktimes.length; j++) {
        if (options.worktimes[i].worktimeId == parttimer.worktimes[j].worktimeId) {
          options.worktimes[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < parttimerForm.worktimeIds.length; j++) {
        if (options.worktimes[i].worktimeId == parttimerForm.worktimeIds[j]) {
          options.worktimes[i].checked = true;
          break;
        }
      }
    }
  }

  return options;
}
