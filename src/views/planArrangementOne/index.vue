<template>
  <section class="largeScreen-contain largeScreen-containone">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <Clock></Clock>
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
          <SmallContain :title="'今日计划安排'">
            <section class="product_one">
              <section class="top-title">
                <div class="top-title-time">
                  <label
                    ><h3>时间:</h3>
                    <b>2024-02-28</b></label
                  >
                </div>
                <div class="top-title-content">
                  <label
                    ><h3>计划数量合计:</h3>
                    <b>1.17%</b></label
                  >

                  <label
                    ><h3>上线数量合计:</h3>
                    <b>1.17%</b></label
                  >
                </div>
              </section>
              <section class="swiperspec-contain">
                <section class="swpierspec-item" style="width: 100%">
                  <template v-for="(item, key) in 4" :key="key">
                    <section class="product_attr">
                      <div class="product_attr_title">序号:01</div>
                      <div class="product_attr_content">
                        <label
                          ><h3>规格型号:</h3>
                          <b>1.17%</b></label
                        >

                        <label
                          ><h3>客户代码:</h3>
                          <b>1.17%</b></label
                        >
                        <label
                          ><h3>计划数量:</h3>
                          <b>1.17%</b></label
                        >

                        <label
                          ><h3>已上线数量:</h3>
                          <b>1.17%</b></label
                        >
                      </div>
                    </section>

                    <section class="product_remark">
                      <div class="remark_top">备注</div>
                      <div class="remark_contain">
                        <div class="remark_content">铁架</div>
                      </div>
                    </section>
                  </template>
                </section>
              </section>
            </section>

            <!-- <section class="product_botton">
              <label><b>计划数量合计:</b><i>89</i></label>
              <label><b>已上线数量合计:</b><i>1</i></label>
            </section> -->
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
          <SmallContain :title="'明日计划安排'">
            <section class="product_one">
              <section class="top-title">
                <div class="top-title-time">
                  <label
                    ><h3>时间:</h3>
                    <b>2024-02-28</b></label
                  >
                </div>
                <div class="top-title-content">
                  <label
                    ><h3>计划数量合计:</h3>
                    <b>1.17%</b></label
                  >

                  <label
                    ><h3>上线数量合计:</h3>
                    <b>1.17%</b></label
                  >
                </div>
              </section>

              <template v-for="(item, key) in 4" :key="key">
                <section class="product_attr">
                  <div class="product_attr_title">序号:01</div>
                  <div class="product_attr_content">
                    <label
                      ><h3>规格型号:</h3>
                      <b>1.17%</b></label
                    >

                    <label
                      ><h3>客户代码:</h3>
                      <b>1.17%</b></label
                    >
                    <label
                      ><h3>计划数量:</h3>
                      <b>1.17%</b></label
                    >

                    <label
                      ><h3>已上线数量:</h3>
                      <b>1.17%</b></label
                    >
                  </div>
                </section>

                <section class="product_remark">
                  <div class="remark_top">备注</div>
                  <div class="remark_contain">
                    <div class="remark_content">铁架</div>
                  </div>
                </section>
              </template>
            </section>
          </SmallContain>
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
  background: url("@/assets/img/home/planArrangementOne/bg.png");
  background-size: contain;
  .clock-style {
    position: absolute;
    color: white;
    font-size: 22px;
    top: 30px;
    right: 30px;
  }
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
    background: url("@/assets/img/home/planArrangementOne/top.png");
    background-repeat: no-repeat;

    // background: rgba(36, 38, 110, 0.6);
    .titles {
      //   background: linear-gradient(180deg, #ffffff 30%, #0091f6 100.044921875%);
      //   -webkit-background-clip: text;
      //   -webkit-text-fill-color: transparent;
      // text-shadow: 0 0 5px white, 0 0 11px #00ffff;
      background: linear-gradient(360deg, #0679c1 0%, #ffffff 85.044921875%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 32px;
      position: relative;
      bottom: 10px;
      font-weight: bold;
      letter-spacing: 10px;
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

    .screen-main-l,
    .screen-main-r {
      position: absolute;
      height: 992px;
      width: 832px;
      display: flex;
      z-index: 2;
      top: 90px;
      left: 20px;
      flex-direction: column;
      padding: 5px 10px;
      .small-contain-contain {
        flex-direction: column;
      }
      .product_one {
        // border: 1px solid rgb(31, 76, 130);
        margin-top: 40px;
      }
      .product_botton {
        border: 1px solid rgb(31, 76, 130);
        padding: 5px 10px;
        margin-top: 20px;
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
        display: flex;
        width: 100%;
        margin-top: 10px;
        align-items: center;
        .cricle {
          width: 114px;
          height: 114px;
          display: block;
          background: url("@/assets/img/home/planArrangement/oN.png");
          position: relative;
          & > div {
            @include contentCenterAbsolute;
            font-size: 12px;
            i {
              font-style: normal;
            }
          }
          i:nth-of-type(1) {
            color: rgb(31, 239, 233);
          }
          i:nth-of-type(2) {
            color: rgb(207, 212, 235);
          }
        }
        .loading-bar {
          border: 1px solid rgb(108, 124, 208);
          // width: 200px;
          flex: 1;
          height: 20px;
          display: flex;
          padding: 3px;
          position: relative;
          .loading-bar-content {
            width: 40%;
            height: 100%;
            display: inline-block;
            background: rgb(124, 233, 242);
          }
          label {
            display: flex;
            min-width: 100px;
            position: absolute;
            display: flex;
            align-items: center;
            font-size: 12px;
            b {
              font-size: 14px;
              margin-left: 10px;
            }
          }
          .upRate {
            color: rgb(207, 212, 235);
            text-shadow: 0 0 3px rgb(0, 255, 255);
            left: 50%;
            transform: translateX(-50%);
            top: -30px;
          }
          .planNum {
            color: rgb(207, 212, 235);
            left: 20px;
            bottom: -30px;
            b {
              color: rgb(74, 240, 247);

              text-shadow: 0 0 3px rgb(0, 255, 255);
            }
          }

          .upNum {
            color: rgb(207, 212, 235);
            right: 10px;
            bottom: -30px;
            b {
              color: rgb(0, 233, 91);

              text-shadow: 0 0 3px rgb(0, 255, 255);
            }
          }
        }
      }

      .product_attr {
        border-left: 1px solid rgb(25, 58, 88);
        border-right: 1px solid rgb(25, 58, 88);
        .product_attr_title {
          background: rgb(1, 45, 68);
          height: 40px;
          font-size: 18px;
          color: white;
          text-align: left;
          text-indent: 70px;
          line-height: 40px;
        }
        .product_attr_content {
          display: flex;
          flex-wrap: wrap;
          font-size: 18px;
          padding: 10px;
        }
        label {
          flex: 0 0 50%;
          display: flex;
          align-items: center;
          height: 40px;
          h3 {
            color: rgb(150, 172, 193);
          }
          b {
            padding: 0 0 0 10px;
          }
          &:nth-of-type(1),
          &:nth-of-type(3) {
            padding-left: 60px;
          }
          &:nth-of-type(1),
          &:nth-of-type(2) {
            b {
              color: rgb(126, 185, 241);
            }
          }
          &:nth-of-type(3) {
            b {
              color: #4af0f7;
              text-shadow: 0 0 3px aqua;
            }
          }

          &:nth-of-type(4) {
            b {
              color: rgb(0, 239, 90);
              text-shadow: 0 0 3px rgb(0, 239, 90);
            }
          }
        }

        // b {
        //   color: #4af0f7;
        //   text-shadow: 0 0 3px aqua;
        // }
      }

      .product_remark {
        color: white;
        margin: 0 0 10px 0;
        padding: 10px 70px;
        display: flex;
        font-size: 18px;
        border: 1px solid rgb(25, 58, 88);
        border-top: 0;
        .remark_top {
          height: 30px;
          width: 60px;
          background: url("@/assets/img/home/planArrangement/remark_top.png");
          background-repeat: no-repeat;
          background-position: left center;
          text-align: left;
          line-height: 30px;
          text-indent: 10px;
        }
        .remark_contain {
          flex: 1;
        }
        .remark_content {
          font-size: 14px;
          height: 30px;
          width: 100%;
          box-shadow: inset 0px 0px 1px 1px #1f4c82;
          text-align: left;
          line-height: 30px;
          text-indent: 10px;
          color: #96acc1;
        }
      }
      .product_botton {
        color: rgb(207, 212, 235);
        i {
          font-style: normal;
          width: 60px;
          display: inline-block;
          text-align: left;
          text-indent: 10px;
        }
      }
      .top-title {
        // padding: 10px 0;
        .top-title-time {
          label {
            background: url("@/assets/img/home/planArrangementOne/c.png");
            background-repeat: no-repeat;
            background-position: left;
            padding-left: 40px;
            color: #7eb9f1;
            position: relative;
            left: 20px;
            font-size: 16px;
          }
        }
        .top-title-content {
          display: flex;
          font-size: 18px;
          label {
            justify-content: center;
            &:nth-of-type(1) {
              background: url("@/assets/img/home/planArrangementOne/a.png");
              background-repeat: no-repeat;
              background-position: 70px;
            }
            &:nth-of-type(2) {
              background: url("@/assets/img/home/planArrangementOne/b.png");
              background-repeat: no-repeat;
              background-position: 70px;
            }
          }
        }
        label {
          flex: 0 0 50%;
          display: flex;
          align-items: center;
          height: 40px;
          h3 {
            color: white;
          }
          b {
            padding: 0 0 0 10px;
            color: #7eb9f1;
          }
          // &:nth-of-type(1),
          // &:nth-of-type(3) {
          //   padding-left: 60px;
          // }
          // &:nth-of-type(1),
          // &:nth-of-type(2) {
          //   b {
          //     color: rgb(126, 185, 241);
          //   }
          // }
          // &:nth-of-type(3) {
          //   b {
          //     color: #4af0f7;
          //     text-shadow: 0 0 3px aqua;
          //   }
          // }

          // &:nth-of-type(4) {
          //   b {
          //     color: rgb(0, 239, 90);
          //     text-shadow: 0 0 3px rgb(0, 239, 90);
          //   }
          // }
        }
      }
    }

    .screen-main-r {
      position: absolute;
      height: 992px;
      width: 832px;
      display: flex;
      z-index: 2;
      top: 90px;
      right: 20px;
      left: initial;
      flex-direction: column;
      padding: 5px 10px;
    }

    .screen-main-center {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      // background: url("@/assets/img/home/planArrangement/center.png");
      background-repeat: no-repeat;
      background-position: center center;
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
        background: url("@/assets/img/home/planArrangementOne/module_bg.png");
        background-repeat: no-repeat;
        border: 0;
        flex: 1;
        margin: 5px 0;
        .small-contain-title {
          .title {
            background: linear-gradient(45deg, #1d38ae 0%, #ffffff 14.044921875%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            justify-content: flex-start;
            font-size: 18px;
            position: relative;
            // top: 10px;
            left: 60px;
            // top: 13px;
            // left: 5px;
            color: rgb(119, 141, 241);
            font-weight: bold;
            // border-left: 8px solid rgb(17, 184, 236);
            padding: 3px 0 0 10px;
            top: 15px;
          }
          label {
            color: white;
            position: relative;
            // top: 10px; 31 76 130
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

  .swiperspec-contain {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    overflow: hidden;
    & > section {
      top: 0px;
      left: 0px;
      position: absolute;
      //border: 1px solid;
      width: 100%;
      height: 100%;
      transition: 3s;
      transition-property: transform;
      display: flex;
    }
  }
}

//elementui控件
</style>
