<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

/**
 * 全屏布局
 */
export default defineComponent({
  name: "FullScreenLayout",
  setup() {
    // const route = useRoute();
    // return { route };
  }
});
</script>
<template>
  <div style="height: 100vh">
    <router-view />
  </div>
</template>
