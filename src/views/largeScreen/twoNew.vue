<!--
1.originData数据源要从小到大排列离线 运行 报警 待机 调试
-->
<template>
  <section class="deviceStateStyle">
    <div class="legend">
      <div><label></label>运行</div>
      <div><label></label>待机</div>
      <div><label></label>调试</div>
      <div><label></label>报警</div>
      <div><label></label>离线</div>
    </div>
    <div class="yAxis">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>

    <div class="xAxis">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
    <div class="title">
      <div v-for="(item, index) in originList" :key="index">{{ item.Name }}</div>
    </div>

    <div class="xAxisList">
      <div v-for="(item, index) in xAxisList" :key="index">{{ item }}</div>
    </div>

    <section class="bar" v-for="(item, index) in originList" :key="index">
      <div class="bar-content" v-for="(a, b) in item.State" :key="b">
        <b
          v-for="(c, d) in a.minus"
          :key="d"
          :style="{ background: colorlist[a.State], width: barItemWidth + 'px' }"
        ></b>
      </div>
    </section>
    <!-- <section class="bar"></section>
    <section class="bar"></section> -->
  </section>
</template>

<script>
// import { reactive, toRefs, onMounted, watch } from "vue";
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
// import { getRealData } from "@/request/compair.js";
import * as echarts from "echarts";
import http from "@/utils/request";
import { useRoute } from "vue-router";
import moment from "moment";
const colorlist = {
  0: "rgb(100,239,104)",
  1: "rgb(246,225,21)",
  2: "rgb(46,188,226)",
  3: "rgb(222,84,57)",
  4: "rgb(148,148,148)"
};
//
const originData = [
  {
    attrKey: "A29",
    list: [],
    name: "离线",
    seriesParam: {
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: false,
        // offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        }
        // position: "insideBottomLeft"
      },
      itemStyle: {
        color: "rgb(74,104,247)"
      }
    }
  },

  {
    attrKey: "A29",
    list: [],
    name: "运行",
    seriesParam: {
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: false,
        offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        },
        position: "insideBottomLeft"
      },
      itemStyle: {
        color: "rgb(157,201,148)"
      }
    }
  },

  {
    attrKey: "A29",
    list: [],
    name: "报警",
    seriesParam: {
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: false,
        offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        },
        position: "insideBottomLeft"
      },
      itemStyle: {
        color: "rgb(244,109,150)"
      }
    }
  },

  {
    attrKey: "A29",
    list: [],
    name: "待机",
    seriesParam: {
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: false,
        offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        },
        position: "insideBottomLeft"
      },
      itemStyle: {
        color: "rgb(242,197,140)"
      }
    }
  },

  {
    attrKey: "A29",
    list: [],
    name: "调试",
    seriesParam: {
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: false,
        offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        },
        position: "insideBottomLeft"
      },
      itemStyle: {
        color: "yellow"
      }
    }
  }
];

