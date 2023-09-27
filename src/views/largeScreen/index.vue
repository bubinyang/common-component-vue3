<template>
  <section class="largeScreen-contain">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="screen-top">
        <div class="time-show">{{ timeVal }}</div>

        <div class="screen-top-title-l" />
        <div class="screen-top-title">看板标题</div>
        <div class="screen-top-title-r" />
      </div>

      <section class="screen-main-content">
        <section class="screen-main-l">
          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <chartBar></chartBar>
            </SmallContain>
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <one></one>
            </SmallContain>
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <two></two>
            </SmallContain>
          </div>
        </section>

        <section class="screen-main-center">
          <mapModule :ratio="ratio" />
        </section>

        <section class="screen-main-r">
          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <three></three>
            </SmallContain>
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <four></four>
            </SmallContain>
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'">
              <five></five>
            </SmallContain>
          </div>
        </section>
      </section>
    </largeScreenMain>
  </section>

  <section class="chart-demo">
    <div class="contain">
      <chartBar></chartBar>
    </div>

    <div class="contain">
      <pie3D></pie3D>
    </div>

    <div class="contain">
      <pie3Dtest></pie3Dtest>
    </div>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import mapModule from "@/views/largeScreen/map.vue";
import chartBar from "@/views/largeScreen/chartBar.vue";
import one from "./one.vue";
import two from "./two.vue";
import three from "./three.vue";
import four from "./four.vue";
import five from "./five.vue";
import pie3D from "./pie3D.vue";
import pie3Dtest from "./pie3Dtest.vue";

export default {
  name: "LargeScreen",
  components: { mapModule, chartBar, one, two, three, four, five, pie3D, pie3Dtest },
  data() {
    return {
      timeVal: "",
      top_bg: "",
      ratio: 2
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
.largeScreen-contain {
  width: 100%;
  // height: 500px;
  .screen-top {
    height: 160px;
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
      background: url("@/assets/logo.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      width: 1043px;
      display: flex;
      justify-content: center;
      padding-top: 15px;
      font-size: 30px;
      letter-spacing: 5px;
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
    // padding:28px;
    justify-content: space-between;
    position: relative;
    // margin-top: 84px;

    .screen-main-l {
      position: absolute;
      height: 100%;
      width: 450px;
      display: flex;
      z-index: 2;
      left: 0;
      flex-direction: column;
      padding: 20px;
    }

    .screen-main-r {
      position: absolute;
      height: 100%;
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
      background: url("@/assets/img/home/zybg.jpg");
      z-index: 1;
    }

    .screen-main-l,
    .screen-main-r {
      width: 450px;
    }
    .module-box {
      display: flex;
      flex: 1;
      margin: 15px 0;
    }
  }
}

.chart-demo {
  background: rgba(3, 24, 25);
  display: flex;
  flex-wrap: wrap;
  .contain {
    flex: 0 0 300px;
    height: 300px;
  }
}
</style>
