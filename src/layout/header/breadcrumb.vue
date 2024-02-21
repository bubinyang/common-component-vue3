<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path">{{
      item.meta.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { reactive, provide, ref, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    // const state = reactive({ breadcrumb: [] });
    const breadcrumb = ref([]);
    const { currentRoute } = useRouter();
    watch([() => currentRoute.value], ([value]) => {
      breadcrumb.value = currentRoute.value.matched;
    });
    return { breadcrumb };
  }
};
</script>
