import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import publicComponents from "@/components/publicCompoents.js";
import widgetComponents from "@/packages/index.js";
import moment from "moment";
import ElementPlus from "element-plus";
import "./style/base.scss"; //基础样式

import "../public/style/base-light.scss";
import "element-plus/dist/index.css";
import "ant-design-vue/dist/antd.css";
import Echarts from "vue-echarts";
import { Table } from "ant-design-vue";
import store from "./store";
const app = createApp(App);
app.config.globalProperties.$moment = moment;
app.component("v-chart", Echarts);

const root = document.documentElement;
/** 以iPhone6为例：布局视口为375px，我们把它分成10份，则1rem = 37.5px，
 * 这时UI给定一个元素的宽为375px（设备独立像素），
 * 我们只需要将它设置为375 / 37.5 = 10rem。
 */
const scale = root.clientWidth / 10;
root.style.fontSize = scale + "px";

console.log(store);
app
  .use(router)
  .use(store)
  .use(ElementPlus)
  .use(Table)
  .use(publicComponents)
  .use(widgetComponents)
  .mount("#app");
