/**
 * 药材接口
 * 使用axios二次封装发送网络请求
 */

import req from "./request.js";
import base from "./base.js";


// 全部药材分类
export const getMedCategoryListApi = () => {
  return req.get(base.medCategoryList);
};

// 药材分类列表
export const getmedCategoryListByPageApi = (params) => {
  return req.get(base.medCategoryListByPage, { params });
};

// 新增药材分类
export const postAddMedicineCategoryApi = (params) => {
  return req.post(base.addMedicineCategory, params);
};

// 更新药材分类
export const putUpdMedicineCategoryApi = (params) => {
  return req.put(base.updMedicineCategory, params);
};

// 删除药材分类
export const delMedicineCategoryApi = (id) => {
  return req.delete(`${base.delMedicineCategory}/${id}`);
};

// 药材列表(条件分页)
export const getMedicineListApi = (params) => {
  return req.get(base.medicineList, { params });
};

// 全部药材
export const getMedecineAllListApi = () => {
  return req.get(base.medecineAllList);
}

// 获取单个药材的详情
export const getMedicineDetailApi = (medicineId) => {
  return req.get(`${base.medicineDetail}?medicineId=${medicineId}`);
};

// 新增药材
export const postAddMedicineApi = (params) => {
  return req.post(base.addMedicine, params);
};

// 更新药材
export const postUpdMedicineApi = (params) => {
  return req.post(base.updMedicine, params);
};

// 删除药材
export const delMedicineApi = (medicineId) => {
  return req.delete(`${base.delMedicine}/${medicineId}`);
};
