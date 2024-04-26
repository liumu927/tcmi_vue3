<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>我的收藏</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
      </div>
    </template>

    <el-collapse accordion>
      <el-collapse-item
        title="药材收藏"
        name="medecine"
        @click="getMyCollectionList(1)"
      >
        <div class="fav-content">
          <ul class="fav-list">
            <li
              class="fav-item"
              v-for="item in myCollectionData"
              :key="item.momentId"
              @click="
                router.push({
                  name: 'medicineDetail',
                  query: { medicineId: item.momentId },
                })
              "
            >
              <img :src="item.momentImg" :alt="item.momentName" />
              <p>{{ item.momentName }}</p>
              <p>收藏于：{{ item.createdAt }}</p>
            </li>
          </ul>
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="方剂收藏"
        name="prescription"
        @click="getMyCollectionList(2)"
      >
        <div class="fav-content">
          <ul class="fav-list">
            <li
              class="fav-item"
              v-for="item in myCollectionData"
              :key="item.momentId"
              @click="
                router.push({
                  name: 'prescriptionDetail',
                  query: { prescriptionId: item.momentId },
                })
              "
            >
              <img :src="item.momentImg" :alt="item.momentName" />
              <p>{{ item.momentName }}</p>
              <p>收藏于：{{ item.createdAt }}</p>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getMyCollectionListApi } from "@/api/common";
import { useUserStore } from "@/stores/useUserStore";

const router = useRouter();
const { userInfo } = useUserStore();
const myCollectionData = ref([]);

const getMyCollectionList = async (collectType) => {
  // 封装参数
  const params = {
    pageNum: 1,
    pageSize: 50,
    userId: userInfo.id,
    collectType: collectType,
  };

  try {
    const res = await getMyCollectionListApi(params);
    myCollectionData.value = res.data.items;
  } catch (error) {
    console.log("🚀 ~ getMyCollectionList ~ error:", error);
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  width: 80%;
  margin: 20px auto;

  .tableBar {
    color: #909399;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 单个分类区域
  .fav-content {
    // 全部列表
    .fav-list {
      list-style: none;
      display: flex;

      // 列表项
      .fav-item {
        margin: 0 20px 20px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        img {
          width: 180px;
          height: 126px;
          object-fit: cover;
          border-radius: 5px;
        }

        p:last-child {
          font-size: 12px;
          color: gray;
        }
      }
    }
  }
}
</style>
