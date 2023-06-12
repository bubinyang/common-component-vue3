<!--
crud完整demo，包括接口
-->
<template>
  <SideLayout>
    <template #main>
      <ContainLayout>
        <template #action>
          <el-form :inline="true">
            <el-form-item> <el-input v-model="dataForm.name" /></el-form-item>
            <el-form-item>
              <el-button @click="query" type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="addOrUpdateHandle()" type="primary">添加</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">删除</el-button>
            </el-form-item>
          </el-form>
        </template>

        <template #contain>
          <el-table
            v-loading="dataListLoading"
            :data="dataList"
            ref="refTable"
            :border="true"
            style="width: 100%"
            height="100%"
          >
            <el-table-column prop="errorTimes" label="errorTimes" align="center" width="100">
            </el-table-column>

            <el-table-column prop="numValue" label="numValue" align="center" width="100">
            </el-table-column>
            <el-table-column>
              <template v-slot="scope">
                <el-button @click="addOrUpdateHandle(scope.row.id)" type="primary" size="mini"
                  >修改</el-button
                >
                <el-button @click="deleteHandle(scope.row.id)" type="danger" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>

        <el-config-provider :locale="zhCn">
          <el-pagination
            :current-page="page"
            :page-sizes="[20, 50, 100]"
            :page-size="limit"
            :total="total"
            background
            layout="total,sizes,prev,pager,next,jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
          >
          </el-pagination>
        </el-config-provider>
      </ContainLayout>

      <component
        :is="currentComp"
        ref="addOrUpdate"
        @refresh="query"
        v-model:visible="dialogVisible"
      ></component>
    </template>
  </SideLayout>
</template>

<script>
import { debounce } from "@/utils/index.js";
import { reactive, ref, onMounted, nextTick, toRefs, computed } from "vue";
import crudHooks from "@/hooks/crudHooks.ts";
import zhCn from "element-plus/lib/locale/lang/zh-cn"; //vue组件中文化
import dialogEl from "./component/dialog.vue";
export default {
  components: { dialogEl },
  setup() {
    const data = reactive({
      //dialogVisible: false,
      zhCn,
      tableData: [
        {
          date: "高模量对位芳纶纤维及其芳纶纸国产化项目",
          name: "2013/7/5-2016/4/10",
          address: "投产项目",
          a: "苏州富顺纤维有限公司",
          b: "望亭镇",
          c: 151,
          d: "苏州捷碳环保大数据有限公司",
          e: ""
        },
        {
          date: "抗疲劳加成型硫化液态硅橡胶项目",
          name: "2019/10/13-2020/5/13",
          address: "投产项目",
          a: "永儒塑胶工业（苏州）有限公司",
          b: "望亭镇",
          c: 150,
          d: "苏州中创碳投科技有限公司",
          e: ""
        }
      ],
      dataForm: { name: "" },
      activatedIsNeed: true,
      getDataListURL: "/getMonkeyHisDataPage",
      deleteURL: "/deleteMonkey"
      // getDataListIsPage: true
    });

    let currentComp = ref("dialogEl");

    const handleCurrentChange = debounce(function (event) {
      console.log("执行", event);
    }, 500);

    const newName = computed(() => {
      return data.dialogVisible ? data.dialogEl : ""; // 注意 ref 包装过的值在value中
    });
    // const add = function () {
    //   data.dialogVisible = true;
    // };
    return {
      ...crudHooks(data),
      ...toRefs(data),
      handleCurrentChange,
      //add,
      newName,
      currentComp
      // currentComp
    };
  }
};
</script>

<style lang="scss"></style>
