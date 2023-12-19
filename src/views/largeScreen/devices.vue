<template>
  <section class="largeScreen-map-style">
    <div class="contain">
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
        <line x1="40" y1="150" x2="100" y2="290" stroke="white" stroke-width="2" />
        <line x1="240" y1="300" x2="340" y2="490" stroke="white" stroke-width="2" />
        <line x1="240" y1="50" x2="340" y2="150" stroke="white" stroke-width="2" />
        <line x1="440" y1="250" x2="640" y2="400" stroke="white" stroke-width="2" />
      </svg>
      <div
        class="dialog-style"
        v-for="(item, index) in originList"
        :key="index"
        :style="{ left: item.position.left, top: item.position.top }"
      >
        <h3>{{ item.title }}</h3>
        <div>
          <p>主轴负载</p>
          <b>{{ item.cncSload }}</b>
          <!-- <label>N*m</label> -->
        </div>

        <div>
          <p>主轴倍率</p>
          <b>{{ item.cncSrate }}</b>
          <!-- <label>min</label> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { hourseList } from "./hourse";
import http from "@/utils/request";

const styleSvg = {
  fill: "transparent",
  stroke: "#00ffff",
  strokeWidth: 0
};
const list = [
  { name: "A-047", position: { left: "0px", top: "100px" } },
  { name: "B-056", position: { left: "250px", top: "420px" } },
  { name: "H-210", position: { left: "200px", top: "0px" } },
  { name: "H-320", position: { left: "500px", top: "350px" } }
];
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

      originList: []
    };
  },
  created() {
    // this.hourseList.forEach((item) => {
    //   const list = item.houseOutLinePoints.length ? item.houseOutLinePoints.split(",") : [];
    //   item.houseOutLinePoints = { left: `${list[0]}px`, top: `${list[1]}px` };
    // });
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      http.post("/api/screen2/device/list", { ID: this.$route.query.id || "1" }).then((res) => {
        this.originList = list.map((item) => {
          const findItem = res.Data.find((childitem) => childitem.device_name === item.name);
          return {
            cncSload: findItem
              ? findItem.cnc_sload
                ? Number(findItem.cnc_sload).toFixed(2)
                : "- -"
              : "- -",
            cncSrate: findItem
              ? findItem.cnc_srate
                ? Number(findItem.cnc_srate).toFixed(2)
                : "- -"
              : "- -",
            title: item.name,
            position: item.position
          };
        });
        console.log(this.originList);
      });
    },
    showHouseOutline(item) {
      //this.itemContentShow = false;
      if (this.isShow) this.currentOutLine = item;
    },
    hideHouseOutline() {
      //   this.itemContentShow = false;
      //   this.currentOutLine = null;
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
  padding: 130px;
  left: 450px;
  right: 450px;
  top: 80px;
  border: 1px solid;
  height: 680px;
  display: flex;
  .contain {
    flex: 1;
    position: relative;
    background: url("@/assets/img/home/device.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 40% 20%;
  }
  .dialog-style {
    width: 150px;
    height: 100px;
    position: absolute;
    // background-image: url("@/assets/images/board3D/dialog.png");
    // background-repeat: no-repeat;
    // background-size: contain;
    // backface-visibility: hidden;
    background: rgb(23, 29, 115);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    justify-content: space-around;
    padding: 10px;
    flex: 1;
    box-shadow: 0px 0px 20px yellow;
    border-radius: 10px;
    h3 {
      width: 100%;
      color: white;
      //   background-image: url("@/assets/images/board3D/节点.png");
      //   background-position: 5px;
      //   background-repeat: no-repeat;
      margin-bottom: 0;
      text-align: center;
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
