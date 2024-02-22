<template>
  <el-menu
    class="el-menu-vertical-demo"
    :default-active="currentRouteUrl"
    :collapse="collapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <SidebarMenusItems :menus="menuList"></SidebarMenusItems>
    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3">
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
import emits from "@/utils/emit.js";
import { menuList } from "@/utils/menuData.js";
import { reactive, toRefs, watch } from "vue";
import SidebarMenusItems from "./sidebar-menus-items.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";
import { setThemeCacheOfConfig } from "@/utils/theme.js";
export default {
  name: "BaseSlider",
  //components: { SidebarMenusItems },

  components: { SidebarMenusItems, Document, IconMenu, Location, Setting },
  setup() {
    const store = useStore();
    const route = useRoute();
    const handleOpen = function () {};
    const handleClose = function () {};
    const state = reactive({ menuList, currentRouteUrl: route.path, collapse: false });
    console.log(setThemeCacheOfConfig);
    emits.on("switchSlider", () => {
      console.log("我接收到了switchSlider");

      state.collapse = !state.collapse;
      setThemeCacheOfConfig("baseSliderCollapse", state.collapse);
    });

    watch(
      () => [route.path],
      ([path]) => {
        console.log(path);
        state.currentRouteUrl = path;
      }
    );

    console.log(route.path);
    console.log(route.query);
    return {
      ...toRefs(state),
      handleOpen,
      handleClose
    };
  }
};
</script>
