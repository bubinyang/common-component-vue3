<!--
1.originData数据源要从小到大排列

"MOCode" /*生产订单号*/: "2302066677",
            "InvName" /*产品名称*/: "输出行星架1",
            "Device" /*设备名称*/: "B-056",
            "Procedure" /*工序名称*/: "平面磨",
            "Quantity" /*任务数量*/: 10,
            "Completed" /*完成数量*/: 0,
            "Rate" /*完成率 %*/: 0

-->
<template>
  <section class="orders-style">
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
          <section class="content" v-for="(item, key) in originData" :key="key">
            <!-- <div>1#</div> -->
            <section>
              <div>{{ item.MOCode }}</div>
              <div>{{ item.Quantity }}</div>
              <div>
                {{ item.Completed }}
              </div>
              <div>{{ item.Rate }}%</div>
            </section>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import { reactive, toRefs, onMounted, watch } from "vue";
import { ref, reactive, toRefs, onMounted, watch, onUnmounted, onBeforeMount, nextTick } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
import { scrollItem } from "@/utils/index.js";
import http from "@/utils/request";

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
      }
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
      dataRight: [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }],
      originData: []
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

    onMounted(async () => {
      await init();
      await nextTick();
      oneInterval = scrollItem({
        contentEl: document.querySelector(".orders-style .box-contain"),
        speed: 0.5,
        orient: "vertical"
      });
    });

    onUnmounted(() => {
      cancelAnimationFrame(oneInterval);
    });

    const init = async (device) => {
      return http.post("/api/screen2/task/list", { ID: "1" }).then((res) => {
        state.originData = res.Data;
      });
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

    // background: rgba(34, 229, 229, 0.05);
    // background: url("@/assets/images/box-bg.png") no-repeat;
    // background-size: 747px 416px;
    // padding: 11px 23px 14px 23px;
  }

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
    height: 600px;
    overflow: hidden;
    color: #e6e6fe;
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
