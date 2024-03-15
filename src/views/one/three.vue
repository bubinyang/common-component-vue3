<template>
{{}}
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
      splitLine: { show: false, lineStyle: { type: 'solid', color: 'rgb(186,201,250)' } },
      axisLine: {
        onZero: false,
        lineStyle: { color: '#00afed', width: 1 },
        color: 'rgb(186,201,250)'
      },
      axisTick: { show: true, lineStyle: { color: 'rgb(199,214,235)', width: 1 } },
      boundaryGap: true,

      axisLabel: {
        color: 'rgb(186,201,250)',
        fontSize: 20,
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
       max:function (value) {
          return value.max<limit.upperLimit?limit.upperLimit:value.max;
      },
      axisLabel: {
        show: true,
        color: 'rgb(186,201,250)',
        fontSize: 20
      }
    }"
    :seriesParam="{
      smooth: false,
      symbolSize: 8,
      symbol: 'circle',
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
import http from "@/utils/requestone";
import { useRoute } from "vue-router";

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
        color: "rgba(180, 180, 180, 0.2)",
        borderRadius: 10,
        borderColor: "rgb(230, 230, 254)"
        // borderWidth: 2
      }
      //barWidth: 10
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
  props: {
    limit: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props) {
    const refresAllDayPoint = ref(false);
    const route = useRoute();

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
      originData[0].seriesParam = {
        markLine: {
          position: "middle",
          data: [
            {
              type: "max",
              yAxis: props.limit.lowerLimit,
              lineStyle: { color: "red" },
              label: {
                position: "insideEndTop",
                formatter: `下限${props.limit.lowerLimit}`,
                color: "red",
                fontSize: 16
              }
            },
            {
              type: "max",
              yAxis: props.limit.upperLimit,
              lineStyle: { color: "red" },
              label: {
                formatter: `上限${props.limit.upperLimit}`,
                position: "insideEndTop",
                color: "red",
                fontSize: 16
              }
            }
          ]
        }
      };

      init();
    });

    const init = async (device) => {
      state.newLrdEchartStep = new lrdEchart({
        dateType: "month",
        decimalDigits: 4,
        frequency: 15
      });
      state.newLrdEchartStep.xAxisData = [];
      originData[0].list = [];
      state.newLrdEchartStep.barChartData = originData;
      http
        .get("/system/qualityresult/list210", { params: { pageNum: 1, pageSize: 50 } })
        .then((res) => {       
          state.newLrdEchartStep.xAxisData = res.rows.map((item) => String(item.qrId).slice(-5));

          originData[0].list = res.rows.map((item) =>
            item.finalValue > 0 ? item.finalValue.toFixed(2) : item.finalValue
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
