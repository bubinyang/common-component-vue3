<template>
  <div class="clock-style">
    <!-- {{ timeValue }} -->
    <!-- {{ timeValue }} -->
    <div v-for="(item, key) in timeList" :key="key">
      {{ item.value }}
    </div>
  </div>
</template>

<script>
const weekList = { 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "日" };

import moment from "moment";
import { reactive, toRefs } from "vue";
import { criculationAction, criculationActionSwitch } from "@/utils/index.js";
// let isAllow = true;
// setTimeout(() => {
//   isAllow = false;
// }, 5000);
// function criculationAction(fn, ms) {
//   const beginAction = () => {
//     fn.apply(this, arguments);
//     setTimeout(() => {
//       console.log(isAllow);
//       if (isAllow) beginAction();
//     }, ms);
//   };
//   beginAction();
// }

export default {
  name: "Clock",
  props: {
    orderList: {
      type: String,
      default: () => {
        return `date:time:week`;
      },
      desc: "时间展示排序"
    }
  },
  created() {
    let times;
    const setGetDate = () => {
      this.getTime().then((res) => {
        times = +res;
      });
    };
    const initialize = () => {
      const setTime = () => {
        times += 1000;
        let time = moment(times).format("HH:mm:ss");
        let date = moment(times).format("YYYY年MM月DD日");
        let week = `星期${weekList[moment(times).day()]}`;
        const list = [
          { value: date, type: "date" },
          { value: time, type: "time" },
          { value: week, type: "week" }
        ];

        this.timeList = this.orderList.split(":").reduce((total, item) => {
          const finditem = list.find((childitem) => childitem.type === item);
          total.push({
            value: finditem.value,
            type: finditem.value
          });

          return total;
        }, []);

        this.timeValue = isNaN(times) ? "" : `${date}${week} ${time} `;
      };
      this.getTime().then((res) => {
        times = +res;
        criculationAction(setTime, 1000);
      });
    };
    criculationAction(setGetDate, 60000);
    initialize();
  },
  setup() {
    const time = reactive({ timeValue: "", show: false, timeList: [] });
    function getTime() {
      return new Promise((resolve) => {
        setTimeout(resolve, 0, new Date());
        // resolve(new Date());
      });
    }

    return {
      getTime,
      ...toRefs(time)
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
