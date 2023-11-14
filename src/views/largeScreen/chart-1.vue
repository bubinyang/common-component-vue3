<template>
  <section class="chart1-style">
    <div>
      <img :src="electricity" />
      <p>电用量</p>
      <b>{{ todayEnergy.avalue }}</b
      ><label>kWh</label>
    </div>

    <div>
      <img :src="peak" />
      <p>峰谷比</p>
      <b><em>峰</em>{{ todayEnergy.peakRatio }}<em>谷</em>{{ todayEnergy.valleyRatio }}</b>
    </div>

    <div>
      <img :src="steam" />
      <p>蒸汽用量</p>
      <b>{{ todayEnergy.evalue }}</b
      ><label>t</label>
    </div>
    <div>
      <img :src="water" />
      <p>水用量</p>
      <b>{{ todayEnergy.bvalue }}</b
      ><label>t</label>
    </div>
    <div>
      <img :src="carbon" />
      <p>碳排放量</p>
      <b>{{ todayEnergy.carbon }}</b
      ><label>tCO₂</label>
    </div>

    <div>
      <img :src="consumption" />
      <p>总能耗量</p>
      <b>{{ todayEnergy.consumption }}</b
      ><label>tce</label>
    </div>
  </section>
</template>

<script>
// import { reactive, toRefs, onMounted, watch } from "vue";
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
// import { getRealData } from "@/request/compair.js";
import * as echarts from "echarts";

import electricity from "@/assets/img/home/electricity.png";
import steam from "@/assets/img/home/steam.png";
import water from "@/assets/img/home/water.png";
import top from "@/assets/img/home/top.png";
import peak from "@/assets/img/home/peak.png";
import consumption from "@/assets/img/home/consumption.png";
import carbon from "@/assets/img/home/carbon.png";

const originData = [
  {
    attrKey: "A29",
    list: [100, 44, 76, 88, 44, 55, 66, 33, 89],
    name: "用电量",
    seriesParam: {
      type: "bar",
      barWidth: 10,
      barGap: "-100%",
      z: 11,
      itemStyle: {
        //lenged文本
        opacity: 0.9,
        color: function (params) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(59,109,150,0.8)"
            },
            {
              offset: 0.3,
              color: "rgba(61,130,182,1)"
            },
            {
              offset: 1,
              color: "rgba(57,158,236,1)"
            }
          ]);
        }
      }
    }
  },
  {
    attrKey: "",
    list: [100, 44, 76, 88, 44, 55, 66, 33, 89],
    name: "",
    seriesParam: {
      type: "pictorialBar",
      symbolSize: [10, 5],
      symbolOffset: [0, -5],
      z: 9999,
      symbolPosition: "end",
      label: {
        show: true,
        position: "top",
        fontSize: 10,
        color: "#fff"
      },
      itemStyle: {
        //lenged文本
        opacity: 0.7,
        color: "rgba(66,159,215,0.9)"
      }
    }
  },
  {
    attrKey: "",
    list: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    name: "",
    seriesParam: {
      type: "pictorialBar",
      symbolSize: [10, 5],
      symbolOffset: [0, 5],
      z: 2,
      itemStyle: {
        opacity: 1,
        color: function (params) {
          return new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(59,159,242,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(78,187,249,1)" // 100% 处的颜色
              }
            ],
            false
          );
        }
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

    const state = reactive({
      newLrdEchartStep: {},
      todayEnergy: {},
      electricity,
      steam,
      water,
      top,
      peak,
      consumption,
      carbon
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

    onMounted(() => {});

    return {
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss">
// .dayEnergyStatistics {
//   .small-contain-contain {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     // padding-top: 30px;
//     color: #ffffff;
//     justify-content: space-around;
//     padding: 10px !important;
//     & > div {
//       height: 32px;
//       background: url("@/assets/img/home/items-bg.png") no-repeat;
//       background-size: contain;
//       // background-position: left 100%;
//       display: flex;
//       align-items: center;
//       width: 352px;
//       // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
//       background-repeat: no-repeat;
//       padding: 0 18px 0 13px;

//       img {
//         position: relative;
//         left: 0px;
//         width: 27px;
//       }
//       p {
//         width: 80px;
//         margin-bottom: 0;
//         text-indent: 20px;
//         font-weight: bold;
//         color: #27d5e9;
//         font-size: 13px;
//       }
//       b {
//         flex: 1;
//         text-align: right;
//         font-size: 22px;
//         color: rgb(252, 253, 222);
//         font-weight: 400;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         text-shadow: rgb(255, 255, 255) 0px 0px 2px;
//         em {
//           font-style: normal;
//           color: #809ec1;
//           font-size: 13px;
//           padding: 0 8px;
//         }
//         // border: 1px solid;
//       }
//       label {
//         flex: 0 0 40px;
//         text-align: right;
//         font-size: 13px;
//         color: #809ec1;
//       }
//     }
//   }
// }
.chart1-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  justify-content: space-around;
  flex: 1;
  & > div {
    height: 32px;
    background: url("@/assets/img/home/items-bg.png") no-repeat;
    background-size: contain;
    // background-position: left 100%;
    display: flex;
    align-items: center;
    width: 300px;
    // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    background-repeat: no-repeat;
    padding: 0 18px 0 13px;

    img {
      position: relative;
      left: 0px;
      width: 27px;
    }
    p {
      width: 80px;
      margin-bottom: 0;
      text-indent: 20px;
      font-weight: bold;
      color: #27d5e9;
      font-size: 13px;
    }
    b {
      flex: 1;
      text-align: right;
      font-size: 22px;
      color: rgb(252, 253, 222);
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: rgb(255, 255, 255) 0px 0px 2px;
      em {
        font-style: normal;
        color: #809ec1;
        font-size: 13px;
        padding: 0 8px;
      }
      // border: 1px solid;
    }
    label {
      flex: 0 0 40px;
      text-align: right;
      font-size: 13px;
      color: #809ec1;
    }
  }
}
</style>
