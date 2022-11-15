<template>
  <div class="layout">
    <section class="layout-header">头部</section>
    <section class="layout-slider">
      <BaseSlider></BaseSlider>
    </section>
    <section class="layout-main">
      <router-view v-slot="{ Component }">
        <keep-alive>
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

export default {
  components: { BaseSlider },
  setup() {
    emits.on("go", () => {
      console.log("我接收到了go");
    });
  }
};
</script>
<style lang="scss">
.layout {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
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
