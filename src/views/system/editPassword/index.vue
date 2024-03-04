<template>
  <SideLayout>
    <template #main>
      <ContainLayout>
        <template #contain>
          <section class="editpassword-style">
            <el-form label-width="100px" ref="dataFormRef" :rules="rules" :model="dataForm">
              <el-form-item label="旧密码" prop="opwd">
                <el-input v-model="dataForm.opwd"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="npwd">
                <el-input v-model="dataForm.npwd"></el-input>
              </el-form-item>
              <el-form-item label="再次输入新密码" prop="npwdagain">
                <el-input v-model="dataForm.npwdagain"></el-input>
              </el-form-item>
            </el-form>

            <el-button type="primary" @click="save">保存</el-button>
          </section>
        </template>
      </ContainLayout>
    </template>
  </SideLayout>
</template>

<script>
import { debounce } from "@/utils/index.js";
import { reactive, ref, onMounted, nextTick, toRefs, computed } from "vue";
import http from "@/utils/request";
import { ElNotification } from "element-plus";

export default {
  setup() {
    const dataFormRef = ref(null);
    const data = reactive({
      dataForm: { opwd: "", npwd: "" },
      rules: {
        opwd: [
          {
            required: true,
            message: "请填旧密码",
            trigger: "change"
          }
        ],
        npwd: [
          {
            required: true,
            message: "请填新密码",
            trigger: "change"
          }
        ]
      },
      menuList: [],
      initSelectIds: []
    });

    const save = () => {
      if (data.dataForm.npwdagain !== data.dataForm.npwd) {
        return ElNotification({
          title: "提示",
          message: "两次密码输入不一致",
          type: "warning"
        });
      }
      dataFormRef.value.validate((valid) => {
        if (!valid) return false;
        http[!data.dataForm.id ? "post" : "post"]("/api/user/changepwd", data.dataForm).then(
          (res) => {
            ElNotification({
              title: "提示",
              message: res.code !== 0 ? "操作失败" : "操作成功",
              type: res.code !== 0 ? "warning" : "success"
            });
          }
        );
      });
    };
    return {
      dataFormRef,
      save,
      ...toRefs(data)
    };
  }
};
</script>

<style lang="scss">
.editpassword-style {
  width: 500px;
}
</style>
