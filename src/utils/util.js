// 封装公共工具


/**
 * 更新图标样式
 * @param {*} collectState 
 * @param {*} authState 
 */
export const updateIconStyles = (collectState, authState) => {
  // 收藏图标样式
  const collectImg = document.getElementById("is-like-img");
  const collectImgActive = document.getElementById("is-like-imgactive");
  if (collectState === 1) {
    collectImg.style.display = "none";
    collectImgActive.style.display = "block";
  } else {
    collectImg.style.display = "block";
    collectImgActive.style.display = "none";
  }

  // 认证图标样式
  const authImg = document.getElementById("is-auth-img");
  const authImgActive = document.getElementById("is-auth-imgactive");
  if (authState === 1) {
    authImg.style.display = "none";
    authImgActive.style.display = "block";
  } else {
    authImg.style.display = "block";
    authImgActive.style.display = "none";
  }
};