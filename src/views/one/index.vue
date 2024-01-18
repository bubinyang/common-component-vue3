<template>
  <section class="largeScreen-contain largeScreen-containone">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="titles">{{ name }}</div>

      <section class="screen-main-content">
        <section class="screen-main-l">
          <SmallContain :title="'一次气密不良'">
            <!-- <twoNew v-if="refresAllDayPoint"></twoNew> -->
            <chartBar></chartBar>
          </SmallContain>

          <SmallContain :title="'启动力矩'">
            <template #action> </template>
            <three v-if="refresAllDayPoint"></three>
          </SmallContain>
        </section>

        <!-- <section class="screen-main-bottom">
          <SmallContain :title="'设备利用率'">
            <three v-if="refresAllDayPoint"></three>
          </SmallContain>
        </section> -->

        <section class="screen-main-center">
          <div class="center-contain">
            <SmallContain class="pie1" :title="'生产总览'">
              <!-- <twoNew v-if="refresAllDayPoint"></twoNew> -->
              <div class="pie1-contain">
                <div class="pie1-box" v-for="(item, index) in list" :key="index">
                  <pie1 :color="item.color" :color1="item.color1"></pie1>
                </div>
              </div>
            </SmallContain>

            <SmallContain :title="'一次校验不合格率'">
              <!-- <twoNew v-if="refresAllDayPoint"></twoNew> -->
              <chartBar1></chartBar1>
            </SmallContain>
          </div>
        </section>

        <section class="screen-main-r">
          <SmallContain :title="'报修清单'">
            <orders v-if="refresAllDayPoint"></orders>
          </SmallContain>

          <SmallContain :title="'一次下线合格率'">
            <!-- <twoNew v-if="refresAllDayPoint"></twoNew> -->
            <chartBar2></chartBar2>
          </SmallContain>
        </section>
      </section>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import chartBar from "./chartBar.vue";
import chartBar1 from "./chartBar1.vue";
import chartBar2 from "./chartBar2.vue";

import one from "./one.vue";
import two from "./two.vue";
import three from "./three.vue";
import four from "./four.vue";
import five from "./five.vue";
import deviceError from "./deviceError.vue";
import orders from "./orders.vue";
import device from "./devices.vue";
import pie1 from "./pie1.vue";

import http from "@/utils/requestone";
import twoNew from "./twoNew.vue";

