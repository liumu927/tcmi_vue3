/**
 * 角色相关——使用axios二次封装发送网络请求
 * @returns 
 */
import req from "./request.js";
import base from "./base.js";


// 获取角色列表
export const getRolesListApi = () => {
  // 返回一个对象 而非数组
  return req.get(base.rolesList);
};

// 更新某个角色及其权限
export const putUpdateRoleApi = (id, params) => {
  return req.put(`${base.updateRole}/${id}`, params);
};

// 删除某个角色
export const delOneRoleApi = (id) => {
  return req.delete(`${base.deleteRole}/${id}`);
};