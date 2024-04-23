/**
 * 方剂接口
 * 使用axios二次封装发送网络请求
 */

import req from "./request.js";
import base from "./base.js";

// 全部方剂分类
export const getPreCategoryListApi = () => {
  return req.get(base.preCategoryList);
};

// 方剂分类列表
export const getpreCategoryListByPageApi = (params) => {
  return req.get(base.preCategoryListByPage, { params });
};

// 新增方剂分类
export const postAddPrescriptionCategoryApi = (params) => {
  return req.post(base.addPrescriptionCategory, params);
};

// 更新方剂分类
export const putUpdPrescriptionCategoryApi = (params) => {
  return req.put(base.updPrescriptionCategory, params);
};

// 删除方剂分类
export const delPrescriptionCategoryApi = (id) => {
  return req.delete(`${base.delPrescriptionCategory}/${id}`);
};

// 方剂列表(条件分页)
export const getPreListApi = (params) => {
  return req.get(base.prescriptionList, { params });
};

// 获取单个方剂的详情
export const getPreDetailApi = (prescriptionId) => {
  return req.get(`${base.prescriptionDetail}?prescriptionId=${prescriptionId}`);
};

// 新增方剂
export const postAddPrescriptionApi = (params) => {
  return req.post(base.addPrescription, params);
};

// 更新方剂
export const putUpdPrescriptionApi = (params) => {
  return req.put(base.updPrescription, params);
};

// 删除方剂
export const delPrescriptionApi = (prescriptionId) => {
  return req.delete(`${base.delPrescription}/${prescriptionId}`);
};
