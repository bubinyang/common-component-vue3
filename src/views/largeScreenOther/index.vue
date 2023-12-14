<template>
  <section class="largeScreen-contain largeScreen-contain-device">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="screen-top">
        <!-- <div class="time-show">{{ timeVal }}</div>

        <div class="screen-top-title-l" />
        <div class="screen-top-title">看板标题</div>
        <div class="screen-top-title-r" /> -->
      </div>

      <section class="screen-main-content">
        <div class="dialog-style" v-for="(item, index) in list" :key="index">
          <h3>{{ item.title }}</h3>
          <div>
            <p>电</p>
            <b>{{ item.value }}</b>
            <label>N*m</label>
          </div>

          <div>
            <p>水</p>
            <b>{{ item.value }}</b>
            <label>min</label>
          </div>

          <div>
            <p>图号</p>
            <b>{{ item.value }}</b>
          </div>

          <div>
            <p>工作令</p>
            <b>{{ item.value }}</b>
          </div>
        </div>
      </section>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import mapModule from "@/views/largeScreen/map.vue";
import chartBar from "@/views/largeScreen/chartBar.vue";
// import one from "./one.vue";
// import two from "./two.vue";
// import three from "./three.vue";
// import four from "./four.vue";
// import five from "./five.vue";
// import deviceError from "./deviceError.vue";
// import orders from "./orders.vue";
// import device from "./devices.vue";

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
      list:[{Device:'name',Quantity:''100}]
    };
  },
  created() {
    // setInterval(() => {
    //   this.setTime();
    // }, 1000);
  },
  mounted() {
    console.log("largreen 执行");
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
    }
  }
};
</script>
<style lang="scss">
.largeScreen-contain-device {
  width: 100%;
  // height: 500px;
  .screen-top {
    height: 80px;
    display: flex;
    color: #0dc9ff;
    position: absolute;
    z-index: 2;
    width: 100%;
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
    }

    .screen-main-l,
    .screen-main-r {
      width: 450px;

      .small-contain {
        flex: 1;
        margin: 15px 0;
        .small-contain-title {
          .title {
            background: linear-gradient(45deg, #ffffff 0%, #88d7f7 30.044921875%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            justify-content: flex-start;
            font-size: 21px;
            position: relative;
            // top: 13px;
            // left: 5px;
            font-weight: bold;
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

  .dialog-style {
    width: 218px;
    height: 219px;
    background-image: url("@/assets/images/board3D/dialog.png");
    background-repeat: no-repeat;
    background-size: contain;
    backface-visibility: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    justify-content: space-around;
    flex: 1;
    h3 {
      width: 100%;
      color: white;
      background-image: url("@/assets/images/board3D/节点.png");
      background-position: 5px;
      background-repeat: no-repeat;
      text-indent: 40px;
      font-weight: bold;
    }
    & > div {
      height: 22px;
      // background-size: contain;
      // background-position: left 100%;
      display: flex;
      align-items: center;
      width: 218px;
      // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      background-repeat: no-repeat;
      background-position: 15px;
      padding: 0 8px 0 2px;

      img {
        position: relative;
        left: 0px;
        width: 27px;
      }
      p {
        width: 80px;
        margin-bottom: 0;
        text-indent: 30px;
        font-weight: bold;
        color: #27d5e9;
        font-size: 10px;
      }
      b {
        flex: 1;
        // text-align: right;
        text-indent: 20px;
        font-size: 17px;
        color: rgb(252, 253, 222);
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: rgb(255, 255, 255) 0px 0px 2px;
        em {
          font-style: normal;
          color: #809ec1;
          font-size: 13px;
          padding: 0 8px;
        }
        // border: 1px solid;
      }
      label {
        flex: 0 0 40px;
        text-align: left;
        text-indent: 5px;
        font-size: 10px;
        color: #809ec1;
      }
    }
  }
}
</style>
