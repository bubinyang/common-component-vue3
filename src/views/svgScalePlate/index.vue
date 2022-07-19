<template>
  <div class="wapper">
    <!-- 横标尺 -->
    <svg id="ruler-v" class="ruler-v"></svg>
    <!-- 竖标尺 -->
    <svg id="ruler-h" class="ruler-h"></svg>
    <!-- 网格背景 -->
    <svg id="svg" class="svg"></svg>
  </div>
</template>
<script>
import { getWeek } from "@/utils";
// import Snap from "snapsvg";
const { Snap } = window;
export default {
  name: "LargeScreen",
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
    // this.$nextTick(() => {
    //   var s = Snap("#svg");
    //   console.log(s);
    //   // Lets create big circle in the middle:
    //   var bigCircle = s.circle(150, 150, 100);
    // });

    function drawRuler() {
      //绘制标尺[横]
      var r = Snap("#ruler-v");
      //绘制标尺[竖]
      var rh = Snap("#ruler-h");
      r.line(25, 0, 25, 25).attr({
        stroke: "#8f9292",
        strokeWidth: 1
      });
      rh.line(0, 25, 25, 25).attr({
        stroke: "#8f9292",
        strokeWidth: 1
      });
      for (var i = 1; i < 100; i++) {
        // 绘制横标尺
        r.line(80 * i + 25, 0, 80 * i + 25, 25).attr({
          stroke: "#8f9292",
          strokeWidth: 1
        });
        r.line(20 * i + 25, 15, 20 * i + 25, 25).attr({
          stroke: "#8f9292",
          strokeWidth: 1
        });
        let text = 80 * i;
        r.text(80 * i + 25 + 2, 12.5, text).attr({
          fill: "#b1b4b4"
        });
        // 绘制竖标尺
        rh.line(0, 80 * i + 25, 25, 80 * i + 25).attr({
          stroke: "#8f9292",
          strokeWidth: 1
        });
        rh.line(15, 20 * i + 25, 25, 20 * i + 25).attr({
          stroke: "#8f9292",
          strokeWidth: 1
        });
        let texth = 80 * i;
        let ruletext = rh.text(0, 80 * i + 25 + 4, texth).attr({
          fill: "#b1b4b4"
        });
        // 旋转文字
        let matrix = new Snap.Matrix();
        matrix.rotate(90, 2, 80 * i + 25 + 4);
        ruletext.transform(matrix);
      }
    }
    // svg绘制背景网格
    function drawGrid() {
      var svg = Snap("#svg");
      // 绘制80大方格
      for (var i = 1; i < 50; i++) {
        svg.line(0, 80 * i, 2000, 80 * i).attr({
          stroke: "#f0ebdc",
          strokeWidth: 1.5
        });
        svg.line(80 * i, 0, 80 * i, 2000).attr({
          stroke: "#f0ebdc",
          strokeWidth: 1.5
        });
      }
      // 绘制20小方格
      for (var i = 1; i < 100; i++) {
        svg.line(0, 20 * i, 2000, 20 * i).attr({
          stroke: "#f5f0e0",
          strokeWidth: 1
        });
        svg.line(20 * i, 0, 20 * i, 2000).attr({
          stroke: "#f5f0e0",
          strokeWidth: 1
        });
      }
    }

    drawRuler();
    drawGrid();
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
.wapper {
  position: relative;
  height: 800px;
  font-size: 12px;
}
.ruler-v {
  position: absolute;
  left: 0px;
  width: 100%;
  background: #383838;
  height: 25px;
  z-index: 2;
}
.ruler-h {
  position: absolute;
  left: 0px;
  background: #383838;
  width: 25px;
  height: 100%;
  z-index: 2;
}
.svg {
  background-color: #faf7ec;
  position: absolute;
  top: 25px;
  left: 25px;
  bottom: 0;
  right: 0;
  z-index: 0;
  width: calc(100% - 25px);
  height: 775px;
}
</style>
