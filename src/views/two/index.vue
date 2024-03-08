<template>
  <section class="largeScreen-contain largeScreen-contain-device">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <!-- <Clock></Clock> -->
      <div class="screen-top"></div>

      <div class="screen-top-title">
        <div class="title">
          <h1>产线名称</h1>
          <label>240减速器线</label>
        </div>

        <div class="title-1 title-data">
          <div class="top">
            <label>{{ originData.sxsl }}</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-2 title-data">
          <div class="top">
            <label>{{ originData.xxsl }}</label>
          </div>
          <h1>下线数量</h1>
        </div>
        <div class="title-3 title-data">
          <div class="top">
            <label>{{ originData.fxs }}</label>
          </div>
          <h1>返修数</h1>
        </div>
        <div class="title-4 title-data">
          <div class="top">
            <label>{{ originData.ycjjhgs }}</label>
          </div>
          <h1>一次交检合格数</h1>
        </div>
        <div class="title-5 title-data">
          <div class="top">
            <label>{{ originData.ycljhgs }}</label>
          </div>
          <h1>一次扭矩合格数</h1>
        </div>
        <div class="title-6 title-data">
          <div class="top">
            <label>{{ originData.ycxxhgs }}</label>
          </div>
          <h1>一次下线合格数</h1>
        </div>
      </div>
      <div class="box">
        <!-- <section class="screen-main-content">
          <div class="dialog-style" v-for="(item, index) in originData.todayCntWsCode" :key="index">
            <h3>{{ item.ws_code }}</h3>
            <div class="contain">
              <div>{{ item.cnt }}</div>

              <div>{{ item.ycgzs }}</div>

              <div>{{ item.fxjggzs }}</div>
            </div>
          </div>
        </section> -->


        <section class="screen-main-content swiperspec-contain">
        <section v-for="(father,index) in newOriginData" :key="index">
            <div class="dialog-style" v-for="(item, index) in father" :key="index">
            <h3>{{ item.ws_code }}</h3>
            <div class="contain">
              <div>{{ item.cnt }}</div>

              <div>{{ item.ycgzs }}</div>

              <div>{{ item.fxjggzs }}</div>
            </div>
          </div>
        </section>
        <!-- <section>2</section> -->
  </section>


      </div>

      <div class="legend">
        <h1>色块说明</h1>
        <label>总加工数</label>
        <label>一次过站数</label>
        <label>返修加工过站</label>
      </div>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import http from "@/utils/requestone";
import { scrollItem,grouping,newSwpierSpecial} from "@/utils/index.js";

