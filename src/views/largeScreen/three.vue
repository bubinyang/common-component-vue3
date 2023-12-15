<!--
URL：/api/screen2/device/availability
{
    "Code": 0,
    "Data": [
        {
            "Name" /*设备名称*/: "A-047",
            "Rate" /*利用率*/: 0
        },
        {
            "Name" /*设备名称*/: "B-056",
            "Rate" /*利用率*/: 0
        }
    ]
}
-->
<template>
  <decorateEchart
    :criculationShowTootipAction="false"
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="newLrdEchartStep.getXAxisLabelBarFormatter"
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'bar'"
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
      splitLine: { show: false, lineStyle: { type: 'solid', color: 'rgb(186,201,250)' } },
      axisLine: {
        onZero: false,
        lineStyle: { color: 'rgb(186,201,250)', width: 1 },
        color: 'rgb(186,201,250)'
      },
      axisTick: { show: true, lineStyle: { color: 'rgb(186,201,250)', width: 1 } },
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
      axisLine: { show: true, lineStyle: { color: 'rgb(186,201,250)', width: 1 } },
      axisTick: { show: false, lineStyle: { color: '#0c73a5', width: 1 } },
      splitLine: { show: false, lineStyle: { type: 'dashed', color: 'rgba(58,175,240,0.6)' } },
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
      show: false,
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
import http from "@/utils/request";

const originData = [
  {
    attrKey: "A29",
    list: [],
    name: "当月",
    seriesParam: {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(21, 154, 255, 1)"
          },
          {
            offset: 0.5,
            color: "rgba(21, 154, 255, 0.5)"
          },
          {
            offset: 1,
            color: "rgba(0, 20, 79, 0)"
          }
        ]),
        normal: {
          barBorderRadius: 30
        }
      },
      showBackground: true,
      backgroundStyle: {
        borderRadius: 30,
        borderColor: "rgb(230, 230, 254)",
        borderWidth: 2
      },
      barWidth: 30
    }
  }
  //   {
  //     attrKey: "A29",
  //     list: [],
  //     name: "上月",
  //     seriesParam: {
  //       areaStyle: {
  //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //           {
  //             offset: 0,
  //             color: "rgba(0,144,255,0.9)"
  //           },
  //           {
  //             offset: 1,
  //             color: "rgba(12,32,53, 0)"
  //           }
  //         ])
  //       }
  //     }
  //   }
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
      originData[0].list = [300, 200, 300, 400, 800];
      http.post("/api/screen2/device/availability", { ID: "1" }).then((res) => {
        state.newLrdEchartStep.xAxisData = res.Data.map((item) => item.Name);
        originData[0].list = res.Data.map((item) => item.Rate);
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
