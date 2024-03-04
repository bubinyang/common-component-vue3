<template>
  <section class="largeScreen-contain largeScreen-contain-device-tree">
    <largeScreenMain
      :bg="{ backgroundImage: `url(${top_bg})` }"
      @emitRatio="emitRatio"
      @change="expand"
    >
      <!-- <Clock></Clock> -->
      <div class="screen-top">
        <Clock></Clock>
      </div>
      <!-- <el-button ref="audioRef" v-show="false" @click="playAudio" type="primary"
        >点击发声</el-button
      > -->

      <audio v-show="false" ref="audioRef" controls autoplay>
        <source :src="videoSource" type="audio/mpeg" />
      </audio>

      <div class="screen-top-titles">
        <div class="title-data title-data-left">
          <div class="repair">
            <label>报修</label>
            <dataNumber :origin="originData.data.todayCnt"></dataNumber>
          </div>
          <i></i>
          <div class="revised">
            <label>已修</label>
            <dataNumber :origin="originData.data.todayCntEnd"></dataNumber>
          </div>
        </div>
        <div class="title-data title-data-right">
          <div class="repair">
            <label>报修</label>
            <dataNumber :origin="originData.data.monthCnt"></dataNumber>
          </div>
          <i></i>
          <div class="revised">
            <label>已修</label>
            <dataNumber :origin="originData.data.todayCntEnd"></dataNumber>
          </div>
        </div>
      </div>

      <div class="screen-table">
        <div class="top">
          <label>创建时间</label>
          <label>工位</label>
          <label>故障</label>
          <label>维修开始</label>
          <label>维修结束</label>
        </div>
        <section class="screen-main-contents">
          <section class="table-content">
            <div class="content" v-for="(item, index) in originData.Items" :key="index">
              <label>{{ item.createTime }}</label>
              <label>{{ item.major }}</label>
              <label>{{ item.wsCode }}</label>
              <label>{{ item.beginTime }}</label>
              <label>{{ item.endTime }}</label>
            </div>
          </section>
        </section>
      </div>

      <!-- <div class="screen-top-title">
        <div class="title">
          <h1>产线名称</h1>
          <label>设备故障</label>
        </div>

        <div class="title-1 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-2 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-3 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-4 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-5 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
        <div class="title-6 title-data">
          <div class="top">
            <label>240</label>
          </div>
          <h1>上线数量</h1>
        </div>
      </div>
      <div class="box">
        <section class="screen-main-content">
          <div class="dialog-style" v-for="(item, index) in 50" :key="index">
            <h3>OP010</h3>
            <div class="contain">
              <div>10</div>

              <div>6</div>

              <div>4</div>
            </div>
          </div>
        </section>
      </div>

      <div class="legend">
        <h1>色块说明</h1>
        <label>总加工数</label>
        <label>一次过站数</label>
        <label>返修加工过站</label>
      </div> -->
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import http from "@/utils/requestone";
import { scrollItem } from "@/utils/index.js";
import warningSound from "@/assets/warning.mp3";
import dataNumber from "@/components/tools/dataNumber/index.vue";
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
  components: { dataNumber },
  data() {
    return {
      videoSource: warningSound,
      timeVal: "",
      top_bg: "",
      ratio: 2,
      waterpumpValueA: "A",
      energyType: "电",

      rankDate: "",
      list: [{ Device: "name", Quantity: "100" }],
      originData: { Items: [], data: {} },
      warnigSetInterval: ""
    };
  },

  created() {
    const updateData = () => {
      this.initData();
      setTimeout(updateData, 60000);
    };
    updateData();
  },

  async mounted() {
    this.initData();
    // await this.init();
    // setTimeout(() => {
    //   if (this.originData.Items.length > 12) {
    //     scrollItem({
    //       contentEl: document.querySelector(".largeScreen-contain-device-tree .table-content"),
    //       speed: 0.5,
    //       orient: "vertical"
    //     });
    //   }
    // }, 1000);

    //this.playAudio();
  },
  methods: {
    expand() {
      // this.$refs.audioRef.play();
    },
    playAudio() {
      const audio = new Audio(warningSound);
      audio.play();
    },
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
      let requestFrame;
      setTimeout(() => {
        if (this.originData.Items.length > 12) {
          requestFrame = scrollItem({
            contentEl: document.querySelector(".largeScreen-contain-device-tree .table-content"),
            speed: 0.5,
            orient: "vertical"
          });
        } else {
          cancelAnimationFrame(requestFrame);
        }
      }, 1000);
    },

    init(device) {
      // const data = {
      //   msg: "操作成功",
      //   code: 200,
      //   data: {
      //     todayCnt: 0,
      //     todayCntEnd: 0,
      //     monthCnt: 0,
      //     monthCntEnd: 0,
      //     todayCntWsCode: [
      //       { ws_code: "OP010", cnt: 0 },
      //       { ws_code: "OP020", cnt: 0 },
      //       { ws_code: "OP030", cnt: 0 },
      //       { ws_code: "OP040", cnt: 0 },
      //       { ws_code: "OP050", cnt: 0 },
      //       { ws_code: "OP060", cnt: 0 },
      //       { ws_code: "OP065", cnt: 0 },
      //       { ws_code: "OP070", cnt: 0 },
      //       { ws_code: "OP080", cnt: 0 },
      //       { ws_code: "OP090", cnt: 0 },
      //       { ws_code: "OP100", cnt: 0 },
      //       { ws_code: "OP120", cnt: 0 },
      //       { ws_code: "OP130", cnt: 0 },
      //       { ws_code: "OP110", cnt: 0 },
      //       { ws_code: "OP140", cnt: 0 },
      //       { ws_code: "OP150", cnt: 0 },
      //       { ws_code: "OP160", cnt: 0 },
      //       { ws_code: "OP170", cnt: 0 },
      //       { ws_code: "OP180", cnt: 0 },
      //       { ws_code: "OP190", cnt: 0 },
      //       { ws_code: "OP210", cnt: 0 },
      //       { ws_code: "OP220", cnt: 0 },
      //       { ws_code: "OP230", cnt: 0 },
      //       { ws_code: "OP240", cnt: 0 },
      //       { ws_code: "OP250", cnt: 0 },
      //       { ws_code: "OP260", cnt: 0 },
      //       { ws_code: "OP270", cnt: 0 },
      //       { ws_code: "OP280", cnt: 0 },
      //       { ws_code: "OP290", cnt: 0 },
      //       { ws_code: "OP300", cnt: 0 },
      //       { ws_code: "OP310", cnt: 0 },
      //       { ws_code: "OP075", cnt: 0 },
      //       { ws_code: "OP220-1", cnt: 0 },
      //       { ws_code: "OP220-2", cnt: 0 },
      //       { ws_code: "OP270-1", cnt: 0 },
      //       { ws_code: "OP270-2", cnt: 0 },
      //       { ws_code: "OP270-4", cnt: 0 },
      //       { ws_code: "OP096", cnt: 0 },
      //       { ws_code: "OP105", cnt: 0 },
      //       { ws_code: "OP035", cnt: 0 },
      //       { ws_code: "OP270-3", cnt: 0 }
      //     ],
      //     todayCntWsCodeNull: [
      //       { ws_code: "OP140", cnt: 1 },
      //       { ws_code: "OP150", cnt: 2 }
      //     ]
      //   }
      // };

      // const res = {
      //   total: 7,
      //   rows: [
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-22 15:23:47",
      //       updateBy: "",
      //       updateTime: "2023-12-22 15:23:47",
      //       remark: null,
      //       woId: 7,
      //       wsCode: "OP140",
      //       major: "电气维修",
      //       question: "",
      //       answer: "",
      //       workpiece: "",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "",
      //       beginTime: null,
      //       endTime: null,
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-08 17:19:02",
      //       updateBy: "",
      //       updateTime: "2023-12-08 17:19:02",
      //       remark: null,
      //       woId: 6,
      //       wsCode: "OP150",
      //       major: "机械维修",
      //       question: "",
      //       answer: "",
      //       workpiece: "",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "",
      //       beginTime: null,
      //       endTime: null,
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-08 17:18:44",
      //       updateBy: "",
      //       updateTime: "2023-12-08 17:20:59",
      //       remark: null,
      //       woId: 5,
      //       wsCode: "OP150",
      //       major: "电气维修",
      //       question: "无法使用",
      //       answer: "专业人员处理",
      //       workpiece: "机械",
      //       workpieceCount: 1,
      //       workpieceRty: 1,
      //       todo: "暂时没有",
      //       beginTime: "2023-12-08 00:00:00",
      //       endTime: "2023-12-08 00:00:00",
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-08 17:17:15",
      //       updateBy: "",
      //       updateTime: "2023-12-08 17:24:46",
      //       remark: null,
      //       woId: 4,
      //       wsCode: "OP130",
      //       major: "机械维修",
      //       question: "无",
      //       answer: "1",
      //       workpiece: "1",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "1",
      //       beginTime: "2023-12-08 00:00:00",
      //       endTime: "2023-12-08 00:00:00",
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-08 17:16:57",
      //       updateBy: "",
      //       updateTime: "2023-12-08 17:20:23",
      //       remark: null,
      //       woId: 3,
      //       wsCode: "OP130",
      //       major: "电气维修",
      //       question: "无法使用",
      //       answer: "专业人员处理",
      //       workpiece: "机械",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "暂时没有",
      //       beginTime: "2023-12-08 00:00:00",
      //       endTime: "2023-12-09 00:00:00",
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-07 11:20:02",
      //       updateBy: "",
      //       updateTime: "2023-12-07 11:21:51",
      //       remark: null,
      //       woId: 2,
      //       wsCode: "OP140",
      //       major: "电气维修",
      //       question: "电气问题",
      //       answer: "人员处理",
      //       workpiece: "1",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "暂时没有",
      //       beginTime: "2023-12-07 00:00:00",
      //       endTime: "2023-12-07 00:00:00",
      //       action: ""
      //     },
      //     {
      //       createBy: "1111",
      //       createTime: "2023-12-05 18:02:54",
      //       updateBy: "",
      //       updateTime: "2023-12-05 18:02:54",
      //       remark: null,
      //       woId: 1,
      //       wsCode: "OP150",
      //       major: "电气维修",
      //       question: "",
      //       answer: "",
      //       workpiece: "",
      //       workpieceCount: 0,
      //       workpieceRty: 0,
      //       todo: "",
      //       beginTime: null,
      //       endTime: null,
      //       action: ""
      //     }
      //   ],
      //   code: 200,
      //   msg: "查询成功"
      // };

      http.get("/kb/kb2").then((res) => {
        this.originData.data = res.data;
      });
      return new Promise((resolve) => {
        http.get("/kb/workorderlist").then((res) => {
          this.originData.Items = res.rows;
          console.log(this.originData.Items, "11");
          if (this.originData.Items.some((item) => !item.beginTime)) {
            clearInterval(this.warnigSetInterval);
            this.warnigSetInterval = setInterval(() => {
              if (this.$refs.audioRef) this.$refs.audioRef.play();
            }, 2000);
          } else {
            clearInterval(this.warnigSetInterval);
          }
          resolve();
        });
      });
    }
  }
};
</script>
<style lang="scss">
.largeScreen-contain-device-tree {
  width: 100%;
  background: #000f1b;
  // height: 500px;
  .clock-style {
    color: #2affff;
    height: 50px;
    font-size: 25px;
    position: absolute;
    right: 130px;
    top: 50%;
    transform: translateY(-50%);
  }
  .screen-top {
    position: relative;
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

  .screen-top-titles {
    display: flex;
    justify-content: space-between;
    margin: 30px 59px 22px 59px;
    .title-data {
      width: 884px;
      height: 160px;
      background: linear-gradient(360deg, rgba(0, 174, 242, 0.09) 0%, rgba(0, 118, 238, 0.3) 100%);
      position: relative;
      display: flex;
      align-items: center;
      & > div {
        flex: 1;
        display: flex;
        justify-content: center;
        label {
          width: 60px;
          font-size: 24px;
          color: #ffffff;
          @include contentCenter;
        }
        .data-number-style {
          display: flex;
          & > div {
            width: 60px;
            height: 80px;
            background: #00274a;
            border-radius: 4px;
            font-size: 56px;
            margin: 0 10px;
            @include contentCenter;
          }
        }
      }
      i {
        width: 2px;
        height: 96px;
        background: url("@/assets/img/home/three/line.png");
        background-repeat: no-repeat;
      }
      .repair {
        .data-number-style {
          color: #d13c27;
        }
      }
      .revised {
        .data-number-style {
          color: #29d127;
        }
      }
      //   display: flex;
      //   flex-direction: column;
      //   justify-content: center;
    }
    .title-data-left {
      &::before {
        content: "";
        display: block;
        width: 96px;
        height: 44px;

        background: url("@/assets/img/home/three/label_td.png");
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .title-data-right {
      &::before {
        content: "";
        display: block;
        width: 96px;
        height: 44px;
        background: url("@/assets/img/home/three/label_by.png");
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }

  .screen-table {
    width: 1800px;
    font-size: 16px;
    margin: 0px 59px 22px 59px;
    height: 750px;
    display: flex;
    flex-direction: column;
    .top {
      color: #2affff;
      height: 54px;
      background: #001c35;
      display: flex;
      label {
        flex: 1;
        @include contentCenter;
      }
    }
    .screen-main-contents {
      flex: 1;
      overflow: hidden;
      .table-content {
        height: 100%;
      }
    }
    .content {
      height: 54px;
      display: flex;
      label {
        flex: 1;
        @include contentCenter;
        color: #ffffff;
      }
      &:nth-of-type(2n + 1) {
        background: #00274a;
      }
    }
  }

  .box {
    flex: 1;

    position: relative;
    margin: 0px 5px 0px 15px;
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
