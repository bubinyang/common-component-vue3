<template>
  <div class="energyMakeUp" ref="energyMakeUpRef" style="width: 100%; height: 278px"></div>
</template>
<script>
import { reactive, toRefs, onMounted, ref, watch } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
// import LineBarCharts from "@/components/chart/LineBarCharts.vue";
import * as echarts from "echarts";
import moment from "moment";
import makeup from "./images/circlebg.png";

// import { getMonthRange } from "@/utils/utils.ts";
function criculationActionSwitch(fn, ms) {
  const obj = {
    isAction: true,
    action() {
      const beginAction = () => {
        if (obj.isAction) fn.apply(this, arguments); //如果需要经常开关的需求，那么递归持续运行,停止和启动执行方法fn即可
        setTimeout(beginAction, ms); //如果关闭后不再开启，如倒计时，那么直接关闭setTimout即可，判断条件放在这行前面
      };
      beginAction();
    }
  };
  return obj;
}
const colors = [
  { bg: "rgba(87,143,235,0.7)", borderColor: "#578feb" },
  { bg: "rgba(90,216,166,0.7)", borderColor: "#5ad8a6" },
  { bg: "rgba(9,95,235,0.7)", borderColor: "#0d64f3" },
  { bg: "rgba(247,15,249,0.5)", borderColor: "#ed04ef" },
  { bg: "rgba(206,240,218,0.7)", borderColor: "#cef0da" },
  { bg: "rgba(244,186,27,0.7)", borderColor: "#f4ba1b" },
  { bg: "rgba(253,233,183,0.7)", borderColor: "#fde9b7" },
  { bg: "rgba(233,107,88,0.7)", borderColor: "#e96b58" },
  { bg: "rgba(244,199,194,0.7)", borderColor: "#f4c7c2" },
  { bg: "rgba(118,194,224,0.7)", borderColor: "#76c2e0" },
  { bg: "rgba(37,151,150,0.7)", borderColor: "#259796" },
  { bg: "rgba(140,96,181,0.7)", borderColor: "#8c60b5" },
  { bg: "rgba(222,207,238,0.7)", borderColor: "#decfee" },
  { bg: "rgba(248,149,69,0.7)", borderColor: "#f89545" },
  { bg: "rgba(235,142,182,0.7)", borderColor: "#eb8eb6" }
];
// var trafficWay = [];
var getdata = [];
var color = ["#00ffff", "#00cfff", "#006ced", "#ffe000", "#ffa800", "#ff5b00", "#ff3000"];
function mapTrafficWay(trafficWay = []) {
  for (var i = 0; i < trafficWay.length; i++) {
    getdata.push(
      {
        value: trafficWay[i].value,
        name: trafficWay[i].thingName,
        itemStyle: {
          normal: {
            borderWidth: 2,
            shadowBlur: 20,
            borderColor: colors[i].borderColor,
            shadowColor: colors[i].bg
          }
        }
      },
      {
        value: 240,
        name: "",
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 0)",
            borderWidth: 0
          }
        }
      }
    );
  }
}

