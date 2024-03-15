<template>
  <SideLayout class="programSelection-style">

    <template #side>
        <ul>
            <li v-for="(item,key) in 10" :key="key">产品1</li>
        </ul>
    </template>
    <template #main>
      <ContainLayout>
        <template #action>
          1122
        </template>

        <template #contain>
          <section class="contain">
             <section class="btn">A</section>
            <section class="btn">B</section>
            <section class="btn">C</section>
            <section class="btn">D</section>
          </section>
          
        </template>

        
      </ContainLayout>

    
    </template>
  </SideLayout>
</template>

<script>
import { debounce } from "@/utils/index.js";
import { reactive, ref, onMounted, nextTick, toRefs, computed } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn"; //vue组件中文化
import http from "@/utils/request";

export default {
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

    

    
    const addOrUpdateHandleConfig = () => {
    };

    return {
      ...toRefs(data),
      addOrUpdateHandleConfig
    };
  }
};
</script>

<style lang="scss">
.programSelection-style{
  .contain{
    flex:1;
    display: flex;
    flex-direction: column;
    .btn{
         flex: 0 0 40px;
          &:nth-of-type(1){
            background:rgb(24,144,253);
          }
          &:nth-of-type(2){
            background:rgb(18,107,105);
          }
          &:nth-of-type(3){
            background:rgb(145,148,157);
          }
          &:nth-of-type(4){
            background:rgb(255,182,0);
          }
     }

  }
}
</style>
