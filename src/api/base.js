// 统一管理所有接口

const base = {
  // host: 'http://localhost:5000/api',  // 域名
  host: '/api',  // 域名

  // ================= 公共api =================
  frontRights: '/rights/front', // 前台权限
  register: '/users/register', // 用户注册接口
  login: '/users/login', // 用户登录接口
  logout: '/users/logout', // 退出登录
  getCoverList: '/cover/list', // 轮播图列表
  updateCover: '/cover/update', // 更新轮播图
  deleteCover: '/cover/delete', // 删除封面图
  addCover: '/cover/add', // 新增封面图


  // ================= 后台api =================
  allRights: '/rights/all', // 获取全部权限
  manageRights: '/rights/manage', // 后台权限 
  updateRight: '/rights/updateRight', // 修改权限
  deleteRight: 'rights/deleteRight', // 删除权限

  rolesList: '/roles', // 角色列表
  updateRole: '/roles/updateRole', // 修改角色
  deleteRole: '/roles/deleteRole', // 删除角色

  userList: '/users/page', // 用户列表(条件分页)
  deleteUser: '/users/delete', // 删除用户
  addUser: '/users/add', // 管理员新增用户
  userInfo: '/users/userInfo', // 用户详细信息
  updateAvatar: '/users/updateAvatar', // 更新用户头像
  updateUserDetail: '/users/update', // 更新用户基本信息

  getApplyList: '/apply/page', // 用户审核列表（条件分页）
  applyApplication: '/apply/success', // 通过审核
  refusedApplication: '/apply/fail', //不通过审核


  // ================= 前台api =================
}

export default base