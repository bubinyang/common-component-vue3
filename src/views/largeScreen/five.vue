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
      }
      // {
      //   value: 60,
      //   name: "",
      //   itemStyle: {
      //     normal: {
      //       label: {
      //         show: false
      //       },
      //       labelLine: {
      //         show: false
      //       },
      //       color: "rgba(0, 0, 0, 0)",
      //       borderColor: "rgba(0, 0, 0, 0)",
      //       borderWidth: 0
      //     }
      //   }
      // }
    );
  }
}

// var seriesOption = [];
export default {
  name: "clearChart",
  // components: { LineBarCharts },
  props: {
    energyType: { type: String, default: () => "" },
    dateRange: { type: Array, default: () => [] }
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
      getdata = [];
      mapTrafficWay(data);
      // seriesOption[0].data = getdata;
      const option = {
        color: colors.map((item) => item.bg),
        title: {
          text: "",
          top: "48%",
          textAlign: "center",
          left: "49%",
          textStyle: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "400"
          }
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: makeup,
                width: 80,
                height: 80
              },
              //   top: "center",
              left: "center",
              top: "center",

              keyframeAnimation: [
                {
                  // 平移动画
                  duration: 15000,
                  loop: true,
                  keyframes: [
                    {
                      // percent为关键帧的位置,0为第一个,1为最后一个
                      percent: 0,
                      easing: "linear",
                      rotation: 0,
                      transition: ["rotation"]
                    },
                    {
                      percent: 1,
                      easing: "linear",
                      // 旋转角度采用弧度值
                      rotation: Math.PI * 2,
                      transition: ["rotation"]
                    }
                  ]
                }
              ],
              origin: [40, 40]
            }
          ]
        },
        tooltip: {
          show: true,
          backgroundColor: "rgba(50, 50, 50, 0.7)",
          textStyle: { color: "#00fefd" },

          axisName: {
            //4.0 后配置有更换
            color: "rgb(255, 255, 255)"
          },
          formatter: (params) => {
            const strings = [];

            return `${params.marker}  ${params.data.name}    ${params.data.value}kWh   ${params.percent}%`;
          }
        },
        legend: {
          icon: "roundRect",
          orient: "vertical",
          // x: 'left',
          // data: ['js', 'ts', 'Vue'],
          itemHeight: 8,
          itemWidth: 20,
          top: 10,
          right: 0,
          align: "right",
          textStyle: {
            color: "#fff"
          },
          itemGap: 2,
          formatter: function (name) {
            // return name.length > 4 ? name.substring(0, 3) + "..." : name + " ";
            return name;
          }
        },
        toolbox: {
          show: false
        },
        series: [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: [79, 70],
            avoidLabelOverlap: true,
            hoverAnimation: false,
            center: [230, 150],

            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "outside",
                  color: "#D3E1F0",
                  // formatter: function (params) {
                  //   console.log(params);
                  //   var percent = 0;
                  //   var total = 0;
                  //   for (var i = 0; i < data.length; i++) {
                  //     total += data[i].value;
                  //   }
                  //   percent = ((params.value / total) * 100).toFixed(0);
                  //   if (params.name !== "") {
                  //     // return (params.name.length > 4 ? params.name.substring(0, 3) + "..." : params.name + " ") + percent + "%";
                  //     // return `<div style="color:#ffffff">${params.name}</div>`;
                  //     return params.name + params.percent + "%";
                  //   } else {
                  //     return "";
                  //   }
                  // }
                  //formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c|{c}}  {per|{d}%}   '
                  formatter: "{b|{b}} {per|{d}%}\n{c|{c}} kWh ",
                  rich: {
                    a: {
                      color: "#CEF0DA",
                      lineHeight: 22,
                      align: "center"
                    },
                    b: {
                      color: "#CEF0DA",
                      fontSize: 14,
                      fontWeight: "normal",
                      lineHeight: 33
                    },
                    per: {
                      color: "#fff",
                      padding: [3, 4]
                    },
                    c: {
                      fontSize: 16
                    }
                  }
                },
                labelLine: {
                  length: 10,
                  length2: 10,
                  show: true,
                  color: "white"
                  //color: "#00ffff"
                }
              }
            },
            data: getdata
          }
        ],
        animation: {
          duration: 2000, // 动画持续时间
          easing: "linear" // 线性动画
        }
      };

      // option.animation.onFrame = function (percent) {
      //   // 根据时间百分比设置旋转角度
      //   option.graphic[0].style.rotation = percent * 360 * (Math.PI / 180); // 转换为弧度
      //   return option;
      // };

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
