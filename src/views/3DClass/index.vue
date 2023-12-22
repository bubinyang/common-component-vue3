<template>
  <div class="largeScreen-contain largeScreen-contain-style">
    <!-- <div id="box" style="width: 150px; height: 150px; background: red"></div> -->
    <div @click="rotate()">旋转</div>
    <largeScreenMain>
      <div ref="ThreeD" class="ThreeD"></div>
    </largeScreenMain>

    <div v-if="loading" class="loadingStyle">
      {{ inputValue }}
      <div class="loadingStyle-progress">
        <el-progress :percentage="inputValue" />
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// const { LBTcamera, THREE, Stats } = window;
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
import gsap from "gsap";
let newThreeBasic;
export default defineComponent({
  name: "3DClass",
  props: {
    show: { type: Boolean, default: () => true }
  },
  components: {},
  setup(props) {
    const state = reactive({
      ThreeD: null,
      inputValue: 0,
      loading: true,
      newThreeBasicVal: 0,
      newThreeBasic: { progress: 0 }
    });

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
      //   gsap.fromTo("#box", { x: 10 }, { duration: 2, yoyo: true, delay: 1, repeat: -1, x: 300 });
      newThreeBasic = new ThreeBasic({
        THREE,
        El: state.ThreeD,
        // url: "./new.glb",
        url: "./threejs/two_compress_edit.glb",
        assistTools: true
      });

      const getProgress = setInterval(() => {
        state.inputValue = newThreeBasic.progress;
        state.loading = newThreeBasic.loading;
        if (newThreeBasic.progress === 100) clearInterval(getProgress);
      }, 1000);
    });

    const rotate = function () {
      newThreeBasic.controls.autoRotate = true;
    };
    return { ...toRefs(state), rotate };
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
.largeScreen-contain-style {
  // background: rgba(1, 14, 50, 1);
  .title-remark {
    background: url("@/assets/img/home/item_bg.png");
    background-size: contain;
    color: white;
  }
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

.loadingStyle {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
.loadingStyle-progress {
  width: 200px;
}
</style>
