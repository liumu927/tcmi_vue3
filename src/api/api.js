// 使用axios二次封装发送网络请求

import req from "./request.js";
import base from "./base.js";


// ================= 公共 =================
// 根据flag获取前台权限
export const getFrontRightsApi = (flag) => {
  return req.get(`${base.frontRights}?flag=${flag}`);
};
// 登录接口
export const postUserLogin = (params) => {
  return req.post(`${base.login}`, params)
}


// ================= 后台 =================
// 获取全部权限列表
export const getAllRightsApi = () => {
  return req.get(base.allRights)
}
// 根据flag获取后台权限
export const getManageRightsApi = (flag) => {
  return req.get(`${base.manageRights}?flag=${flag}`);
};
// 更新权限列表
export const putRightsApi = (id, params) => {
  return req.put(`${base.updateRight}/${id}`, params);
};
// 删除某个权限列表
export const delRightApi = (id) => {
  return req.delete(`${base.deleteRight}/${id}`);
};


// 获取角色列表
export const getRolesListApi = () => {
  // 返回一个对象 而非数组
  return req.get(base.rolesList);
};
// 更新某个角色及其权限
export const putUpdateRoleApi = (id, params) => {
  return req.put(`${base.updateRole}/${id}`, params)
}
// 删除某个角色
export const delOneRoleApi = (id) => {
  return req.delete(`${base.deleteRole}/${id}`)
}


// 获取用户列表
export const getUsersListApi = () => {
  return req.get(base.userList)
}
// 获取用户详细信息
export const getUserInfoApi = () => {
  return req.get(base.userInfo)
}


// ================= 前台 =================
