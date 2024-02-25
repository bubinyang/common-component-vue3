<template>
  <template v-for="x in props.menus || []" :key="x.path">
    <el-sub-menu v-if="x.children && x.children.length > 0" :index="x.url" :router="true">
      <template #title>
        <el-icon><location /></el-icon>

        <span>
          <a>{{ x.name }} </a>
        </span>
      </template>

      <sidebar-menus-items :menus="x.children"></sidebar-menus-items>
    </el-sub-menu>
    <el-menu-item :index="x.url" v-else>
      <el-icon><setting /></el-icon>

      <span>
        <a @click="pushPath(x)">{{ x.name }}</a></span
      >
    </el-menu-item>
  </template>
</template>

<script>
// import { menuList } from "@/utils/menuData.js";
// import { reactive, toRefs } from "vue";
import SidebarMenusItems from "./sidebar-menus-items.vue";
import { useRouter } from "vue-router";
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";

export default {
  name: "BaseSlider",
  components: { Document, IconMenu, Location, Setting },
  props: {
    menus: Array
  },
  setup(props) {
    const handleOpen = function () {};
    const handleClose = function () {};
    /// const state = reactive({ menuList });

    const router = useRouter();
    const pushPath = (path) => {
      const { url } = path;
      router.push(url);
    };

    return {
      //   ...toRefs(state),
      pushPath,
      props,
      handleOpen,
      handleClose
    };
  }
};
</script>
