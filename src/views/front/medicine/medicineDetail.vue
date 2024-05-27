<template>
  <NavMenu></NavMenu>
  <el-card class="med-container">
    <template #header>
      <div class="card-header">
        <h1>{{ medicineDetail.medicineName }}</h1>
        <p style="color: grey; font-size: 12px">
          更新时间：{{ medicineDetail.updatedAt }}
        </p>
      </div>
    </template>

    <div class="main">
      <div class="tag">
        <p>
          分类专栏：<el-tag type="info">{{
            medicineDetail.medicineTypeName
          }}</el-tag>
        </p>
      </div>
      <div class="container">
        <div class="med-img">
          <img :src="medicineDetail.medicineImg" />
          <span id="med-img-text">药材图示</span>
        </div>
        <div class="text">
          <ul>
            <li>
              <span>药材别名</span>
              <p>{{ medicineDetail.medicineAlias }}</p>
            </li>
            <li>
              <span>药材归经</span>
              <p>{{ medicineDetail.origin }}</p>
            </li>
            <li>
              <span>产地分布</span>
              <p>{{ medicineDetail.originDistribution }}</p>
            </li>
            <li>
              <span>药用部位</span>
              <p>{{ medicineDetail.medicinalParts }}</p>
            </li>
            <li>
              <span>药材性状</span>
              <p>{{ medicineDetail.analysis }}</p>
            </li>
            <li>
              <span>功效与作用</span>
              <p>{{ medicineDetail.effects }}</p>
            </li>
            <li>
              <span>常用配方</span>
              <p>{{ medicineDetail.commonPrescriptions }}</p>
            </li>
            <li>
              <span>临床应用</span>
              <p>{{ medicineDetail.application }}</p>
            </li>
            <li>
              <span>使用禁忌</span>
              <p>{{ medicineDetail.usageTaboo }}</p>
            </li>
            <li>
              <span>参考价格</span>
              <p>{{ medicineDetail.referencePrice }}</p>
            </li>
          </ul>
        </div>
        <div v-show="!notIsNormal" class="no-normal">
          <div class="med-img">
            <img :src="medicineDetail.structureImg" />
            <span>化学结构图</span>
          </div>
          <ul>
            <li>
              <span>药材化学成分</span>
              <p>{{ medicineDetail.biologicalRelated }}</p>
            </li>
            <li>
              <span>药理研究</span>
              <p>{{ medicineDetail.chemicalStructure }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="left-toolbox">
        <div class="toolbox-left">
          <p>发布时间：{{ medicineDetail.createdAt }}</p>
        </div>
        <div class="toolbox-right">
          <!-- 点赞 -->
          <!-- <a class="tool-item-href">
            <img
              class="isactive"
              style="margin-right: 0px; display: none"
              id="is-zan-imgactive"
              src="/zan_active.png"
            />
            <img
              class="isdefault"
              style="margin-right: 0px; display: block"
              id="is-zan-img"
              src="/zan.png"
            />
            <span
              id="zanCount"
              class="count"
              style="color: rgb(153, 154, 170)"
            ></span>
          </a> -->

          <!-- 收藏 -->
          <a class="tool-item-href" @click="changeCollectState">
            <img
              class="isdefault"
              style="display: block"
              id="is-like-img"
              src="/like.png"
            />
            <img
              class="isactive"
              style="display: none"
              id="is-like-imgactive"
              src="/like_active.png"
            />
            <span
              id="likeCount"
              class="count"
              style="color: rgb(153, 154, 170)"
              >{{ medicineDetail.collectionNum }}</span
            >
          </a>
        </div>
      </div>
    </template>
  </el-card>

  <!-- 留言区 -->
  <Comment 
    :toCommentData="toCommentData"
  />

  <Footer></Footer>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed, reactive } from "vue";
