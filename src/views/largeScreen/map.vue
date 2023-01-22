<template>
  <section class="largeScreen-map-style">
    <svg id="svgEl" width="100%" height="100%" version="1.1">
      <polygon
        @click="clickHorse"
        :index="index"
        @mouseleave="hideHouseOutline"
        @mouseenter="showHouseOutline(item)"
        id="pan"
        v-for="(item, index) in hourseList"
        :key="index"
        :name="item.name"
        :points="item.points"
        :style="item.style"
      />
    </svg>
    <!-- <div v-for="(item,index) in hourseList" :key="index" style="color:white">
            <img :style="item.houseOutLinePoints" :src="item.houseSrc"/>
        </div>
          -->
    <div v-if="currentOutLine">
      <img :style="currentOutLine.houseOutLinePoints" :src="currentOutLine.houseSrc" />
    </div>

    <div v-show="itemContentShow" class="item-content" :style="positionStyle">
      <div class="text-top"><i @click="closeDiaglog" class="el-icon-close"></i></div>
      <div class="title">{{ currentOutLine ? currentOutLine.name : "" }}</div>
      <div class="text-set" v-for="(item, index) in origin.slice(0, 3)" :key="index">
        <div class="dot"></div>
        <span
          ><label class="label-style">{{ item.label }} :</label
          ><span class="color-set">{{ item.usage }} </span>
          <label class="unit-style">{{ item.unit }}</label></span
        >
      </div>
    </div>
  </section>
</template>

<script>
import { newSetDialogPosition } from "@/utils";
import { hourseList } from "./hourse";
const styleSvg = {
  fill: "transparent",
  stroke: "#00ffff",
  strokeWidth: 0
};
export default {
  props: {
    origin: {
      type: Array,
      default: () => []
    },
    ratio: {
      type: Number,
      default: () => 2
    }
  },
  data() {
    return {
      hourseList,
      currentOutLine: {},
      positionStyle: {},
      itemContentShow: false,
      isShow: true
    };
  },
  created() {
    this.hourseList.forEach((item) => {
      const list = item.houseOutLinePoints.length ? item.houseOutLinePoints.split(",") : [];
      item.houseOutLinePoints = { left: `${list[0]}px`, top: `${list[1]}px` };
    });
  },
  computed: {},
  mounted() {},
  methods: {
    showHouseOutline(item) {
      //this.itemContentShow = false;
      if (this.isShow) this.currentOutLine = item;
    },
    hideHouseOutline() {
      //   this.itemContentShow = false;
      //   this.currentOutLine = null;
    },
    clickHorse(e) {
      if (!this.isShow) return;

      this.itemContentShow = false;
      this.$nextTick(() => {
        const position = newSetDialogPosition(".largeScreen-map-style", {
          eventItem: e,
          dialogElName: ".item-content",
          isTransform: { containElWidth: 1920, dialogElWidth: 244 }
        });
        console.log(this.ratio);
        Object.keys(position).forEach((key) => {
          if (position[key] !== undefined) {
            this.positionStyle[key] = `${position[key] / this.ratio + 5}px`;
          }
        });
        this.itemContentShow = true;
        this.isShow = false;
      });
    },
    closeDiaglog() {
      this.itemContentShow = false;
      this.currentOutLine = null;
      this.isShow = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.largeScreen-map-style {
  height: 100%;
  position: relative;

  img {
    position: absolute;
    cursor: pointer;
    z-index: 1;
  }

  .item-content {
    width: 244px;
    height: 128px;
    position: absolute;
    z-index: 3;
    background: url("@/assets/img/home/item_bg.png");
    .text-top {
      height: 18px;
      color: white;
      text-align: right;
      padding-right: 10px;
      .el-icon-close {
        cursor: pointer;
      }
    }
    .title {
      text-align: center;
      color: rgba(0, 245, 208, 1);
      font-size: 16px;
      line-height: 29px;
      height: 29px;
    }

    .text-set {
      font-size: 14px;
      /*text-align: center;*/
      color: #fff;
      margin-left: 15px;
      line-height: 20px;
      margin-bottom: 3px;
    }

    .label-style {
      width: 100px;
      display: inline-block;
      text-align: right;
    }

    .color-set {
      color: rgba(0, 245, 208, 1);
      width: 80px;
      display: inline-block;
      text-indent: 20px;
    }
    // .unit-style{

    // }
  }
  #svgEl {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    polygon {
      cursor: pointer;
    }
  }
}
</style>
