<template>
  <el-dialog v-model="setVisible"
    >弹出框内容
    <el-form label-width="100px" ref="dataFormRef" :model="dataForm">
      <el-form-item label="角色名称" prop="account">
        <el-input v-model="dataForm.account"></el-input>
      </el-form-item>

      <el-form-item label="菜单权限" prop="roleid">
        <!-- <el-select v-model="dataForm.roleid">
          <el-option v-for="item in origin" :key="item.id" :label="item.name" :value="item.id" />
        </el-select> -->
        <treeStructure
          ref="tree"
          :filter="false"
          :is-initial-data="true"
          :check="true"
          :accordion="true"
          @change="changeHandler"
          @finishLoading="finishHandler"
        />
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
      dataForm: { time: "", value: "" },

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
        ctx.emit("update:visible", value);
      }
    });

    const init = async function (current) {
      await nextTick();
      dataFormRef.value.resetFields();
      if (data.dataForm.id) {
        data.dataForm = current;
        // getInfo();
      }
    };

    const getInfo = function () {
      http.get("/getMonkeyDataInfoById", { params: { id: data.dataForm.id } }).then((res) => {
        data.dataForm = res.data[0] || {};
      });
    };

    const save = function () {
      http[!data.dataForm.id ? "post" : "post"]("/api/user/save", data.dataForm).then((res) => {
        if (res.code !== 0) {
          return console.log("error");
        } else {
          ElNotification({
            title: "",
            message: res.message,
            type: "success"
          });
        }

        ctx.emit("refresh", "");

        setVisible.value = false; //此处需要加value
      });
    };
    ///api/user/getrightslist 获取菜单列表
    http.post("/api/user/getrightslist", {}).then((res) => {
      // data.roleList = res.data;
      // data.roleList.unshift({ id: -1, name: "无" });
    });

    const changeHandler = () => {};
    const finishHandler = () => {};
    return {
      save,
      init,
      getInfo,
      setVisible,
      dataFormRef,
      changeHandler,
      finishHandler,
      ...toRefs(data)
    };
  }
};
</script>
