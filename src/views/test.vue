<template>
  <section id="stageContain">
    <ChangeYearMonthDay
      v-model:dateOption="dateOption"
      :addHours="0"
      :multiple="true"
      :increase="true"
      :type-list="['year', 'allyear']"
      :typeListMutiple="['allyear']"
      :intervalTimeValue="{ realtime: 1, day: 1, month: 1, year: 1 }"
    ></ChangeYearMonthDay>
    <el-button type="primary">Primary</el-button>

    <LabelInputSwitch v-model="color" type="select" :options="options" />
    222
    <div class="logContain">111</div>
  </section>
</template>
<script>
import { reactive, ref } from "vue";
export default {
  name: "Test",
  setup() {
    const dateOption = ref({ dateOther: "", date: "", type: "year" });
    const color = ref("red");
    const optionList = reactive({
      options: [
        { label: "红色", value: "red" },
        { label: "蓝色", value: "blue" }
      ]
    });
    return {
      dateOption,
      color,
      ...optionList
    };
  }
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
