<!--
 * @Descripttion:
 * @version:
 * @Author: BBY
 * @Date: 2020-11-26 09:54:30
 * @LastEditTime: 2020-12-14 10:52:04
-->
<template>
  <div class="tree-demo-style">
    <TreeNode
      :props="defaultProps"
      :filter="true"
      :is-initial-data="true"
      :data="data"
      :loading="loading"
      show-checkbox
    />
    {{ casVal }}
    <CascaderNode
      v-model="casVal"
      :origin="options"
      :show-all-levels="false"
      filterable
      clearable
      :key-type="{
        label: 'name',
        children: 'childList',
        value: 'id',
        multiple: false
      }"
      @change="handleChange"
    />

    <treeStructure
      ref="tree"
      :filter="true"
      :is-initial-data="true"
      :check="true"
      :accordion="true"
      @change="changeHandler"
      @finishLoading="finishHandler"
    />
  </div>
</template>

<script>
import { dataList, res } from "@/components/tools/treeNode/data";

export default {
  name: "TreeMenu",
  data() {
    return {
      defaultProps: {
        children: "childs",
        label: "name"
      },
      data: [],
      loading: true,
      casVal: "1332210769688793092",
      options: res.data
    };
  },
  mounted() {
    console.log("TreeMenu 执行了");
    this.getOrigin()
      .then((data) => {
        this.data = data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getOrigin() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(dataList);
        }, 1000);
      });
    },
    handleChange(val) {
      console.log(val);
    },
    changeHandler(val) {
      console.log(val);
    },
    finishHandler() {}
  }
};
</script>
