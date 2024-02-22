<template>
  <section class="base-header">
    <div class="base-header-left">
      <SvgIcon :name="'shrink'" @click="switchSlider"></SvgIcon>
      <breadcrumb></breadcrumb>
    </div>

    <div class="base-header-right">
      {{ isFullscreen }}
      <SvgIcon
        @click="fullscreen"
        :name="!isFullscreen ? 'fullscreen2' : 'tuichuquanping'"
      ></SvgIcon>
    </div>
  </section>
</template>

<script>
import { reactive, provide, ref, nextTick, watch, toRefs } from "vue";
import breadcrumb from "./breadcrumb.vue";
import emits from "@/utils/emit.js";
import screenfull from "screenfull";

export default {
  components: { breadcrumb },
  setup() {
    const state = reactive({ isShow: false, isFullscreen: false });
    const switchSlider = () => {
      emits.emit("switchSlider");
      emits.emit("emitTheme");
    };
    const fullscreen = () => {
      state.isFullscreen = !state.isFullscreen;
      screenfull.toggle();
    };
    return { ...toRefs(state), switchSlider, fullscreen };
  }
};
</script>