export default {
  name: "LargeScreen",
  components: {
    two,
    orders,
    deviceError,
    three,
    device,
    twoNew,
    chartBar,
    chartBar1,
    chartBar2,
    pie1
  },
  data() {
    return {
      timeVal: "",
      top_bg: "",
      ratio: 2,
      waterpumpValueA: "A",
      energyType: "电",
      waterpumpA: [
        { dictValue: "A", dictLabel: "电" },
        { dictValue: "W", dictLabel: "水" }
      ],
      rankDate: "",
      topData: {},
      refresAllDayPoint: false,
      name: "",
      list: [
        { color: "#1C8A33", color1: "#B7FF81" },
        { color: "#76027E", color1: "#F71780" },
        { color: "#F23200", color1: "#DCFF19" },
        { color: "#2660D6", color1: "#04B8F8" },
        { color: "#0E4B90", color1: "#04B8F8" },
        { color: "#952037", color1: "#ECB5CF" }
      ]
    };
  },
  created() {
    // setInterval(() => {
    //   this.setTime();
    // }, 1000);
  },
  mounted() {
    const updateData = () => {
      this.refreshComponent();
      this.init();
      setTimeout(updateData, 300000);
    };
    updateData();
    // http.post("/api/line/name", { ID: this.$route.query.id || "1" }).then((res) => {
    //   this.name = res.Data;
    // });
  },
  methods: {
    setTime() {
      const date = this.$moment().format("YYYY-MM-DD");
      const time = this.$moment().format("HH:mm:ss");
      const week = this.$moment().day();
      this.timeVal = `${date}    星期${getWeek(week)}    ${time}`;
    },
    emitRatio(data) {
      this.ratio = data;
    },
    init() {
      // http.get("/kb/kb1").then((res) => {
      //   console.log(res, 110);
      // });
    },

    refreshComponent() {
      this.refresAllDayPoint = false;
      this.$nextTick(() => {
        this.refresAllDayPoint = true;
      });
    }
  }
};
</script>
<style lang="scss">
.largeScreen-containone {
  width: 100%;
  background: url("@/assets/img/home/board_bg.png");
  background-size: contain;
  .titles {
    height: 77px;
    width: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 40px;
    background: url("@/assets/img/home/board_head.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
  .screen-top {
    height: 80px;
    display: flex;
    color: #e6e6fe;
    position: absolute;
    z-index: 2;
    left: 450px;
    right: 450px;
    top: 80px;
    justify-content: space-between;
    /* right: 450px; */
    h1 {
      color: #e6e6fe;
    }
    & > div {
      flex: 0 0 195px;
      background: rgba(36, 38, 110, 0.6);
      display: flex;
      flex-direction: column;
      padding: 10px;
      label {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .time-show {
      position: absolute;
      left: 28px;
      bottom: 0;
      color: white;
      font-size: 20px;
    }

    .screen-top-title {
      // background: linear-gradient(180deg, #ffffff 30%, #0091f6 100.044921875%);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
      font-size: 52px;
      position: relative;
      bottom: 5px;
    }
    .screen-top-title-l,
    .screen-top-title-r {
      flex: 1;
      height: 35px;
      background-size: cover;
    }
  }

  .screen-main-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 100px;

    .screen-main-l {
      position: absolute;
      height: 100%;
      width: 540px;
      display: flex;
      z-index: 2;
      left: 0;
      flex-direction: column;
      padding: 5px 10px;
    }

    .screen-main-r {
      position: absolute;
      height: 100%;
      width: 540px;
      display: flex;
      z-index: 2;
      right: 0;
      flex-direction: column;
      padding: 5px 10px;
    }

    .screen-main-center {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      //background: url("@/assets/img/home/zybg.jpg");
      z-index: 1;
      .center-contain {
        width: 850px;
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
      }
      .pie1 {
        .pie1-contain {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
        }

        .small-contain-contain {
          padding: 50px;
        }
        .pie1-box {
          flex: 0 0 33%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .screen-main-bottom {
      position: absolute;
      height: 317px;
      bottom: 0;
      display: flex;
      right: 10px;
      left: 10px;
      bottom: 5px;
    }

    .screen-main-l,
    .screen-main-r,
    .screen-main-center {
      .small-contain {
        // background: rgba(37, 42, 162, 0.8);
        // background: rgba(36, 38, 110, 0.6);
        background: url("@/assets/img/home/box_bg.png") no-repeat;
        background-size: 100% 100%;
        border: 0;
        flex: 1;
        margin: 15px 0;
        .small-contain-title {
          .title {
            background: linear-gradient(45deg, #ffffff 0%, #88d7f7 15.044921875%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            justify-content: flex-start;
            font-size: 18px;
            position: relative;
            top: 10px;
            left: 30px;
            // top: 13px;
            // left: 5px;
            color: rgb(119, 141, 241);
            // border-left: 8px solid rgb(17, 184, 236);
            padding: 3px 0 0 10px;
            font-family: PangMenZhengDaoBiao;
          }
          label {
            color: white;
            position: relative;
            // top: 10px;
            // right: 10px;
          }
        }
        .small-contain-contain {
          padding: 20px;
        }
      }
    }
  }

  .el-radio-group {
    right: 30px;
    position: absolute;
    .el-radio-button {
      margin: 0 5px;
    }
    .el-radio-button__inner {
      padding: 0;
      height: 21px;
      width: 47px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: #0277d0;
      //background: url("@/assets/images/home/unselected.png") no-repeat;
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      border: 1px solid white;
      // background: url("@/assets/images/home/selected.png") no-repeat;
      background-color: initial;
      border: 0;
      box-shadow: none;
    }
  }
}

//elementui控件
</style>
