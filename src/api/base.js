// 统一管理所有接口

const base = {
  // host: 'http://localhost:5000/api',  // 域名
  host: "/api", // 域名

  // ================================== 公共api ==================================
  frontRights: "/rights/front", // 前台权限

  register: "/users/register", // 用户注册接口
  login: "/users/login", // 用户登录接口
  logout: "/users/logout", // 退出登录

  coverList: "/cover/list", // 轮播图列表
  noticeList: '/notices/page', // 公告列表
  noticeDetail: '/notices/detail', // 获取单个公告详情

  articleCategoryList: "/article/category", // 资讯分类列表
  articleList: "/articles/page", // 资讯列表(条件分页)
  articleDetail: "/articles/detail", // 获取单个资讯的详情
  articleHotTen: "/articles/hot", // 获取热门文章

  medCategoryList: "/medicine/category", // 全部药材分类
  medCategoryListByPage: "/medicine/category/page", // 药材分类列表(条件分页)
  medicineList: "/medicine/page", // 药材列表(条件分页)
  medecineAllList: "/medicine/all", // 全部药材
  medicineDetail: "/medicine/detail", // 获取单个药材的详情

  preCategoryList: "/prescription/category", // 全部方剂分类列表
  preCategoryListByPage: "/prescription/category/page", // 方剂分类列表(条件分页)
  prescriptionList: "/prescription/page", // 方剂列表(条件分页)
  prescriptionDetail: "/prescription/detail", // 获取单个方剂详情(包括药材组成)

  addComment: "/comment/add", // 添加留言
  commentList: "/comment/page", // 获取留言列表(条件分页)

  // ================================== 后台api ==================================
  allRights: "/rights/all", // 获取全部权限
  manageRights: "/rights/manage", // 后台权限
  updateRight: "/rights/updateRight", // 修改权限
  deleteRight: "rights/deleteRight", // 删除权限

  rolesList: "/roles", // 角色列表
  updateRole: "/roles/updateRole", // 修改角色
  deleteRole: "/roles/deleteRole", // 删除角色

  userList: "/users/page", // 用户列表(条件分页)
  deleteUser: "/users/delete", // 删除用户
  addUser: "/users/add", // 管理员新增用户
  userInfo: "/users/userInfo", // 用户详细信息
  updateUserDetail: "/users/update", // 更新用户基本信息

  applyList: "/apply/page", // 用户审核列表（条件分页）
  applyApplication: "/apply/success", // 通过审核
  refusedApplication: "/apply/fail", //不通过审核

  updateCover: "/cover/update", // 更新轮播图
  deleteCover: "/cover/delete", // 删除封面图
  addCover: "/cover/add", // 新增封面图

  addArticleCategory: "/article/category/add", // 新增资讯分类
  updArticleCategory: "/article/category/update", // 更新资讯分类
  delArticleCategory: "/article/category/delete", // 删除资讯分类
  addArticle: "/articles/add", // 新增资讯
  updArticle: "/articles/update", // 更新资讯
  delArticle: "/articles/delete", // 删除资讯

  addMedicineCategory: "/medicine/category/add", // 新增药材分类
  updMedicineCategory: "/medicine/category/update", // 更新药材分类
  delMedicineCategory: "/medicine/category/delete", // 删除药材分类
  addMedicine: "/medicine/add", // 新增药材
  updMedicine: "/medicine/update", // 更新药材
  delMedicine: "/medicine/delete", // 删除药材

  addPrescriptionCategory: "/prescription/category/add", // 新增方剂分类
  updPrescriptionCategory: "/prescription/category/update", // 更新方剂分类
  delPrescriptionCategory: "/prescription/category/delete", // 删除方剂分类
  addPrescription: "/prescription/add", // 新增方剂(对应药材组成)
  updPrescription: "/prescription/update", // 更新方剂
  delPrescription: "/prescription/delete", // 删除方剂

  addNotice: '/notices/add', // 新增公告
  updateNotice: '/notices/update', // 更新公告
  deleteNotice: '/notices/delete', // 删除公告

  medCateData: "/data/statistics/medicine/category", // 药材分类相关数据
  preCateData: "/data/statistics/prescription/category", // 方剂分类相关数据
  userData: "/data/statistics/user/role", // 方剂分类相关数据
  indexData: "/manage/index/data", // 后台首页数据

  // ================================== 前台api ==================================
  updateAvatar: "/users/updateAvatar", // 更新用户头像

  applyAuth: "/apply/add", // 申请成为专业用户

  authAddPre: "/prescription/auth/add", // 专业用户上传方剂
  passAuthPreList: "/prescription/auth/page", // 获取前台能够展示的方剂

  changeCollectState: "/collection/change", // 添加或取消收藏
  mycollectionList: "/collection/findMomentByPageQuery", // 获取我的收藏列表

  changePreAuthState: "/authentication/change", // 添加或取消方剂认证
};

export default base;
