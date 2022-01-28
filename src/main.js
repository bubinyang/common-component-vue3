import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import publicComponents from "./components/publicCompoents.js";
import ElementPlus from "element-plus";
import "./style/base.scss";
import "element-plus/dist/index.css";

createApp(App).use(router).use(ElementPlus).use(publicComponents).mount("#app");
