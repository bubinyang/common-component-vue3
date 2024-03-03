<template>
  <el-dialog v-model="setVisible"
    >弹出框内容
    <el-form label-width="100px" ref="dataFormRef" :model="dataForm" :rules="rules">
      <el-form-item label="用户名" prop="account">
        <el-input v-model="dataForm.account"></el-input>
      </el-form-item>
      <el-form-item label="别名" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>

      <el-form-item label="角色" prop="roleid">
        <el-select v-model="dataForm.roleid">
          <el-option v-for="item in origin" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <el-button @click="setVisible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, onMounted, nextTick, toRefs, computed } from "vue";
import http from "@/utils/request";
import { ElNotification } from "element-plus";

export default {
  props: {
    visible: { type: Boolean, default: () => false },
    origin: { type: Object, default: () => ({}) }
  },
  emits: ["refresh"], //这行代码需要加，否则报警
  setup(props, ctx) {
    const dataFormRef = ref(null);
    const data = reactive({
      dataForm: { account: "", name: "", roleid: "", id: "" },

      rules: {
        account: [
          {
            required: true,
            message: "请填写用户名称",
            trigger: "change"
          }
        ],

        roleid: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ]
      },

      options: [
        {
          value: "Option1",
          label: "Option1"
        },
        {
          value: "Option2",
          label: "Option2"
        }
      ]
    });
    let setVisible = computed({
      /*此处也可以不用computed，直接创建一个visible给el-dialog，v-if=dialogVisible直接写组件上，但是如果这样写
      那么弹框的显示隐藏无法回写到dialogVisible上,不够直观，通过computed可以解决这个问题
      */

      get() {
        return props.visible;
      },
      set(value) {
        if (!value) {
          dataFormRef.value.resetFields();
        }
        ctx.emit("update:visible", value);
      }
    });

    const init = async function (current) {
      await nextTick();
      dataFormRef.value.resetFields();
      if (data.dataForm.id) {
        data.dataForm = current;
        // getInfo();
      } else {
        data.dataForm.id = 0;
      }
    };

    const getInfo = function () {
      http.get("/getMonkeyDataInfoById", { params: { id: data.dataForm.id } }).then((res) => {
        data.dataForm = res.data[0] || {};
      });
    };

    const save = function () {
      dataFormRef.value.validate((valid) => {
        if (!valid) return false;
        http[!data.dataForm.id ? "post" : "post"]("/api/user/save", data.dataForm).then((res) => {
          ElNotification({
            title: "提示",
            message: res.code !== 0 ? "操作失败" : "操作成功",
            type: res.code !== 0 ? "warning" : "success"
          });

          ctx.emit("refresh", "");

          setVisible.value = false; //此处需要加value
        });
      });
    };
    return {
      save,
      init,
      getInfo,
      setVisible,
      dataFormRef,
      ...toRefs(data)
    };
  }
};
</script>
