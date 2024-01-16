<template>
  <decorateEchart
    :criculationShowTootipAction="true"
    :data="newLrdEchartStep.barChartData || []"
    :x-axis-label-formatter="
      newLrdEchartStep.getXAxisLabelBarFormatter
        ? newLrdEchartStep.getXAxisLabelBarFormatter.bind(newLrdEchartStep)
        : () => {}
    "
    :x-axis-data="newLrdEchartStep.xAxisData || []"
    :chartType="'line'"
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
// import LineBarCharts from "@/components/chart/LineBarChartsUpdate.vue";
import { ref } from "vue-demi";
import { lrdEchart } from "@/utils/utils.ts";
// import { getRealData } from "@/request/compair.js";
import * as echarts from "echarts";

export default {
  components: {
    //LineBarCharts
  },
  props: {},
  setup() {
    const refresAllDayPoint = ref(false);

    const decrease = (delta) => {
      if (typeof delta !== "undefined") {
        delta;
      } else {
        delta;
      }
    };

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

    const newLrdEchartStep = ref(
      new lrdEchart({ dateType: "month", decimalDigits: 4, currentDate: "2022-07" })
    );
    const options = ref({});
    //  img1
    return {
      refresAllDayPoint,
      newLrdEchartStep,
      seriesItemStyle,
      options
    };
  },
  mounted() {
    this.options = {
      itemStyle: {
        normal: {
          barBorderRadius: [20, 20, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(57,89,255,1)"
            },
            {
              offset: 1,
              color: "rgb(46,200,207,1)"
            }
          ]),
          borderColor: "none"
        }
      },
      title: {
        text: "Stacked Line"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "Email",
          type: "bar",
          stack: "Total",
          itemStyle: {
            normal: {
              barBorderRadius: [20, 20, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(57,89,255,1)"
                },
                {
                  offset: 1,
                  color: "rgb(46,200,207,1)"
                }
              ]),
              borderColor: "none"
            }
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        }
      ]
    };

    const res = {
      code: 0,
      msg: "success",
      data: [
        {
          parentConsumption: 1282109.6875,
          myConsumption: 1282109.6875,
          values: {
            "2022-07-11": [
              { normal: "44115.7813" },
              { valley: "47076.0938" },
              { peak: "33904.0625" },
              { rush: "9681.5625" }
            ],
            "2022-07-10": [
              { normal: "43887.6562" },
              { valley: "49486.2501" },
              { peak: "31910.4687" },
              { rush: "11456.7188" }
            ],
            "2022-07-09": [
              { normal: "46081.4062" },
              { valley: "53513.2813" },
              { peak: "35529.375" },
              { rush: "11156.25" }
            ],
            "2022-07-08": [
              { normal: "46906.7186" },
              { valley: "49522.9688" },
              { peak: "33706.2499" },
              { rush: "11955.0001" }
            ],
            "2022-07-07": [
              { normal: "49994.5314" },
              { valley: "52370.3125" },
              { peak: "36380.6249" },
              { rush: "12545.7813" }
            ],
            "2022-07-06": [
              { normal: "46911.7185" },
              { valley: "51822.3438" },
              { peak: "36854.8438" },
              { rush: "12077.1876" }
            ],
            "2022-07-05": [
              { normal: "46184.3749" },
              { valley: "59570.4688" },
              { peak: "38502.3437" },
              { rush: "11039.6876" }
            ],
            "2022-07-04": [{ normal: "32544.3752" }, { peak: "24278.1249" }, { rush: "4719.9999" }],
            "2022-07-13": [{ valley: "48396.7187" }, { peak: "12763.7501" }, { rush: "4648.2812" }],
            "2022-07-12": [
              { normal: "47131.5624" },
              { valley: "48359.0624" },
              { peak: "33500.9376" },
              { rush: "11622.8125" }
            ]
          },
          attrKey: "A29",
          peakValleyFlat: {
            values: [
              { normal: "403758.1247" },
              { valley: "460117.5002" },
              { peak: "317330.7811" },
              { rush: "100903.2815" }
            ],
            attrKey: "A29"
          }
        }
      ]
    };
    this.newLrdEchartStep.barChartData = this.newLrdEchartStep.dealEchartList([res], "normal")();
  }
};
</script>
