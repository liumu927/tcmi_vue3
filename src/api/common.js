/**
 * 其他接口
 * 使用axios二次封装发送网络请求
 */


import req from "./request.js";
import base from "./base.js";


 // ================================== 轮播图api ==================================
// 获取轮播图列表
export const getCoverListApi = () => {
  return req.get(base.coverList);
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


 // ================================== 公告api ==================================
// 获取公告列表(条件分页)
export const getNoticeListApi = (params) => {
  return req.get(base.noticeList, {params});
};

// 更新公告
export const putUpdateNoticeApi = (params) => {
  return req.put(base.updateNotice, params)
}

// 删除
export const deleteNoticeApi = (coverId) => {
  return req.delete(`${base.deleteNotice}/${coverId}`)
}

// 新增
export const postAddNoticeApi = (params) => {
  return req.post(base.addNotice, params)
}

// 获取单个公告详情
export const getNoticeDetailApi = (id) => {
  return req.get(`${base.noticeDetail}/${id}`)
}