export default {
  modelValue: {
    type: String,
    default() {
      return "";
    },
    state: "辅助v-model的props"
  },
  origin: {
    type: Array,
    default() {
      return [];
    },
    state: "数据源"
  },

  placeHolder: {
    type: String,
    default() {
      return "请填写内容";
    },
    state: "placeHolder"
  },

  keyType: {
    type: Object,
    default() {
      return { label: "label", children: "children" };
    },
    state: "中文和子集的key的设置"
  },

  disabled: {
    type: Boolean,
    default() {
      return false;
    },
    state: "是否禁用"
  },

  valueKey: {
    type: String,
    default() {
      return "id";
    },
    state: "value的key设置"
  },

  treeHorizontal: {
    type: Boolean,
    default() {
      return false;
    },
    state: "是否为横向树形选择"
  },

  clearable: {
    type: Boolean,
    default() {
      return true;
    },
    state: "是否有清除按钮"
  },

  showCheckbox: {
    type: Boolean,
    default() {
      return false;
    },
    state: "是否为多选"
  }
};
