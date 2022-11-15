<template>
  <template v-for="x in props.menus || []" :key="x.path">
    <el-sub-menu v-if="x.children && x.children.length > 0" :index="x.url">
      <template #title>
        <span>
          <a>{{ x.name }}</a>
        </span>
      </template>

      <sidebar-menus-items :menus="x.children"></sidebar-menus-items>
    </el-sub-menu>
    <el-menu-item v-else>
      <template #title>
        <!-- <a @click="pushPath(x)" v-if="x.meta?.isNewPage" :href="`${x.meta.url}`" target="_blank">
          {{ x.meta.title }}
        </a>
        <a @click="pushPath(x)" v-else>{{ x.meta?.title }}</a> -->
        <a @click="pushPath(x)">{{ x.name }}</a>
      </template>
    </el-menu-item>
  </template>
</template>

<script>
// import { menuList } from "@/utils/menuData.js";
// import { reactive, toRefs } from "vue";
// import SidebarMenusItems from "./sidebar-menus-items.vue";
import { useRouter } from "vue-router";

export default {
  name: "BaseSlider",
  props: {
    menus: Array
  },
  setup(props) {
    const handleOpen = function () {};
    const handleClose = function () {};
    /// const state = reactive({ menuList });

    const router = useRouter();
    const pushPath = (path) => {
      console.log(path);
      router.push("/snake/index");
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
