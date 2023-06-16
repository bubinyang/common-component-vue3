<template>
  <div class="layout">
    <section class="layout-header">头部</section>
    <section class="layout-slider">
      <BaseSlider v-if="state.isShow"></BaseSlider>
    </section>
    <section class="layout-main" v-if="isRouterActive">
      <router-view v-slot="{ Component }">
        <keep-alive exclude="TreeMenu">
          <component :key="route.fullPath" :is="Component"></component>
        </keep-alive>
      </router-view>
    </section>
  </div>
</template>

<script>
/**
 * :key="route.fullPath" 可以防止tab切换不同路由报错
 */

import { lrdDrag, lrdDragSort } from "@/utils/utils.ts";
import emits from "@/utils/emit.js";
import BaseSlider from "@/layout/slider/base-slider.vue";
import { useStore } from "vuex";
import { reactive, provide, ref, nextTick } from "vue";
import { useRoute } from "vue-router";

export default {
  components: { BaseSlider },
  setup() {
    emits.on("go", () => {
      console.log("我接收到了go");
    });
    const state = reactive({ isShow: false });
    const isRouterActive = ref(true);
    state.isShow = true;

    const route = useRoute();

    // setTimeout(() => {
    //   state.isShow = true;
    // }, 8000);
    provide("reload", () => {
      isRouterActive.value = false;
      nextTick(() => {
        isRouterActive.value = true;
      });
    });
    return { route, state, isRouterActive };
  }
};
</script>
<style lang="scss">
// @function setRem($px) {
//   @return ($px/37.5) * 1rem;
// }
.layout {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  display: flex;
  // flex-wrap: wrap;
  .layout-header {
    height: 50px;
    position: absolute;
    width: grid-width(5);
    font-size: 16px;
    // flex: 0 0 100%;
  }
  .layout-slider {
    margin-top: 50px;
    flex: 0 0 230px;
    overflow: auto;
    //隐藏滚动条轨道和按钮
    &::-webkit-scrollbar {
      display: none;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .layout-main {
    margin-top: 30px;
    flex: 1;
    overflow: hidden;
  }
}
</style>
