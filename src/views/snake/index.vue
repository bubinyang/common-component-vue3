<!--
1.一开始我是用polyline的思路去做蛇身，吃一个食物，蛇身增加一截，键盘事件让polyline拐弯非常之麻烦。转变思路，使用把蛇身拆分
成N个小段，用circle拼接而成,每个circle有自己的cx和cy,那么同样有自己的运行方向属性direction。
2.首先做到蛇头根据键盘方向进行运动,第一步先让蛇头动起来，定时器发现并不是最优，使用requestAnimationFrame可以让动画更加丝滑
改变蛇头cricle的direction,同时根据direction的变化去改变对应的cx和cy值。
3.吃食物，准备条件是 方向历史点，历史点跟蛇头点卡到一个条件，那么就相当于吃到了食物。
 刚开始的思路是cx，cy的位移距离正好是蛇段直径,当points蛇头cx cy跟方向历史点任何一个相等，那么就可以吃掉。往points里面添加一个点
 由于requeranmationframe的频率60才能丝滑，如果还是每一次位移是直径，速度过快，将速度设为1，此时满足上面相等条件很难做到，改成当
 蛇头触碰到食物就吃掉(更加合情合理)。关于吃到的食物，首次想法是放在蛇尾，如果方向操作复杂且过快，尾巴新增的蛇段direction容易找不着
 正确的值，无法跟着蛇身，蛇段放在蛇头前面那么问题就可以解决，direction设置成currentDirection即可
4.现在要处理触碰墙壁和尾巴，游戏结束。
接触墙壁，最左侧的cx 最右侧的cx,超出这个范围算碰壁
接触身体，刚开始的思路是points存在一个蛇头cx减蛇段cx和蛇头cy减蛇段cy绝对值小于snakeWidth的时候就游戏结束，后来发现需要去除蛇头，
后来运行发现刚转弯蛇头跟第二端会有一瞬间交错，这时候也满足条件，但是这样游戏结束肯定不合理，蛇头转向撞向身体才算失败，跟身体的前面几节永远不可能触碰
所以干脆就把points靠近蛇身的前三段全部截取，这样触发蛇头撞击蛇身的情况就会正常发生

-->
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
    </svg>
  </div>
  <div>总得分:score{{ newSnake.score }}</div>
  <!-- <el-button type="primary" @click="start">继续</el-button> -->

  <el-button type="primary" @click="start">开始</el-button>

  <el-button type="primary" @click="stop">暂停</el-button>

  <el-button type="primary" @click="reset">重置</el-button>
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
    this.newSnake = new snake({ svgEl, width: 1000, height: 800, snakeWidth: 8 });
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
    },
    reset() {
      this.newSnake.reset();
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
  width: 1004px;
  height: 804px;
  border: 2px solid black;
  margin: 0 auto;
  // svg {
  //   border: 2px solid black;
  // }
}
</style>
