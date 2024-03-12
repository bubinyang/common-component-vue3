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
            <el-table-column prop="name" label="编号" align="center"> </el-table-column>
            <el-table-column prop="name" label="名称" align="center"> </el-table-column>
            <el-table-column prop="name" label="图号" align="center"> </el-table-column>
            <el-table-column prop="name" label="子组数" align="center"> </el-table-column>
            <el-table-column prop="name" label="创建时间" align="center"> </el-table-column>

            <el-table-column label="操作" width="210">
              <template v-slot="scope">
                <el-button
                  @click="addOrUpdateHandle(scope.row.id, scope.row)"
                  type="primary"
                  size="mini"
                  >修改</el-button
                >

                <el-button
                  @click="addOrUpdateHandleConfig(scope.row.id, scope.row)"
                  type="primary"
                  size="mini"
                  >配置</el-button
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

      <component
        :is="currentCompConfig"
        ref="addOrUpdate"
        @refresh="query"
        v-model:visible="dialogVisibleConfig"
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
import dialogElConfig from "./component/dialogConfig.vue";

import http from "@/utils/request";

export default {
  components: { dialogEl, dialogElConfig },
  setup() {
    const data = reactive({
      //dialogVisible: false,
      zhCn,
      dialogVisibleConfig: false,
      dataForm: { name: "" },
      activatedIsNeed: true,
      getDataListURL: "/api/role/list",
      deleteURL: "/api/role/del",
      getDataListIsPage: false,
      roleList: [],
      menuList: []
      // getDataListIsPage: true
    });

    let currentComp = ref("dialogEl");
    let currentCompConfig = ref("dialogElConfig");

    http.post("/api/user/getrightslist", {}).then((res) => {
      data.menuList = res.data;
      // data.roleList = res.data;
      // data.roleList.unshift({ id: -1, name: "无" });
    });

    const addOrUpdateHandleConfig = () => {
      data.dialogVisibleConfig = true;
    };

    return {
      ...crudHooks(data),
      ...toRefs(data),
      currentComp,
      currentCompConfig,
      addOrUpdateHandleConfig
    };
  }
};
</script>

<style lang="scss"></style>
