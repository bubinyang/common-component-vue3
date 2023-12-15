// import FixBoxWh from './layout/fix-box-wh';// 布局
import SmallContain from "./layout/smallContain/index.vue";

import ExportImage from "./tools/exportImage/index.vue"; // 导出图片
import Clock from "./tools/clock/index.vue";

import decorateEchart from "./tools/echart/index.vue";
import decorateEchartY from "./tools/echart/LineBarChartsY.vue";
import decorateEchartY01 from "./tools/echart/LineBarChartsY-01.vue";

import SideLayout from "@/components/layout/sideLayout/index.vue";
import ContainLayout from "@/components/layout/containLayout/index.vue";
import largeScreenMain from "@/components/layout/large-screen-main/index.vue";

const components = [
  // FixBoxWh,
  Clock,
  ExportImage,
  SmallContain,
  // LabelInputSwitch,
  SideLayout,
  ContainLayout,
  largeScreenMain,
  decorateEchart,
  decorateEchartY,
  decorateEchartY01
  // ChangeYearMonthDay,
  // HourMinSecond
  // ThreeLangrunda
];

const install = {
  install: function (Vue) {
    Object.keys(components).forEach((key) => {
      Vue.component(components[key].name, components[key]);
    });
  }
};

export default install;
