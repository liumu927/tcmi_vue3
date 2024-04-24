<template>
  <NavMenu></NavMenu>
  <el-card>
    <template #header>
      <div class="card-header">
        <h1>{{ preDetail.prescriptionName }}</h1>
        <p style="color: grey; font-size: 12px">
          更新时间：{{ preDetail.updatedAt }}
        </p>
      </div>
    </template>

    <div class="main">
      <div class="tag">
        <p>
          分类专栏：<el-tag type="warning">{{ preDetail.preTypeName }}</el-tag>
        </p>
      </div>
      <div class="container">
        <div class="med-img">
          <img :src="preDetail.imgUrl" />
          <span id="med-img-text">方剂图示</span>
        </div>
        <div class="text">
          <ul>
            <li><span>方剂归经</span>{{ preDetail.origin }}</li>
            <li><span>主要功效</span>{{ preDetail.effects }}</li>
            <li><span>组成成分</span>{{ preDetail.composition }}</li>
            <li><span>推荐用法</span>{{ preDetail.prescriptionUsage }}</li>
            <li><span>临床应用</span>{{ preDetail.application }}</li>
            <li><span>使用人群</span>{{ preDetail.applicableCrowd }}</li>
            <li><span>使用禁忌</span>{{ preDetail.contraindications }}</li>
          </ul>
          <div class="preMedicines">
            <p>主要药材组成</p>
            <template v-for="(item, index) in preMeds" :key="index">
              <el-tag
                style="cursor: pointer"
                type="success"
                @click="
                  router.push({
                    name: 'medicineDetail',
                    query: { medicineId: item.medicineId },
                  })
                "
                >{{ item.medicineName }}</el-tag
              >
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="left-toolbox">
        <div class="toolbox-left">
          <p>发布时间：{{ preDetail.createdAt }}</p>
        </div>
        <div class="toolbox-right">
          <!-- 点赞 -->
          <a class="tool-item-href">
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
          </a>

          <!-- 收藏 -->
          <a class="tool-item-href">
            <img
              class="isactive"
              style="margin-right: 0px; display: none"
              id="is-like-imgactive"
              src="/like_active.png"
            />
            <img
              class="isdefault"
              style="margin-right: 0px; display: block"
              id="is-like-img"
              src="/like.png"
            />
            <span
              id="likeCount"
              class="count"
              style="color: rgb(153, 154, 170)"
            ></span>
          </a>

          <!-- 认证：只有专业用户可以进行认证 -->
          <a class="tool-item-href">
            <img
              class="isactive"
              style="margin-right: 0px; display: none"
              id="is-auth-imgactive"
              src="/auth_active.png"
            />
            <img
              class="isdefault"
              style="margin-right: 0px; display: block"
              id="is-auth-img"
              src="/auth.png"
            />
            <span
              id="authCount"
              class="count"
              style="color: rgb(153, 154, 170)"
            ></span>
          </a>
        </div>
      </div>
    </template>
  </el-card>

  <el-card class="comments">
    <template #header>
      <div class="comments-header">
        <h3>留言区</h3>
      </div>
    </template>
    <div class="left-toolbox">
      <div class="toolbox-left">
        <el-avatar :size="50" :src="preDetail.coverImg" />
        <span>{{ preDetail.author }}</span>
      </div>
      <div class="toolbox-middle"></div>
      <div class="toolbox-right">
        <p>发布时间：{{ preDetail.createdAt }}</p>
      </div>
    </div>
  </el-card>

  <Footer></Footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, onMounted, computed } from "vue";
import { getPreDetailApi } from "@/api/prescription";
import { useUserStore } from "@/stores/useUserStore";
import { Star, Medal, Pointer } from "@element-plus/icons-vue";

const { userInfo } = useUserStore();
const route = useRoute();
const router = useRouter();
// 接收通过路由跳转传过来的ID
const getPreId = route.query.prescriptionId;
const preDetail = ref([]);
// 接收药材组成
const preMeds = ref([]);

onMounted(() => {
  getPreInfo();
});

// 判断用户身份 是否是普通用户
const notIsNormal = computed(() => {
  return userInfo.role.roleType === 303;
});

/**
 * 获取方剂信息
 */
const getPreInfo = async () => {
  try {
    const res = await getPreDetailApi(getPreId);

    // 回显
    preDetail.value = res.data;

    // 存放药材组成数据
    preMeds.value = res.data.prescriptionMedicines;
  } catch (error) {
    console.log("🚀 ~ getPreInfo ~ error:", error);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-card {
  width: 80%;
  margin: 20px auto;

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
            font-size: 12px;
            color: gray;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin-bottom: 10px;

            span {
              display: block;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              font-weight: bold;
              color: #cdaa7d;
            }
          }
        }

        // 药材组成
        .preMedicines {
          p {
            width: 110px;
            font-size: 14px;
            font-weight: bold;
            color: #cdaa7d;
          }

          .el-tag {
            margin-top: 10px;
            margin-right: 20px;
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

    // 左侧
    .toolbox-left {
      display: flex;
      align-items: center;
      font-size: 12px;
    }

    // 右侧
    .toolbox-right {
      width: 30%;
      display: flex;
      justify-content: space-around;

      img {
        height: 20px;
      }
    }
  }
}

.comments {
  margin-top: 30px;
  margin-bottom: 100px;
}
</style>
