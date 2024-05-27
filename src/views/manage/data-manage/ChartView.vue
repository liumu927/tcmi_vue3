<template>
  <el-card>
    <!-- 头部 -->
    <template #header>
      <div class="tableBar">
        <span>数据统计</span>
      </div>
    </template>
    <div class="body" width="100%">
      <div id="med-cate" ref="medicineCategory"></div>
      <div id="pre-cate" ref="prescriptionCategory"></div>
    </div>
    <div id="user-role" ref="userRole"></div>
  </el-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import {
  getMedCateDataApi,
  getPreCateDataApi,
  getUserDataApi,
} from "@/api/common";

// 通过 inject 接收Echarts
const $echarts = inject("$echarts");
// 获取dom节点
const medicineCategory = ref();
const prescriptionCategory = ref();
const userRole = ref();
// 存放请求回来的数据
const medDataList = ref([]);
const preDataList = ref([]);
const userDataList = ref([]);
const xData = ref();
const yData = ref();

onMounted(() => {
  // 【注意】这里存在异步问题
  // getMedCateData 是一个异步操作，如果 initMedTypeEcharts 在数据还没有返回之前就被调用了，那么value 将不会被正确设置。
  getMedCateData().then(() => {
    initMedTypeEcharts();
  });

  getPreCateData().then(() => {
    initPreTypeEcharts();
  });

  getUserData().then(() => {
    initUserRoleEcharts();
  });
});

/**
 * 请求 用户角色数据
 */
const getUserData = async () => {
  try {
    const res = await getUserDataApi();
    userDataList.value = res.data;
    setData(userDataList.value);
  } catch (error) {
    console.log("🚀 ~ getUserData ~ error:", error);
  }
};

/**
 * 请求 药材分类数据
 */
const getMedCateData = async () => {
  try {
    const res = await getMedCateDataApi();
    medDataList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getMedCateData ~ error:", error);
  }
};

/**
 * 请求 方剂分类数据
 */
const getPreCateData = async () => {
  try {
    const res = await getPreCateDataApi();
    preDataList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getMedCateData ~ error:", error);
  }
};

/**
 * 初始化 用户角色图
 */
const initUserRoleEcharts = () => {
  // echarts初始化
  const myChart = $echarts.init(userRole.value);

  // 自定义配置
  const option = {
    title: {
      text: "用户统计",
      subtext: "统计维度：用户身份",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: "#FF915A", // 0% 处的颜色
        },
        {
          offset: 0.5,
          color: "#9FE080", // 50% 处的颜色
        },
        {
          offset: 1,
          color: "#73C0DE", // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    xAxis: [
      {
        type: "category",
        data: xData.value,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "数量",
        type: "bar",
        barWidth: "30%",
        data: yData.value,
      },
    ],
  };

  myChart.setOption(option);

  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    myChart.resize();
  });
};

/**
 * 初始化 方剂分类图
 */
const initPreTypeEcharts = () => {
  // echarts初始化
  const myChart = $echarts.init(prescriptionCategory.value);

  // 自定义配置
  const option = {
    title: {
      text: "方剂分析",
      subtext: "统计维度：方剂分类",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "方剂_分类",
        type: "pie",
        radius: ["40%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: preDataList.value,
      },
    ],
  };

  myChart.setOption(option);

  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    myChart.resize();
  });
};

/**
 * 初始化 药材分类图
 */
const initMedTypeEcharts = () => {
  // echarts初始化
  const myChart = $echarts.init(medicineCategory.value);

  // 自定义配置
  const option = {
    title: {
      text: "药材统计",
      subtext: "统计维度：药材分类",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a}<br/>{b} : {c} ({d}%)",
    },
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "药材_分类",
        type: "pie",
        radius: [50, 140],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        data: medDataList.value,
      },
    ],
  };

  myChart.setOption(option);

  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    myChart.resize();
  });
};

/**
 * 统一更改数据格式
 */
const setData = (dataList) => {
  xData.value = dataList.map((x) => x.name);
  yData.value = dataList.map((y) => y.value);
};
</script>

<style lang="scss" scoped>
.tableBar {
  color: #909399;
  font-weight: bold;
  font-size: 16px;
}

.body {
  display: flex;
  margin: 50px 0 100px 0;

  // 必须要设置大小
  div {
    width: 50%;
    height: 550px;
  }

  #med-cate {
    margin-right: 30px;
  }
}

#user-role {
  width: 100%;
  height: 400px;
}
</style>
