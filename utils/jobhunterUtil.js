module.exports = {
  initJobhunterForm: initJobhunterForm,
  initJobhunterShow: initJobhunterShow,
  initOptions: initOptions,
}


//初始化简历
function initJobhunterShow(jobhunterShow, jobhunter, options) {
  if (!jobhunter) {
    var jobhunterForm = getApp().globalData.jobhunterForm;
    jobhunterShow.userSno = jobhunterForm.userSno //学号
    jobhunterShow.userGraduatetime = jobhunterForm.userGraduatetime.substring(0,4) //毕业时间
    jobhunterShow.userNativeplace = jobhunterForm.userNativeplace //籍贯
    jobhunterShow.specialdetailed = jobhunterForm.specialdetailed //具体专业
    jobhunterShow.userIntroduction = jobhunterForm.userIntroduction //自我介绍
    jobhunterShow.intentioncitys = []
    for (var i = 0; i < jobhunterForm.intentioncitys.length; i++) {
      if (jobhunterForm.intentioncitys[i] != null && jobhunterForm.intentioncitys[i] != "")
        jobhunterShow.intentioncitys.push(jobhunterForm.intentioncitys[i]);
    }
    //伯乐
    for (var j = 0; j < options.referrers.length; j++) {
      if (options.referrers[j].referrerId === jobhunterForm.referrerId)
        jobhunterShow.referrerValue = options.referrers[j].referrerValue;
    }
    //工作经验
    for (var j = 0; j < options.experiences.length; j++) {
      if (options.experiences[j].experienceId === jobhunterForm.experienceId)
        jobhunterShow.experienceValue = options.experiences[j].experienceValue;
    }
    //专业分类
    for (var j = 0; j < options.specials.length; j++) {
      if (options.specials[j].specialId === jobhunterForm.specialId)
        jobhunterShow.specialValue = options.specials[j].specialValue;
    }
    //学历
    for (var j = 0; j < options.educations.length; j++) {
      if (options.educations[j].educationId === jobhunterForm.educationId)
        jobhunterShow.educationValue = options.educations[j].educationValue;
    }
    //意向岗位
    jobhunterShow.intentionjobValues = []
    for (var i = 0; i < jobhunterForm.intentionjobIds.length; i++) {
      for (var j = 0; j < options.intentionjobs.length; j++) {
        if (options.intentionjobs[j].intentionjobId === jobhunterForm.intentionjobIds[i])
          jobhunterShow.intentionjobValues.push(options.intentionjobs[j].intentionjobValue);
      }
    }

    //证书
    jobhunterShow.certificateValues = []
    for (var i = 0; i < jobhunterForm.certificateIds.length; i++) {
      for (var j = 0; j < options.certificates.length; j++) {
        if (options.certificates[j].certificateId === jobhunterForm.certificateIds[i])
          jobhunterShow.certificateValues.push(options.certificates[j].certificateValue);
      }
    }

    //荣誉
    jobhunterShow.honorValues = []
    for (var i = 0; i < jobhunterForm.honorIds.length; i++) {
      for (var j = 0; j < options.honors.length; j++) {
        if (options.honors[j].honorId === jobhunterForm.honorIds[i])
          jobhunterShow.honorValues.push(options.honors[j].honorValue);
      }
    }
    console.log(jobhunterShow);
    return jobhunterShow;
  } else {
    jobhunterShow.userSno = jobhunter.userSno //学号
    jobhunterShow.userGraduatetime = jobhunter.userGraduatetime //毕业时间
    jobhunterShow.userNativeplace = jobhunter.userNativeplace //籍贯
    jobhunterShow.specialdetailed = jobhunter.specialdetailed //具体专业
    jobhunterShow.userIntroduction = jobhunter.userIntroduction //自我介绍
    //伯乐
    for (var j = 0; j < options.referrers.length; j++) {
      if (options.referrers[j].referrerId == jobhunter.referrerId)
        jobhunterShow.referrerValue = options.referrers[j].referrerValue;
    }
    //工作经验
    for (var j = 0; j < options.experiences.length; j++) {
      if (options.experiences[j].experienceId == jobhunter.experienceId)
        jobhunterShow.experienceValue = options.experiences[j].experienceValue;
    }
    //专业分类
    for (var j = 0; j < options.specials.length; j++) {
      if (options.specials[j].specialId == jobhunter.specialId)
        jobhunterShow.specialValue = options.specials[j].specialValue;
    }
    //学历
    for (var j = 0; j < options.educations.length; j++) {
      if (options.educations[j].educationId == jobhunter.educationId)
        jobhunterShow.educationValue = options.educations[j].educationValue;
    }
    //意向岗位
    jobhunterShow.intentionjobValues = []
    for (var i = 0; i < jobhunter.intentionjobs.length; i++) {
      for (var j = 0; j < options.intentionjobs.length; j++) {
        if (options.intentionjobs[j].intentionjobId == jobhunter.intentionjobs[i].intentionjobId)
          jobhunterShow.intentionjobValues.push(options.intentionjobs[j].intentionjobValue);
      }
    }
    //证书
    jobhunterShow.certificateValues = []
    for (var i = 0; i < jobhunter.certificates.length; i++) {
      for (var j = 0; j < options.certificates.length; j++) {
        if (options.certificates[j].certificateId == jobhunter.certificates[i].certificateId)
          jobhunterShow.certificateValues.push(options.certificates[j].certificateValue);
      }
    }

    //荣誉
    jobhunterShow.honorValues = []
    for (var i = 0; i < jobhunter.honors.length; i++) {
      for (var j = 0; j < options.honors.length; j++) {
        if (options.honors[j].honorId == jobhunter.honors[i].honorId)
          jobhunterShow.honorValues.push(options.honors[j].honorValue);
      }
    }
    //意向城市
    jobhunterShow.intentioncitys = []
    for (var i = 0; i < jobhunter.intentionCitys.length; i++) {
      jobhunterShow.intentioncitys.push(jobhunter.intentionCitys[i].intentioncity);
    }
    console.log(jobhunterShow);
    return jobhunterShow;
  }
}



