/**
 * 药材接口
 * 使用axios二次封装发送网络请求
 */


import req from "./request.js";
import base from "./base.js";


// 药材分类列表
export const getMedicineCategoryListApi = (params) => {
  return req.get(base.medicineCategoryList,{params});
}

// 新增药材分类
export const postAddMedicineCategoryApi = (params) => {
  return req.post(base.addMedicineCategory, params);
}

// 更新药材分类 
export const putUpdMedicineCategoryApi = (params) => {
  return req.put(base.updMedicineCategory, params);
}

// 删除药材分类
export const delMedicineCategoryApi = (id) => {
  return req.delete(`${base.delMedicineCategory}/${id}`);
}

// 药材列表(条件分页)
export const getMedicineListApi = () => {
  return req.get(base.medicineList);
}

// 获取单个药材的详情
export const getMedicineDetailApi = () => {
  return req.get(base.medicineDetail);
}

// 新增药材
export const postAddMedicineApi = () => {
  return req.post(base.updMedicine);
}

// 更新药材
export const postUpdMedicineApi = () => {
  return req.post(base.addMedicine);
}

// 删除药材
export const delMedicineApi = () => {
  return req.delete(base.delMedicine);
}