import { getMedicineDetailApi } from "@/api/medicine";
import { changeCollectStateApi } from "@/api/common";
import { useUserStore } from "@/stores/useUserStore";
import { ElMessage } from "element-plus";
import { updateIconStyles } from "@/utils/util";
import Comment from "@/components/front/Comment.vue";

const { userInfo } = useUserStore();
const route = useRoute();
// 接收通过路由跳转传过来的资讯ID 字符串
const getMedicineId = Number(route.query.medicineId);
const medicineDetail = ref([]);
const userRoleId = userInfo.role.roleType;

// 请求发布评论的请求体
const toCommentData = reactive({
  momentId: Number(getMedicineId),
  commentType: 1
});

onMounted(() => {
  getMedInfo();
});

// 判断用户身份 是否是普通用户
const notIsNormal = computed(() => {
  return userRoleId === 303;
});

/**
 * 添加/取消收藏
 */
const changeCollectState = async () => {
  // 封装参数
  const params = {
    momentId: medicineDetail.value.medicineId,
    collectType: 1,
  };

  // 发起请求
  try {
    const res = await changeCollectStateApi(params);
    ElMessage.success(res.msg);
    getMedInfo();
  } catch (error) {
    console.log("🚀 ~ changeCollectState ~ error:", error);
  }
};

/**
 * 获取药材信息
 */
const getMedInfo = async () => {
  try {
    const res = await getMedicineDetailApi(getMedicineId);

    // 回显
    medicineDetail.value = res.data;

    // 更新图标样式
    updateIconStyles(res.data.collectState);
  } catch (error) {
    console.log("🚀 ~ getMedInfo ~ error:", error);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-card {
  width: 80%;
  margin: 20px auto;
}

// 详情展示区
.med-container {
  // 头部
  .card-header {
    text-align: center;
    overflow: hidden;
    h1 {
      margin-bottom: 10px;
    }
  }

  // 中间全部内容
  .main {
    // tag标签区域
    .tag {
      font-size: 14px;
      margin-bottom: 30px;
    }

    // 内容区域
    .container {
      padding: 0 30px;
      font-size: 16px;

      // 图片盒子
      .med-img {
        width: 300px;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;

        // 图片
        img {
          height: 100%;
          width: 100%;
          object-fit: contain;
          margin-bottom: 5px;
          border-radius: 10px;
        }

        // 文字
        span {
          font-size: 12px;
          color: gray;
        }
      }

      // 主要内容区域
      .text {
        margin-top: 20px;
        ul {
          list-style: none;

          li {
            display: flex;
            height: auto;
            line-height: 25px;
            font-size: 12px;
            color: gray;
            span {
              display: block;
              width: 100px;
              font-size: 14px;
              font-weight: bold;
              color: $second-text;
            }
            p {
              flex: 1;
            }
          }
        }
      }

      // 普通用户不可见区域
      .no-normal {
        margin-top: 20px;
        min-height: 350px;

        .med-img {
          margin-bottom: 20px;
        }

        ul {
          list-style: none;
          // display: flex;
          height: 35px;
          line-height: 35px;
          font-size: 12px;
          color: gray;

          li {
            display: flex;
            height: auto;
            line-height: 25px;
            font-size: 12px;
            color: gray;
            span {
              display: block;
              width: 110px;
              font-size: 14px;
              font-weight: bold;
              color: $second-text;
            }
            p {
              flex: 1;
            }
          }
        }
      }
    }
  }

  // 底部区域
  .left-toolbox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    // 左侧 头像 姓名
    .toolbox-left {
      display: flex;
      align-items: center;
      font-size: 12px;

      span:last-child {
        font-size: 18px;
        font-weight: bold;
        display: block;
        margin-left: 20px;
      }
    }

    // 右侧
    .toolbox-right {
      width: 15%;
      display: flex;
      justify-content: space-around;

      // 点赞 / 收藏
      .tool-item-href {
        width: 30px;
        display: flex;
        justify-content: space-between;

        img {
          height: 20px;
        }
      }
    }
  }
}
</style>
