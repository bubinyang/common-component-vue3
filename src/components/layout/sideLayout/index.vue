<template>
  <div class="side-layout-component">
    <div v-if="$slots.side" class="side">
      <slot name="side" />
    </div>
    <div class="content-contain">
      <slot name="main" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SideLayout",
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
$sideWidth: 250px;
.side-layout-component {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 500px);
  // height: calc(#{$content--fill-height-tabs});
  .side {
    width: $sideWidth;
    margin-right: 10px;
    height: 100%;
  }
  .content-contain {
    background: white;
    border: 1px solid #ebeef5;
    flex: 1;
    overflow: auto;
    padding: 10px;
  }
}
</style>
