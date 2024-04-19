/**
 * 权限相关——使用axios二次封装发送网络请求
 */

import req from "./request.js";
import base from "./base.js";


// 根据flag获取前台权限
export const getFrontRightsApi = (flag) => {
  return req.get(`${base.frontRights}?flag=${flag}`);
};

// 获取全部权限列表
export const getAllRightsApi = () => {
  return req.get(base.allRights);
};

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