export default {
  components: {
    //LineBarCharts
  },
  props: {},
  setup() {
    const refresAllDayPoint = ref(false);
    const route = useRoute();

    const state = reactive({
      newLrdEchartStep: {},
      dataZoom: [],
      originList: [],
      colorlist,
      barItemWidth: "1",
      xAxisList: []
    });

    const seriesItemStyle = ref({
      barBorderRadius: [20, 20, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "rgba(57,89,255,1)"
        },
        {
          offset: 1,
          color: "rgba(46,200,207,1)"
        }
      ]),
      borderColor: "none"
    });

    onMounted(() => {
      init();
    });

    const init = async (device) => {
      state.newLrdEchartStep = new lrdEchart({
        dateType: "month",
        decimalDigits: 4,
        frequency: 15
      });

      // state.newLrdEchartStep.xAxisData = [
      //   "six",
      //   "李四",
      //   "one",
      //   "two",
      //   "three",
      //   "four",
      //   "five",
      //   "张三"
      // ];
      // originData[0].list = [900, 500, 100];
      // originData[1].list = [900, 500, 100];
      // originData[2].list = [900, 500, 100];
      // originData[3].list = [900, 500, 100];

      if (originData[0].list.length >= 6) {
        //startValue 必须是从高到低数据，相当于要拿最后6条数据，所以要减6
        state.dataZoom = [
          {
            yAxisIndex: 0,
            show: false,
            type: "inside",
            startValue: originData[0].list.length - 6,
            endValue: originData[0].list.length - 1,
            zoomLock: true //禁止鼠标滚动数据
          }
        ];
      }
      state.newLrdEchartStep.barChartData = originData;
      function getMin(end, start) {
        const today = moment().startOf("day");
        const endTime = today.clone().set({ hour: end.split(":")[0], minute: end.split(":")[1] });
        const startTime = today
          .clone()
          .set({ hour: start.split(":")[0], minute: start.split(":")[1] });
        return (endTime.valueOf() - startTime.valueOf()) / (60 * 1000);
      }
      http.post("/api/screen2/device/state/time2", { ID: route.query.id || "1" }).then((res) => {
        // res.Data = [
        //   {
        //     Name: "A-047",
        //     State: [
        //       {
        //         state: 1,
        //         start: "00:00",
        //         End: "06:42"
        //       },
        //       {
        //         state: 2,
        //         start: "06:42",
        //         End: "06:45"
        //       },
        //       {
        //         state: 3,
        //         start: "06:45",
        //         End: "10:00"
        //       }
        //     ]
        //   },
        //   {
        //     Name: "B-056",
        //     State: [
        //       {
        //         state: 4,
        //         start: "00:00",
        //         End: "10:00"
        //       }
        //     ]
        //   },

        //   {
        //     Name: "B-056",
        //     State: [
        //       {
        //         state: 4,
        //         start: "00:00",
        //         End: "10:00"
        //       }
        //     ]
        //   },
        //   {
        //     Name: "B-056",
        //     State: [
        //       {
        //         state: 4,
        //         start: "00:00",
        //         End: "10:00"
        //       }
        //     ]
        //   },
        //   {
        //     Name: "B-056",
        //     State: [
        //       {
        //         state: 4,
        //         start: "00:00",
        //         End: "10:00"
        //       }
        //     ]
        //   },
        //   {
        //     Name: "B-056",
        //     State: [
        //       {
        //         state: 4,
        //         start: "00:00",
        //         End: "10:00"
        //       }
        //     ]
        //   }
        // ];
        state.originList = res.Data;
        const totalTimeMinutes = Math.floor(
          (moment().valueOf() - moment().startOf("day").valueOf()) / (60 * 1000)
        );
        state.barItemWidth = 350 / totalTimeMinutes;
        const timeOne = Math.floor((moment().valueOf() - moment().startOf("day").valueOf()) / 5);

        console.log(timeOne);
        let star = moment().startOf("day").valueOf();
        // let list = [];
        while (star <= moment().valueOf()) {
          state.xAxisList.push(star);
          star = star + timeOne;
        }
        state.xAxisList = state.xAxisList.map((item) => moment(item).format("HH:mm"));
        const today = moment().startOf("day");
        state.originList.forEach((item) => {
          item.State.forEach((childitem) => {
            childitem.minus = getMin(childitem.End, childitem.Start);
          });
        });

        console.log(state.originList);
      });

      //let { data } = await baseService.get("/energy/board/getMonthEnergy");
    };

    return {
      refresAllDayPoint,
      seriesItemStyle,
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss">
.deviceStateStyle {
  padding: 30px 20px 30px 50px;
  flex: 1;
  position: relative;
  .yAxis {
    width: 2px;
    height: 100%;
    background: white;
    position: relative;
    i {
      width: 10px;
      display: block;
      background: white;
      height: 2px;
      position: absolute;
      left: -10px;
      &:nth-child(1) {
        top: 0;
      }
      &:nth-child(2) {
        top: 44.5px;
      }
      &:nth-child(3) {
        top: 89px;
      }

      &:nth-child(4) {
        top: 133.5px;
      }
      &:nth-child(5) {
        top: 178px;
      }

      &:nth-child(6) {
        top: 222.5px;
      }
      &:nth-child(7) {
        bottom: 0px;
      }
    }
  }

  .xAxis {
    height: 2px;
    // height: 100%;
    background: white;
    position: relative;
    bottom: 2px;
    i {
      height: 10px;
      display: block;
      background: white;
      width: 2px;
      position: absolute;
      left: -10px;
      &:nth-child(1) {
        left: 0;
      }
      &:nth-child(2) {
        left: 72px;
      }
      &:nth-child(3) {
        left: 144px;
      }

      &:nth-child(4) {
        left: 216px;
      }
      &:nth-child(5) {
        left: 288px;
      }

      &:nth-child(6) {
        left: 360px;
      }
      //   &:nth-child(7) {
      //     left: 360px;
      //   }
    }
  }
  .bar {
    height: 35px;
    width: 350px;
    // background: white;
    position: absolute;

    display: flex;
    .bar-content {
      display: flex;
      position: relative;
      //   label{position: absolute;right: ;}

      b {
        display: block;
        // flex: 0 0 0.5833px;
        // background: red;
        height: 100%;
      }
    }
    &:nth-of-type(1) {
      top: 35px;
    }

    &:nth-of-type(2) {
      top: 80px;
    }

    &:nth-of-type(3) {
      top: 125px;
    }

    &:nth-of-type(4) {
      top: 170px;
    }

    &:nth-of-type(5) {
      top: 215px;
    }

    &:nth-of-type(6) {
      top: 260px;
    }
    // &:last-child {
    //   top: 50px;
    // }
  }

  .title {
    position: absolute;
    width: 50px;
    top: 30px;
    color: white;
    bottom: 30px;
    left: 0px;
    div {
      height: 47px;
      display: flex;
      align-items: center;
    }
  }

  .xAxisList {
    position: absolute;
    height: 50px;
    bottom: -30px;
    width: 100%;
    color: white;
    left: 0px;
    display: flex;
    div {
      position: absolute;
      &:nth-child(1) {
        left: 35px;
      }
      &:nth-child(2) {
        left: 105px;
      }
      &:nth-child(3) {
        left: 175px;
      }
      &:nth-child(4) {
        left: 245px;
      }
      &:nth-child(5) {
        left: 315px;
      }
      &:nth-child(6) {
        left: 385px;
      }
    }
  }

  .legend {
    position: absolute;
    top: 10px;
    width: 100%;
    z-index: 10;
    display: flex;
    color: rgb(186, 201, 250);
    div {
      width: 75px;
      height: 20px;
      display: flex;
      align-items: center;
      label {
        flex: 0 0 35px;
        height: 100%;
        border-radius: 5px;
      }
      &:nth-child(1) label {
        background: rgb(100, 239, 104);
      }
      &:nth-child(2) label {
        background: rgb(246, 225, 21);
      }
      &:nth-child(3) label {
        background: rgb(46, 188, 226);
      }
      &:nth-child(4) label {
        background: rgb(222, 84, 57);
      }
      &:nth-child(5) label {
        background: rgb(148, 148, 148);
      }
    }
  }

  //   & > section {
  //     &:nth-child(1) {
  //       top: 0px;
  //     }
  //   }

  //   & > section:nth-child(1) {
  //     top: 50px;
  //   }
  // border: ;
}
</style>
