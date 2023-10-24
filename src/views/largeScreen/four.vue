<template>
  <decorateEchart
    :criculationShowTootipAction="true"
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="newLrdEchartStep.getXAxisLabelBarFormatter"
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'bar'"
    :title="{
      text: 'kWh',
      top: '0',
      left: '20',
      textStyle: { color: '#00FFFF', fontSize: '12', fontWeight: 'normal' }
    }"
    :colors="['#0090FF', 'rgba(0,204,255,1)']"
    :grid="{ left: 20, right: 10, bottom: 10, top: 30 }"
    :average="0"
    :xAxisParam="{
      splitLine: { show: false, lineStyle: { type: 'solid', color: '#4B6BAA' } },
      axisLine: {
        onZero: false,
        lineStyle: { color: '#6080A8', width: 1 },
        color: '#ffffff'
      },
      axisTick: { show: true, lineStyle: { color: '#0c73a5', width: 1 } },
      boundaryGap: true,

      axisLabel: {
        color: '#7A8295',
        formatter: newLrdEchartStep.getXAxisLabelBarFormatter
          ? newLrdEchartStep.getXAxisLabelBarFormatter.bind(newLrdEchartStep)
          : () => {}
      }
    }"
    :yAxisName="''"
    :yAxisParam="{
      axisLine: { show: true, lineStyle: { color: '#3C5069', width: 1 } },
      axisTick: { show: false, lineStyle: { color: '#0c73a5', width: 1 } },
      splitLine: { show: false, lineStyle: { type: 'dashed', color: 'rgba(58,175,240,0.6)' } },
      min: function (value) {
        return 0;
      }
    }"
    :seriesParam="{
      symbolSize: 8,
      symbol: 'circle',
      smooth: true,
      showSymbol: false,
      stack: newLrdEchartStep.chartType === 'zzt' ? 'total' : false
    }"
    :markPointParam="{
      itemStyle: {
        opacity: 0
      },
      symbolSize: 0
    }"
    :legendParam="{
      show: true,
      right: '5%',
      top: '2%',
      bottom: '2%',
      textStyle: {
        color: 'auto'
      }
    }"
    :axisLineShow="false"
    :tooltip="{
      borderColor: 'rgba(50, 50, 50, 0.7)',
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      textStyle: {
        padding: 10,
        color: '#00fefd',
        fontSize: '12'
      }
    }"
    :showDataZoom="false"
    style="height: calc(100%)"
  />
</template>

<script>
// import { reactive, toRefs, onMounted, watch } from "vue";
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
// import { getRealData } from "@/request/compair.js";
import * as echarts from "echarts";

const originData = [
  // {
  //   attrKey: "A29",
  //   list: [100, 44, 76, 88, 44, 55, 66, 33, 89],
  //   name: "用电量",
  //   seriesParam: {
  //     type: "bar",
  //     barWidth: 10,
  //     barGap: "-100%",
  //     z: 11,
  //     itemStyle: {
  //       //lenged文本
  //       opacity: 0.9,
  //       color: function (params) {
  //         return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //           {
  //             offset: 0,
  //             color: "rgba(59,109,150,0.8)"
  //           },
  //           {
  //             offset: 0.3,
  //             color: "rgba(61,130,182,1)"
  //           },
  //           {
  //             offset: 1,
  //             color: "rgba(57,158,236,1)"
  //           }
  //         ]);
  //       }
  //     }
  //   }
  // },
  // {
  //   attrKey: "",
  //   list: [100, 44, 76, 88, 44, 55, 66, 33, 89],
  //   name: "",
  //   seriesParam: {
  //     type: "pictorialBar",
  //     symbolSize: [10, 5],
  //     symbolOffset: [0, -5],
  //     z: 9999,
  //     symbolPosition: "end",
  //     label: {
  //       show: true,
  //       position: "top",
  //       fontSize: 10,
  //       color: "#fff"
  //     },
  //     itemStyle: {
  //       //lenged文本
  //       opacity: 0.7,
  //       color: "rgba(66,159,215,0.9)"
  //     }
  //   }
  // },
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
      newLrdEchartStep: {}
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

    // const newLrdEchartStep = ref(
    //   new lrdEchart({ dateType: "month", decimalDigits: 4, currentDate: "2022-07" })
    // );

    onMounted(() => {
      console.log("onMounted");
      init();
    });

    const init = async (device) => {
      state.newLrdEchartStep = new lrdEchart({
        dateType: "month",
        decimalDigits: 4,
        frequency: 15
      });
      console.log(state.newLrdEchartStep);
      //   originData[0].list = [300, 200, 300, 400, 800];
      //   originData[1].list = [200, 250, 400, 700, 400];
      const resultList = [300, 200, 300, 400, 800];

      // originData[0].list = resultList;
      // originData[1].list = resultList.map((item) => (Number(item) === 0 ? null : item));
      // originData[2].list = resultList.map((item) => (Number(item) !== 0 ? 1 : null));

      //   state.newLrdEchartStep.getXAxisLabelBarFormatter = (val) => {
      //     return val + "马丁";
      //   };
      state.newLrdEchartStep.barChartData = originData;
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
