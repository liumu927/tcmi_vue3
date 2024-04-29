<!-- 二级评论 -->

<template>
  <div v-if="props.secondComments && props.secondComments.length">
    <div
      class="sub-reply-container"
      id="child-reply"
      v-for="(child, childIndex) in props.secondComments"
      :key="childIndex"
    >
      <div class="listbox-top-user">
        <el-avatar :size="30" :src="child.userImg" />
        <p>
          <span>{{ child.createdBy }}</span>
          <span>{{ child.roleName }}</span>
        </p>
      </div>
      <div class="listbox-middle-root">{{ child.comment }}</div>
      <div class="listbox-bottom">
        <span>发布时间：{{ child.createdAt }}</span>
        <!-- 回复的是二级评论 -->
        <span @click="handleReply(child.parentId, child.id)">回复</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 接收父组件传过来的值：二级留言
const props = defineProps({
  secondComments: {
    type: Array,
    default: [],
  },
});

// 声明需要抛出的事件
const emit = defineEmits(["handle-reply"]);

const handleReply = (rootCommentId, parentId) => {
  // 【注意】这里不以对象形式包裹发送，会导致嵌套；因为父组件中回复一级评论与子级评论共用一个传值方法
  emit("handle-reply", rootCommentId, parentId);
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/_var.scss";

.sub-reply-container {
  margin: 20px 0 0 65px;

  .listbox-top-user {
    display: flex;

    p {
      margin-left: 10px;
      width: 100%;

      // 姓名条
      span:first-child {
        color: $second-text;
      }

      // 身份标签
      span:nth-child(2) {
        margin-left: 5px;
        font-size: 8px;
        padding: 2px;
        background-color: $title-color;
        color: white;
        border-radius: 5px;
        position: relative;
        bottom: 4px;
      }
    }
  }

  .listbox-middle-root,
  .listbox-bottom {
    margin-left: 38px;
  }

  .listbox-bottom {
    font-size: 12px;
    color: #9499a0;
    margin: 10px 0 10px 35px;
    display: flex;

    span {
      display: block;
      margin-right: 20px;
    }

    span:last-child:hover {
      cursor: pointer;
      color: $title-color;
    }
  }
}
</style>
