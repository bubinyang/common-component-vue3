<template>
  <div class="data-number-style">
    <div v-for="(item, index) in list" :key="index">{{ item }}</div>
  </div>
</template>

<script>
import moment from "moment";
import { reactive, toRefs, onMounted } from "vue";

export default {
  name: "dataNumber",
  props: {
    origin: {
      type: [String, Number],
      default: () => {
        return `00`;
      },
      desc: "数据源"
    }
  },
  created() {},
  setup(props) {
    const state = reactive({ timeValue: "", show: false, timeList: [], list: [] });
    onMounted(() => {
      state.list = String(props.origin).split("");
      console.log(state.list);
    });
    return {
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss">
.clock-style {
  display: flex;
  align-items: center;
}
</style>