// import one from "./one.vue";
// import two from "./two.vue";
// import three from "./three.vue";
// import four from "./four.vue";
// import five from "./five.vue";
// import deviceError from "./deviceError.vue";
// import orders from "./orders.vue";
// import device from "./devices.vue";
let requestFrame;
export default {
  name: "LargeScreenOther",
  components: {},
  data() {
    return {
      timeVal: "",
      top_bg: "",
      ratio: 2,
      waterpumpValueA: "A",
      energyType: "电",

      rankDate: "",
      list: [{ Device: "name", Quantity: "100" }],
      originData: { todayCntWsCode: [] },
      newOriginData:[]
    };
  },

  created() {
    const updateData = () => {
      this.initData();
      setTimeout(updateData, 20000);
    };
    updateData();
  },

 async mounted() {
   // grouping([1, 2, 3, 4, 5, 6],4);
    await this.initData();
    newSwpierSpecial(".swiperspec-contain")
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
    async initData() {
      await this.init();

      // setTimeout(() => {
      //   cancelAnimationFrame(requestFrame);
      //   if (this.originData.todayCntWsCode.length > 140) {
      //     requestFrame = scrollItem({
      //       contentEl: document.querySelector(".largeScreen-contain-device .screen-main-content"),
      //       speed: 0.5,
      //       orient: "vertical"
      //     });
      //   } else {
      //     cancelAnimationFrame(requestFrame);
      //   }
      // }, 2000);
    },

    init() {
      return new Promise((resolve) => {
        http.get("/kb/kb1/plus").then((res) => {
          this.originData = res.data;
          this.newOriginData=grouping(res.data.todayCntWsCode,40)
          console.log(this.newOriginData);
          resolve(res.data);
        });
      });
    }
  }
};
</script>
<style lang="scss">
.largeScreen-contain-device {
  width: 100%;
  background: #000f1b;
  // height: 500px;
  .clock-style {
    color: rgba(0, 0, 0, 1);
    height: 50px;
    font-size: 25px;
    position: relative;
    left: 30px;
  }
  .screen-top {
    display: flex;
    color: #0dc9ff;
    // position: absolute;
    z-index: 2;
    height: 61px;
    width: 100%;
    background: url("@/assets/img/home/two/top.png");
    background-repeat: no-repeat;
  }

  .screen-top-title {
    display: flex;
    justify-content: space-between;
    margin: 30px 25px 22px 20px;
    .title {
      width: 432px;
      height: 161px;
      background: url("@/assets/img/home/two/cpmc_pic.png");
      background-repeat: no-repeat;
      position: relative;
      h1 {
        font-family: PangMenZhengDaoBiao;
        color: white;
        font-size: 30px;
        left: 60px;
        top: -10px;
        position: absolute;
      }
      label {
        background: linear-gradient(45deg, #ffffff 0%, #88d7f7 15.044921875%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        justify-content: flex-start;
        font-size: 55px;
        position: relative;
        top: 20px;
        color: rgb(119, 141, 241);

        font-family: PangMenZhengDaoBiao;
      }
    }
    .title-data {
      width: 215px;
      height: 160px;
      background: linear-gradient(360deg, rgba(0, 174, 242, 0.09) 0%, rgba(0, 118, 238, 0.3) 100%);
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .top {
        height: 54px;

        display: flex;
        align-items: center;
        justify-content: center;

        label {
          font-weight: 500;
          font-size: 48px;
        }
        &::before {
          content: "";
          display: block;
          height: 54px;
          width: 54px;
          background: url("@/assets/img/home/two/icon_fxs.png");
          background-repeat: no-repeat;
          margin-right: 13px;
        }
      }
      h1 {
        margin: 10px 0;
        color: white;
      }
    }
    .title-1 {
      label {
        color: #29d127;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_sxsl.png");
      }
    }
    .title-2 {
      label {
        color: #d13c27;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_xxsl.png");
      }
    }

    .title-3 {
      label {
        color: #feb100;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_fxs.png");
      }
    }

    .title-4 {
      label {
        color: #f6ff00;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_ycxjjhg.png");
      }
    }

    .title-5 {
      label {
        color: #884fdd;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_ycjjhg.png");
      }
    }

    .title-6 {
      label {
        color: #fe5b00;
      }
      .top::before {
        background: url("@/assets/img/home/two/icon_ycxxhgs.png");
      }
    }
  }

  .box {
    flex: 1;

    position: relative;
    margin: 0px 5px 0px 15px;
    overflow: hidden;
    // display: flex;
  }
  .screen-main-content {
    overflow: hidden;
    height: 100%;
    position: relative;
    color:white;
    font-size: 30px;
    & > section {
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      position: absolute;
      border: 1px solid;
      width: 100%;
      height: 100%;
      transition: 2s;
      transition-property: transform;
      background: rgba(0,15,27);

    }

    // flex: 1;

    // position: relative;
    // margin: 180px 16px 10px 16px;
    // overflow: hidden;
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

  .dialog-style {
    width: 220px;
    height: 132px;
    margin: 6px 8px 15px 8px;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 4px 0px;
    // background-image: url("@/assets/images/board3D/dialog.png");
    // background-repeat: no-repeat;
    // background-size: contain;
    backface-visibility: hidden;
    // background: darkred;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    justify-content: space-around;
    flex: 1;
    float: left;
    position: relative;
    h3 {
      width: 100%;
      color: #2affff;
      font-size: 20px;
      height: 34px;
      font-family: PangMenZhengDaoBiao;
      background: url("@/assets/img/home/two/cptitle.png");
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 0;
      position: absolute;
      top: 0;
    }
    .contain {
      background: linear-gradient(360deg, rgba(0, 174, 242, 0.09) 0%, rgba(0, 118, 238, 0.3) 100%);
      border-radius: 0px 0px 2px 2px;
      flex: 1;
      width: 100%;
      padding-top: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        margin: 0 4px;
      }
      div:nth-of-type(1) {
        background: linear-gradient(141deg, #884fdd 0%, #0078ff 100%);
      }
      div:nth-of-type(2) {
        background: linear-gradient(141deg, #00ec83 0%, #00bdf0 100%);
      }
      div:nth-of-type(3) {
        background: linear-gradient(141deg, #ffce00 0%, #ff8282 100%);
      }
    }
  }

  .legend {
    flex: 0 0 50px;
    color: #ffffff;
    display: flex;
    align-items: center;
    margin: 0 0 0 25px;
    h1 {
      color: #ffffff;
      margin-bottom: 0;
      margin-right: 100px;
    }
    label {
      width: 170px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &::before {
        content: "";
        height: 20px;
        width: 20px;
        display: block;
        background: linear-gradient(141deg, #884fdd 0%, #0078ff 100%);
        margin-right: 10px;
      }
    }
    label:nth-of-type(2)::before {
      background: linear-gradient(141deg, #00ec83 0%, #00bdf0 100%);
    }
    label:nth-of-type(3)::before {
      background: linear-gradient(141deg, #ffce00 0%, #ff8282 100%);
    }
  }
}
</style>
