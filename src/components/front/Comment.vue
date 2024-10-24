<!-- 留言区
    【待优化】
      1. 发布评论后，输入框的值没有清空【已解决】
      2. 发布四级及以上的评论后，页面没有及时刷新
      3. 回复框的控制，有一些生硬；点击第一个后，点击第二个时需要点两次，因为要先关闭第一个【已解决：加一个判断】
      4. 先点击回复，再点击编辑区输入框并发表评论，会设置rootCommentId和parentId【已解决：resetReply】

    【未做】
      1. 删除评论
      2. 子评论分页
-->

<template>
  <div class="comments">
    <el-card>
      <template #header>
        <div class="comments-header">
          <h3>留言区</h3>
        </div>
      </template>

      <!-- 编辑区 -->
      <div class="editbox">
        <div class="editbox-left">
          <el-avatar :size="45" :src="userInfo.avatar" />
        </div>
        <div class="editbox-middle">
          <el-input
            placeholder="与其赞同别人的话语，不如自己畅所欲言..."
            v-model="comment"
            @focus="resetReply"
          ></el-input>
        </div>
        <div class="editbox-right">
          <el-button @click="handlePublish(comment)">发布</el-button>
        </div>
      </div>

      <!-- 列表区 -->
      <div class="listbox" v-for="(item, index) in commentsList" :key="index">
        <!-- 顶级评论 -->
        <div class="top-level">
          <div class="listbox-top-user">
            <el-avatar :size="45" :src="item.userImg" />
            <p>
              <span>{{ item.createdBy }}</span>
              <span>{{ item.roleName }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.comment }}</div>
          <div class="listbox-bottom">
            <span>发布时间：{{ item.createdAt }}</span>
            <span @click="handleReply(item.id, item.id)">回复</span>
          </div>
        </div>

        <!-- 子评论区 -->
        <div v-if="item.children && item.children.length">
          <!-- 子评论：二级 -->
          <SecondComment
            :secondComments="item.children"
            @handle-reply="handleReply"
            style="margin-left: 0"
          />

          <!-- 子评论：三级 -->
          <template v-for="child in item.children" :key="child.id">
            <template v-if="child.children && child.children.length">
              <ChildComment
                :childComments="child.children"
                :parentName="child.createdBy"
                @to-reply="handleReply"
                style="margin-left: 65px"
              />
            </template>
          </template>
        </div>

        <!-- 回复框 -->
        <div
          class="reply-box-container"
          v-show="showReplyIndex === item.id && showReply"
        >
          <div class="replybox" id="reply-box">
            <div class="replybox-left">
              <el-avatar :size="30" :src="userInfo.avatar" />
            </div>
            <div class="replybox-middle">
              <el-input placeholder="回复" v-model="replyComment"></el-input>
            </div>
            <div class="replybox-right">
              <el-button @click="handlePublish(replyComment)">提交</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <PageQuery
        :total="total"
        :pageNum="getCommentForm.pageNum"
        :pageSize="getCommentForm.pageSize"
        @page-size="handlePageSize"
        @page-num="handlePageNum"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { getCommentListApi, postAddCommentApi } from "@/api/common";
import PageQuery from "@/components/common/PageQuery.vue";
import ChildComment from "@/components/front/ChildComment.vue";
import { useUserStore } from "@/stores/useUserStore";
import SecondComment from "@/components/front/SecondComment.vue";

const { userInfo } = useUserStore();
const comment = ref("");
const replyComment = ref("");
// 存储请求回来的数据总数
const total = ref(0);
// 存储请求回来的留言列表
const commentsList = ref([]);
// 控制回复框
const showReplyIndex = ref(0);
const showReply = ref(false);

onMounted(() => {
  getCommentList();
});

// 接收父组件传过来的值
const props = defineProps({
  toCommentData: {
    type: Object,
    required: true,
  },
});

// 请求当前主体的评论列表
const getCommentForm = reactive({
  pageNum: 1,
  pageSize: 10,
  // ChildPageNum: 1,
  // ChildPageSize: 2,
  momentId: props.toCommentData.momentId,
});

// 新增留言的请求体  数据从父组件来
const postAddCommentForm = reactive({
  comment: "",
  momentId: props.toCommentData.momentId,
  commentType: props.toCommentData.commentType,
  rootCommentId: null,
  parentId: null,
  replyComment: "",
});

/**
 * 获取留言列表
 */
const getCommentList = async () => {
  try {
    // 封装参数
    const res = await getCommentListApi(getCommentForm);
    total.value = res.data.total;
    commentsList.value = res.data.items;
    console.log("🚀 ~ getCommentList ~ commentsList:", commentsList.value);
  } catch (error) {
    console.log("🚀 ~ getCommentList ~ error:", error);
  }
};

