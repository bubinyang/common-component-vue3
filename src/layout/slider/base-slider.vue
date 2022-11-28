<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="currentRouteUrl"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <SidebarMenusItems :menus="menuList"></SidebarMenusItems>
    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script>
import { menuList } from "@/utils/menuData.js";
import { reactive, toRefs, watch } from "vue";
import SidebarMenusItems from "./sidebar-menus-items.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { use } from "echarts";

export default {
  name: "BaseSlider",
  components: { SidebarMenusItems },
  setup() {
    const store = useStore();
    const route = useRoute();
    const handleOpen = function () {};
    const handleClose = function () {};
    const state = reactive({ menuList, currentRouteUrl: route.path });

    watch(
      () => [route.path],
      ([path]) => {
        console.log(path);
        state.currentRouteUrl = path;
      }
    );

    console.log(route.path);
    return {
      ...toRefs(state),
      handleOpen,
      handleClose
    };
  }
};
</script>
