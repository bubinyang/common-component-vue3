<template>
  <!-- <div>
    <Article :title="AriticeItem.title" :info="AriticeItem.info" :author="AriticeItem.author">
    </Article>
  </div> -->
  <el-form label-width="100px" :model="formLabelAlign" style="max-width: 460px">
    <el-form-item label="用户米">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="formLabelAlign.password" />
    </el-form-item>
    <!-- <el-form-item label="Activity form">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item> -->
  </el-form>
</template>
<script setup>
import { reactive } from "vue";

// const AriticeItem = reactive({
//   title: "文章标题",
//   info: "文章内容",
//   author: "X"
// });

const formLabelAlign = reactive({
  name: "",
  password: "",
  type: ""
});
</script>
