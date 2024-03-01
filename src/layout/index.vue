<template>
  <div :class="`layout ${containClass}`">
    <section class="layout-header">
      <!-- <section class="log"></section> -->
      <section class="head-operation">
        <BaseHeader></BaseHeader>
      </section>
    </section>

    <section class="layout-slider">
      <BaseSlider v-if="isShow"></BaseSlider>
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

import emits from "@/utils/emit.js";
import BaseSlider from "@/layout/slider/base-slider.vue";
import { useStore } from "vuex";
import { reactive, provide, ref, nextTick, watch, computed, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseHeader from "./header/base-header.vue";
import { getThemeCacheOfConfig } from "@/utils/theme.js";
import { setCache } from "@/utils/cache.js";

export default {
  components: { BaseSlider, BaseHeader },
  setup() {
    emits.on("go", () => {
      console.log("我接收到了go");
    });
    const state = reactive({ isShow: false, containClass: "" });
    const isRouterActive = ref(true);
    state.isShow = true;
    // setCache("theme", { baseSliderCollapse: true });
    const route = useRoute();
    const { currentRoute } = useRouter();
    console.log(currentRoute.value.matched);
    console.log(route);
    // const containClass = computed(() => {
    //   console.log(getThemeCacheOfConfig().join(""));

    //   return getThemeCacheOfConfig().join("");
    // });

    emits.on("emitTheme", () => {
      state.containClass = getThemeCacheOfConfig().join("");
    });
    console.log(getThemeCacheOfConfig());
    state.containClass = getThemeCacheOfConfig().join("");

    // setTimeout(() => {
    //   state.isShow = true;
    // }, 8000);
    provide("reload", () => {
      isRouterActive.value = false;
      nextTick(() => {
        isRouterActive.value = true;
      });
    });

    watch([() => currentRoute.value], ([value]) => {
      console.log(currentRoute.value);
    });

    return { route, ...toRefs(state), isRouterActive };
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
  .layout-header {
    height: 50px;
    position: absolute;
    // width: grid-width(5);
    width: 100%;
    font-size: 16px;
    display: flex;
    padding-left: 230px;
    box-shadow: 4px 4px 30px 0px rgba(75, 102, 171, 0.2);
    .log {
      flex: 0 0 230px;
    }
    .head-operation {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 40px;
      .base-header {
        display: flex;
        flex: 1;
        &-left {
          flex: 1;
          display: flex;
          align-items: center;
          .el-breadcrumb {
            margin-left: 20px;
          }
        }
        &-right {
          display: flex;
          align-items: center;
          .user-container {
            margin-left: 20px;
          }
        }
      }
    }
  }
  .layout-slider {
    text-align: left;
    //margin-top: 50px;
    // flex: 0 0 230px;
    width: 230px;
    overflow: auto;
    transition: width 0.3s;
    //隐藏滚动条轨道和按钮 实现无滚动条，但是可以滚动效果
    &::-webkit-scrollbar {
      display: none;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .layout-main {
    margin-top: 50px;
    flex: 1;
    overflow: auto;
    position: relative;
  }
}
</style>
