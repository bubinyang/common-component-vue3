<!--
1.originData数据源要从小到大排列
-->
<template>
  <decorateEchartY
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="() => {}"
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'bar'"
    :title="{
      text: '',
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
    :grid="{ left: 50, right: 20, bottom: 30, top: 30 }"
    :average="0"
    :xAxisParam="{
      splitLine: { show: false, lineStyle: { type: 'solid' } },
      axisLine: {
        show: true,
        onZero: false,
        lineStyle: { color: 'rgb(186,201,250)', width: 2 },
        color: 'rgb(186,201,250)'
      },
      axisTick: { show: true, lineStyle: { color: 'rgb(186,201,250)', width: 1 } },
      boundaryGap: true,

      axisLabel: {
        show: true,
        color: 'rgb(186,201,250)'
      }
    }"
    :yAxisParam="{
      axisLine: { show: true, lineStyle: { color: '#3AAFF0', width: 2 } },
      axisTick: { show: true, lineStyle: { color: '#0c73a5', width: 1 } },
      splitLine: { show: false, lineStyle: { type: 'dashed', color: 'rgba(58,175,240,0.6)' } },
      min: function (value) {
        return 0;
      },
      axisLabel: {
        show: true,
        color: 'rgb(186,201,250)',
        width: 150,
        formatter(value) {
          return value;
        },
        rich: {}
      }
    }"
    :seriesParam="{
      symbol: 'none',
      smooth: true,
      showSymbol: false,
      stack: 'total'
    }"
    :markPointParam="{
      itemStyle: {
        opacity: newLrdEchartStep.markPointParam ? 0 : 0
      },
      label: {
        color: '#ffffff'
      }
    }"
    :legendShow="true"
    :legendParam="{
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
    :dataZoom="dataZoom"
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
    name: "故障",
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
      dataZoom: []
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
        "six",
        "李四",
        "one",
        "two",
        "three",
        "four",
        "five",
        "张三"
      ];
      originData[0].list = [900, 500, 100];
      originData[1].list = [900, 500, 100];
      originData[2].list = [900, 500, 100];
      originData[3].list = [900, 500, 100];
      // originData[0].list = [
      //   {
      //     value: 900,
      //     itemStyle: { color: "rgba(27, 105, 208, 1)" }
      //   },
      //   {
      //     value: 1000,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 1100,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 1200,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 1300,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 1400,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 1500,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   },
      //   {
      //     value: 2000,
      //     itemStyle: { color: "rgba(11, 197, 197, 1)" }
      //   }
      // ];

      // originData[1].list = [
      //   {
      //     value: 200,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 500,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 550,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 600,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 650,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 700,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 750,
      //     itemStyle: { color: "blue" }
      //   },
      //   {
      //     value: 1000,
      //     itemStyle: { color: "blue" }
      //   }
      // ];

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
        // console.log({ yAxisIndex: 0, show: false, type: "inside", startValue: originData[0].list.length - 6, endValue: originData[0].list.length - 1 });
      }

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
