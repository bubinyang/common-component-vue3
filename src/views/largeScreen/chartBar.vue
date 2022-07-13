<template>
  <decorateEchart
    :data="newLrdEchartStep.barChartData"
    :x-axis-label-formatter="newLrdEchartStep.getXAxisLabelBarFormatter.bind(newLrdEchartStep)"
    :x-axis-data="newLrdEchartStep.xAxisData"
    :chartType="'bar'"
    :showDataZoom="false"
    :colors="['rgba(9,255,192,0.5)']"
    :grid="{ left: 10, right: 10, bottom: 10, top: 7 }"
    :xAxisParam="{
      splitLine: { show: false },

      axisLine: {
        onZero: false,
        lineStyle: { color: '#707070', width: 2 }
      }
    }"
    :yAxisParam="{
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(45,68,113)' } },
      min: function (value) {
        return 0;
      }
    }"
    :markPointParam="{ data: [], itemStyle: { opacity: 0 } }"
    :seriesParam="{ symbol: 'emptyCircle' }"
    :legendShow="false"
    :axisLineShow="false"
    :axisLabelColor="'#AEAFB2'"
    :seriesItemStyle="seriesItemStyle"
    :tooltip="{
      borderColor: 'rgba(0, 92, 255, 1)',
      backgroundColor: 'rgba(11, 63, 156, 0.7)',
      textStyle: {
        padding: 10,
        color: 'white',
        fontSize: '20'
      }
    }"
    style="height: calc(100%)"
  />
  <!-- <v-chart ref="baseChart" :autoresize="true" :option="options"></v-chart> -->
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

    const newLrdEchartStep = ref(new lrdEchart("month", 4));
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
    console.log(this.newLrdEchartStep.barChartData);
  }
};
</script>
