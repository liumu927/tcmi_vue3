/**
 * 其他接口
 * 使用axios二次封装发送网络请求
 */


import req from "./request.js";
import base from "./base.js";


// 获取轮播图列表
export const getCoverListApi = () => {
  return req.get(base.getCoverList);
};

// 更新轮播图
export const putUpdateCoverApi = (params) => {
  return req.put(base.updateCover, params)
}

// 删除封面图片
export const deleteCoverApi = (coverId) => {
  return req.delete(`${base.deleteCover}/${coverId}`)
}

// 新增封面图
export const postAddCoverApi = (params) => {
  return req.post(base.addCover, params)
}
