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

    <el-form-item>
      <el-button @click="submit">登录</el-button>
    </el-form-item>
    <!-- <el-form-item label="Activity form">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item> -->
  </el-form>
</template>
<script>
import { reactive, toRefs } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

// const AriticeItem = reactive({
//   title: "文章标题",
//   info: "文章内容",
//   author: "X"
// });
export default {
  setup() {
    const router = useRouter();

    const data = reactive({
      formLabelAlign: {
        name: "",
        password: "",
        type: ""
      }
    });
    const submit = () => {
      Cookies.set("token", "abcde");
      router.replace("/");
    };

    return { ...toRefs(data), submit };
  }
};
</script>
