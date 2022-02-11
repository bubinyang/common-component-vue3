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
            <SmallContain :title="'综合能源消费量'" />
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'" />
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'" />
          </div>
        </section>

        <section class="screen-main-center">
          <mapModule :ratio="ratio" />
        </section>

        <section class="screen-main-r">
          <div class="module-box">
            <SmallContain :title="'综合能源消费量'" />
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'" />
          </div>

          <div class="module-box">
            <SmallContain :title="'综合能源消费量'" />
          </div>
        </section>
      </section>
    </largeScreenMain>
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import mapModule from "@/views/largeScreen/map.vue";
export default {
  name: "LargeScreen",
  components: { mapModule },
  data() {
    return {
      timeVal: "",
      top_bg: "",
      ratio: 2
    };
  },
  created() {
    setInterval(() => {
      this.setTime();
    }, 1000);
  },
  mounted() {},
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
</style>
