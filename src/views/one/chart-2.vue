<template>
  <decorateEchartY01
    :criculationShowTootipAction="false"
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
        color: '#7A8295',
        show: false
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
        return value.max;
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
import decorateEchartRow from "@/components/tools/echart/LineBarChartRow.vue";
const originData = [
  {
    attrKey: "A29",
    list: [1789, 1245, 2645, 2315, 2251],
    name: "当月",
    seriesParam: {
      type: "bar",
      barWidth: 30,
      showBackground: true,

      // itemStyle: {
      //   normal: {
      //     barBorderRadius: 0,
      //     color: "transparent"
      //   }
      // },
      label: {
        normal: {
          show: true,
          position: ["100%", "-10"],
          textStyle: {
            fontSize: 14,
            color: "#62E6F6",
            lineHeight: -20
          },
          formatter: function (data) {
            return data.name;
          },
          rich: {
            blue: {
              fontSize: 14,
              lineHeight: 5,
              color: "#62E6F6"
            },
            mr: {
              padding: [0, 0, 0, 10],
              fontSize: 14,
              color: "#fff"
            }
          }
        }
      }
    }
  },

  {
    attrKey: "A29",
    list: [300, 300, 300],
    name: "当月",
    seriesParam: {
      name: "外框",
      type: "bar",
      itemStyle: {
        normal: {
          barBorderRadius: 10,
          color: "rgba(24,64,96,0.14)" //rgba设置透明度0.14
        }
      },
      label: {
        normal: {
          show: true,
          textStyle: {
            color: "#00DEFF",
            fontSize: 14,
            lineHeight: 0
          },
          position: ["95%", "-50%"],
          rich: {
            blue: {
              fontSize: 14,
              lineHeight: 5,
              color: "#62E6F6"
            }
          }
        }
      },
      barGap: "-100%",
      z: 0,
      barWidth: 15
    }
  }

  // {
  //   attrKey: "A29",
  //   list: [],
  //   name: "当月",
  //   seriesParam: {
  //     label: {
  //       formatter: function (param) {
  //         return param.name;
  //       },
  //       right: "3%",
  //       show: true,
  //       offset: [4, -17],
  //       textStyle: {
  //         fontWeight: 400,
  //         fontSize: 15,
  //         color: "#4984d5"
  //       },

  //       position: "topLeft"
  //     },

  //     // label: { show: false, position: "right" },
  //     barWidth: 10,
  //     showBackground: true,

  //     backgroundStyle: {
  //       barBorderRadius: 30
  //     },
  //     itemStyle: {
  //       normal: {
  //         barBorderRadius: 30
  //       }
  //     }
  //   }
  // }
];

export default {
  // components: {
  //   decorateEchartRow
  //   //LineBarCharts
  // },
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
      init();
    });

    const init = async (device) => {
      state.newLrdEchartStep = new lrdEchart({
        dateType: "month",
        decimalDigits: 4,
        frequency: 15
      });

      state.newLrdEchartStep.xAxisData = [];

      const data = [
        { name: "a", value: 200 },
        { name: "b", value: 300 },
        { name: "c", value: 100 }
      ];
      const color = ["#0BC5C5", "#1B69D0", "#92BCF3"];
      data.sort((a, b) => b.value - a.value);
      state.newLrdEchartStep.xAxisData = data.map((item) => item.name).reverse();
      originData[0].list = data.reverse().map((item, index) => {
        return {
          name: item.name,
          value: item.value
          // itemStyle: { color: color[index] }
        };
      });

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
