<template>
  <TopBar></TopBar>

  <el-card>
    <template #header>
      <div class="tableBar">
        <span v-if="getArticleId">资讯更新页</span>
        <span v-else>新增资讯页</span>
        <el-button type="success" plain @click="router.back();">返回</el-button>
      </div>
    </template>

    <!-- 资讯项 -->
    <el-form
      ref="ruleFormRef"
      :model="updateForm"
      class="updateForm"
      label-position="top"
      size="default"
      status-icon
      style="font-weight: bold; width: 60%; margin: 0 auto"
    >
      <el-form-item label="封面图" prop="coverImg">
        <el-upload
          class="avatar-uploader"
          action="/api/upload/file"
          name="file"
          :show-file-list="false"
          :headers="{ Authorization: token }"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="updateForm.coverImg"
            :src="updateForm.coverImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="资讯ID" prop="articleId">
        <el-input
          v-model="updateForm.articleId"
          disabled
          placeholder="您无需填写，我们帮您解决"
        />
      </el-form-item>
      <el-form-item label="资讯标题" prop="title" required>
        <el-input v-model="updateForm.title" />
      </el-form-item>
      <el-form-item label="资讯类别" prop="articleCategory" required>
        <el-select v-model="updateForm.articleCategory">
          <el-option
            v-for="item in categorysList"
            :key="item.articleTypeId"
            :label="item.typeName"
            :value="item.articleTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="updateForm.author" />
      </el-form-item>
      <el-form-item label="文章图片" prop="articleImg">
        <el-upload
          class="avatar-uploader"
          action="/api/upload/file"
          name="file"
          :show-file-list="false"
          :headers="{ Authorization: token }"
          :on-success="handleAddSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="updateForm.articleImg"
            :src="updateForm.articleImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="资讯内容" prop="content">
        <el-input v-model="updateForm.content" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button v-if="getArticleId" type="success" @click="updateDetail"
          >保存更新</el-button>
        <el-button v-else type="success" @click="addArticle">新增</el-button>
        <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <Footer></Footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import TopBar from "@/components/common/TopBar.vue";
import { useTokenStore } from "@/stores/useTokenStore";
import { Plus } from "@element-plus/icons-vue";
import {
  getArticleDetailApi,
  putUpdArticleApi,
  getArticleCategoryListApi,
  postAddArticleApi,
} from "@/api/articles";

const router = useRouter();
const route = useRoute();
const { token } = useTokenStore();

// 接收通过路由跳转传过来的资讯ID
const getArticleId = route.query.articleId;
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 存放分类列表
const categorysList = ref([]);
// 收集表单内容并用于回显
const updateForm = reactive({
  articleId: null,
  title: "",
  author: "",
  coverImg: "",
  articleCategory: null,
  content: "",
  articleImg: ""
});

onMounted(() => {
  // 更新操作，用于回显
  if (getArticleId) {
    getArticleInfo();
  }
  getCategoryList();
});

/**
 * 获取资讯信息
 */
const getArticleInfo = async () => {
  try {
    const res = await getArticleDetailApi(getArticleId);
    console.log("🚀 ~ getArticleInfo ~ res:", res);

    // 回显
    Object.assign(updateForm, res.data);
  } catch (error) {
    console.log("🚀 ~ getArticleInfo ~ error:", error);
  }
};

/**
 *  获取分类列表
 */
const getCategoryList = async () => {
  try {
    var res = await getArticleCategoryListApi();
    categorysList.value = res.data;

    console.log("🚀 ~ getCategoryList ~ categorysList:", categorysList);
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 封面图上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  updateForm.coverImg = response.data;
  ElMessage.success(response.msg);
};
/**
 * 文章图上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAddSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  updateForm.articleImg = response.data;
  ElMessage.success(response.msg);
};

/**
 * 新增资讯
 */
const addArticle = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 新增
      const res = await postAddArticleApi(updateForm);

      ElMessage.success(res.msg);

      // 跳转回资讯列表页
      router.push("/manage/article_manage/articles");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 * 更新资讯信息
 */
const updateDetail = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 更新
      const res = await putUpdArticleApi(updateForm);
      ElMessage.success(res.msg);

      // 跳转回资讯列表页
      router.push("/manage/article_manage/articles");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 *  before-upload 钩子中限制资讯上传文件的格式和大小
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB!");
    return false;
  }
  return true;
};

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};
</script>

<style lang="scss" scoped>
.el-card {
  width: 80%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .tableBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>