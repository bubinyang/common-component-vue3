<!--
背景:antdesign组件形成的树形结构table,需要进行拖拉拽排序
1.defaultExpandAllRows 默认全部展开，拉拽后重新加载数据又会默认全部展开，滚动都会默认恢复到顶部，不合适(因为人在操作的时候，会把部分缩起来)
解决方案: 借助expandedRowKeys(A)和 @expandedRowsChange(B) 属性和事件，给A增加默认值，A的值会在操作展开缩小变化，在拖拽后刷新数据A不进行初始化，直接继续取当前值（拖拽后滚动条都不会恢复到顶部，可能跟定义A属性有关系）。
2.红色位置线需要在完整高度的内容框中进行定位，否则滚动的时候红线不会位移，所以lrdDragSort类又增加了一个completeContentEl属性值
-->
<template>
  <section
    style="
      width: 700px;
      height: 400px;

      margin: 100px 0 100px 0;
      position: relative;
      left: 400px;
    "
    class="aTable-style"
  >
    <table class="test-style">
      <tr>
        <th>Firstname</th>
        <th>Lastname</th>
      </tr>
      <tr>
        <td>Peter</td>
        <td>Griffin</td>
      </tr>
      <tr>
        <td>Lois</td>
        <td>Griffin</td>
      </tr>
    </table>

    <!-- <div class="tootip-contain"></div> -->
    <a-table
      :scroll="{ x: 700, y: 445 }"
      defaultExpandAllRows
      :columns="columns"
      :data-source="data"
      :row-selection="rowSelection"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a
            @mouseenter="draggableClick(record)"
            draggable
            style="display: block; height: 50px; width: 50px; background: black"
          ></a>
        </template>
      </template>
    </a-table>
  </section>
</template>

<script>
const dataOrigin = [
  {
    key: 1,
    name: "John Brown sr.",
    age: 60,
    address: "New York No. 1 Lake Park",
    children: [
      {
        key: 11,
        name: "John Brown",
        age: 42,
        address: "New York No. 2 Lake Park"
      },
      {
        key: 12,
        name: "John Brown jr.",
        age: 30,
        address: "New York No. 3 Lake Park",
        children: [
          {
            key: 121,
            name: "Jimmy Brown",
            age: 16,
            address: "New York No. 3 Lake Park"
          }
        ]
      },
      {
        key: 13,
        name: "Jim Green sr.",
        age: 72,
        address: "London No. 1 Lake Park",
        children: [
          {
            key: 131,
            name: "Jim Green",
            age: 42,
            address: "London No. 2 Lake Park",
            children: [
              {
                key: 1311,
                name: "Jim Green jr.",
                age: 25,
                address: "London No. 3 Lake Park"
              },
              {
                key: 1312,
                name: "Jimmy Green sr.",
                age: 18,
                address: "London No. 4 Lake Park"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 2,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park"
  }
];
const columnsData = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "200px"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: "10%"
  },
  {
    title: "Address",
    dataIndex: "address",
    width: "20%",
    key: "address"
  },
  {
    title: "operation",
    dataIndex: "operation",
    fixed: "right"
    // slots: { customRender: "operation" }
  }
];
import { reactive, ref, onMounted, nextTick } from "vue";
import { lrdDrag, lrdDragSort } from "@/utils/utils.ts";

export default {
  setup() {
    const columns = ref(columnsData);
    const data = ref(dataOrigin);
    const rowSelection = ref({
      checkStrictly: false,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      }
    });

    let newLrdDrag = {};
    const draggableClick = function (record) {
      const { name } = record;
      newLrdDrag.name = name;
    };

    onMounted(async () => {
      await nextTick();
      const containEl = document.querySelector(".aTable-style");
      const completeContentEl = document.querySelector(".aTable-style .ant-table");
      newLrdDrag = new lrdDragSort(containEl, {
        completeContentEl,
        attributeKey: "data-row-key"
      });

      // newLrdDrag.moveAction = function () {
      //   console.log("我是你爸爸");
      // };
    });

    return {
      columns,
      data,
      rowSelection,
      draggableClick
    };
  },
  created() {
    console.log("drag刷新");
  }
};
</script>

<style scoped>
/* .test-style.table {
  border-collapse: collapse;
} */

.test-style.table,
td,
th {
  border: 1px solid black;
}
</style>
