<template>
  <v-chart ref="baseChart" :autoresize="true" :option="options"></v-chart>
</template>
<script>
import { criculationActionSwitch, numShortens } from "@/utils/index";

export default {
  name: "decorateEchart",
  data() {
    return {
      seriesIndex: 0,
      dataIndex: 0,
      toolTipRendered: false
    };
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    //设置Y轴最高值
    average: {
      type: Number,
      default() {
        return null;
      }
    },
    //告警线
    giveAnAlarmL: {
      type: Array,
      default: () => []
    },

    //是否显示底部缩放模块
    showDataZoom: {
      type: Boolean,
      default: true
    },
    //缩放范围设置
    zoomList: {
      type: Array,
      default() {
        return [];
      }
    },

    title: {
      type: Object,
      default() {
        return {};
      }
    },
    xAxisData: {
      type: Array,
      require: true,
      default: () => []
    },

    xAxisParam: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },

    //x轴格式化显示出对应中文字段
    xAxisLabelFormatter: {
      type: Function,
      default: function (value) {
        return value;
      }
    },

    //x轴和y轴文字颜色
    axisLabelColor: {
      type: String,
      default: "#666"
    },

    //y轴标题(说明)
    yAxisName: {
      type: String,
      default: ""
    },

    yAxisParam: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },

    grid: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },
    tooltip: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },

    //颜色组，应用于图例及图表对应的颜色
    colors: {
      type: Array,
      default: () => []
    },
    //切换图表类型，仅限于折线和柱状图切换使用。复杂点请自行新建组件
    chartType: {
      type: String,
      default: ""
    },
    //serious 最大值
    markPointParam: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },
    legendParam: {
      type: Object,
      default: () => {
        return { right: "1%", top: "2%", bottom: "2%", padding: [0, 0, 0, 105] };
      }
    },
    //是否显示图例
    legendShow: {
      type: Boolean,
      default: true
    },
    // 编辑图表上的线和点等样式
    seriesParam: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },
    //serious 图形去填充样式
    areaStyleList: {
      type: Array,
      default() {
        return [];
      }
    },
    //柱条或者拐点样式
    seriesItemStyle: {
      type: Object,
      require: false,
      default() {
        return {};
      }
    },
    //是否选中最后一条数据进行展示弹出框
    showDefaultTipAction: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.setChart(this.data);
    }
  },
  mounted() {
    // if (this.showDefaultTipAction) this.showDefaultTip();
    //this.criculationShowTootip();
  },
  methods: {
    //自动循环展示tootip
    criculationShowTootip() {
      setTimeout(() => {
        let index = 0;
        this.caiculationObj = criculationActionSwitch(() => {
          if (index > this.dataIndex) index = 0;
          this.$refs.baseChart?.dispatchAction({
            type: "showTip",
            seriesIndex: this.seriesIndex, // 显示第几个series
            dataIndex: index // 显示第几个数据
          });
          index++;
        }, 4000);
        this.caiculationObj.action();
        this.$refs.baseChart?.$el.addEventListener("mouseover", () => {
          this.caiculationObj.isAction = false;
        });
        this.$refs.baseChart?.$el.addEventListener("mouseout", () => {
          this.caiculationObj.isAction = true;
        });
      }, 2000);
    },

    // 显示默认最后一个数据的提示
    showDefaultTip() {
      setTimeout(() => {
        if (this.$refs.baseChart) {
          this.$refs.baseChart.dispatchAction({
            type: "showTip",
            seriesIndex: this.seriesIndex, // 显示第几个series
            dataIndex: this.dataIndex // 显示第几个数据
          });
        }
      }, 150);
    },
    getSeries(val) {
      const list = val.map((item, index) => {
        const arr = item.list
          .reduce((total, childitem, index) => {
            if (childitem !== "") {
              total.push({
                key: index,
                value: childitem
              });
            }
            return total;
          }, [])
          .filter((item) => item.value)
          .map((item) => item.key);
        return {
          index,
          arr: arr[arr.length - 1]
        };
      });
      const findItem = list.sort((a, b) => {
        return b.arr - a.arr;
      })[0];
      const { index, arr } = findItem || {};
      this.dataIndex = arr;
      this.seriesIndex = index;

      // 找到最后一条数据画tooltip
      const seriesList = val.map((item, index) => {
        return {
          connectNulls: true,
          label: {
            show: false,
            position: "top",
            textStyle: {
              color: "#555"
            },
            borderRadius: 3,
            padding: 2,
            backgroundColor: "white",
            formatter: (val) => {
              const list = item.list.filter((item) => item);
              const maxNum = Math.max.apply(null, list);
              const minNum = Math.min.apply(null, list);
              let value = "";
              if (maxNum === val.value) value = maxNum;
              if (minNum === val.value) value = minNum;
              return value;
            }
          },
          itemStyle: {
            normal: {
              borderColor: this.colors[index],
              shadowColor: "rgba(0, 0, 0, 0.4)",

              ...this.seriesItemStyle
            }
          },
          name: item.name,
          type: this.chartType,
          // stack: 'total',
          markLine: {
            position: "middle",
            data: this.giveAnAlarmL
          },
          min: function (value) {
            if (value.min === 1) {
              return 0;
            }
            return Math.round(value.min * 0.9);
          },
          max: function (value) {
            if (value.max === 1) {
              return value.max;
            }
            return Math.ceil(value.max * 1.1);
          },
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ],
            itemStyle: {
              opacity: 0.6
            },
            symbolSize: [50, 40],
            ...this.markPointParam
          },
          lineStyle: {
            normal: {
              width: 2.5,
              shadowColor: "rgba(115,221,255, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
              shadowOffsetX: 4
            }
          },
          symbolSize: 5,
          a: false,
          symbol: "circle",
          smooth: true,

          data: item.list,

          ...this.seriesParam,
          ...item.seriesParam
        };
      });

      // 设置这件图区域
      // seriesList.forEach((item, index) => {
      //   if (this.areaStyleList[index]) {
      //     item.areaStyle = this.areaStyleList[index];
      //   }
      // });
      return seriesList;
    },
    setChart(originData) {
      const vm = this;
      // 指定图表的配置项和数据
      const option = {
        itemStyle: {
          // borderColor: '#304352',
          borderWidth: 2,
          // barBorderRadius: [4, 4, 2, 2],
          shadowColor: "rgba(0, 0, 0, 0.4)",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          opacity: 0.9
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.2)",
            borderColor: "white",
            opacity: 1
          }
        },
        title: {
          // subtext: this.subTitle,
          left: 30,
          textStyle: {
            color: "#333",
            fontWeight: "bold",
            fontSize: 16
          },
          ...this.title
        },

        dataZoom: [
          {
            realtime: true,
            type: "inside",

            startValue: this.zoomList.length ? String(this.zoomList[0]) : 0,
            endValue: this.zoomList.length ? String(this.zoomList[1]) : 100
          },
          {
            type: "slider",
            show: this.showDataZoom,
            bottom: 10,
            showDetail: true,
            labelFormatter: function (value) {
              return "";
            }
          }
        ],
        color: this.colors,
        grid: {
          left: 30,
          right: 30,
          bottom: 40,
          top: 82,
          containLabel: true,
          ...this.grid
        },

        tooltip: {
          trigger: "axis",
          borderWidth: 1,
          padding: 10,
          borderColor: "rgba(50, 50, 50, 0.7)",
          backgroundColor: "rgba(50, 50, 50, 0.7)",
          textStyle: {
            color: "rgb(255, 255, 255)"
          },
          // formatter: (params) => {
          //   const strings = params.reduce(
          //     (total, item) => {
          //       console.log(item);
          //       total.push(`${item.marker} ${item.seriesName}: ${formatValue(item.value)}`);
          //       return total;
          //     },
          //     [this.xAxisLabelFormatter(params[0].name)]
          //   );
          //   return strings.join("<br />");
          // },
          ...this.tooltip
        },
        legend: {
          show: this.legendShow,
          ...this.legendParam
        },

        xAxis: {
          type: "category",
          splitLine: { show: true, lineStyle: { color: ["#e8e8e8"] } },
          axisLabel: {
            color: this.axisLabelColor,
            formatter: this.xAxisLabelFormatter
          },
          boundaryGap: false, //xAxis刻度值是否从最左边开始(图表或者折现是否贴着yXis开始)
          axisLine: {
            onZero: false,
            lineStyle: { color: "#0c73a5", width: 2 }
          },
          ...this.xAxisParam,
          data: this.xAxisData
        },

        yAxis: {
          type: "value",
          name: this.yAxisName,
          nameGap: 36,
          nameTextStyle: {
            padding: [0, 0, 0, 30]
          },
          min: function (value) {
            if (value.min > 0) return Math.floor(value.min);
            if (value.min < 0) return Math.floor(value.min * 1.2);
          },
          axisLine: { show: true, lineStyle: { color: "#0c73a5", width: 5 } },
          axisTick: { show: false },
          axisLabel: {
            color: this.axisLabelColor,
            width: 150,
            formatter(value) {
              if (value < 1) return value;
              return numShortens(value, 1);
            },
            rich: {}
          },
          splitLine: { show: true, lineStyle: { color: ["#e8e8e8"] } },
          splitArea: {
            show: false,
            areaStyle: { color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"] }
          },
          max: (value) => {
            if (value.max < this.average || 0) {
              return this.average * 1.1;
            }
            return value.max;
          },
          ...this.yAxisParam
        },
        series: this.getSeries(originData)
      };
      return option;
    }
  }
};

function formatValue(val) {
  if ((val ?? " ") !== " ") {
    return val;
  } else {
    return "--";
  }
}
</script>
