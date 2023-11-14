<template>
  <decorateEchartY
    :criculationShowTootipAction="true"
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="
      newLrdEchartStep.getXAxisLabelBarFormatter
        ? newLrdEchartStep.getXAxisLabelBarFormatter.bind(newLrdEchartStep)
        : () => {}
    "
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'bar'"
    :title="{
      text: 'kWh',
      top: '0',
      left: '20',
      textStyle: { color: '#00FFFF', fontSize: '12', fontWeight: 'normal' }
    }"
    :colors="[
      '#5B8FF9',
      '#61DDAA',
      '#65789B',
      '#61DDAA',
      '#65789B',
      '#2FC25B',
      '#9661BC',
      '#F19D9D'
    ]"
    :grid="{ left: 20, right: 10, bottom: 10, top: 30 }"
    :average="0"
    :xAxisParam="{
      splitLine: { show: false, lineStyle: { type: 'solid' } },
      axisLine: {
        show: false,
        onZero: false,
        lineStyle: { color: '#3AAFF0', width: 2 },
        color: '#ffffff'
      },
      axisTick: { show: false, lineStyle: { color: '#0c73a5', width: 1 } },
      boundaryGap: true,

      axisLabel: {
        color: '#7A8295'
      }
    }"
    :yAxisParam="{
      axisLine: { show: false, lineStyle: { color: '#3AAFF0', width: 2 } },
      axisTick: { show: false, lineStyle: { color: '#0c73a5', width: 1 } },
      splitLine: { show: false, lineStyle: { type: 'dashed', color: 'rgba(58,175,240,0.6)' } },
      min: function (value) {
        return 0;
      },
      axisLabel: {
        show: false,
        color: '#7A8295',
        width: 150,
        formatter(value) {
          if (value < 1) return value;
          return numShorten(value, 1);
        },
        rich: {}
      },

      max: (value) => {
        return value.max * 1.2;
      }
    }"
    :seriesParam="{
      symbol: 'none',
      smooth: true,
      showSymbol: false,
      stack: newLrdEchartStep.chartType === 'zzt' ? 'total' : false
    }"
    :markPointParam="{
      itemStyle: {
        opacity: newLrdEchartStep.markPointParam ? 0 : 0
      },
      label: {
        color: '#ffffff'
      }
    }"
    :legendShow="false"
    :legend="{
      textStyle: {
        color: '#ffffff'
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
  {
    attrKey: "A29",
    list: [],
    name: "当月",
    seriesParam: {
      label: { show: true, position: "right" },
      // barWidth: 10,
      showBackground: true,

      /**如果柱子要在一个框里显示，此处代码设置好，再把itemStyle设置一下即可 */
      // backgroundStyle: {
      //   color: "none",
      //   borderColor: "#0096FF",
      //   borderWidth: 1
      // },

      // itemStyle: {
      //   normal: {
      //     // barBorderRadius: 30
      //     borderColor: "rgba(2,241,233,0)",
      //     borderWidth: 5
      //   }
      // }
      /*end*/

      backgroundStyle: {
        barBorderRadius: 30
      },
      itemStyle: {
        normal: {
          barBorderRadius: 30
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

      state.newLrdEchartStep.xAxisData = [
        "张三",
        "李四",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six"
      ];
      originData[0].list = [
        {
          value: 2000,
          itemStyle: { color: "rgba(27, 105, 208, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        }
      ];

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
