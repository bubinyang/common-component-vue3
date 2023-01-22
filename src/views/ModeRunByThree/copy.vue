<template>
  <div class="factory3D-style" v-loading="loading" element-loading-text="模型加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <section class="logo-contain">
      <label class="title">{{ props.title }} </label>
    </section>

    <section class="box-contain">
      <div class="ThreeD"></div>
    </section>

    <section class="dialogLeft" :class="{ active: isShrink }">
      <ul>
        <li>
          <img :src="EERurl" />
          <h2>冷站能效EER {{ isShrink }}</h2>
          <label>7 W/W</label>
        </li>
        <li>
          <img :src="COPurl" />
          <h2>制冷机能效COP</h2>
          <label>6.5 W/W</label>
        </li>
        <li>
          <img :src="temperature" />
          <h2>室外温度</h2>
          <label>32 ℃</label>
        </li>
        <li>
          <img :src="humidity" />
          <h2>室外湿度</h2>
          <label>28 ℃</label>
        </li>
        <li>
          <img :src="wetbulbTemperature" />
          <h2>室外湿球温度</h2>
          <label>25 ℃</label>
        </li>
      </ul>
      <div class="shinkBtn" @click="shrink()">
        <i v-show="!isShrink" @click.stop="shrink()" class="el-icon-d-arrow-left"></i>
        <i v-show="isShrink" @click.stop="shrink()" class="el-icon-d-arrow-right"></i>
      </div>
    </section>
    <section class="status">
      <div>
        <i class="runIcon"></i>
        <h2>运行中</h2>
        <label>12</label>
      </div>
      <div>
        <i class="stopIcon"></i>
        <h2>停止中</h2>
        <label>4</label>
      </div>
      <div>
        <i class="fault"></i>
        <h2>故障中</h2>
        <label>2</label>
      </div>
      <div>
        <i class="start"></i>
        <h2>备启中</h2>
        <label>4</label>
      </div>
    </section>

    <div class="operation">
      <span @click="controlRestart()" class="rstart">
        <img :src="restart" />
      </span>

      <span @click="controlRotate()" class="rotate">
        <img :src="rotate" />
      </span>

      <!-- <span class="fullscreen">
        <img :src="EERurl" />
      </span> -->
    </div>
  </div>
</template>

<script>
import SmallContain from "@/components/large-home/smallContain/index.vue";
const { LBTcamera, THREE, Stats } = window;
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

// import clearTendencyChartOne from "@/views/board/clearComponent/clearTendencyChartOne.vue";
import { watch, reactive, toRefs, computed, markRaw, ref, onMounted, onBeforeMount, onBeforeUnmount, nextTick, onActivated, onDeactivated } from "vue";
//import Clock from "@/components/clok/index.vue";
import largeScreenMain from "@/components/large-home/largeScreen/index.vue";
import EERurl from "@/assets/images/three/01.png";
import COPurl from "@/assets/images/three/02.png";
import temperature from "@/assets/images/three/03.png";
import humidity from "@/assets/images/three/04.png";
import wetbulbTemperature from "@/assets/images/three/05.png";
import restart from "@/assets/images/three/restart.png";
import rotate from "@/assets/images/three/rotate.png";
import { flowTubes } from "./arrow.js";
import { createfly, createLinePoint, drawLine, goFly, domTag, generateVirtualLight } from "@/views/board3D/oneMediumTemperatureCHW/createFly.js";
const menu = [];
/**
 * origin 轨道线路数据源
 *
 */
var controls, camera, labelRenderer, mainRequestAnimationFrame, animate, origin;
const options = [
  {
    value: "选项1",
    label: "黄金糕"
  },
  {
    value: "选项2",
    label: "双皮奶"
  },
  {
    value: "选项3",
    label: "蚵仔煎"
  },
  {
    value: "选项4",
    label: "龙须面"
  },
  {
    value: "选项5",
    label: "北京烤鸭"
  }
];

