import service from "@/utils/http";

// 获取登录令牌

export const postUwellOauth = (params, token) => {
  const text = btoa(`data_report:ZGF0YV9yZXBvcnQ6c0RMeVhBZjk0d1VI`);
  // const text = btoa(`data_report:123456`);
  return service(`/u/uwell-auth/oauth2/token`, {
    method: "POST",
    params,
    headers: {
      Authorization: `Basic ${text}`,
      "Content-Type": "application/json;charset=UTF-8",
      reCAPTCHA: token,
    },
  });
};

// 退出
export const delUwellLogout = () => {
  return service(`/u/uwell-auth/token/logout`, {
    method: "DELETE",
  });
};

// 忘记密码邮件发送
export const postUwellForgetPwd = (data) => {
  return service(`/u/uwell-system/user/email/forgetPwd`, {
    method: "POST",
    data:{
      email:data.email,
    },
    headers: { reCAPTCHA: data.token},
  });
};

// 忘记密码
export const postUwellForgetPassword = (data) => {
  return service(`/u/uwell-system/user/forgetPassword`, {
    method: "POST",
    data,
  });
};

// 获取当前用户资源权限

export const getResourceListByCurrentUser = () => {
  return service(`/u/uwell-system/resource/listByCurrentUser`, {
    method: "GET",
  });
};

// 动态表单管理列表
export const postDrsFormList = (data) => {
  return service(`/u/drs/form/list`, {
    method: "POST",
    data,
  });
};

// 发布动态表单
export const putDrsFormRelease = (id) => {
  return service(`/u/drs/form/release/${id}`, {
    method: "PUT",
  });
};

// 删除动态表单
export const delDrsFormDel = (id) => {
  return service(`/u/drs/form/del/${id}`, {
    method: "DELETE",
  });
};

// 停止动态表单
export const putDrsFormStop = (id) => {
  return service(`/u/drs/form/stop/${id}`, {
    method: "PUT",
  });
};

// 添加动态表单
export const postDrsFormAdd = (data) => {
  return service(`/u/drs/form/add`, {
    method: "POST",
    data,
  });
};

// 动态表单编辑的初始化数据

export const getDrsFormEditInit = (id) => {
  return service(`/u/drs/form/editInit/${id}`, {
    method: "GET",
  });
};

export const getDrsFormDataDetails = (id) => {
  return service(`/u/drs/formData/details/${id}`, {
    method: "GET",
  });
};

// 内部用户查询-钉钉
export const getInnerDeptTree = () => {
  return service(`/u/uwell-system/inner-dept/detail/tree`, {
    method: "GET",
  });
};
// 外部用户查询-钉钉
export const getInnerTree = () => {
  return service(`/u/uwell-system/dept/detail/tree`, {
    method: "GET",
  });
};

// 编辑动态表单
export const putDrsFormEdit = (data) => {
  return service(`/u/drs/form/edit`, {
    method: "PUT",
    data,
  });
};

// 动态表单数据列表
export const postDrsformDataList = (data) => {
  return service(`/u/drs/formData/list/${data.id}`, {
    method: "POST",
    data: data.data,
  });
};

// 动态表单数据筛选条件
export const postDrsformDataScreen = (formId) => {
  return service(`/u/drs/formData/screen/${formId}`, {
    method: "GET",
  });
};

// 当前用户的字段管理列表
export const getFormFieldManageListForUser = (formId) => {
  return service(`/u/drs/formFieldManage/listForUser/${formId}`, {
    method: "GET",
  });
};

// 编辑当前用户的字段管理
export const postFormFieldManageListForUser = (data) => {
  return service(`/u/drs/formFieldManage/edit/${data.formId}`, {
    method: "POST",
    data: data.data,
  });
};

// （表单管理）导出动态表单管理数据列表
// export const postFormDataExport = (data) => {
//   return service(`/u/drs/formData/export/${data.formId}`, {
//     method: "POST",
//     data:data.data
//   });
// };

// 动态表单数据详情
export const getFormDataDetails = (dataId) => {
  return service(`/u/drs/formData/details/${dataId}`, {
    method: "GET",
  });
};

// 删除动态表单数据
export const delFormDataDel = (dataId) => {
  return service(`/u/drs/formData/del/${dataId}`, {
    method: "DELETE",
  });
};



// 动态表单数据筛选条件
export const getFormDataScreen = (dataId) => {
  return service(`/u/drs/formData/screen/${dataId}`, {
    method: "GET",
  });
};

// // 获取表单数据列表
// export const getSchemaTableList = (id,value) => {
//   return service(`/u/schema/schemaTable/list/${id}`, {
//     method: "POST",
//     data:value
//   });
// };

