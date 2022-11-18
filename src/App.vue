<script>
import HelloWorld from "./components/HelloWorld.vue";
import layout from "@/layout/index.vue";
import FullscreenLayout from "@/views/layout/fullscreen-layout.vue";
import app from "@/constant/app.ts";
import { reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { pageLayout } from "@/constant/setting";
export default {
  components: { layout, FullscreenLayout },
  setup() {
    const route = useRoute();
    const state = reactive({ layout: "" });
    watch(
      () => [route.path, route.query],
      ([path, query]) => {
        state.layout = app.fullscreen.includes(path) ? pageLayout.fullscreen : pageLayout.page;
      }
    );
    return {
      state,
      page: pageLayout.fullscreen
    };
  }
};
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <!--如果需要全屏，layout单独封装出来易于维护-->
  <div class="app">
    <!-- <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view> -->
    <FullscreenLayout v-if="state.layout === page"></FullscreenLayout>
    <layout v-else></layout>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
