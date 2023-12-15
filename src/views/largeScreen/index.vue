<template>
  <section class="largeScreen-contain">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="screen-top">
        <div>
          <h1>运行</h1>
          <label>{{ topData.Running }}</label>
        </div>

        <div>
          <h1>待机</h1>
          <label>{{ topData.Standby }}</label>
        </div>

        <div>
          <h1>调试</h1>
          <label>{{ topData.Debugging }}</label>
        </div>
        <div>
          <h1>报警</h1>
          <label>{{ topData.Alarm }}</label>
        </div>
        <div>
          <h1>离线</h1>
          <label>{{ topData.Offline }}</label>
        </div>
      </div>

      <section class="screen-main-content">
        <section class="screen-main-l">
          <SmallContain :title="'设备状态'">
            <two v-if="refresAllDayPoint"></two>
          </SmallContain>

          <SmallContain :title="'设备异常'">
            <template #action> </template>

            <deviceError v-if="refresAllDayPoint"></deviceError>
          </SmallContain>
        </section>

        <section class="screen-main-bottom">
          <SmallContain :title="'设备利用率'">
            <three v-if="refresAllDayPoint"></three>
          </SmallContain>
        </section>

        <section class="screen-main-center">
          <!-- <mapModule :ratio="ratio" /> -->
          <device v-if="refresAllDayPoint"></device>
        </section>

        <section class="screen-main-r">
          <SmallContain :title="'订单完成'">
            <orders v-if="refresAllDayPoint"></orders>
          </SmallContain>
        </section>
      </section>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import chartBar from "@/views/largeScreen/chartBar.vue";
import one from "./one.vue";
import two from "./two.vue";
import three from "./three.vue";
import four from "./four.vue";
import five from "./five.vue";
import deviceError from "./deviceError.vue";
import orders from "./orders.vue";
import device from "./devices.vue";
import http from "@/utils/request";

export default {
  name: "LargeScreen",
  components: { two, orders, deviceError, three, device },
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
      refresAllDayPoint: false
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
      http.post("/api/screen2/device/state", { ID: "1" }).then((res) => {
        this.topData = res.Data;
      });
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
.largeScreen-contain {
  width: 100%;
  background: url("@/assets/img/home/bg.png");
  .screen-top {
    height: 80px;
    display: flex;
    color: #e6e6fe;
    position: absolute;
    z-index: 2;
    left: 450px;
    right: 450px;
    /* right: 450px; */
    h1 {
      color: #e6e6fe;
    }
    & > div {
      flex: 1;
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

    .screen-main-l {
      position: absolute;
      height: calc(100% - 317px);
      width: 450px;
      display: flex;
      z-index: 2;
      left: 0;
      flex-direction: column;
      padding: 20px;
    }

    .screen-main-r {
      position: absolute;
      height: calc(100% - 317px);
      width: 450px;
      display: flex;
      z-index: 2;
      right: 0;
      flex-direction: column;
      padding: 20px;
    }

    .screen-main-center {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      //background: url("@/assets/img/home/zybg.jpg");
      z-index: 1;
    }

    .screen-main-bottom {
      position: absolute;
      height: 317px;
      width: 100%;
      bottom: 0;
      background: rgba(36, 38, 110, 0.9);
      display: flex;
    }

    .screen-main-l,
    .screen-main-r,
    .screen-main-bottom {
      .small-contain {
        // background: rgba(37, 42, 162, 0.8);
        background: rgba(36, 38, 110, 0.9);
        border: 0;
        flex: 1;
        margin: 15px 0;
        .small-contain-title {
          .title {
            background: linear-gradient(45deg, #ffffff 0%, #88d7f7 30.044921875%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            justify-content: flex-start;
            font-size: 18px;
            position: relative;
            top: 10px;
            left: 10px;
            // top: 13px;
            // left: 5px;
            color: rgb(119, 141, 241);
            font-weight: bold;
            border-left: 8px solid rgb(17, 184, 236);
            padding: 3px 0 0 10px;
          }
          label {
            color: white;
            position: relative;
            // top: 10px;
            // right: 10px;
          }
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
