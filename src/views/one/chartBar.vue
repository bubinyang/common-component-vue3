<template>
  <decorateEchart
    :criculationShowTootipAction="false"
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="newLrdEchartStep.getXAxisLabelBarFormatter"
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'line'"
    :title="{
      text: '',
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
        lineStyle: { color: '#00afed', width: 1 },
        color: '#ffffff'
      },
      axisTick: { show: true, lineStyle: { color: '#00afed', width: 1 } },
      boundaryGap: true,

      axisLabel: {
        color: 'rgb(186,201,250)',
        formatter: (val) => {
          return val;
        }
      }
    }"
    :yAxisName="''"
    :yAxisParam="{
      axisLine: { show: true, lineStyle: { color: '#00afed', width: 1 } },
      axisTick: { show: false, lineStyle: { color: '#0c73a5', width: 1 } },
      splitLine: {
        show: true,
        lineStyle: { type: 'solid', color: '#00afed', width: 1 }
      },
      min: function (value) {
        return 0;
      },
      axisLabel: {
        show: true,
        color: 'rgb(186,201,250)'
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
      show: false,
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
import http from "@/utils/requestone";
import moment from "moment";
const originData = [
  {
    attrKey: "A29",
    list: [],
    name: "当月",
    seriesParam: {
      // itemStyle: {
      //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //     {
      //       offset: 0,
      //       color: "rgba(21, 154, 255, 1)"
      //     },
      //     {
      //       offset: 0.5,
      //       color: "rgba(21, 154, 255, 0.5)"
      //     },
      //     {
      //       offset: 1,
      //       color: "rgba(0, 20, 79, 0)"
      //     }
      //   ])
      // }
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
      originData[0].list = [300, 200, 300, 400, 800];
      //originData[1].list = [200, 250, 400, 700, 400];

      //   state.newLrdEchartStep.getXAxisLabelBarFormatter = (val) => {
      //     return val + "马丁";
      //   };
      // state.newLrdEchartStep.barChartData = originData;

      // http
      //   .get("/system/passone/list/rejectRatioQmData", {
      //     beginTime: "2023-12-29",
      //     endTime: "2024-01-19"
      //   })
      //   .then((res) => {
      //     console.log(res, 111111111111111);
      //   });
      http
        .get("/system/passone/list/rejectRatioQmData", {
          params: {
            beginTime: moment().subtract(20, "days").format("YYYY-MM-DD"),
            endTime: moment().add(1, "days").format("YYYY-MM-DD")
          }
        })
        .then((res) => {
          state.newLrdEchartStep.xAxisData = res.rows.map((item) => item.date);
          originData[0].list = res.rows.map((item) =>
            item.percent > 0 ? item.percent.toFixed(2) : item.percent
          );
          state.newLrdEchartStep.barChartData = originData;
        });
    };

    return {
      refresAllDayPoint,
      seriesItemStyle,
      ...toRefs(state)
    };
  }
};
</script>
