<!--
表格样式私有化定制+vue事件结合节流方法+elementui组件样式定制化
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
      <el-table-column prop="address" label="项目ss类型" align="center" width="120" />
      <el-table-column prop="a" label="项目主体" align="center" />
      <el-table-column prop="b" label="板块" align="center" width="120" />
      <el-table-column prop="c" label="能耗总量(tce)" align="center" width="120" />
      <el-table-column prop="d" label="核查机构" align="center" />
      <el-table-column prop="e" label="项目描述" align="center" />
    </el-table>

    <el-select class="frond-style" popper-class="frond-style" v-model="values" placeholder="Select">
      <el-option
        v-for="item in [
          { value: 1, label: 'option1' },
          { value: 2, label: 'option2' }
        ]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-date-picker
      class="frond-style"
      popper-class="frond-style"
      v-model="yearEnergyDate"
      type="year"
      placeholder=" "
    >
    </el-date-picker>

    <el-pagination
      class="frond-style"
      popper-class="frond-style"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChanges"
    />
  </section>
</template>

<script setup>
import { debounce } from "@/utils/index.js";
import { ref } from "vue";

// import zhCn from "element-plus/lib/locale/lang/zh-cn"; //vue组件中文化
// const zhCn=zhCn;
const handleSizeChange = function () {};
const handleCurrentChanges = function () {};
const small = ref(false);
const currentPage4 = ref(4);
const pageSize4 = ref(100);

const yearEnergyDate = ref(new Date());
const values = ref(1);
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

/**下拉，时间空间，分页等组件的定制化样式 */
//elementui组件定制样式
$bg: rgba(43, 63, 102, 0.5);
$has-border: true;
.frond-style {
  background: none !important;
  border: none !important;
  /**input 框(包含所有空间) */
  .el-input__inner {
    background: none;
    // border: 0;
    box-shadow: none;
    color: #00e3ff;
    // border: 1px solid #3b5369;
    @if $has-border {
      border: 1px solid #3b5369;
    } @else {
      border: 0;
    }
  }
  .el-popper__arrow {
    &::before {
      border: none !important;
    }
  }

  /**时间控件 */
  .el-picker-panel {
    background: $bg !important;
    color: #fff;
  }

  &.el-popper {
    box-shadow: none;
  }
  .el-popper__arrow {
    --el-color-white: #2b3f66 !important;
    &:before {
      background: #07355e !important;
    }
  }
  .el-date-picker__header-label {
    color: #00aaff !important;
  }
  .el-date-picker__header--bordered {
    border-bottom: 1px solid #00aaff !important;
  }
  .el-picker-panel__icon-btn {
    color: #00aaff !important;
  }

  .el-picker-panel__content {
    .cell {
      color: #00aaff !important;
    }
    .current {
      .cell {
        color: #fff !important;
      }
    }
  }

  &.el-picker__popper {
    //disable
    .el-year-table td.disabled .cell,
    .el-month-table td.disabled .cell {
      background: $bg;
    }
  }
  /**分页 */
  &.el-pagination {
    button {
      background: #07355e !important;
      color: #fff !important;
    }

    li {
      background: #07355e !important;
      color: rgb(64, 158, 255) !important;
    }

    li.active {
      background: none !important;
    }
  }

  /**下拉 */

  &.el-select__popper {
    border: none !important;
    background: $bg !important;
    li {
      // background: @bg!important;
      color: #8c98a8 !important;
      &:hover {
        color: #fff !important;
        background: $bg !important;
      }
    }
  }

  .el-select-dropdown__item {
    color: #fff !important;
    &.hover {
      background: none;
    }
    &:hover {
      background: #0277d0 !important;
    }
    &.selected {
      // background: #0277d0 !important;
      color: #fff !important;
    }
  }
}
</style>
