<template>
  <div class="largeScreen-contain largeScreen-contain-style">
    <div id="box" style="width: 150px; height: 150px; background: red"></div>
    <largeScreenMain>
      <div ref="ThreeD" class="ThreeD"></div>
    </largeScreenMain>

    <!-- <div v-if="loading" class="loadingStyle">
      {{ inputValue }}
      <div class="loadingStyle-progress">
        <el-progress :percentage="inputValue" />
      </div>
    </div> -->
  </div>
</template>

<script>
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { XREstimatedLight } from "three/addons/webxr/XREstimatedLight.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
      let camera, scene, renderer;
      let controller;
      let defaultEnvironment;

      init();
      animate();

      function init() {
        // const container = document.createElement( 'div' );
        // document.body.appendChild( container );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          0.01,
          100000
        );
        camera.position.set(1, 1, 1);

        const defaultLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        defaultLight.position.set(0.5, 1, 0.25);
        scene.add(defaultLight);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xb9d3ff, 0.5); //调节透明度自行对比
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.physicallyCorrectLights = true;
        renderer.xr.enabled = true;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 0;
        controls.maxDistance = 2500;

        const helper = new THREE.AxesHelper(500000);

        scene.add(helper);

        const grid = new THREE.GridHelper(20000, 200, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        // const xrLight = new XREstimatedLight(renderer);

        // xrLight.addEventListener("estimationstart", () => {
        //   scene.add(xrLight);
        //   scene.remove(defaultLight);
        //   if (xrLight.environment) {
        //     scene.environment = xrLight.environment;
        //   }
        // });

        // xrLight.addEventListener("estimationend", () => {
        //   scene.add(defaultLight);
        //   scene.remove(xrLight);
        //   scene.environment = defaultEnvironment;
        // });

        new RGBELoader()
          .setPath("http://192.168.8.98:8080/examples/textures/equirectangular/")
          .load("royal_esplanade_1k.hdr", function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            defaultEnvironment = texture;

            scene.environment = defaultEnvironment;
          });

        //

        // document.body.appendChild(
        //   ARButton.createButton(renderer, { optionalFeatures: ["light-estimation"] })
        // );

        const ballGeometry = new THREE.SphereGeometry(0.175, 32, 32);
        const ballGroup = new THREE.Group();
        ballGroup.position.z = -2;

        const rows = 3;
        const cols = 3;

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const ballMaterial = new THREE.MeshStandardMaterial({
              color: 0xdddddd,
              //   roughness: i / rows,
              //   metalness: j / cols
              roughness: 0.1,
              metalness: 0.8888
            });
            console.log(
              {
                roughness: i / rows,
                metalness: j / cols
              },

              (i + 0.5 - rows * 0.5) * 0.4,
              (j + 0.5 - cols * 0.5) * 0.4,
              0
            );
            const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
            ballMesh.position.set((i + 0.5 - rows * 0.5) * 0.4, (j + 0.5 - cols * 0.5) * 0.4, 0);
            ballGroup.add(ballMesh);
          }
        }

        // const helper = new THREE.AxesHelper(500000);

        // scene.add(helper);

        scene.add(ballGroup);

        function onSelect() {
          ballGroup.position.set(0, 0, -2).applyMatrix4(controller.matrixWorld);
          ballGroup.quaternion.setFromRotationMatrix(controller.matrixWorld);
        }

        controller = renderer.xr.getController(0);
        controller.addEventListener("select", onSelect);
        scene.add(controller);

        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      //

      function animate() {
        renderer.setAnimationLoop(render);
      }

      function render() {
        renderer.render(scene, camera);
      }
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
