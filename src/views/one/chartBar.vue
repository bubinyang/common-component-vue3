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
      axisLabel: {
        show: true,
        color: 'rgb(186,201,250)',
        fontSize: 20,
        formatter(value) {
          //  if (value < 1) return value;
          return value * 100 + '%';
        }
      }
    }"
    :seriesParam="{
      smooth: false,
      label: {
        show: true,
        position: 'top',
        color: 'white',
        fontSize: 20,

        formatter: (val) => {
          return (val.value * 100).toFixed(0) + '%';
        }
      }
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
    name: "当日",
    seriesParam: {}
  }
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
      console.log("limit", props.limit);

      originData[0].seriesParam = {
        markLine: {
          position: "middle",
          data: [
            // {
            //   type: "max",
            //   yAxis: props.limit.lowerLimit,
            //   lineStyle: { color: "red" },
            //   label: {
            //     position: "insideEndTop",
            //     formatter: `下限${(props.limit.lowerLimit || 0) * 100}%`,
            //     color: "red",
            //     fontSize: 16
            //   }
            // },
            {
              type: "max",
              yAxis: props.limit.upperLimit,
              lineStyle: { color: "red" },
              label: {
                formatter: `上限${(props.limit.upperLimit || 0) * 100}%`,
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
      originData[0].list = [];
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
          state.newLrdEchartStep.xAxisData = res.rows.map((item) => item.date).slice(-7);
          originData[0].list = res.rows
            .map((item) => (item.percent > 0 ? item.percent.toFixed(2) : item.percent))
            .slice(-7);
          state.newLrdEchartStep.barChartData = originData;
        });
    };

    const labelFormatter = (val) => {
      return (val.value * 100).toFixed(0) + "%";
    };

    return {
      refresAllDayPoint,
      seriesItemStyle,
      ...toRefs(state)
    };
  }
};
</script>
