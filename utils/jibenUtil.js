
module.exports = {
  initJibenForm: initJibenForm,
  initJibenShow: initJibenShow,
}

//初始化简历
function initJibenShow( user,options){
  var jibenShow ={};
  if(!user){
    var form = getApp().globalData.jibenForm;
    if (form.userPhotoUrl && form.userPhotoUrl !=""){
      jibenShow.userPhotoUrl = form.userPhotoUrl;
    }else{
      jibenShow.userPhotoUrl = getApp().globalData.userPhotoUrl;
    }
      /************/
    jibenShow.userName = form.userName   //名字
    jibenShow.userGender = form.userGender   //性别
    jibenShow.userTel = form.userTel   //电话
    jibenShow.userQq = form.userQq   //QQ
    jibenShow.userEmail = form.userEmail   //邮箱
    //学校
    for (var j = 0; j < options.schools.length; j++) {
      if (options.schools[j].schoolId === form.schoolId)
        jibenShow.schoolValue = options.schools[j].schoolValue;
    }

    return jibenShow;
  }else{
    if (user.userPhotoUrl && user.userPhotoUrl != "") {
      jibenShow.userPhotoUrl = getApp().globalData.domain + user.userPhotoUrl;
    } else {
      jibenShow.userPhotoUrl = getApp().globalData.userPhotoUrl;
    }
    /************/
    jibenShow.userName = user.userName   //名字
    jibenShow.userGender = user.userGender   //性别
    jibenShow.userTel = user.userTel   //电话
    jibenShow.userQq = user.userQq   //QQ
    jibenShow.userEmail = user.userEmail   //邮箱

    //学校
    for (var j = 0; j < options.schools.length; j++) {
      if (options.schools[j].schoolId == user.schoolId)
        jibenShow.schoolValue = options.schools[j].schoolValue;
    }
    
    return jibenShow;
  }
}

//初始化表单
function initJibenForm(form , user) {
  if (!user){
    var globalform = getApp().globalData.jibenForm;
    if (form.userPhotoUrl != null)
      form.userPhotoUrl = globalform.userPhotoUrl;
    if (form.userName != null)
      form.userName = globalform.userName;
    if (form.userGender != null)
      form.userGender = globalform.userGender;
    if (form.userTel != null)
      form.userTel = globalform.userTel;
    if (form.userQq != null)
      form.userQq = globalform.userQq;
    if (form.userEmail != null)
      form.userEmail = globalform.userEmail;
    if (form.schoolId != null){
      form.schoolId = globalform.schoolId;
      form.enterCodeC = globalform.enterCodeC;
    }
      
    return form;
  }
  
  if (form.userPhotoUrl != null)
    form.userPhotoUrl = user.userPhotoUrl;
  if (form.userName != null)
    form.userName = user.userName;
  if (form.userGender != null)
    form.userGender = user.userGender;
  if (form.userTel != null)
    form.userTel = user.userTel;
  if (form.userQq != null)
    form.userQq = user.userQq;
  if (form.userEmail != null)
    form.userEmail = user.userEmail;
  if (form.schoolId != null){
    form.schoolId = user.schoolId;
    form.enterCodeC = user.enterCodeC;
  }
    
  return form;
}
