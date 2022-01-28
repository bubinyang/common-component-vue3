<template>
  <div class="contain-layout-component">

    <div v-if="$slots.action" class="contain-layout-action">
      <slot name="action"/>
    </div>
    <div class="contain-layout-content">

      <slot name="contain"/>

    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContainLayout',
  components: {},
  props: {
    topFixHeight: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      isShow: true
    }
  },
  methods: {
  }
}
</script>

<style  lang="scss">
.contain-layout-component{
  border: 1px solid #ebeef5;
  background-color: #fff;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .contain-layout-content{
    flex:1;
    overflow: auto;
    display: flex;
  }
}
</style>
