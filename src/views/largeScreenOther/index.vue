<template>
  <section class="largeScreen-contain largeScreen-contain-device">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <Clock></Clock>
      <div class="screen-top">
        <section>
          <h1>预产量</h1>
          <label>{{ originData.TotalQuantity }}</label>
        </section>

        <section>
          <h1>实际产量</h1>
          <label>{{ originData.TotalCompleted }}</label>
        </section>
      </div>
      <div class="box">
        <section class="screen-main-content">
          <div class="dialog-style" v-for="(item, index) in originData.Items" :key="index">
            <h3>{{ item.Procedure }}</h3>
            <div>
              <p>设备名称</p>
              <b>{{ item.Device }}</b>
              <!-- <label>N*m</label> -->
            </div>

            <div>
              <p>任务数量</p>
              <b>{{ item.Quantity }}</b>
              <!-- <label>min</label> -->
            </div>

            <div>
              <p>完成数量</p>
              <b>{{ item.Completed }}</b>
            </div>

            <div>
              <p>状态</p>
              <b>{{ item.State }}</b>
            </div>
          </div>
        </section>
      </div>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import http from "@/utils/request";
import { scrollItem } from "@/utils/index.js";

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
      list: [{ Device: "name", Quantity: "100" }],
      originData: { Items: [] }
    };
  },

  created() {
    const updateData = () => {
      this.init();
      setTimeout(updateData, 300000);
    };
    updateData();
  },

  mounted() {
    setTimeout(() => {
      if (this.originData.Items.length > 132) {
        scrollItem({
          contentEl: document.querySelector(".largeScreen-contain-device .screen-main-content"),
          speed: 0.5,
          orient: "vertical"
        });
      }
    }, 1000);
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
    init(device) {
      http.post("/api/screen1", { ID: "1" }).then((res) => {
        this.originData = res.Data;
        this.originData.Items.push(...res.Data.Items);
        this.originData.Items.push(...res.Data.Items);
        this.originData.Items.push(...res.Data.Items);
      });
    }
  }
};
</script>
<style lang="scss">
.largeScreen-contain-device {
  width: 100%;
  // background: rgb(198, 208, 239);
  // height: 500px;
  .clock-style {
    color: rgba(0, 0, 0, 1);
    height: 50px;
    font-size: 25px;
    position: relative;
    left: 30px;
  }
  .screen-top {
    height: 120px;
    display: flex;
    color: #0dc9ff;
    position: absolute;
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: space-around;
    top: 50px;
    & > section {
      // flex: 1;
      border: 1px solid rgb(228, 231, 237);
      flex: 0 0 300px;
      padding: 0 10px;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
      background: rgb(245 245 245);
      display: flex;
      flex-direction: column;
      h1 {
        font-size: 30px;
        margin-bottom: 0;
      }
      label {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
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
  .box {
    flex: 1;

    position: relative;
    margin: 130px 16px 10px 16px;
    overflow: hidden;
    display: flex;
  }
  .screen-main-content {
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
    height: 210px;
    margin: 6px 8px;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 4px 0px;
    // background-image: url("@/assets/images/board3D/dialog.png");
    // background-repeat: no-repeat;
    // background-size: contain;
    background: rgb(53, 169, 49);
    backface-visibility: hidden;
    // background: darkred;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    justify-content: space-around;
    flex: 1;
    float: left;
    h3 {
      width: 100%;
      color: white;
      font-size: 20px;
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
        font-weight: bold;
        color: rgb(30, 77, 76);
        font-size: 15px;
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
