<template>
  <section class="largeScreen-contain largeScreen-containone">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="top">
        <div class="titles">计划安排可视化看板</div>
      </div>
      <!--  <div class="screen-top">
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
      </div> -->

      <section class="screen-main-content">
        <section class="screen-main-l">
          <SmallContain :title="'设备状态'">
            <section class="product_title">
              <div class="product_title_one">
                <label></label>
                <h3>规格型号</h3>
                <b>NHHKH-2</b>
              </div>
              <div class="product_title_two">
                <label></label>
                <h3>规格型号</h3>
                <b>NHHKH-2</b>
              </div>
            </section>

            <section class="product_loading">
              <label></label>
              <div>
                <b></b>
              </div>
            </section>
          </SmallContain>

          <!-- <SmallContain :title="'设备异常'">
            <template #action> </template>
          </SmallContain> -->
        </section>

        <!-- <section class="screen-main-bottom">
          <SmallContain :title="'设备利用率'"> </SmallContain>
        </section> -->

        <section class="screen-main-center">
          <!-- <mapModule :ratio="ratio" /> -->
        </section>

        <section class="screen-main-r">
          <SmallContain :title="'加工任务信息'"> </SmallContain>
        </section>
      </section>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import chartBar from "@/views/largeScreen/chartBar.vue";
// import one from "./one.vue";
// import two from "./two.vue";
// import three from "./three.vue";
// import four from "./four.vue";
// import five from "./five.vue";
// import deviceError from "./deviceError.vue";
// import orders from "./orders.vue";
// import device from "./devices.vue";
import http from "@/utils/request";
//import twoNew from "./twoNew.vue";

export default {
  name: "LargeScreen",
  //   components: { two, orders, deviceError, three, device, twoNew },
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
      name: ""
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

    http.post("/api/line/name", { ID: this.$route.query.id || "1" }).then((res) => {
      this.name = res.Data;
    });
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
      http.post("/api/screen2/device/state", { ID: this.$route.query.id || "1" }).then((res) => {
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
.largeScreen-containone {
  width: 100%;
  background: url("@/assets/img/home/planArrangement/bg.png");
  background-size: contain;
  .top {
    height: 102px;
    display: flex;
    left: 0px;
    right: 0px;
    position: absolute;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 40px;
    background: url("@/assets/img/home/planArrangement/top.png");
    background-repeat: no-repeat;

    // background: rgba(36, 38, 110, 0.6);
    .titles {
      //   background: linear-gradient(180deg, #ffffff 30%, #0091f6 100.044921875%);
      //   -webkit-background-clip: text;
      //   -webkit-text-fill-color: transparent;
      text-shadow: 0 0 5px white, 0 0 10px #00ffff, 0 0 15px white, 0 0 20px white;
      font-size: 52px;
    }
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

      &:nth-child(1) {
        box-shadow: 0px 0px 30px rgb(100, 239, 104);
      }
      &:nth-child(2) {
        box-shadow: 0px 0px 30px rgb(246, 225, 21);
      }
      &:nth-child(3) {
        box-shadow: 0px 0px 30px rgb(46, 188, 226);
      }
      &:nth-child(4) {
        box-shadow: 0px 0px 30px rgb(222, 84, 57);
      }
      &:nth-child(5) {
        box-shadow: 0px 0px 30px rgb(148, 148, 148);
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

    .screen-main-l {
      position: absolute;
      height: 851px;
      width: 409px;
      display: flex;
      z-index: 2;
      top: 110px;
      left: 20px;
      flex-direction: column;
      padding: 5px 10px;
      .small-contain-contain {
        flex-direction: column;
      }
      .product_title {
        display: flex;
        width: 100%;
        justify-content: space-around;
        .product_title_one,
        .product_title_two {
          width: 169px;
          height: 79px;
          background: url("@/assets/img/home/planArrangement/item_bg.png");
          position: relative;
          label {
            display: block;
            width: 45px;
            height: 45px;
            background: url("@/assets/img/home/planArrangement/circle_1.png");
            background-repeat: no-repeat;
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
          }
          h3 {
            width: 100px;
            @include labelEllipsis;
            position: absolute;
            left: 60px;
            top: 20px;
            color: white;
            font-size: 14px;
            text-align: left;
            margin-bottom: 0;
          }
          b {
            width: 100px;
            @include labelEllipsis;
            position: absolute;
            left: 60px;
            bottom: 20px;
            color: rgb(127, 187, 243);
            text-align: left;
          }
        }
      }

      .product_loading {
        label {
          width: 114px;
          height: 114px;
          display: block;
          background: url("@/assets/img/home/planArrangement/oN.png");
        }
        div {
          border: 1px solid rgb(108, 124, 208);
          width: 200px;
          height: 30px;
          display: flex;
          padding: 3px;
          b {
            width: 40%;
            height: 100%;
            display: inline-block;
            background: rgb(124, 233, 242);
          }
        }
      }
    }

    .screen-main-r {
      position: absolute;
      height: 851px;
      width: 450px;
      display: flex;
      z-index: 2;
      top: 110px;
      right: 20px;
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
    .screen-main-bottom {
      .small-contain {
        // background: rgba(37, 42, 162, 0.8);
        // background: rgba(36, 38, 110, 0.6);
        background: url("@/assets/img/home/planArrangement/module_bg.png");
        border: 0;
        flex: 1;
        margin: 5px 0;
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
