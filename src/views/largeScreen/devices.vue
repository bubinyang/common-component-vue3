<template>
  <section class="largeScreen-map-style">
    <svg id="svgEl" width="100%" height="100%" version="1.1">
      <!-- <polygon
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
      /> -->
      <line x1="50" y1="50" x2="150" y2="150" stroke="black" stroke-width="2" />
    </svg>
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
      isShow: true,
      list: [{ title: "A" }, { title: "A" }, { title: "A" }]
    };
  },
  created() {
    // this.hourseList.forEach((item) => {
    //   const list = item.houseOutLinePoints.length ? item.houseOutLinePoints.split(",") : [];
    //   item.houseOutLinePoints = { left: `${list[0]}px`, top: `${list[1]}px` };
    // });
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
  position: absolute;
  left: 450px;
  right: 450px;
  top: 80px;
  border: 1px solid;
  height: 680px;

  .dialog-style {
    width: 218px;
    height: 219px;
    // background-image: url("@/assets/images/board3D/dialog.png");
    // background-repeat: no-repeat;
    // background-size: contain;
    // backface-visibility: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    justify-content: space-around;
    flex: 1;
    h3 {
      width: 100%;
      color: white;
      //   background-image: url("@/assets/images/board3D/节点.png");
      //   background-position: 5px;
      //   background-repeat: no-repeat;
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
