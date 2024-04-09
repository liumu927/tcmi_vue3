// 统一管理所有接口

const base = {
  // host: 'http://localhost:5000/api',  // 域名
  host: '/api',  // 域名

  // ================= 公共api =================
  login: '/users/login', // 用户登录接口
  frontRights: '/rights/front', // 前台权限
  

  // ================= 后台api =================
  allRights: '/rights/all', // 获取全部权限
  manageRights: '/rights/manage', // 后台权限 
  updateRight: '/rights/updateRight', // 修改权限
  deleteRight: 'rights/deleteRight', // 删除权限

  rolesList: '/manage/roles', // 角色列表
  updateRole: '/manage/roles/updateRole', // 修改角色
  deleteRole: '/manage/roles/deleteRole', // 删除角色

  userList: '/users', // 用户列表
  userInfo: '/users/userInfo', // 用户列表

  
  // ================= 前台api =================
}

export default base