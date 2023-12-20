<!--
1.originData数据源要从小到大排列
-->
<template>
  <section class="two deviceError">
    <div class="content-container">
      <div class="top">
        <section>
          <div>设备名称</div>
          <div>报警内容</div>
          <div>时间</div>
        </section>
      </div>

      <div class="center">
        <div class="box-contain">
          <section class="content" v-for="(item, key) in originData" :key="key">
            <!-- <div>1#</div> -->
            <section>
              <div>{{ item.Name }}</div>
              <div>{{ item.Alarm }}</div>
              <div>
                {{ item.Time }}
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
import { ref, reactive, toRefs, onMounted, watch, nextTick } from "vue";
import { lrdEchart } from "@/utils/utils.ts";
import * as echarts from "echarts";
import http from "@/utils/request";
import { scrollItem } from "@/utils/index.js";
import { useRoute } from "vue-router";

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
      dataRight: [
        { Name: "A-047", Alarm: "1", Time: "2023-12-11 17:00:35" },
        { Name: "A-047", Alarm: "2", Time: "2023-12-11 17:00:35" },
        { Name: "A-047", Alarm: "3", Time: "2023-12-11 17:00:35" },
        { Name: "A-047", Alarm: "4", Time: "2023-12-11 17:00:35" }
      ],
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

    // const newLrdEchartStep = ref(
    //   new lrdEchart({ dateType: "month", decimalDigits: 4, currentDate: "2022-07" })
    // );
    onMounted(async () => {
      await init();
      await nextTick();
      if (state.originData.length > 6) {
        scrollItem({
          contentEl: document.querySelector(".deviceError .box-contain"),
          speed: 0.5,
          orient: "vertical"
        });
      }
    });

    const init = async (device) => {
      //  URL：/api/screen2/device/alarm
      return http.post("/api/screen2/device/alarm", { ID: route.query.id || "1" }).then((res) => {
        state.originData = res.Data;
        // state.originData.push(
        //   ...[
        //     { Name: "A-047", Alarm: "1", Time: "2023-12-11 17:00:35" },
        //     { Name: "A-047", Alarm: "2", Time: "2023-12-11 17:00:35" },
        //     { Name: "A-047", Alarm: "3", Time: "2023-12-11 17:00:35" },
        //     { Name: "A-047", Alarm: "4", Time: "2023-12-11 17:00:35" }
        //   ]
        // );
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
.two {
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