const factoryList = [
  { code: "Cube038", name: "AB车间" },
  { code: "Cube039", name: "CD车间" },
  { code: "Cube040", name: "EF车间" },
  { code: "Cylinder007", name: "GJ车间" },
  { code: "Cube042", name: "拉丝车间" },
  { code: "Cube025", name: "四合院（东、南）" },
  { code: "Cylinder006", name: "五期磨细砂" },
  { code: "Cube041", name: "KM车间" },
  { code: "Cube026", name: "宿舍楼1" },
  { code: "Cube027", name: "宿舍楼2" },
  { code: "Cube029", name: "宿舍楼3" },
  { code: "Cube031", name: "宿舍楼4" },
  { code: "Cube036", name: "陶粒板车间" },
  { code: "Cube032", name: "U车间" },
  { code: "Cube028", name: "新创业运输公司" },
  { code: "Cube035", name: "构件车间" },
  { code: "Cube034", name: "PC钢棒B车间" },
  { code: "Cube033", name: "PC钢棒A车间" },
  { code: "立方体", name: "研发大楼" },
  { code: "Cube023", name: "建华学院" },
  { code: "Cube043", name: "码头磨细砂" },
  { code: "平面002", name: "码头磨细砂" },
  { code: "平面008", name: "码头磨细砂" },
  { code: "平面009", name: "码头磨细砂" },
  { code: "立方体015", name: "码头磨细砂" },
  { code: "立方体016", name: "码头磨细砂" },
  { code: "立方体017", name: "码头磨细砂" },
  { code: "平面004", name: "码头" },
  { code: "柱体022", name: "码头" },
  { code: "立方体003", name: "码头" },
  { code: "立方体010", name: "码头" },
  { code: "Archmodels55_37_hull003", name: "码头" },
  { code: "Archmodels55_37_hull002", name: "码头" },
  { code: "船22", name: "码头" },
  { code: "Obj_000001002", name: "码头" },
  { code: "柱体019", name: "码头" },
  { code: "柱体020", name: "码头" },
  { code: "Curve", name: "码头" }
];
window.allFlowAnimIdFns = [];
function debounce(fn, ms) {
  let timeout;
  return function () {
    if (timeout) clearTimeout(timeout);
    const actionNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, ms);
    if (actionNow) fn.apply(this, arguments);
  };
}
export default {
  components: {
    // Clock,
    // largeScreenMain
    // SmallContain,
    // mapComp,
    // systemEnery,
    // statisticsToday,
    // realTimeEnergyChart,
    // systemWater,
    // wasteWahterSystem,
    // systemWaterTwo,
    // wasteWahterSystemTwo,
    // yearEnergy,
    // dayEnergy,
    // buildEletricity,
    // centerFacility
    //wasteWahterSystemTwo
    // clearTendencyChartOne
    // SmallContain
  },
  props: {
    modeUrl: { type: String, default: () => "" },
    title: { type: String, default: () => "" },
    dialogTip: { type: Array, default: () => [] }
  },

  setup(props) {
    const state = reactive({
      menu,
      currentTitle: "洁净室温湿度运行数据",
      checkindex: 0,
      parent: "洁净系统",
      timer: null,
      systemEneryDateValue: "",
      systemEnergyLoactionList: options,
      systemEneryLocationValue: "",
      isShrink: false,
      EERurl,
      COPurl,
      temperature,
      humidity,
      wetbulbTemperature,
      restart,
      rotate,
      loading: true,
      autoRotate: false
    });

    onMounted(async () => {
      await nextTick();
      //   const El = document.querySelector(".ThreeD");
      //   console.log(El);
      getData.apply(this);
    });

    onBeforeUnmount(() => {
      //clearTimeout(state.timer);
    });

    onDeactivated(() => {
      if (origin) {
        origin.forEach((item) => {
          cancelAnimationFrame(item.mainRequestAnimationFrame);
        });
      }

      if (mainRequestAnimationFrame) cancelAnimationFrame(mainRequestAnimationFrame);
    });
    onActivated(() => {
      if (mainRequestAnimationFrame) mainRequestAnimationFrame = requestAnimationFrame(animate);
      if (origin) {
        origin.forEach((item) => {
          if (item.mainRequestAnimationFrame) {
            item.mainRequestAnimationFrame = item.goFly();
          }
        });
      }
    });
    // watch(
    //   () => [props.ratio],
    //   ([ratio]) => {
    //    // if (labelRenderer && labelRenderer.domElement) labelRenderer.domElement.style.transform = "scale(" + 1.06719 + ")";
    //   }
    // );

    //     onActivated(() => {
    //   window.boardDeactivated = false;
    //   window.allFlowAnimIdFns.forEach((a) => {
    //     if (a.fn) {
    //       a.id = requestAnimationFrame(a.fn);
    //     }
    //   });
    //   if (render) {
    //     window.renderId = requestAnimationFrame(render);
    //   }
    // });

    const shrink = function () {
      state.isShrink = !state.isShrink;
    };
    const controlRotate = function () {
      controls.autoRotate = true;
    };
    const controlRestart = function () {
      controls.autoRotate = false;
      camera.position.set(0, 0.3, 0.8);
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camera.lookAt({
        // 相机看向哪个坐标
        x: 0,
        y: 0,
        z: 0
      });
    };
    const getData = function () {
      const that = this;
      const El = document.querySelector(".ThreeD");
      if (!El) return;
      const width = El.offsetWidth;
      const height = El.offsetHeight;
      var renderer,
        // camera,
        scene,
        gui,
        light,
        stats,
        //controls,
        meshHelper,
        mixer,
        action,
        datGui,
        raycaster,
        mouse,
        points,
        curve,
        movingTarget,
        geoetryItem,
        cubeList, //曲线坐标点数据
        line, //曲线对象
        lineBufferGeometry, //画线几何类
        lineGeometry,
        lines,
        arrowGLTF,
        labelRendererAction,
        model; //完整工厂车间模型

      var path = 0;
      //curve 画出来的路径线

      // points 曲线点等分数组
      const signName = "圆锥";
      // const colorItem={r:0,g:191,b:255};//角锥颜色
      const colorHex = 0x52f5a5; // 十六进制颜色
      const colorHexTwo = 0x49f2df;
      const colorHexThree = 0xfec056;
      const signMeshs = [];
      const activeColor = 0xff0000;
      var clock = new THREE.Clock();

      function initRender() {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        // renderer.setClearColor(0xb9d3ff, 1)
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.sRGBEncoding; //让模型看上去更真实,模型更亮
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        // BakeShadows
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true;
        // 告诉渲染器需要阴影效果
        document.querySelector(".ThreeD").appendChild(renderer.domElement);
      }

      function initCamera() {
        camera = new THREE.PerspectiveCamera(35, width / height);
        // camera.position.set(200, 200, 200);
        camera.position.set(0, 0.3, 0.8);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
          // 相机看向哪个坐标
          x: 0,
          y: 0,
          z: 0
        });
      }

      function initScene() {
        scene = new THREE.Scene();
        //scene.background = new THREE.Color(0x010e31);
        // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
      }

      function initLight() {
        // scene.add(new THREE.AmbientLight(0x444444, 6)); //环境光
        light = new THREE.DirectionalLight(0xffffff, 1); //平行光
        light.position.set(60, 100, 40);
        light.castShadow = true;
        //   light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2.2);
        // scene.add(light);
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 50;
        // spotLight.position.set(50, 90, 50);
        spotLight.angle = Math.PI / 6;
        spotLight.castShadow = true;
        // scene.add(spotLight);
        //室内环境光，模拟threejs
        // const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // pmremGenerator.compileEquirectangularShader();
        // scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.5).texture;

        //环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        ambientLight.intensity = 0.5;
        scene.add(ambientLight);

        //添加舞台聚光灯
        const bigSpotLight = new THREE.SpotLight("#ffffff", 2);

        bigSpotLight.angle = Math.PI / 8;
        bigSpotLight.penumbra = 0.2;
        bigSpotLight.decay = 2;
        bigSpotLight.distance = 30;

        bigSpotLight.position.set(0, 10, 0);
        bigSpotLight.target.position.set(0, 0, 0);

        scene.add(bigSpotLight.target);
        scene.add(bigSpotLight);

        //四周灯光
        // 天花板灯
        const topLight = generateVirtualLight({
          THREE,
          intensity: 0.75,
          scale: [10, 10, 1],
          position: [0, 5, -9],
          rotation: [Math.PI / 2, 0, 0]
        });

        // 四周灯光
        //虚拟场景
        let virtualScene = new THREE.Scene();
        const fbo = new THREE.WebGLCubeRenderTarget(256);
        fbo.texture.type = THREE.HalfFloatType;
        const cubeCamera = new THREE.CubeCamera(1, 1000, fbo);

        virtualScene.add(cubeCamera);

        const leftTopLight = generateVirtualLight({
          THREE,
          intensity: 4,
          scale: [20, 0.1, 1],
          position: [-5, 1, -1],
          rotation: [0, Math.PI / 2, 0]
        });
        const leftBottomLight = generateVirtualLight({
          THREE,
          intensity: 1,
          scale: [20, 0.5, 1],
          position: [-5, -1, -1],
          rotation: [0, Math.PI / 2, 0]
        });
        const rightTopLight = generateVirtualLight({
          THREE,
          intensity: 1,
          scale: [20, 1, 1],
          position: [10, 1, 0],
          rotation: [0, -Math.PI / 2, 0]
        });

        const floatLight = generateVirtualLight({
          THREE,
          form: "ring",
          color: "white",
          intensity: "1",
          scale: 10,
          position: [-15, 4, -18],
          target: [0, 0, 0]
        });

        virtualScene.add(topLight);
        virtualScene.add(leftTopLight);
        virtualScene.add(leftBottomLight);
        virtualScene.add(rightTopLight);
        virtualScene.add(floatLight);

        scene.environment = fbo.texture;
        const virtualRender = () => {
          cubeCamera.update(renderer, virtualScene);
          requestAnimationFrame(virtualRender);
        };
        virtualRender();
      }

      // function getFitScaleValue(obj) {
      //   var boxHelper = new THREE.BoxHelper(obj);
      //   boxHelper.geometry.computeBoundingBox();
      //   var box = boxHelper.geometry.boundingBox; // 获取模型边界
      //   var maxDiameter = 1.5 * Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z); // 数值越大，模型越小
      //   return Math.ceil(LBTcamera.position.z / maxDiameter);
      // }

      function initModel() {
        console.log("加载");
        // 辅助工具
        var helper = new THREE.AxesHelper(500000);
        //scene.add(helper);

        // // 地板
        // const meshColor = new THREE.Color("rgb(35, 78, 176)");
        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 1 }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        //mesh.copy(points);

        //scene.add(mesh);
        var floorGeo = new THREE.PlaneGeometry(2000, 2000);
        var floorMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgb(41,55,109)"), side: THREE.DoubleSide });
        var floor = new THREE.Mesh(floorGeo, floorMaterial);
        floor.position.set(0, 10, -100);
        floor.rotation.x = -Math.PI / 2;
        floor.castShadow = true;
        floor.receiveShadow = true;
        //scene.add(floor);

        var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(41,55,109)") }));
        planeMesh.position.set(0, 10, -100);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.receiveShadow = true;
        //scene.add(planeMesh);
        // 添加地板割线
        var grid = new THREE.GridHelper(2000, 100);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        //scene.add(grid);

        //加载CSS2DRenderer
        labelRendererAction = getLabelRenderer();
        // setTotip();
        // 加载glb模型

        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath("./threejs/draco/gltf/");
        const loaderGLTF = new THREE.GLTFLoader();
        loaderGLTF.setDRACOLoader(dracoLoader);
        loaderGLTF.load(
          `./${props.modeUrl}`,
          //"./modelDraco.glb",
          function (gltf) {
            model = gltf.scene;
            // model.position.set(1, 1, 0);
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            model.rotation.set(0, Math.PI, 0);

            scene.add(model);
            loaderGLTF.load("./arrow.glb", function (arrGltf) {
              arrowGLTF = arrGltf;
              //  getArrowSetLine();
              state.loading = false;
              setTotip();
            });
          },
          function () {
            console.log("加载中");
          },
          function (e) {
            console.error(e);
          }
        );

        // 加载模型
        var loader = new THREE.FBXLoader();

        // 加载图标
        const modeZ = 150;
        console.log(loader);
        // 加载建筑
        // loader.load("./factory3.fbx", function (mesh) {
        //   // 添加骨骼辅助
        //   // meshHelper = new THREE.SkeletonHelper(mesh);
        //   // scene.add(meshHelper);

        //   // 设置模型的每个部位都可以投影
        //   mesh.traverse(function (child) {
        //     if (child.isMesh) {
        //       child.castShadow = true;
        //       child.receiveShadow = true;
        //     }
        //   });
        //   mesh.position.z += modeZ;
        //   mesh.position.y -= 0;

        //   //   let LBTscale = getFitScaleValue(mesh);
        //   //     // 放大三维显示倍数，默认为1
        //   //     object.scale.multiplyScalar(LBTscale);
        //   console.log(mesh);
        //   scene.add(mesh);
        //   that.loading = false;
        // });
        El.addEventListener("click", onMouseClick, false);
        // El.addEventListener('mousemove', debounce(
        //   function(){console.log('移动')}
        // ), false)
        El.onmousemove = debounce(function () {
          //that.itemContentShow = false;
        }, 500);
      }

      //设置图标飞行
      function arrowFly() {
        for (let i = 0; i < flowTubes.length; i++) {
          // 水管流动
          const t = flowTubes[i];
          const pathLine = model.getObjectByName(t.name);
          let paths = []; // 构建三维样条曲线的点数不能太多，否则影响飞线效果。
          const pathGeometry = pathLine.geometry;
          let positionAttribute = pathGeometry.getAttribute("position");
          const space = t.space;

          for (let i = 0; i < positionAttribute.count; i += space) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            pathLine.localToWorld(vertex);
            paths.push(vertex);
          }
          if (t.reverse) {
            paths = paths.reverse();
          }
          const clonedArrow = arrowGLTF.scene.clone();
          clonedArrow.isCloneArrow = true;
          clonedArrow.scale.set(1000, 1000, 1000);
          clonedArrow.position.set(-50, 50, 50);
          clonedArrow.updateMatrixWorld();
          clonedArrow.updateWorldMatrix();
          scene.updateMatrixWorld();
          scene.updateWorldMatrix();
          scene.add(clonedArrow);
          createfly(paths, t.customPointsLength, "#FF5446", THREE, clonedArrow, t.rotation, scene);

          // const flowWater = createfly(paths, t.customPointsLength, "#FF5446", three);
          // scene.add(flowWater);
        }
      }

      function getArrowSetLine() {
        //多条轨道
        origin = [
          {
            points: [
              { x: 414.91082872940825, y: 10.205769216229951, z: -929.4445234997431 },
              { x: 414.8391698278758, y: 9.103288410516644, z: 809.4125495134166 },
              { x: -147.00615992485407, y: 11.103551208108014, z: 811.1245573438093 }
            ],
            speed: 0.005,
            key: "one"
          },

          {
            points: [
              { x: 592.556895241524, y: 8.414869750731222, z: -924.4975779586704 },
              { x: 593.2068358763756, y: 9.120697927528449, z: 754.028686987643 },
              { x: 414.59675900900226, y: 9.236430684491854, z: 769.8633236095969 }
            ],
            speed: 0.005,
            key: "two"
          }
        ];

        origin.forEach((item) => {
          const { points } = item;
          const arrow = arrowGLTF.scene.clone();
          arrow.scale.set(1000, 1000, 1000);
          scene.add(arrow);
          const { cubeList } = createLinePoint({ initialPoints: points, THREE, scene });
          const { line, curve } = drawLine({
            position: cubeList.map((cube) => cube.position),
            THREE
          });
          console.log(line);
          scene.add(line);
          item.goFly = goFly({ curve, targeItem: arrow, item });
          item.goFly();
        });
      }

      function getLabelRenderer() {
        labelRenderer = new CSS2DRenderer();
        const containEl = document.querySelector(".ThreeD");
        const width = containEl.offsetWidth;
        const height = containEl.offsetHeight;
        labelRenderer.setSize(width, height);
        const El = document.querySelector(".factory3D-style");
        const { top, left } = El.getBoundingClientRect();
        labelRenderer.domElement.style.transformOrigin = "left top";
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.left = "0px";
        labelRenderer.domElement.style.pointerEvents = "none";
        containEl.appendChild(labelRenderer.domElement);
        return labelRenderer;
      }

      function setTotip() {
        // const dialogTip = [
        //   {
        //     id: "one",
        //     label: "设备1",
        //     position: { x: -40.339814351422575, y: 50.94430054091745, z: 253.68931618741232 }
        //   },
        //   {
        //     id: "two",
        //     label: "设备2",
        //     position: { x: -40.339814351422575, y: 50.94430054091745, z: 369.4471831471705 }
        //   }
        // ];

        // createLinePoint({
        //   initialPoints: props.dialogTip.map((item) => item.position),
        //   THREE,
        //   scene
        // });

        let domDialog;
        props.dialogTip.forEach((item, index) => {
          domDialog = document.createElement("div");
          if (!item.noClass) {
            domDialog.className = `title-text`;
          } else if (item.levelone) {
            //1级的时候为黄色
            domDialog.className = `levelone`;
          }

          domDialog.innerHTML = item.label;
          // domDialog.innerHTML = JSON.stringify(item);
          item.position.x = item.position.x / 3900;
          item.position.y = item.position.y / 3900;
          item.position.z = item.position.z / 3900;
          const dom = domTag(domDialog, item.position, item.id);
          scene.add(dom);
        });
      }
      function onMouseClick(event) {
        const elRect = El.getBoundingClientRect();
        const left = event.clientX - elRect.left;
        const top = event.clientY - elRect.top;
        // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        mouse.x = (left / elRect.width) * 2 - 1;
        mouse.y = -(top / elRect.height) * 2 + 1;

        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(scene.children, true);
        const currentItem = intersects[0] ? intersects[0].object.name : false;
        if (intersects[0]) {
          // console.log(
          //   `x:${intersects[0].point.x},y:${intersects[0].point.y},y:${intersects[0].point.z}`
          // );
        }
        const findItem = factoryList.find((item) => item.code === currentItem);
        if (findItem) {
          that.clickHorse(event, findItem);
        } else {
          // that.itemContentShow = false;
        }
      }

      // 添加光线投射找到对应模型
      function initraycasterFunc() {
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
      }

      // 初始化性能插件
      function initStats() {
        stats = new Stats();
        // document.querySelector('.ThreeD').appendChild(stats.dom)
      }

      function initControls() {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        // controls.minPolarAngle = 10;
        controls.maxPolarAngle = 1.5;
        // 设置控制器的中心点
        // controls.target.set( 0, 100, 0 );
        // 如果使用animate方法时，将此函数删除
        // controls.addEventListener( 'change', render );
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
        // controls.dampingFactor = 0.25;
        // 是否可以缩放
        controls.enableZoom = true;
        // 是否自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 3;
        // 设置相机距离原点的最远距离
        controls.minDistance = 0;
        // 设置相机距离原点的最远距离
        controls.maxDistance = 5000;
        // 是否开启右键拖拽
        controls.enablePan = true;
        //controls.target = new THREE.Vector3(500, 200, 0);
      }

      function render() {
        // var time = clock.getDelta();
        // if (mixer) {
        //   mixer.update(time);
        // }

        controls.update();
      }

      //绘制曲线运动轨迹

      function setCatmullRomCurve3() {
        /**绘制方块 */
        const initialPointsOther = [
          { x: -800, y: 300, z: 400 },
          { x: -600, y: 300, z: 800 },
          { x: 200, y: 300, z: 200 },
          { x: 200, y: 300, z: -200 },
          { x: 600, y: 300, z: -500 }
        ];
        const initialPoints = [
          { x: 1075.3834454744501, y: 109.871325565605753, z: 322.08633024099527 },
          { x: -1132.0475222805737, y: 125.50002615639014, z: 313.47358128384633 },
          { x: -1124.548672156688, y: 125.499939967936353, z: -215.54737535147314 }
          // { x: -542.0403852323634, y: 104.60817797049014e-14, z: -207.53388590756322 },
          // { x: -469.12216181887413, y: 125.49995609910628, z: -116.53495989594364 },
          // { x: 1134.969953388329, y: 123.678173754689727, z: -115.40666175158849 }
        ];
        //画直线
        geoetryItem = new THREE.Geometry();
        initialPointsOther.forEach((item) => {
          const { x, y, z } = item;
          geoetryItem.vertices.push(new THREE.Vector3(x, y, z));
        });
        console.log(geoetryItem.vertices[0].set);
        // geoetryItem.vertices.push(
        //   new THREE.Vector3(-800, 100, 400),
        //   new THREE.Vector3(-600, 100, 800)
        // );
        const lineItem = new THREE.LineLoop(geoetryItem, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
        scene.add(lineItem);

        const list = [];
        //根据基础坐标值创建相应的四方体
        const addCube = (pos) => {
          const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
          const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
          const cube = new THREE.Mesh(geometry, material);
          //  list.push(cube);
          cube.position.copy(pos);
          scene.add(cube);
          return cube;
        };

        cubeList = initialPoints.map((pos) => {
          return addCube(pos);
        });
        console.log(cubeList);
        /**绘制曲线方法*/
        curve = new THREE.CatmullRomCurve3(
          cubeList.map((cube) => cube.position) // 直接绑定方块的position以便后续用方块调整曲线
          // [new THREE.Vector3(-10, 0, 10), new THREE.Vector3(-5, 5, 5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, -5, 5), new THREE.Vector3(10, 0, 10)]
        );
        curve.curveType = "catmullrom"; // 曲线类型
        curve.tension = 0.01; //曲线张力设置小一点，可以减少弧度(实现直线)
        curve.closed = false; // 曲线是否闭合
        curve.arcLengthDivisions = 2;

        //第一种创造线条的方法
        points = curve.getPoints(50); // 50等分获取曲线点数组
        lineGeometry = new THREE.Geometry();
        for (let i = 0; i < 50; i++) {
          lineGeometry.vertices.push(new THREE.Vector3());
        }
        line = new THREE.Line( // LineLoop画出来的曲线是闭环，最后一个点会连接到第一个点。 Line画出来的是非闭环
          // lineBufferGeometry.setFromPoints(points),
          lineGeometry.clone(),
          new THREE.LineBasicMaterial({ color: 0x00ff00 })
        ); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了
        scene.add(line);

        drawLineUpdate();

        //创造一个跑动点movingTarget

        var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        movingTarget = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), material);

        movingTarget.position.x = 500;
        movingTarget.position.y = 500;
        movingTarget.position.z = 500;

        movingTarget.castShadow = true;
        movingTarget.receiveShadow = true;
        console.log(movingTarget);
        scene.add(movingTarget);

        //测试
        const materials = new THREE.LineBasicMaterial({
          color: 0x0000ff
        });

        const pointsList = [];
        pointsList.push(new THREE.Vector3(-10, 0, 0));
        pointsList.push(new THREE.Vector3(0, 10, 0));
        pointsList.push(new THREE.Vector3(10, 0, 0));

        const geometrys = new THREE.BufferGeometry().setFromPoints(pointsList);

        lines = new THREE.Line(geometrys, materials);
        console.log(geometrys.setAttribute);
        scene.add(lines);
      }

      // transformContols 事件操作
      function transformContols() {
        console.log(renderer.domElement);
        const transformControl = new THREE.TransformControls(camera, renderer.domElement);
        transformControl.addEventListener("change", render);
        scene.add(transformControl);
        transformControl.addEventListener("mouseDown", function (e) {
          console.log("鼠标按下ss");
          console.log(line);
          //	cancelHideTransorm();
        });

        var dragcontrols = new THREE.DragControls(cubeList, camera, renderer.domElement); //
        dragcontrols.enabled = false;
        dragcontrols.addEventListener("hoveron", function (event) {
          transformControl.attach(event.object); //加载显示3D控制器
          // cancelHideTransorm();
        });

        dragcontrols.addEventListener("hoveroff", function (event) {
          console.log("鼠标离开模型", event.object);
          transformControl.detach(event.object); //去除加载3D控制器
        });

        transformControl.addEventListener("objectChange", function (e) {
          drawLineUpdate();
        });
      }

      //画出线
      function drawLineUpdate() {
        for (var i = 0; i < 50; i++) {
          var p = line.geometry.vertices[i];
          var t = i / (50 - 1);
          curve.getPoint(t, p);
        }
        line.geometry.verticesNeedUpdate = true;
      }

      animate = function () {
        // 更新控制器
        render();

        // 更新性能插件
        //stats.update();

        renderer.render(scene, camera);
        path += 0.005;
        path %= 1;
        // movingTarget.position.copy(curve.getPointAt(path));
        if (labelRendererAction) labelRendererAction.render(scene, camera);
        mainRequestAnimationFrame = requestAnimationFrame(animate);
      };

      function draw() {
        // 兼容性判断
        // if (!Detector.webgl) Detector.addGetWebGLMessage();

        // initGui();
        initRender();
        initScene();
        // setCatmullRomCurve3();

        // initraycasterFunc();
        initCamera();
        initLight();
        initModel();
        initControls();
        //transformContols();
        initStats();

        animate();
      }
      draw();
    };

    //插入线并运动方法

    return {
      shrink,
      controlRotate,
      controlRestart,
      props,
      ...toRefs(state)
    };
  }
};
</script>
<style lang="scss">
.factory3D-style {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;

  .logo-contain {
    height: 77px;
    width: 100%;
    position: absolute;
    background-image: url("@/assets/images/three/top.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;

    .title {
      //width: 308px;
      height: 50px;
      font-size: 35px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      line-height: 25px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-30%);
      top: 50%;

      // font-weight: bold;
      // color: #ffffff;
      //  line-height: 18px;
      display: inline-block;
      background: linear-gradient(0deg, #0091f6 0%, #96f6fa 71.044921875%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .box-contain {
    flex: 1;
    margin-top: 72px;
    margin-left: 37px;
    margin-right: 37px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .ThreeD {
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      cursor: pointer;
    }
  }

  .dialogLeft {
    transition: left 1s;
    position: absolute;
    width: 232px;
    height: 487px;
    left: 0px;
    // border: 1px solid;
    top: 100px;
    background-image: url("@/assets/images/three/dialogLeft_bg.png");
    // background-size: contain;
    background-repeat: no-repeat;
    z-index: 2;
    ul {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      li {
        height: 72px;
        background-image: url("@/assets/images/three/dialogLeft_item_bg.png");
        background-size: 220px 100%;
        background-repeat: no-repeat;
        position: relative;

        h2 {
          position: absolute;
          top: 13px;
          left: 66px;
          // width: 109px;
          height: 18px;
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          line-height: 18px;
          display: inline-block;

          background: linear-gradient(0deg, #0091f6 0%, #96f6fa 71.044921875%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        label {
          position: absolute;
          bottom: 6px;
          left: 66px;
          display: inline-block;
          // width: 76px;
          height: 26px;
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
        }
        img {
          position: absolute;
          top: 50%;
          left: 13px;
          transform: translateY(-50%);
        }
      }
    }

    .shinkBtn {
      cursor: pointer;
      position: absolute;
      background: rgba(18, 28, 60, 0.8);
      width: 30px;
      height: 50px;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      @include contentCenter;
    }
  }
  .active {
    // border: 2px solid red;
    left: -232px;
  }

  .status {
    position: absolute;
    z-index: 2;
    right: 0px;
    top: 100px;
    width: 128px;
    height: 405px;
    background-image: url("@/assets/images/three/status_bg.png");
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      position: relative;
      flex: 1;
    }
    h2 {
      color: #ffffff;
      font-size: 18px;
      position: absolute;
      top: 20px;
      left: 60px;
    }
    label {
      color: #58dbff;
      font-size: 27px;
      position: absolute;
      bottom: 10px;
      left: 60px;
    }
    i {
      display: inline-block;
      height: 28px;
      width: 28px;
      border-radius: 28px;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      // background: red;
    }
    .runIcon {
      background-image: linear-gradient(rgb(58, 251, 115), rgb(5, 219, 52));
    }
    .stopIcon {
      background-image: linear-gradient(rgb(242, 242, 242), rgb(242, 242, 242));
    }
    .fault {
      background-image: linear-gradient(rgb(251, 63, 84), rgb(217, 3, 43));
    }
    .start {
      background-image: linear-gradient(rgb(20, 172, 242), rgb(0, 106, 224));
    }
  }

  .testBg {
    position: absolute;
    top: 0;
    span {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url("@/assets/images/three/test.png");
      background-size: 60px 40px;
    }
    .one {
      background-position: -20px 0;
    }
  }

  .operation {
    position: absolute;
    left: 50px;
    top: 20px;
    & > span {
      display: inline-block;
      cursor: pointer;
      margin: 0 10px;
    }
  }
}

.title-text {
  position: absolute;
  border: 1px solid rgb(33 186 206);
  min-width: 50px;
  height: 30px;
  background: rgba(27, 74, 127, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
.levelone {
  @extend .title-text;
  background: none;
  color: yellow;
  border: 0;
}
</style>