// var seriesOption = [];
export default {
  name: "clearChart",
  // components: { LineBarCharts },
  props: {
    energyType: { type: String, default: () => "" },
    dateRange: { type: Array, default: () => [] },
    color: {
      type: String,
      default: () => "rgba(103,194,58,1)"
    },
    color1: {
      type: String,
      default: () => "rgba(114,187,78,1)"
    },
    maxValue: {
      type: [String, Number],
      default: () => 100
    }
  },
  setup(props) {
    var myChart;
    const energyMakeUpRef = ref();
    // const store = useStore();
    const state = reactive({
      radio1: 1,
      newLrdEchartStep: {},
      colorChart: [
        "#85FCC5",
        "#01F2F2",
        "#2a43e1",
        "#61DDAA",
        "#b6dd10",
        "#2FC25B",
        "#9661BC",
        "#F19D9D"
      ],
      average: 0,
      refreshChart: true,
      echartTitle: "单位:kWh",
      dateOption: {
        dateOther: "",
        date: "",
        type: "year"
      },
      yAxisName: "",
      echartLoading: false,
      legendColor: "#ffffff",
      existingBar: true,
      colors: "#4B6BAA",
      trafficWay: []
    });
    // const legendColor = computed(() => (store.state.skinStyle === "1" ? "#333" : "#ffffff"));
    // const existingBar = computed(() => true);
    // const colors = computed(() => (store.state.skinStyle === "1" ? "rgb(232,232,228)" : "#4B6BAA"));
    onMounted(() => {
      init();
    });

    const init = async () => {
      //   let { data } = await baseService.get("/board/monthEnergy/proportion", { key: props.energyType, month: moment(new Date()).format("YYYY-MM") });
      // trafficWay = data;
      const data = [
        {
          thingName: "二层3#生产线",
          value: 4608.8
        },
        {
          thingName: "一层照明",
          value: 4285.6
        },
        {
          thingName: "三层视频监控",
          value: 2249.12
        },
        {
          thingName: "二层照明（南）",
          value: 1857.39
        },
        {
          thingName: "大厅客梯",
          value: 233.83
        },
        {
          thingName: "三层瓶盖库",
          value: 101.34
        },
        {
          thingName: "应急照明",
          value: 80.604
        },
        {
          thingName: "三层洗盖机",
          value: 75.81
        },
        {
          thingName: "2#货梯",
          value: 17.26
        },
        {
          thingName: "1#货梯",
          value: 14.94
        }
      ];

      let dataArr = [];
      for (var i = 0; i < 100; i++) {
        if (i % 2 === 0) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 25,
            itemStyle: {
              normal: {
                color: props.color1,
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)"
              }
            }
          });
        } else {
          dataArr.push({
            name: (i + 1).toString(),
            value: 20,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)"
              }
            }
          });
        }
      }

      let getvalue = ["75"];
      const option = {
        angleAxis: {
          max: props.maxValue,
          clockwise: false, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ["50%", "50%"],
          radius: "146%" //图形大小
        },
        series: [
          {
            type: "pie",
            zlevel: 3,
            silent: true,
            center: ["50%", "50%"],
            radius: ["91%", "95%"],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: dataArr
          },

          {
            type: "pie",
            name: "内层细圆环",
            radius: ["71%", "75%"],
            startAngle: 0,
            hoverAnimation: false,
            clockWise: true,
            itemStyle: {
              color: props.color
            },
            label: {
              show: false
            },
            data: [10],
            z: 99
          },
          {
            type: "bar",
            data: getvalue,
            showBackground: false,

            // backgroundStyle: {
            //   color: "red"
            // },
            coordinateSystem: "polar",
            roundCap: false,
            barWidth: 30,
            z: 999,
            itemStyle: {
              normal: {
                opacity: 1,
                color: props.color
              }
            },

            label: {
              normal: {
                position: "inside",
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                  color: props.color //跟随其他颜色
                }
              }
            }
          }
        ]
      };

      myChart = echarts.init(energyMakeUpRef.value);
      myChart.setOption(option);
    };
    watch(props, (nweProps) => {
      init();
    });
    const criculationShowTootip = function () {
      setTimeout(() => {
        let index = 0;
        const caiculationObj = criculationActionSwitch(() => {
          if (index > getdata.length) index = 0;
          myChart?.dispatchAction({
            type: "showTip",
            seriesIndex: 0, // 显示第几个series
            dataIndex: index * 2 // 显示第几个数据
          });

          index++;
        }, 4000);
        caiculationObj.action();
        // energyMakeUpRef.value?.$el.addEventListener("mouseover", () => {
        //   caiculationObj.isAction = false;
        // });
        // energyMakeUpRef.value?.$el.addEventListener("mouseout", () => {
        //   caiculationObj.isAction = true;
        // });
      }, 2000);
    };
    //criculationShowTootip();
    return {
      isCheck: true,
      resourceType: "",
      energyMakeUpRef,
      //   legendColor,
      //   existingBar,
      //   colors,
      ...toRefs(state)
    };
  }
};
</script>
