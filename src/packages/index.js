import ChangeYearMonthDay from "@/packages/Widget/changeYearMonthDay/index.vue";
import HourMinuteSeconds from "@/packages/Widget/hourMinuteSecond/index.vue";
import LabelInputSwitch from "@/packages/Widget/LabelInputSwitch/index.vue";
import ExpandButton from "@/packages/Widget/expandButton/index.vue";
import InputTree from "@/packages/Widget/inputTree/index.vue";

const components = [
  ChangeYearMonthDay,
  HourMinuteSeconds,
  LabelInputSwitch,
  ExpandButton,
  InputTree
];

const install = function (Vue, opts = {}) {
  components.map((component) => {
    Vue.component(component.name, component);
  });
};

/* 支持使用标签的方式引入 */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install
  //tools
};
