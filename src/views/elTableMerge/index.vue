<template>
  <el-table border :data="dataList" style="width: 100%" :span-method="objectSpanMethod">
    <el-table-column prop="thingName" :label="'结构'" width="150" />
    <el-table-column prop="baseName" :label="'能源品种'" width="150">
      <template v-slot="scope">
        {{ `${scope.row.baseName}(${scope.row.baseUnit})` }}
      </template>
    </el-table-column>
    <el-table-column prop="attrName" :label="'类型'" width="100" />
    <el-table-column prop="allDosage" :label="'总量'" width="100">
      <template v-slot="scope">
        {{ (scope.row.allDosage ?? " ") !== " " ? scope.row.allDosage : "- -" }}
      </template>
    </el-table-column>
    <el-table-column prop="standardRatio" :label="'标准占比'" width="100">
      <template v-slot="scope">
        {{ (scope.row.standardRatio ?? " ") !== " " ? scope.row.standardRatio + "%" : "- -" }}
      </template>
    </el-table-column>
    <el-table-column prop="realityRatio" :label="'实际占比'" width="100">
      <template v-slot="scope">
        {{ (scope.row.realityRatio ?? " ") !== " " ? scope.row.realityRatio + "%" : "- -" }}
      </template>
    </el-table-column>
    <!-- <el-table-column :label="currentDate" align="center">
      <el-table-column v-for="(item, key) in dateList" :key="key" :label="item.label" width="120">
        <template #default="scope">
          <span>
            {{
              (scope.row.dataList[key]?.dosage ?? " ") !== " "
                ? scope.row.dataList[key]?.dosage
                : "- -"
            }}</span
          >
        </template>
      </el-table-column>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { ref, watch, reactive, toRefs, computed, toRaw, nextTick, watchEffect } from "vue";
import { data } from "./data.js";
data.forEach((item) => {
  item.baseNameThingName = item.thingName + item.baseName;
});
export default {
  setup() {
    const state = reactive({
      dataList: data
    });
    /**
     * key 是匹配到需要合并的某列
     * searchKey 需要合并的行，之所以不能用key，比如总进线1和总进线3的baseNamed都是电，那么电列里的每行都会合并。实际需求是总进线1的电和总进线3的电分别合并。那么需要创建总进线1电的唯一code进行匹配合并，所以需要人为制造baseNameThingName
     * nextIndex 合并记录标识key字段
     *
     */
    const mergeObj = [
      { key: "thingName", nextIndex: "thingNameId", searchKey: "thingName" },
      { key: "baseName", nextIndex: "baseNameId", searchKey: "baseNameThingName" }
    ];
    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const findItem = mergeObj.find((item) => item.key === column.property); //匹配到需要合并的列
      if (findItem) {
        const currentId = state.dataList[rowIndex][findItem.searchKey]; //记录第一条需要查询的关键key值
        let rowspan = 1;
        for (let i = rowIndex + 1; i < state.dataList.length; i++) {
          if (state.dataList[i][findItem.searchKey] === currentId) {
            state.dataList[i][findItem.nextIndex] = true; //匹配到的row，增加记录标识，后续rowspan设为0，目的是清空td达到合并目的
            rowspan++;
          } else {
            break;
          }
        }
        if (state.dataList[rowIndex][findItem.nextIndex]) {
          return {
            rowspan: 0,
            colspan: 1
          };
        }
        if (rowspan > 1) {
          return {
            rowspan: rowspan,
            colspan: 1
          };
        }
        if (rowspan === 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
      }
    };

    return { ...toRefs(state), objectSpanMethod };
  }
};
</script>
