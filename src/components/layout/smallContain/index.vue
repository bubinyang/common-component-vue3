<!--布局
上下布局，头部标题，底部内容结构
-->
<template>
  <div class="small-contain">
    <h2 v-if="title" class="small-contain-title">
      <label class="title" :style="styles">{{ title }}</label>
      <slot name="action" />
    </h2>
    <div class="small-contain-contain">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: "SmallContain",
  props: {
    title: {
      type: String,
      default() {
        return "";
      }
    },
    titleBgShow: {
      type: Boolean,
      default() {
        return true;
      }
    },
    titleDirection: {
      type: String,
      default() {
        return "left";
      }
    },
    transformYDeg: {
      type: [String, Number],
      default() {
        return 0;
      }
    },
    transformZDeg: {
      type: [String, Number],
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      value: "测试"
    };
  },
  computed: {
    styles() {
      return {
        textAlign: this.titleDirection,
        transform: `rotateY(${this.transformYDeg}deg) rotateZ(${this.transformZDeg}deg)`
        //background: this.titleBgShow?this.titleBg:'none'
      };
    }
  },
  created() {
    // axios.get(`/apis/api/Kanban/Bad01`).then(res => {})
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.small-contain {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;

  .small-contain-title {
    color: white;
    height: 33px;
    margin-bottom: 0;
    // font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    .title {
      background-repeat: no-repeat;
      height: 100%;
      background-size: contain;
      display: flex;
      justify-content: center;
      flex: 1;
    }
    label {
      display: block;
      color: black;
    }
  }
  .small-contain-contain {
    flex: 1;
    padding: 0 0.1rem;
    display: flex;
  }
}
</style>
