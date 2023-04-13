<!--
表格样式私有化定制+vue事件结合节流方法
-->
<template>
  <el-button type="primary" @click="query()">查询</el-button>

  <section class="monkeyContain-style">
    <div class="coloum" v-for="(item, index) in originList" :key="index">
      <div class="row" v-for="(childitem, childindex) in item" :key="childindex">
        {{ childitem.type }}
        <label v-if="childitem.errorTimes !== 9999">{{ childitem.errorTimes }}</label>
      </div>
    </div>

    <!-- <el-table
      @current-change="handleCurrentChange($event)"
      :data="tableData"
      style="width: 100%; height: 880px"
    >
      <el-table-column prop="date" label="项目名称" width="300" align="center" />
      <el-table-column prop="name" label="项目日期" width="220" align="center" />
      <el-table-column prop="address" label="项目类型" align="center" width="120" />
      <el-table-column prop="a" label="项目主体" align="center" />
      <el-table-column prop="b" label="板块" align="center" width="120" />
      <el-table-column prop="c" label="能耗总量(tce)" align="center" width="120" />
      <el-table-column prop="d" label="核查机构" align="center" />
      <el-table-column prop="e" label="项目描述" align="center" />
    </el-table> -->
  </section>
</template>

<script setup>
import { ref } from "vue";

import { debounce } from "@/utils/index.js";
import axios from "axios";
import { getMonkeyData } from "@/api/monkey.js";
const tableData = [
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
];
// let originList = [];
const originList = ref(null);
const list = ref(null);

const handleCurrentChange = debounce(function (event) {
  console.log("执行", event);
}, 500);

const query = function () {
  //console.log(111);
  getMonkeyData().then(({ data }) => {
    data.forEach((item) => {
      const numList = item.numValue.split(",");
      item.total = numList.reduce((sum, a) => {
        sum += Number(a);
        return sum;
      }, 0);

      item.type = isThreeSameNumber(numList) ? "same" : item.total >= 11 ? "big" : "small";
    });
    console.log(data);
    let type;
    let arr = [];
    originList.value = data.reduce((total, item) => {
      if (!type) type = item.type;
      if (item.type !== type) {
        total.push(arr);
        type = item.type;
        arr = [];
      }
      if (type === item.type) arr.push(item);
      return total;
    }, []);
    console.log(originList.value);

    list.value = data.filter((item) => {
      return item.errorTimes !== 9999;
    });
    console.log(list.value);
  });
};

function isThreeSameNumber(origin) {
  return origin.every((item, index) => {
    return origin[0] === item;
  });
}
</script>

<style lang="scss">
.monkeyContain-style {
  display: flex;
  height: 200px;
  .coloum {
    border: 1px solid;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    // .row {
    // }
  }
}
</style>
