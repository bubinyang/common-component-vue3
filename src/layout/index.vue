<template>
  <div class="layout">
    <section class="layout-header">头部</section>
    <section class="layout-slider">
      <BaseSlider v-if="state.isShow"></BaseSlider>
    </section>
    <section class="layout-main" v-if="isRouterActive">
      <router-view v-slot="{ Component }">
        <keep-alive exclude="TreeMenu">
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </section>
  </div>
</template>

<script>
import { lrdDrag, lrdDragSort } from "@/utils/utils.ts";
import emits from "@/utils/emit.js";
import BaseSlider from "@/layout/slider/base-slider.vue";
import { useStore } from "vuex";
import { reactive, provide, ref, nextTick } from "vue";

export default {
  components: { BaseSlider },
  setup() {
    emits.on("go", () => {
      console.log("我接收到了go");
    });
    const state = reactive({ isShow: false });
    const isRouterActive = ref(true);
    state.isShow = true;
    // setTimeout(() => {
    //   state.isShow = true;
    // }, 8000);
    provide("reload", () => {
      isRouterActive.value = false;
      nextTick(() => {
        isRouterActive.value = true;
      });
    });
    return { state, isRouterActive };
  }
};
</script>
<style lang="scss">
.layout {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  display: flex;
  // flex-wrap: wrap;
  .layout-header {
    height: 50px;
    position: absolute;
    // flex: 0 0 100%;
  }
  .layout-slider {
    margin-top: 50px;
    background: #263238;
    flex: 0 0 230px;
    .el-menu {
      border-right: 0;
    }
  }
  .layout-main {
    margin-top: 50px;
    flex: 1;
  }
}
</style>
