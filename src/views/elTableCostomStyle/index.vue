<!--
表格样式私有化定制+vue事件结合节流方法
-->
<template>
  <section class="eltable-style">
    <el-table
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
    </el-table>
  </section>
</template>

<script setup>
import { debounce } from "@/utils/index.js";
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

const handleCurrentChange = debounce(function (event) {
  console.log("执行", event);
}, 500);
</script>

<style lang="scss">
.eltable-style {
  background-image: radial-gradient(rgb(0, 72, 140), rgb(0, 0, 38));

  /**通用elementui样式 start*/
  .el-table {
    //   background-color: #23272e;
    background-color: transparent;
    color: rgba(26, 204, 247, 1);
    border-color: #63dfff;
    .el-table__inner-wrapper {
      &::before {
        background: none;
      }
    }
    thead tr,
    thead th {
      background: rgba(6, 63, 118, 1);
      color: #00aaff;
      border: 0px solid rgb(14, 44, 93);
      &.el-table__cell {
        background: none;
      }
    }
    .el-table__body {
      // font-family: PangMenZhengDaoBiao;
      tr:hover {
        td {
          background: none;
        }
      }
      tr:nth-child(2n-1) {
        //   background: rgba(0, 64, 131, 0.8);
        background: transparent;
      }
      tr:nth-child(2n) {
        background: rgba(0, 80, 151, 0.5);
      }
      td {
        //   border: 0px solid rgb(14, 44, 93);
        border-bottom: 1px dashed #59707b;
        &:first-child {
          color: rgb(37, 179, 60);
        }
      }
    }
    &::before {
      height: 0;
    }
    & th.gutter {
      display: table-cell !important;
    }
  }
}
</style>
