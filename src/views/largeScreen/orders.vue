<!--
1.originData数据源要从小到大排列
-->
<template>
  <section class="two">
    <div class="content-container">
      <div class="top">
        <section>
          <div>单号</div>
          <div>预产量</div>
          <div>实际产量</div>
          <div>完成率</div>
        </section>
      </div>

      <div class="center">
        <div class="box-contain">
          <section class="content" v-for="(item, key) in dataRight" :key="key">
            <!-- <div>1#</div> -->
            <section>
              <div>{{ item.name }}</div>
              <div>{{ item.content }}</div>
              <div>
                {{ item.time }}
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  </section>
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
      label: {
        formatter: function (param) {
          return param.name;
        },
        show: true,
        // offset: [0, -2],
        textStyle: {
          fontSize: 12,
          color: "white"
        }
        // position: "insideBottomLeft"
      }

      // label: { show: true, position: "right" },
      // barWidth: 10,
      //showBackground: true

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

      // backgroundStyle: {
      //   barBorderRadius: 30
      // },
      // itemStyle: {
      //   normal: {
      //     barBorderRadius: 30
      //   }
      // }
    }
  },

  {
    attrKey: "A29",
    list: [],
    name: "当月",
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
      }

      // label: { show: true, position: "right" },
      // barWidth: 10,
      //  showBackground: true

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

      // backgroundStyle: {
      //   barBorderRadius: 30
      // },
      // itemStyle: {
      //   normal: {
      //     barBorderRadius: 30
      //   }
      // }
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
      dataZoom: [],
      dataRight: [{ name: "1" }]
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
      // init();
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
      originData[0].list = [
        {
          value: 900,
          itemStyle: { color: "rgba(27, 105, 208, 1)" }
        },
        {
          value: 1000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1100,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1200,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1300,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1400,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 1500,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        },
        {
          value: 2000,
          itemStyle: { color: "rgba(11, 197, 197, 1)" }
        }
      ];

      originData[1].list = [
        {
          value: 200,
          itemStyle: { color: "blue" }
        },
        {
          value: 500,
          itemStyle: { color: "blue" }
        },
        {
          value: 550,
          itemStyle: { color: "blue" }
        },
        {
          value: 600,
          itemStyle: { color: "blue" }
        },
        {
          value: 650,
          itemStyle: { color: "blue" }
        },
        {
          value: 700,
          itemStyle: { color: "blue" }
        },
        {
          value: 750,
          itemStyle: { color: "blue" }
        },
        {
          value: 1000,
          itemStyle: { color: "blue" }
        }
      ];

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

<style lang="scss">
.top {
  // width: calc(100% - 10px);
  color: #00ffff;
  & > section {
    flex: 1;
    display: flex;
    // padding-right: 10px;
    // @include clearfix(#0a3358, rgba(0, 97, 255, 0.8), #00d1ff);

    div {
      @include contentCenter;
      flex: 1;
      height: 40px;

      &:first-child,
      &:last-child {
        flex: 0 0 100px;
      }
    }
  }
  svg {
    position: relative;
    right: 10px;
  }
}
.center {
  display: block;
  height: 300px;
  overflow: hidden;
  .content {
    & > section {
      display: flex;
      flex: 1;
      div {
        flex: 1;
        // border-bottom: 1px solid #00a3ff;
        height: 50px;
        @include contentCenter;

        &:first-child,
        &:last-child {
          flex: 0 0 100px;
        }
      }
    }
  }
}

.two {
  flex: 1;
  .content-container {
    height: 100%;

    // background: rgba(34, 229, 229, 0.05);
    // background: url("@/assets/images/box-bg.png") no-repeat;
    // background-size: 747px 416px;
    // padding: 11px 23px 14px 23px;
    h1 {
      font-size: 20px;
      color: #00ffff;
    }
  }
}
</style>
