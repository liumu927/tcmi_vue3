/**
 * 方剂接口
 * 使用axios二次封装发送网络请求
 */


import req from "./request.js";
import base from "./base.js";


// 方剂分类列表
export const getPriscriptionCategoryListApi = (params) => {
  return req.get(base.priscriptionCategoryList, {params});
}

// 新增方剂分类
export const postAddPriscriptionCategoryApi = (params) => {
  return req.post(base.addPriscriptionCategory, params);
}

// 更新方剂分类 
export const putUpdPriscriptionCategoryApi = (params) => {
  return req.put(base.updPriscriptionCategory, params);
}

// 删除方剂分类
export const delPriscriptionCategoryApi = (id) => {
  return req.delete(`${base.delPriscriptionCategory}/${id}`);
}

// 方剂列表(条件分页)
export const getPriscriptionListApi = () => {
  return req.get(base.priscriptionList);
}

// 获取单个方剂的详情
export const getPriscriptionDetailApi = () => {
  return req.get(base.priscriptionDetail);
}

// 新增方剂
export const postAddPriscriptionApi = () => {
  return req.post(base.addPriscription);
}

// 更新方剂
export const putUpdPriscriptionApi = () => {
  return req.put(base.updPriscription);
}

// 删除方剂
export const delPriscriptionApi = () => {
  return req.delete(base.delPriscription);
}
