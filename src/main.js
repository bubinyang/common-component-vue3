import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import publicComponents from "@/components/publicCompoents.js";
import widgetComponents from "@/packages/index.js";
import moment from "moment";
import ElementPlus from "element-plus";
import "./style/base.scss";
import "element-plus/dist/index.css";
import "ant-design-vue/dist/antd.css";
import Echarts from "vue-echarts";
import { Table } from "ant-design-vue";
const app = createApp(App);
app.config.globalProperties.$moment = moment;
app.component("v-chart", Echarts);
app
  .use(router)
  .use(ElementPlus)
  .use(Table)
  .use(publicComponents)
  .use(widgetComponents)
  .mount("#app");