//初始化表单
function initJobhunterForm(jobhunterForm, jobhunter) {
  if (!jobhunter) {
    var globaljobhunterForm = getApp().globalData.jobhunterForm;
    if (jobhunterForm.honorIds != null)
      jobhunterForm.honorIds = globaljobhunterForm.honorIds;
    if (jobhunterForm.certificateIds != null)
      jobhunterForm.certificateIds = globaljobhunterForm.certificateIds;
    if (jobhunterForm.intentionjobIds != null)
      jobhunterForm.intentionjobIds = globaljobhunterForm.intentionjobIds;
    if (jobhunterForm.intentioncitys != null){
      jobhunterForm.intentioncitys = globaljobhunterForm.intentioncitys;
      jobhunterForm.intentioncityCodes = globaljobhunterForm.intentioncityCodes;
    }
      
    if (jobhunterForm.userSno != null)
      jobhunterForm.userSno = globaljobhunterForm.userSno;
    if (jobhunterForm.userNativeplace != null) {
      jobhunterForm.userNativeplace = globaljobhunterForm.userNativeplace;
      jobhunterForm.nativeplaceCodeA = globaljobhunterForm.nativeplaceCodeA;
    }
    if (jobhunterForm.userGraduatetime != null)
      jobhunterForm.userGraduatetime = globaljobhunterForm.userGraduatetime;
    if (jobhunterForm.experienceId != null)
      jobhunterForm.experienceId = globaljobhunterForm.experienceId;
    if (jobhunterForm.specialId != null)
      jobhunterForm.specialId = globaljobhunterForm.specialId;
    if (jobhunterForm.specialdetailed != null)
      jobhunterForm.specialdetailed = globaljobhunterForm.specialdetailed;
    if (jobhunterForm.educationId != null)
      jobhunterForm.educationId = globaljobhunterForm.educationId;
    if (jobhunterForm.referrerId != null)
      jobhunterForm.referrerId = globaljobhunterForm.referrerId;
    if (jobhunterForm.userIntroduction != null)
      jobhunterForm.userIntroduction = globaljobhunterForm.userIntroduction;
    return jobhunterForm;
  }
  if (jobhunterForm.honorIds != null)
    for (var i = 0; i < jobhunter.honors.length; i++) {
      jobhunterForm.honorIds[i] = jobhunter.honors[i].honorId;
    }
  if (jobhunterForm.specialtyIds != null)
    for (var i = 0; i < jobhunter.specialtys.length; i++) {
      jobhunterForm.specialtyIds[i] = jobhunter.specialtys[i].specialtyId
    }
  if (jobhunterForm.certificateIds != null)
    for (var i = 0; i < jobhunter.certificates.length; i++) {
      jobhunterForm.certificateIds[i] = jobhunter.certificates[i].certificateId;
    }
  if (jobhunterForm.intentionjobIds != null)
    for (var i = 0; i < jobhunter.intentionjobs.length; i++) {
      jobhunterForm.intentionjobIds[i] = jobhunter.intentionjobs[i].intentionjobId;
    }
  if (jobhunterForm.intentioncitys != null)
    for (var i = 0; i < jobhunter.intentionCitys.length; i++) {
      jobhunterForm.intentioncitys[i] = jobhunter.intentionCitys[i].intentioncity;
      jobhunterForm.intentioncityCodes[i] = jobhunter.intentionCitys[i].intentionCodeA;
    }

  if (jobhunterForm.userSno != null)
    jobhunterForm.userSno = jobhunter.userSno;
  if (jobhunterForm.userNativeplace != null) {
    jobhunterForm.userNativeplace = jobhunter.userNativeplace;
    jobhunterForm.nativeplaceCodeA = jobhunter.nativeplaceCodeA;
  }
  if (jobhunterForm.userGraduatetime != null)
    jobhunterForm.userGraduatetime = jobhunter.userGraduatetime;
  if (jobhunterForm.experienceId != null)
    jobhunterForm.experienceId = jobhunter.experienceId;
  if (jobhunterForm.specialId != null)
    jobhunterForm.specialId = jobhunter.specialId;
  if (jobhunterForm.specialdetailed != null)
    jobhunterForm.specialdetailed = jobhunter.specialdetailed;
  if (jobhunterForm.educationId != null)
    jobhunterForm.educationId = jobhunter.educationId;
  if (jobhunterForm.referrerId != null)
    jobhunterForm.referrerId = jobhunter.referrerId;
  if (jobhunterForm.userIntroduction != null)
    jobhunterForm.userIntroduction = jobhunter.userIntroduction;
  return jobhunterForm;
}


