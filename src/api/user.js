// 使用axios二次封装发送网络请求

import req from "./request.js";
import base from "./base.js";

// 注册接口
export const postUserRegisterApi = (params) => {
  return req.post(base.register, params);
};

// 登录接口
export const postUserLoginApi = (params) => {
  return req.post(base.login, params);
};

// 退出登录
export const postUserLogoutApi = (userId) => {
  return req.post(`${base.logout}?id=${userId}`);
};

// 用户列表(条件分页)
export const getUserListByPageQueryApi = (params) => {
  return req.get(base.userList, {params: params});
};

// 删除用户
export const deleteUserApi = (userId) => {
  return req.delete(`${base.deleteUser}/${userId}`);
};

// 管理员新增用户
export const postAddUserApi = (params) => {
  return req.post(base.addUser, params);
};

// 根据id获取用户详细信息
export const getUserInfoApi = (userId) => {
  return req.get(`${base.userInfo}?userId=${userId}`);
};

// 更新用户头像
export const updateAvatarApi = (avatarUrl) => {
  return req.patch(`${base.updateAvatar}?avatar=${avatarUrl}`);
};

// 更新用户基本信息
export const updateUserDetailApi = (params) => {
  return req.put(base.updateUserDetail, params);
};

// 用户审核列表（条件分页）
export const getApplyListApi= (params) => {
  return req.get(base.applyList, {params: params});
}

// 通过审核
export const applyApplicationApi = (userId) => {
  return req.post(`${base.applyApplication}?id=${userId}`);
};

//不通过审核
export const refusedApplicationApi = (userId) => {
  return req.post(`${base.refusedApplication}?id=${userId}`);
};
