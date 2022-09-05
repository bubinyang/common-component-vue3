<template>
  <div class="layout">
    内部框
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import { lrdDrag, lrdDragSort } from "@/utils/utils.ts";
import emits from "@/utils/emit.js";

export default {
  setup() {
    emits.on("go", () => {
      console.log("我接收到了go");
    });
  }
};
</script>
