<template>{{ timeValue }}</template>

<script>
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
  props: {},
  created() {
    let times;
    const setGetDate = () => {
      this.getTime().then((res) => {
        times = +res;
        console.log("更新时间");
      });
    };
    const initialize = () => {
      const setTime = () => {
        times += 1000;
        let time = moment(times).format("HH:mm:ss");
        let date = moment(times).format("YYYY年MM月DD日");
        let week = moment(times).day();
        this.timeValue = `${time}   ${date}   星期${week}`;
      };
      let criculationActionObj = criculationActionSwitch(setTime, 1000);
      setTimeout(() => {
        criculationActionObj.isAction = false;
      }, 5000);
      this.getTime().then((res) => {
        times = +res;

        //criculationAction(setTime, 1000);
        criculationActionObj.action();
      });
    };
    criculationAction(setGetDate, 60000);
    initialize();
  },
  setup() {
    const time = reactive({ timeValue: "" });
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
