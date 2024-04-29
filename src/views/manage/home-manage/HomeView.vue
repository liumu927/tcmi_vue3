<template>
  <div style="color: #666; font-size: 14px">
    <el-card>
      <!-- 头部 -->
      <template #header>
        <div class="tableBar">
          <span>🤗 欢迎回来！</span>
        </div>
      </template>

      <div class="charNum">
        <div class="user">
          <el-card>
            <p>用户总数</p>
            <span>{{ dataList.userCount }}</span>
            <span>人</span>
          </el-card>

          <el-card>
            <p>今日新增用户</p>
            <span>{{ dataList.newUserCount }}</span>
            <span>人</span>
          </el-card>
        </div>

        <div class="medicine">
          <el-card>
            <p>药材总数</p>
            <span>{{ dataList.medCount }}</span>
            <span>条</span>
          </el-card>

          <el-card>
            <p>药材分类数</p>
            <span>{{ dataList.medTypeCount }}</span>
            <span>类</span>
          </el-card>
        </div>

        <div class="prescription">
          <el-card>
            <p>方剂总数</p>
            <span>{{ dataList.preCount }}</span>
            <span>剂</span>
          </el-card>

          <el-card>
            <p>方剂分类数</p>
            <span>{{ dataList.preTypeCount }}</span>
            <span>类</span>
          </el-card>
        </div>

        <div class="prescription">
          <el-card>
            <p>可见方剂数</p>
            <span>{{ dataList.authPreCount }}</span>
            <span>剂</span>
          </el-card>

          <el-card>
            <p>审核方剂数</p>
            <span>{{ dataList.authingPreCount }}</span>
            <span>剂</span>
          </el-card>
        </div>

        <div class="article">
          <el-card>
            <p>文章总数</p>
            <span>{{ dataList.articleCount }}</span>
            <span>篇</span>
          </el-card>

          <el-card>
            <p>文章分类数</p>
            <span>{{ dataList.articleTypeCount }}</span>
            <span>类</span>
          </el-card>
          <!-- 考虑：加一个文章热度榜 -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getIndexDataApi } from "@/api/common";

const dataList = ref([]);

onMounted(() => {
  getIndexData();
});

const getIndexData = async () => {
  try {
    const res = await getIndexDataApi();
    dataList.value = res.data;
    console.log("🚀 ~ getIndexData ~ dataList:", dataList);
  } catch (error) {
    console.log("🚀 ~ getIndexData ~ error:", error);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.tableBar {
  color: #909399;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charNum {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  // 子代选择器
  & > div {
    width: 48%;
    height: 150px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;

    .el-card {
      width: 48%;
      border-radius: 10px;
      position: relative;

      p {
        font-weight: bold;
      }

      // 数字
      span:nth-child(2) {
        font-size: 30px;
        color: $theme-color;
        text-decoration: underline $title-color;
        display: block;
        text-align: center;
        margin-top: 20px;
      }

      // 单位
      span:last-child {
        display: block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border: 1px solid $theme-color;
        background-color: $second-color;
        border-radius: 50%;
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
  }
}
</style>
