<template>
  <section ref="containRef" class="fourgrid-contain">
    <div ref="topRef" class="fourgrid-top" style="height: calc(35% - 5px)">
      <section ref="colFormerTop" style="width: calc(50% - 5px)" />
      <div ref="pullColTop" class="pull-left-right" />
      <section ref="colRearTop" style="width: calc(50% - 5px)" />
    </div>
    <div ref="pullUpDownRef" :class="{ pullUpDown: true }" />
    <div ref="bottomRef" class="fourgrid-bottom" style="height: calc(65% - 5px)">
      <section ref="colFormerBottom" style="width: calc(50% - 5px)" />
      <div ref="pullColBottom" class="pull-left-right" />
      <section ref="colRearBottom" style="width: calc(50% - 5px)" />
    </div>
  </section>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      resize: false,
      styleObj: {}
    };
  },
  created() {},
  mounted() {
    //   this.pullUpDown()
    this.pull({
      containEl: this.$refs["containRef"],
      moveEl: this.$refs["pullUpDownRef"],
      formerEl: this.$refs["topRef"],
      rearEl: this.$refs["bottomRef"],
      type: "row"
    });

    this.pull({
      containEl: this.$refs["containRef"],
      moveEl: this.$refs["pullColTop"],
      formerEl: this.$refs["colFormerTop"],
      rearEl: this.$refs["colRearTop"],
      type: "col"
    });

    this.pull({
      containEl: this.$refs["containRef"],
      moveEl: this.$refs["pullColBottom"],
      formerEl: this.$refs["colFormerBottom"],
      rearEl: this.$refs["colRearBottom"],
      type: "col"
    });
  },
  methods: {
    pull(options) {
      const { containEl, moveEl, formerEl, rearEl, type } = options;
      const typeDirection = {
        row: {
          client: "clientY",
          containSizeKey: "offsetHeight",
          styleKey: "height"
        },

        col: {
          client: "clientX",
          containSizeKey: "offsetWidth",
          styleKey: "width"
        }
      }[type];
      const containElSize = containEl[typeDirection.containSizeKey];
      let move;
      const El = this.$refs["pullUpDownRef"];
      const topEl = this.$refs["topRef"];
      const bottomEl = this.$refs["bottomRef"];
      const that = this;
      // 记住首次点击获取的位置
      let fristPull;
      const rowPercentTop = Number(that.getPercentVal(formerEl.style[typeDirection.styleKey])[0]);
      const rowPercentBottom = Number(that.getPercentVal(rearEl.style[typeDirection.styleKey])[0]);
      moveEl.addEventListener("mousedown", function (e) {
        // document.querySelector('html').style.cursor="row-resize"
        move = function (event) {
          fristPull = !fristPull ? e[typeDirection.client] : fristPull;
          const moveTop = event[typeDirection.client] - fristPull;
          let topPercentVal = rowPercentTop;
          let bottomPercentVal;
          const differPercent = (moveTop / containElSize).toFixed(30) * 100;
          topPercentVal += differPercent;
          if (topPercentVal > 100) topPercentVal = 100;
          if (topPercentVal < 0) topPercentVal = 0;
          bottomPercentVal = 100 - topPercentVal;
          formerEl.style[typeDirection.styleKey] = `calc(${topPercentVal}% - ${
            topPercentVal == 100 || topPercentVal == 0 ? 10 : 5
          }px)`;
          rearEl.style[typeDirection.styleKey] = `calc(${bottomPercentVal}% - ${
            bottomPercentVal == 100 || bottomPercentVal == 0 ? 10 : 5
          }px)`;
          event.preventDefault();
        };
        document.addEventListener("mousemove", move);
      });

      document.addEventListener("mouseup", function (e) {
        document.removeEventListener("mousemove", move);
      });

      document.querySelector("html").addEventListener("mouseup", function () {
        // document.querySelector('html').style.cursor="initial"
        moveEl.removeEventListener("mousemove", move);
      });
    },
    getPercentVal(value) {
      return value.match(/[\d\.]+(?=%)/g);
    },
    setCursorStyle(val) {
      this.resize = val;
    }
  }
};
</script>

<style lang="scss">
.fourgrid-contain {
  height: 100vh;
  overflow: hidden;

  // height: 500px;
  // margin: 100px auto 0 auto;
  // width:500px;
  .fourgrid-top {
    display: flex;
    // overflow: hidden;
    & > section {
      border: 1px solid #c0c0c0;
    }
  }
  .fourgrid-bottom {
    display: flex;
    // overflow: hidden;
    & > section {
      border: 1px solid #c0c0c0;
    }
  }

  .pullUpDown {
    height: 10px;
    background: rgb(238, 238, 238);
    &:hover {
      cursor: row-resize;
    }
  }
  .pull-left-right {
    width: 10px;
    background: rgb(238, 238, 238);
    &:hover {
      cursor: col-resize;
    }
  }

  .cursorStyle {
    cursor: col-resize;
  }
}
</style>
