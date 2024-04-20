<!-- 分页器 -->

<template>
  <div class="demo-pagination-block">
    <el-pagination
      v-if="props.total > 5"
      :total="props.total"
      :page-sizes="pageSizes"
      v-model:page-size="pageSize"
      v-model:current-page="pageNum"
      :small="small"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

// 这里不用设置一个ref的total了，会有影响
// 当前页
const pageNum = ref(4);
// 每页显示几条数据
const pageSize = ref(10);
// 可选的每页多少条数据
const pageSizes = ref([5, 10, 15, 20]);
const small = ref(true);
const background = ref(true);

// 接收父组件传过来的值
const props = defineProps({
  total: {
    required: true,
    type: Number,
  },
  pageNum: {
    default: 1, // 当前页，默认为第一页
    type: Number,
  },
  pageSize: {
    default: 10, // 每页默认10条
    type: Number,
  },
});

// console.log(props);

// 声明需要抛出的事件
const emit = defineEmits(["page-size", "page-num"]);

/**
 * 决定当前页显示多少条数据
 * pageSize变化时触发
 * @param {*} pageSize
 */
const handleSizeChange = (pageSize) => {
  // console.log("当前页显示数据条数：", pageSize);

  // 重新发送请求，请求列表数据
  // 在当前组件触发一个自定义事件。任何额外的参数都会传递给事件监听器的回调函数。
  emit("page-size", { pageSize: pageSize });
};

/**
 * 处理切换页码
 * pageNum发生变化时触发
 * @param {*} pageNum
 */
const handleCurrentChange = (pageNum) => {
  // console.log("当前页码：", pageNum);

  emit("page-num", { pageNum: pageNum });
};
</script>

<style lang="scss" scoped>
.demo-pagination-block {
  height: 20px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items:flex-end;
}
</style>
