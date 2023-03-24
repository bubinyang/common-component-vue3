<template>
  <div class="largeScreen-contain largeScreen-contain-style">
    <div id="box" style="width: 150px; height: 150px; background: red"></div>
    <largeScreenMain>
      <div ref="ThreeD" class="ThreeD"></div>
    </largeScreenMain>
  </div>
</template>

<script>
const { LBTcamera, THREE, Stats } = window;
// import http from "@/service/baseService";
// import useThreeHooks from "@/views/board3D/oneMediumTemperatureCHW/useThreeHooks.js";
import {
  reactive,
  toRefs,
  computed,
  markRaw,
  ref,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  defineComponent
} from "vue";
import { ThreeBasic } from "@/utils/utils.ts";
// import { ThreeBasic } from "@/utils/chartDateFormatting.ts";
//import oneMediumTemperatureCHW from "./oneMdeiumTest/index.vue";
// import Swiper from "swiper";
// import one from "@/assets/images/temPoraryDemo/001.jpg";
// import two from "@/assets/images/temPoraryDemo/002.jpg";
// import three from "@/assets/images/temPoraryDemo/003.jpg";
// import five from "@/assets/images/temPoraryDemo/005.jpg";
// import six from "@/assets/images/temPoraryDemo/006.jpg";
// import seven from "@/assets/images/temPoraryDemo/007.jpg";
// import eight from "@/assets/images/temPoraryDemo/008.jpg";
// import nine from "@/assets/images/temPoraryDemo/9.jpg";
// import ten from "@/assets/images/temPoraryDemo/10.jpg";
import gsap from "gsap";

export default defineComponent({
  name: "3DClass",
  props: {
    show: { type: Boolean, default: () => true }
  },
  components: {},
  setup(props) {
    const state = reactive({ ThreeD: null });

    onBeforeMount(() => {
      // http
      //   .get("/sys/params/page", {
      //     order: "",
      //     orderField: "",
      //     page: 1,
      //     limit: 10,
      //     paramCode: "three3D_one"
      //   })
      //   .then(({ data: res }) => {
      //     const configCode = res.list && res.list.length > 0 ? JSON.parse(res.list[0].paramValue) : [];
      //     state.dialogTip = configCode;
      //     state.chwShow = true;
      //   });
    });
    onMounted(() => {
      console.log(state.ThreeD);
      //   gsap.fromTo("#box", { x: 10 }, { duration: 2, yoyo: true, delay: 1, repeat: -1, x: 300 });
      const newThreeBasic = new ThreeBasic({
        THREE,
        El: state.ThreeD,
        url: "./threejs/1110small.glb",
        assistTools: true
      });
      newThreeBasic.draw();
    });
    return { ...toRefs(state) };
  }
});
</script>
<style lang="scss">
.ThreeD {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
// .largeScreen-contain-style {
//   position: relative;

//   //height: calc(100vh - 50px - 38px - 30px);
//   height: calc(100vh);
//   color: white;
//   margin: 0 !important;
//   padding: 0 !important;
//   .main_box {
//     background: url("@/assets/images/boardWhole/board_bg.png");
//     // position: relative;
//   }

//   .el-date-editor--year {
//     width: 150px;
//   }
//   .el-select {
//     width: 100px;
//   }

//   .el-input {
//     .el-input__inner {
//       //   border: 0 !important;
//       //   border-radius: initial;
//       //background: transparent;
//       color: #00e3ff;

//       background: #142c53;
//       border: 1px solid #1f66c2;
//       border-radius: 2px;
//     }
//   }
//   ul {
//     margin: 0;
//     padding: 0;
//   }

//   .swiper-container {
//     flex: 1;
//     //   height: 200px;
//     border-radius: 10px;
//     height: 100%;
//     .swiper-slide {
//       width: 100%;
//     }
//   }
// }
</style>
