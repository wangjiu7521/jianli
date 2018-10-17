module.exports = {
  initOutworkerForm: initOutworkerForm,
  initOutworkerShow: initOutworkerShow,
  initOptions: initOptions,
}

//初始化简历
function initOutworkerShow(outworkerShow, outworker, options) {
  if (!outworker) {
    var form = getApp().globalData.outworkerForm;
    outworkerShow.skillIntroduction = form.skillIntroduction //自我介绍

    //特长
    outworkerShow.specialtyValues = []
    for (var i = 0; i < form.specialtyIds.length; i++) {
      for (var j = 0; j < options.specialtys.length; j++) {
        if (options.specialtys[j].specialtyId === form.specialtyIds[i])
          outworkerShow.specialtyValues.push(options.specialtys[j].specialtyValue);
      }
    }
    console.log(outworkerShow);
    return outworkerShow;
  } else {

    outworkerShow.skillIntroduction = outworker.skillIntroduction //自我介绍

    //特长
    outworkerShow.specialtyValues = []
    for (var i = 0; i < outworker.specialtys.length; i++) {
      for (var j = 0; j < options.specialtys.length; j++) {
        if (options.specialtys[j].specialtyId == outworker.specialtys[i].specialtyId)
          outworkerShow.specialtyValues.push(options.specialtys[j].specialtyValue);
      }
    }
    console.log(outworkerShow);
    return outworkerShow;
  }
}


//初始化表单
function initOutworkerForm(outworkerForm, outworker) {
  if (!outworker) {
    var globalform = getApp().globalData.outworkerForm;
    if (outworkerForm.specialtyIds != null)
      outworkerForm.specialtyIds = globalform.specialtyIds;

    if (outworkerForm.skillIntroduction != null)
      outworkerForm.skillIntroduction = globalform.skillIntroduction;
    return outworkerForm;
  }

  if (outworkerForm.specialtyIds != null)
    for (var i = 0; i < outworker.specialtys.length; i++) {
      outworkerForm.specialtyIds[i] = outworker.specialtys[i].specialtyId
    }

  if (outworkerForm.skillIntroduction != null)
    outworkerForm.skillIntroduction = outworker.skillIntroduction;
  return outworkerForm;
}


function initOptions(options, back, outworker) {
  if (!outworker) {
    back = false;
  }
  var outworkerForm = getApp().globalData.outworkerForm;

  //特长
  for (var i = 0; i < options.specialtys.length; i++) {
    options.specialtys[i].checked = false;
    if (back == true && outworker.specialtys) {
      for (var j = 0; j < outworker.specialtys.length; j++) {
        if (options.specialtys[i].specialtyId == outworker.specialtys[j].specialtyId) {
          options.specialtys[i].checked = true;
          break;
        }
      }
    } else {
      for (var j = 0; j < outworkerForm.specialtyIds.length; j++) {
        if (options.specialtys[i].specialtyId == outworkerForm.specialtyIds[j]) {
          options.specialtys[i].checked = true;
          break;
        }
      }
    }
  }

  return options;
}