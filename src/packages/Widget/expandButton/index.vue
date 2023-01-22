<template>
  <div class="expand-btn" @click="screen">
    <i
      :style="{ color: $attrs.expandColor || 'white' }"
      v-if="!modelValue"
      class="el-icon-full-screen"
    />
    <i :style="{ color: $attrs.expandColor || 'white' }" v-if="modelValue" class="el-icon-menu" />
  </div>
</template>
<script>
export default {
  name: "ExpandButton",
  components: {},
  props: {
    fullmodel: {
      type: Boolean,
      default() {
        return false;
      }
    },
    refName: {
      type: String,
      default() {
        return "";
      }
    },
    modelValue: {
      type: Boolean,
      default() {
        return false;
      }
    }
    // expandColor: {
    //   type: String,
    //   default() {
    //     return "white";
    //   }
    // }
  },
  data() {
    return {
      fullscreen: false
    };
  },
  computed: {},
  mounted() {
    //如果不是点击图标进行全屏/取消全屏，那么图标的状态值不会变，紧跟着它的样式也不会变化
    /**
     * Boolean(document.webkitCurrentFullScreenElement) 该属性可以判断是否全屏状态
     */
    window.addEventListener(
      "resize",
      () => {
        // if(Boolean(document.webkitCurrentFullScreenElement))
        this.$emit("update:modelValue", Boolean(document.webkitCurrentFullScreenElement));
      },
      false
    );
  },
  methods: {
    screen(e) {
      console.log(this.modelValue);
      const parentEl = e.currentTarget.parentElement;
      if (!this.modelValue) {
        // parentEl.classList.add("expand-style");
        //可以实现一键全屏
        parentEl["webkitRequestFullScreen"]();
      } else {
        //parentEl.classList.remove("expand-style");
        //一键取消全屏
        document["webkitCancelFullScreen"]();
      }
      // this.$emit("change", !this.fullmodel);
      this.$emit("update:modelValue", !this.modelValue);
      this.$emit("refresh");
    }
  },
  emits: ["update:modelValue", "refresh"]
};
</script>
<style lang="scss">
.expand-btn {
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 9999;
}
.expand-style {
  position: fixed !important;
  z-index: 2000 !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  height: auto !important;
  background: rgb(40, 146, 218) !important;
}
</style>
