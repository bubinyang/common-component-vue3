<template>
  <div class="setDialogPosition-style">
    <el-input v-model="inputV" placeholder="请输入内容" />
    <el-button type="primary" @click="$router.push('/')">主要按钮</el-button>
    <div ref="clickRef" class="item-contain" />
    <div class="item-content" :style="positionStyle" />

    <svg id="svgEl" width="100%" height="100%" version="1.1">
      <polygon
        name="厂房1"
        points="210,80 238,72 260,90 230,100"
        style="fill: transparent; stroke: #000000; stroke-width: 1"
      />

      <polygon
        name="厂房2"
        points="210,150 238,142 260,160 230,170"
        style="fill: transparent; stroke: #000000; stroke-width: 1"
      />
    </svg>
  </div>
</template>
<script>
import { newSetDialogPosition } from "@/utils";
const positionAttr = ["left", "top", "right", "bottom"];
export default {
  name: "SetDialogPosition",
  data() {
    return {
      positionStyle: {},
      inputV: ""
    };
  },
  computed: {},
  mounted() {
    const that = this;
    console.log("弹出框生命周期");
    this.$nextTick(() => {
      //    const containEl=document.querySelector('.setDialogPosition-style')
      const contentEl = document.querySelector(".item-content");
      this.$refs["clickRef"].addEventListener("click", function (e) {
        positionAttr.forEach((item) => {
          contentEl.style[item] = null;
        });

        contentEl.style.display = "block";
        const position = newSetDialogPosition(".setDialogPosition-style", {
          eventItem: e,
          dialogElName: ".item-content"
        });
        Object.keys(position).forEach((key) => {
          if (position[key] !== undefined) {
            contentEl.style[key] = `${position[key]}px`;
          }
        });
        console.log(this.positionStyle);
        e.stopPropagation();
      });
      document.addEventListener("click", function () {
        contentEl.style.display = "none";
      });

      // svg添加事件
      document.querySelectorAll("#svgEl polygon").forEach((item) => {
        item.addEventListener("click", function (e) {
          positionAttr.forEach((item) => {
            contentEl.style[item] = null;
          });

          contentEl.style.display = "block";
          const position = newSetDialogPosition(".setDialogPosition-style", {
            eventItem: e,
            dialogElName: ".item-content"
          });
          Object.keys(position).forEach((key) => {
            if (position[key] !== undefined) {
              contentEl.style[key] = `${position[key]}px`;
            }
          });
          console.log(this.positionStyle);
          e.stopPropagation();

          //    console.log(e.target.getAttribute('name'))
        });
      });
      document.querySelector("#svgEl").addEventListener("click", function () {
        console.log("svg1112");
      });
    });
  },
  methods: {}
};
</script>

<style lang="scss">
.setDialogPosition-style {
  width: 800px;
  height: 800px;
  border: 1px solid;
  margin: 50px 0 0 500px;
  position: relative;
  .item-contain {
    width: 50px;
    height: 50px;
    border: 1px solid;
    position: absolute;
    top: 220px;
    left: 300px;
  }
  .item-content {
    position: absolute;
    width: 250px;
    height: 250px;
    border: 1px solid;
    display: none;
  }
}
</style>
