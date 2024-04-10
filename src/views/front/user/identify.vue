<template>
  <div class="box">
    <p class="title">申请成为专业用户</p>
    <div class="formContainer">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="ruleForm"
        label-position="top"
        :size="formSize"
        status-icon
        style="font-weight: bold; width: 50%"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" style="width: 80%" />
        </el-form-item>
        <el-form-item label="申请理由" prop="applyReasons">
          <el-input
            v-model="ruleForm.applyReasons"
            style="width: 80%"
            :autosize="{ minRows: 2, maxRows: 8 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="身份认证" prop="evidence">
          <el-upload
            class="upload-demo"
            drag
            action=""
            multiple
            style="width: 80%"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖动文件上传或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
          <el-button
            type="primary"
            @click="changeIdentity(ruleFormRef)"
            id="submit"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";

const router = useRouter();

// ref 获取整个DOM表单对象
const ruleFormRef = ref();

// 收集表单内容
const ruleForm = reactive({
  username: "",
  applyReasons: "",
  evidence: "",
});

// 控制该表单内组件的尺寸
const formSize = ref("default");

// 表单验证
const rules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    { min: 2, max: 12, message: "Length should be 2 to 12", trigger: "blur" },
  ],
  reasons: [
    {
      required: true,
      message: "请输入申请理由",
      trigger: "blur",
    },
    { min: 6, max: 12, message: "Length should be 6 to 12", trigger: "blur" },
  ],
  identification: [
    {
      required: true,
    },
  ],
});

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};

// 提交
const changeIdentity = () => {};
</script>

<style lang="scss" scoped>
.box {
  .title {
    font-size: 20px;
    color: gray;
  }

  .formContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      padding: 50px;
      background-color: #fff;
      border-radius: 10px;
    }

    .el-button {
      margin: 0 auto;
      padding: 0 100px;
    }
  }
}
</style>
