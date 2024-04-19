<!-- 前台首页 -->

<template>
  <!-- 轮播图 -->
  <div id="flash">
    <el-carousel :interval="5000" type="card" height="250px">
      <el-carousel-item v-for="(item, coverId) in coverData" :key="coverId">
        <img :src="item.coverImg" />
      </el-carousel-item>
    </el-carousel>
  </div>

  <div id="main">
    <!-- 分类 -->
    <div class="newContent">
      <!-- 药材分类 -->
      <div class="typelist">
        <div>药材分类：</div>
        <ul>
          <li
            :class="typeIndex == index ? 'active' : ''"
            v-for="(item, index) in medicineTypeList"
            :key="index"
            @click="getMedicineType"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <!-- 方剂分类 -->
      <div class="typelist">
        <div>方剂分类：</div>
        <ul>
          <li
            :class="typeIndex == index ? 'active' : ''"
            v-for="(item, index) in prescriptionTypeList"
            :key="index"
            @click="getPrescriptionType"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 分类搜索结果 -->
    <div id="classlist">
      <!-- 搜索结果 -->
      <div class="classModule">
        <div
          class="classItem"
          v-for="(item, index) in categoryData"
          :key="index"
          @click=""
        >
          <img :src="item.imgUrl" style="object-fit: cover" />
          <div class="leftItem">
            <h3>{{ item.materialsName }}</h3>
            <ul>
              <li>
                <em style="font-weight: 700">功能主治：</em>
                {{  }}
              </li>

              <li>
                <em style="font-weight: 700">常用配方推荐：</em>
                {{  }}
              </li>

              <li>
                <em style="font-weight: 700">参考价格：</em>
                {{  }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门资讯 -->
    <div class="container">
      <div class="article">
        <div class="title">科普资讯</div>
        <div class="articlelist">
          <div
            class="articleitem"
            v-for="item in newsData"
            :key="item.id"
            @click="router.push(`/index/articleDetail?id=${item.id}`)"
          >
            <img :src="item.imgUrl" alt="" />
            <div class="info">
              <div class="name">{{ item.title }}</div>
              <div class="articlecontent">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCoverListApi } from "@/api/common.js";

const coverData = ref([]);
const medicineTypeList = ref([]);
const prescriptionTypeList = ref([]);
const categoryData = ref([]);
const newsData = ref([]);

onMounted(() => {
  getCoverList();
});

/**
 * 获取轮播图列表
 */
const getCoverList = async () => {
  try {
    var res = await getCoverListApi();

    coverData.value = res.data;

    // console.log(coverData.value);
  } catch (error) {
    console.log(error);
  }
};

// 获取药材分类
const getMedicineType = () => {};

// 获取方剂分类
const getPrescriptionType = () => {};

// 按分类搜索并返回列表

// 获取科普咨询
</script>

<style lang="scss" scoped>
// 轮播图容器
#flash {
  width: 80%;
  height: 250px;
  margin: 0 auto;
  // overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
}

// 主容器
#main {
  width: 100%;
  height: auto;
  margin: 0 auto;
  margin-top: 40px;
}
</style>
