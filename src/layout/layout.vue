<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
// import app from "@/constants/app";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    //return { enabledKeepAlive: app.enabledKeepAlive };
  }
});
</script>
