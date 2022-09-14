<template>
  <div class="snak-style">
    <svg
      v-if="refreshSnake"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <!-- <polyline
        v-if="refreshSnake"
        :points="points"
        style="fill: none; stroke: black; stroke-width: 3"
      />-->

      <circle
        v-for="(item, key) in newSnake.points"
        :key="key"
        :cx="item.cx"
        :cy="item.cy"
        r="4"
        fill="black"
      />

      <circle
        v-for="(item, key) in newSnake.pointFood"
        :key="key"
        :cx="item.cx"
        :cy="item.cy"
        r="4"
        fill="red"
      />

      <!-- <circle cx="150" cy="50" r="4" fill="red">
        <animateMotion path="M150 50 L150 400" begin="2s" dur="1s" repeatCount="indefinite" />
      </circle> -->
    </svg>
  </div>
  <div>总得分:score{{ newSnake.score }}</div>
  <el-button type="primary" @click="start">继续</el-button>

  <el-button type="primary" @click="start">开始</el-button>

  <el-button type="primary" @click="stop">暂停</el-button>
  <!-- <div>{{ newSnake.keyDownHistory }}</div>

  <div>{{ newSnake.points }}</div> -->
</template>
<script>
import { criculationAction, criculationActionSwitch } from "@/utils/index.js";
import { snake } from "@/utils/utils.ts";
//ArrowUp  ArrowRight ArrowDown  ArrowLeft
export default {
  name: "Snake",
  data() {
    return {
      //20,20 40,25 60,40
      initPoints: ["20,20", "20,180"],
      points: [],
      defaultDirection: "down",
      refreshSnake: true,
      newSnake: {}
    };
  },
  mounted() {
    const svgEl = document.querySelector(".snak-style svg");
    this.newSnake = new snake({ svgEl, width: 500, height: 500, snakeWidth: 8 });
    // this.newSnake = newSnake

    this.newSnake.action = () => {
      // console.log(this.newSnake.points);
      this.points = this.newSnake.points;
      this.refreshSnake = false;
      this.$nextTick(() => {
        this.refreshSnake = true;
      });
    };

    // setTimeout(()=>{

    // })
    // document.addEventListener("keydown", (event) => {
    //   console.log(event.key);
    // });
  },
  methods: {
    stop() {
      //this.newSnake.pause = !this.newSnake.pause;
      this.newSnake.stop();
    },
    start() {
      this.newSnake.start();
    }
  }
};

function refreshPoints(origin) {
  return origin.reduce((total, item) => {
    total = total + item + " ";
    return total;
  }, "");
}
// function move(){

// }
</script>

<style lang="scss">
.snak-style {
  width: 500px;
  height: 500px;

  margin: 0 auto;
  svg {
    border: 2px solid black;
  }
}
</style>
