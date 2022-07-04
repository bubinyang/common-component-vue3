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
  mounted() {},
  methods: {
    screen(e) {
      console.log(this.modelValue);
      const parentEl = e.currentTarget.parentElement;
      if (!this.modelValue) {
        parentEl.classList.add("expand-style");
      } else {
        parentEl.classList.remove("expand-style");
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
