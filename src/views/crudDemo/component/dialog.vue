<template>
  <el-dialog v-model="setVisible"
    >弹出框内容
    <el-form label-width="100px" ref="dataFormRef" :model="dataForm">
      <el-form-item label="errorTimes" prop="errorTimes">
        <el-input v-model="dataForm.errorTimes"></el-input>
      </el-form-item>
      <el-form-item label="numValue" prop="numValue">
        <el-input v-model="dataForm.numValue"></el-input>
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

export default {
  props: {
    visible: { type: Boolean, default: () => false }
  },
  emits: ["refresh"], //这行代码需要加，否则报警
  setup(props, ctx) {
    const dataFormRef = ref(null);
    const data = reactive({ dataForm: { time: "", value: "" } });
    let setVisible = computed({
      /*此处也可以不用computed，直接创建一个visible给el-dialog，v-if=dialogVisible直接写组件上，但是如果这样写
      那么弹框的显示隐藏无法回写到dialogVisible上,不够直观，通过computed可以解决这个问题
      */

      get() {
        return props.visible;
      },
      set(value) {
        console.log(value);
        ctx.emit("update:visible", value);
      }
    });
    console.log(data.dataForm);

    const init = async function () {
      await nextTick();
      dataFormRef.value.resetFields();
      if (data.dataForm.id) {
        console.log("查询");
        getInfo();
      }
    };

    const getInfo = function () {
      http.get("/getMonkeyDataInfoById", { params: { id: data.dataForm.id } }).then((res) => {
        data.dataForm = res.data[0] || {};
      });
    };

    const save = function () {
      http[!data.dataForm.id ? "post" : "put"]("/addMonkeyData", data.dataForm).then((res) => {
        if (res.code !== 200) {
          return console.log("error");
        }
        ctx.emit("refresh", "");

        setVisible.value = false; //此处需要加value
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
