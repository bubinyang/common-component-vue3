<template>
  <section class="base-header">
    <div class="base-header-left">
      <SvgIcon :name="'shrink'" @click="switchSlider"></SvgIcon>
      <breadcrumb></breadcrumb>
    </div>

    <div class="base-header-right">
      <SvgIcon :name="'fullscreen2'"></SvgIcon>
    </div>
  </section>
</template>

<script>
import { reactive, provide, ref, nextTick, watch } from "vue";
import breadcrumb from "./breadcrumb.vue";
import emits from "@/utils/emit.js";

export default {
  components: { breadcrumb },
  setup() {
    const state = reactive({ isShow: false });
    const switchSlider = () => {
      console.log("switch");
      emits.emit("switchSlider");
    };
    return { state, switchSlider };
  }
};
</script>
