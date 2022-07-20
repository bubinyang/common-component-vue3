<template>
  <SideLayout>
    <template #side>左侧标题</template>
    <template #main>
      <ContainLayout>
        <template #action>顶部内容</template>
        <template #contain>
          <el-table :data="tableData" border height="100%" style="width: 100%">
            <el-table-column fixed="left" prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" width="400" label="Address" />
          </el-table>
        </template>
      </ContainLayout>
    </template>
  </SideLayout>
</template>

<script>
import { ref } from "vue-demi";

export default {
  setup() {
    const tableData = ref([
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
    ]);
    for (let i = 0; i < 10; i++) {
      tableData.value.push({
        date: "2016-05-03" + i,
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles"
      });
    }
    return {
      tableData
    };
  }
};
</script>
