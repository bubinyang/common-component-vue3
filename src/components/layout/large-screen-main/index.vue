<template>
  <div class="langScreen" :style="{ background: fullmodel ? 'rgb(4,9,61)' : 'initial' }">
    <ExpandButton @refresh="refresh" v-model="fullmodel"></ExpandButton>
    <div :style="bg" class="main_box">
      <div class="main_contain">
        <slot name="top" />
        <slot name="content" />
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'

export default {
  name: "largeScreenMain",
  // components: { ExpandButton },
  props: {
    bg: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      fullmodel: false,
      ratio: 1
    };
  },
  created() {},
  mounted() {
    this.rize();
    window.addEventListener("resize", this.rize, false);
  },

  methods: {
    refresh() {
      this.$emit("change", "go");
    },
    rize() {
      const docEl = document.querySelector(".langScreen");
      console.log(docEl);
      const El = document.querySelector(".main_box");
      El.style.width = "1920px";
      El.style.height = "1080px";
      this.ratio = docEl.getBoundingClientRect().width / 1920;
      El.style.transform = "scale(" + this.ratio + ")";
      El.style.transformOrigin = "left top";
      El.style.backgroundSize = "100%";
      // 如果largeScreen-contain高度小于内容高度，增加overflow:auto,需要重新计算一下scale
      const containEl = document.querySelector(".largeScreen-contain");
      const containH = containEl.getBoundingClientRect().height;
      if (containH.toFixed(2) < El.getBoundingClientRect().height.toFixed(2)) {
        containEl.style.overflowY = "auto";
      }
      this.ratio = docEl.getBoundingClientRect().width / 1920;
      El.style.transform = "scale(" + this.ratio + ")";
      console.log(this.ratio);
      this.$emit("emitRatio", this.ratio);
    }
  },
  unmounted() {
    window.removeEventListener("resize", this.rize);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.langScreen {
  padding-bottom: 56.25%;
  background-size: cover;
  position: relative;
  .main_box {
    position: absolute;
  }
  .main_contain {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: hidden;
  }
}
</style>
