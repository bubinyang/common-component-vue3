<template>
  <section class="orders-style">
    <div class="content-container">
      <!-- <div class="top">
        <section>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </section>
      </div> -->

      <div class="center">
        <div class="box-contain">
          <section class="content" v-for="(item, key) in 4" :key="key">
            <i>10</i>
            <div>
              <h1>工位:</h1>
              <label class="position">OP150</label>
              <h1>报修类型:</h1>
              <label>电气维修</label>
            </div>
            <div>
              <h1>时间:</h1>
              2023-12-22 15:23:47
            </div>
            <div>
              <h1>报修内容:</h1>
              无
            </div>
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
import { useRoute } from "vue-router";

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
    const route = useRoute();

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
      // const result = await init();
      await nextTick();
      // if (state.originData.length > 32) {
      //   oneInterval = scrollItem({
      //     contentEl: document.querySelector(".orders-style .box-contain"),
      //     speed: 0.5,
      //     orient: "vertical"
      //   });
      // }

      // oneInterval = scrollItem({
      //   contentEl: document.querySelector(".orders-style .box-contain"),
      //   speed: 0.5,
      //   orient: "vertical"
      // });
    });

    onUnmounted(() => {
      cancelAnimationFrame(oneInterval);
    });

    const init = async (device) => {
      // return new Promise((resolve) => {
      //   http.post("/api/screen2/task/list", { ID: route.query.id || "1" }).then((res) => {
      //     state.originData = res.Data;
      //     resolve(res.Data);
      //   });
      // });
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
    // height: 600px;
    overflow: hidden;
    color: #e6e6fe;
    h1 {
      margin-bottom: 0;
    }
    .content {
      position: relative;
      padding-left: 50px;
      margin-right: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid;
      border-image: linear-gradient(90deg, rgba(0, 216, 247, 0) 0%, #00afed 100%) 2 2 2 2;

      i {
        font-style: normal;
        position: absolute;
        left: 20px;
        top: 20px;
      }
      & > div {
        display: flex;
        align-items: center;
        .position {
          color: rgb(133, 180, 230);
        }
        h1 {
          color: rgb(158, 165, 175);
          margin-right: 10px;
        }
      }
      // .boardBottom {
      //   //  width: 101px;
      //   width: 100%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 0;
      //   border-top: 5px dotted #fff; // dotted这个会密一点
      //   background: linear-gradient(to right, #3498db, #e74c3c);
      //   background-origin: border-box;
      // }

      // &:nth-child(2n + 2) {
      //   background: rgba(183, 162, 162, 0.3);
      // }
    }
  }
}
</style>