// // 根据 ID 获取图形表单 get
// export const getSchemaTableGetById = (id) => {
//   return service(`/u/schema/schemaTable/getById/${id}`, {
//     method: "GET",
//   });
// };

// 内部账号

// 钉钉组织架构查询(树形结构)
export const getUwellSystemInnerDeptTree = () => {
  return service(`/u/uwell-system/inner-dept/tree`, {
    method: "GET",
  });
};

// 内部用户分页查询-钉钉
export const postUwellSystemInnerUserPage = (data) => {
  return service(`/u/uwell-system/inner-user/page`, {
    method: "POST",
    data,
  });
};

// 钉钉组织架构同步
export const getUwellSystemInnerUserSync = () => {
  return service(`/u/uwell-system/inner-user/sync`, {
    method: "GET",
  });
};

// 角色列表
export const getUwellSystemRoleList = () => {
  return service(`/u/uwell-system/role/list`, {
    method: "GET",
  });
};

// 内部用户编辑
export const postUwellSystemInnerUserEdit = (data) => {
  return service(`/u/uwell-system/inner-user/edit`, {
    method: "POST",
    data,
  });
};

// 外部账号
// 部门查询（树形结构）
export const getUwellSystemDeptTree = () => {
  return service(`/u/uwell-system/dept/tree`, {
    method: "GET",
  });
};

// /分页查询用户信息
export const postUwellSystemUserPage = (data) => {
  return service(`/u/uwell-system/user/page`, {
    method: "POST",
    data,
  });
};

// 部门创建
export const postUwellSystemDeptCreate = (data) => {
  return service(`/u/uwell-system/dept/create`, {
    method: "POST",
    data,
  });
};

// 部门编辑
export const postUwellSystemDeptEdit = (data) => {
  return service(`/u/uwell-system/dept/edit`, {
    method: "POST",
    data,
  });
};

// 部门删除
export const delUwellSystemDept = (data) => {
  return service(`/u/uwell-system/dept/${data.id}`, {
    method: "DELETE",
    // params:data
  });
};

// 用户创建
export const postUwellSystemUserCreate = (data) => {
  return service(`/u/uwell-system/user/create`, {
    method: "POST",
    data,
  });
};

// 用户编辑
export const postUwellSystemUserEdit = (data) => {
  return service(`/u/uwell-system/user/edit`, {
    method: "POST",
    data,
  });
};

// 用户删除
export const delUwellSystemUser = (data) => {
  return service(`/u/uwell-system/user/${data.id}`, {
    method: "DELETE",
  });
};

// 表单填报
export const postFormFillingList = (data) => {
  return service(`/u/drs/form/fillingList`, {
    method: "POST",
    data,
  });
};

// 编辑表单初始化动态表单结构
export const getformStructureGet = (dataId) => {
  return service(`/u/drs/formData/addInit/${dataId}`, {
    method: "GET",
  });
};


// 新增动态表单数据（用户）带有是否保存状态
export const postFormDataAddStatus = (id, data,status) => {
  return service(`/u/drs/formData/add/${id}/${status}`, {
    method: "POST",
    data: data,
  });
};
// 新增动态表单数据 (管理)
export const postFormDataAdd = (id, data) => {
  return service(`/u/drs/formData/add/${id}`, {
    method: "POST",
    data: data,
  });
};

// （表单填报）动态表单填报数据列表
export const postFormDataFillingList = (data) => {
  return service(`/u/drs/formData/fillingList/${data.id}`, {
    method: "POST",
    data: data.data,
  });
};

// 编辑表单初始化动态表单结构
export const getFormDataEditInit = (dataId) => {
  return service(`/u/drs/formData/editInit/${dataId}`, {
    method: "GET",
  });
};


export const putFormDataEditPersonal = (dataId, data,status) => {
  return service(`/u/drs/formData/edit/${dataId}/${status}`, {
    method: "PUT",
    data,
  });
};
export const putFormDataEdit = (dataId, data) => {
  return service(`/u/drs/formData/edit/${dataId}`, {
    method: "PUT",
    data,
  });
};

// 国家列表 get

export const getListCountry = () => {
  return service(`/u/website/as/open/countryRegion/list`, {
    method: "GET",
  });
};
export const getListProvince = (params) => {
  return service(`/u/website/as/open/countryRegion/list`, {
    method: "GET",
    params
  });
};

// 产品列表
export const getListProduct = (type) => {
  return service(`/u/website/api/open/onViewProductType/${type}`, {
    method: "GET",
  });
};
