<!--
 * @Descripttion:
 * @version:
 * @Author: BBY
 * @Date: 2020-12-10 09:26:10
 * @LastEditTime: 2020-12-10 10:26:47
-->
<template>
  <div class="side-layout-component">

    <div v-if="$slots.side" class="side">
      <slot name="side"/>
    </div>
    <div class="content-contain">

      <slot name="main"/>

    </div>

  </div>
</template>

<script>
export default {
  name: 'SideLayout',
  components: {},
  data () {
    return {}
  },
  methods: {}
}
</script>

<style  lang="scss">

$sideWidth:250px;
.side-layout-component{
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 50px - 30px - 38px);
  // height: calc(#{$content--fill-height-tabs});
  .side{
    width:$sideWidth;
    margin-right: 10px;
    height: 100%;
  }
  .content-contain{
    background: white;
    border: 1px solid #EBEEF5;
    flex: 1;
    overflow: auto;
    padding:10px

  }
}

</style>
