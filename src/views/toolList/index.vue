<template>
  <section class="toolist-style">初始化页面</section>
</template>
<script>
import origin from "@/utils/origin";

export default {
  name: "ToolList",
  data() {
    return {
      origin,
      htmlCodes: "",
      javascriptCodes: "",
      cssCodes: "",
      iFrameEl: "",
      iframeLoading: false,
      activeIndex: ""
    };
  },
  computed: {},
  beforeCreate() {
    const firstItem = origin[0] ? origin[0] : false;
    if (!firstItem) return;
    this.$router.push({ name: "ToolListDetail", params: { id: firstItem.code } });
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
.toolist-style {
  height: 100%;
  display: flex;

  .item-list-contain {
    flex: 0 0 200px;
    ul li {
      cursor: pointer;
    }
  }
  .edit-interface {
    flex: 1;
  }

  .edit-room-style {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .edit-room-top {
      display: flex;
      flex: 1;
      & > div {
        flex: 1;
      }
    }
    .edit-room-bottom {
      flex: 1;
    }
    .stageContainIframe {
      width: 100%;
      height: 100%;
    }
  }
  .activeStyle {
    background-color: #409eff;
    color: white;
  }
}
</style>