/**
 * 重置编辑区输入框
 */
const resetReply = () => {
  showReplyIndex.value = 0;
  showReply.value = false;
  // postAddCommentForm.rootCommentId = null;
  // postAddCommentForm.parentId = null;

  const replyBox = document.querySelector(".reply-box-container");
  if (
    replyBox &&
    replyBox.hasAttribute("data-root-comment-id") &&
    replyBox.hasAttribute("data-parent-comment-id")
  ) {
    replyBox.removeAttribute("data-parent-comment-id");
    replyBox.removeAttribute("data-root-comment-id");
    // console.log("🚀 ~ resetReply ~ replyBox:", replyBox)
  }
};

/**
 * 显示 回复编辑框
 */
const handleReply = (rootCommentId, parentId) => {
  // 如果已经有一个回复框显示，先关闭它
  if (showReplyIndex !== 0) {
    showReply.value = false;
  }
  // 更新当前显示的回复框的索引
  showReplyIndex.value = rootCommentId;
  // 控制显示隐藏
  showReply.value = !showReply.value;

  const replyBox = document.querySelector(".reply-box-container");
  // 更新回复编辑框的属性，作为参数传给父组件
  replyBox.setAttribute("data-parent-comment-id", parentId);
  replyBox.setAttribute("data-root-comment-id", rootCommentId);
  // console.log("🚀 ~ handleReply ~ replyBox:", replyBox)
};

/**
 * 在发布评论成功后，调用清空输入框内容的方法
 * @param {*} allComment
 */
const handlePublish = (allComment) => {
  publishComment(allComment).then(() => {
    comment.value = "";
    replyComment.value = "";
    getCommentList();
  });
};

/**
 * 发布/回复
 */
const publishComment = async (allComment) => {
  postAddCommentForm.comment = allComment;

  // 获取回复框上自定义属性的值
  const replyBox = document.querySelector(".reply-box-container");
  if (
    replyBox &&
    replyBox.hasAttribute("data-root-comment-id") &&
    replyBox.hasAttribute("data-parent-comment-id")
  ) {
    const rootCommentId = replyBox.getAttribute("data-root-comment-id");
    const parentId = replyBox.getAttribute("data-parent-comment-id");

    postAddCommentForm.rootCommentId = rootCommentId;
    postAddCommentForm.parentId = parentId;
  }

  try {
    const res = await postAddCommentApi(postAddCommentForm);
    ElMessage.success(res.msg);
    getCommentList();
  } catch (error) {
    console.log("🚀 ~ publishComment ~ error:", error);
  }
};

/**
 * 分页器--当前页的数据量
 */
const handlePageSize = (pageSizeVal) => {
  getCommentForm.pageSize = pageSizeVal.pageSize;
  getCommentList();
};

/**
 * 分页器--切换页码
 */
const handlePageNum = (pageNumVal) => {
  getCommentForm.pageNum = pageNumVal.pageNum;
  getCommentList();
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

// 留言区
.comments {
  margin-top: 30px;
  margin-bottom: 100px;

  .el-card {
    width: 80%;
    margin: 20px auto;
  }

  .editbox,
  .listbox {
    margin: 0px 20px 20px 20px;
    display: flex;
  }

  // 编辑区
  .editbox {
    justify-content: space-between;
    align-items: center;
    .editbox-middle {
      width: 85%;
    }
  }

  // 列表展示区
  .listbox {
    flex-direction: column;
    border-bottom: 1px solid rgb(189, 187, 187);

    // 时间 + 回复
    .listbox-bottom {
      font-size: 12px;
      color: #9499a0;
      margin: 10px 0 10px 65px;
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

    // 信息条
    .listbox-top-user {
      display: flex;

      // 个人信息
      p {
        margin-left: 20px;
        width: 100%;
        position: relative;

        span:first-child {
          color: $second-text;
        }
        // 身份标签
        span:last-child {
          margin-left: 5px;
          font-size: 8px;
          padding: 2px;
          background-color: $title-color;
          color: white;
          border-radius: 5px;
          position: absolute;
        }
      }
    }

    // 顶级评论
    .top-level {
      // 根评论内容
      .listbox-middle-root {
        margin-left: 65px;
      }
    }

    // 回复评论输入框
    .replybox {
      margin: 10px 0 20px 65px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 60%;

      .replybox-middle {
        width: 75%;
      }
    }

    // 展示更多
    .view-more {
      margin-left: 65px;
      font-size: 12px;
      color: #9499a0;
    }

    .view-more span:hover,
    .view-less span:hover {
      cursor: pointer;
      color: $title-color;
    }

    // 展示更少
    .view-less {
      font-size: 12px;
      color: #9499a0;
      margin-left: 37px;
    }
  }
}
</style>
