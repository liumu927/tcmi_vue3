/**
 * 资讯接口
 * 使用axios二次封装发送网络请求
 */

import req from "./request.js";
import base from "./base.js";

// 资讯分类列表
export const getArticleCategoryListApi = () => {
  return req.get(base.articleCategoryList);
};

// 新增资讯分类
export const postAddArticleCategoryApi = (params) => {
  return req.post(base.addArticleCategory, params);
};

// 更新资讯分类
export const putUpdArticleCategoryApi = (params) => {
  return req.put(base.updArticleCategory, params);
};

// 删除资讯分类
export const delArticleCategoryApi = (id) => {
  return req.delete(`${base.delArticleCategory}/${id}`);
};

// 资讯列表(条件分页)
export const getArticleListApi = () => {
  return req.get(base.articleList);
};

// 获取单个资讯的详情
export const getArticleDetailApi = () => {
  return req.get(base.articleDetail);
};

// 新增资讯
export const postAddArticleApi = () => {
  return req.post(base.addArticle);
};

// 更新资讯
export const putUpdArticleApi = () => {
  return req.put(base.updArticle);
};

// 删除资讯
export const delArticleApi = () => {
  return req.delete(base.delArticle);
};
