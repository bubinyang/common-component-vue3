<template>
  <el-dialog modal-class="productConfigDialog" v-model="setVisible" width="90%"
    >配置产品
    <!-- <el-form label-width="100px" ref="dataFormRef" :model="dataForm" :rules="rules">
      <el-form-item label="名称" prop="account">
        <el-input v-model="dataForm.account"></el-input>
      </el-form-item>
      <el-form-item label="图号" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>

      <el-form-item label="子组数" prop="roleid">
        <el-input-number v-model="roleid" :min="1" :max="10" @change="handleChange" />
      </el-form-item>
    </el-form> -->

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="公摊上限">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="公摊下限">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="预警上限">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="预警下限">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="大校准值">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="小校准值">
        <template #default="scope">
          <el-input-number v-model="scope.row.address" :min="1" :max="10" />
        </template>
      </el-table-column>

      <el-table-column prop="address" label="开启">
        <template #default="scope">
          <el-switch v-model="scope.row.address" />
        </template>
      </el-table-column>
    </el-table>

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
      ],
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
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
        console.log(value);
        // if (!value) {
        //   dataFormRef.value.resetFields();
        // }
        ctx.emit("update:visible", value);
      }
    });

    const init = async function (current) {
      await nextTick();
      //dataFormRef.value.resetFields();
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

<style lang="scss">
.productConfigDialog {
  .el-input-number {
    width: 150px;
  }
}
</style>
