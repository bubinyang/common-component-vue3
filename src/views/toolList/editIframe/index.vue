<template>
  <section id="stageContain">
    <div class="logContain"></div>
  </section>
</template>

<script>
import { strToJson } from "@/utils";
// import Vue from "vue";
import { createApp } from "vue/dist/vue.esm-bundler";
import publicComponents from "@/components/publicCompoents.js";
import widgetComponents from "@/packages/index.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

export default {
  name: "Test",
  data() {
    return {};
  },
  mounted() {
    const logEl = document.querySelector("#stageContain");
    function setConsole(message) {
      logEl.innerHTML += message + "<br />";
    }
    window.addEventListener("message", function (messageEvent) {
      const { obj, template, type } = messageEvent.data;

      let objUpdate = null;
      // if for the tools，replace the console method，render info to Element
      // hide create of code

      if (type === "tools") {
        console.log = setConsole;
        objUpdate = `{created(){
            ${obj}
          }}`;
      } else {
        objUpdate = obj;
      }
      const jscode = (objUpdate || "{}").replace(/([\n\r]+)/g, "");
      const templateNode = `<div>${template || ""}</div>`;
      //   const Component = Vue.extend({
      //     ...strToJson(jscode),
      //     template: templateNode
      //   });
      //   const markedComponent = new Component().$mount();
      //   const stageContainEl = document.querySelector("#stageContain");
      //   stageContainEl.appendChild(markedComponent.$el);

      //vue3
      const Profile = {
        ...strToJson(jscode),
        template: templateNode
      };
      console.log(Profile, strToJson(jscode));

      const app = createApp(Profile);
      app.use(ElementPlus).use(publicComponents).use(widgetComponents).mount("#stageContain");
    });
  }
};
</script>
<style lang="scss">
#stageContain {
  height: 100%;
  position: relative;
  .logContain {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
}
</style>
