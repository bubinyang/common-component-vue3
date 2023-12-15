<!--
1.originData数据源要从小到大排列
-->
<template>
  <section class="orders-style">
    <div class="content-container">
      <div class="top">
        <section>
          <div>订单号</div>
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
              <div>{{ item.MOCode }}</div>
              <div>{{ item.Quantity }}</div>
              <div>{{ item.Completed }}</div>
              <div>
                {{ item.Rate }}
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
import { ref, reactive, toRefs, onMounted, watch, onUnmounted } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
import { scrollItem } from "@/utils/index.js";
import http from "@/utils/request";

//        oneInterval = scrollItem({ contentEl: document.querySelector(".one .box-contain"), speed: 0.5, orient: "vertical" });
// onUnmounted(() => {
//       cancelAnimationFrame(oneInterval);
//       cancelAnimationFrame(twoInterval);
//     });

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
let oneInterval;
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
      dataRight: [
        { MOCode: "1", Quantity: "10", Completed: "1", Rate: 40 },
        { MOCode: "2", Quantity: "10", Completed: "1", Rate: 40 }
      ]
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

      oneInterval = scrollItem({
        contentEl: document.querySelector(".orders-style .box-contain"),
        speed: 0.5,
        orient: "vertical"
      });
      init();
    });

    onUnmounted(() => {
      cancelAnimationFrame(oneInterval);
    });

    const init = async (device) => {
      http.post("/api/screen1", { ID: "1" }).then((res) => {});
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
.orders-style {
  flex: 1;
  .content-container {
    height: 100%;
    color: rgb(186, 201, 250);

    // background: rgba(34, 229, 229, 0.05);
    // background: url("@/assets/images/box-bg.png") no-repeat;
    // background-size: 747px 416px;
    // padding: 11px 23px 14px 23px;
  }

  .top {
    // width: calc(100% - 10px);
    color: rgb(186, 201, 250);

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
    color: rgb(230, 230, 254);

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
}
</style>