function initOptions(options, back, jobhunter) {
  if (!jobhunter) {
    back = false;
  }

  var jobhunterForm = getApp().globalData.jobhunterForm;
  //伯乐
  for (var i = 0; i < options.referrers.length; i++) {
    options.referrers[i].checked = false;
    if (back == true && jobhunter.referrerId && jobhunter.referrerId == options.referrers[i].referrerId) {
      options.referrers[i].checked = true;
    } else if (jobhunterForm.referrerId == options.referrers[i].referrerId) {
      options.referrers[i].checked = true;
    }
  }
  //意向岗位
  for (var i = 0; i < options.intentionjobs.length; i++) {
    options.intentionjobs[i].checked = false;
    if (back == true && jobhunter.intentionjobs) {
      for (var j = 0; j < jobhunter.intentionjobs.length; j++) {
        if (options.intentionjobs[i].intentionjobId == jobhunter.intentionjobs[j].intentionjobId) {
          options.intentionjobs[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < jobhunterForm.intentionjobIds.length; j++) {
        if (options.intentionjobs[i].intentionjobId == jobhunterForm.intentionjobIds[j]) {
          options.intentionjobs[i].checked = true;
          break;
        }
      }
    }
  }

  //证书
  for (var i = 0; i < options.certificates.length; i++) {
    options.certificates[i].checked = false;
    if (back == true && jobhunter.certificates) {
      for (var j = 0; j < jobhunter.certificates.length; j++) {
        if (options.certificates[i].certificateId == jobhunter.certificates[j].certificateId) {
          options.certificates[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < jobhunterForm.certificateIds.length; j++) {
        if (options.certificates[i].certificateId == jobhunterForm.certificateIds[j]) {
          options.certificates[i].checked = true;
          break;
        }
      }
    }
  }
  //荣誉
  for (var i = 0; i < options.honors.length; i++) {
    options.honors[i].checked = false;
    if (back == true && jobhunter.honors) {
      for (var j = 0; j < jobhunter.honors.length; j++) {
        if (options.honors[i].honorId == jobhunter.honors[j].honorId) {
          options.honors[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < jobhunterForm.honorIds.length; j++) {
        if (options.honors[i].honorId == jobhunterForm.honorIds[j]) {
          options.honors[i].checked = true;
          break;
        }
      }
    }
  }
  return options;
}