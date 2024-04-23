/**
 * 资讯接口
 * 使用axios二次封装发送网络请求
 */

import req from "./request.js";
import base from "./base.js";

// 资讯分类列表
export const getArticleCategoryApi = () => {
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
export const getArticleListApi = (params) => {
  return req.get(base.articleList, { params });
};

// 获取单个资讯的详情
export const getArticleDetailApi = (articleId) => {
  return req.get(`${base.articleDetail}?articleId=${articleId}`);
};

// 新增资讯
export const postAddArticleApi = (params) => {
  return req.post(base.addArticle, params);
};

// 更新资讯
export const putUpdArticleApi = (params) => {
  return req.put(base.updArticle, params);
};

// 删除资讯
export const delArticleApi = (articleId) => {
  return req.delete(`${base.delArticle}/${articleId}`);
};

// 获取热门文章
export const getArticleHotTenApi = () => {
  return req.get(base.articleHotTen);
};
