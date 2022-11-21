<template>
  <div
    class="Three-contain"
    v-loading="loading"
    element-loading-text="模型加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="current-points-style">
      <div v-for="(item, key) in currentPonts" :key="key">
        <div>x:{{ item.x }}</div>
        <div>y:{{ item.y }}</div>
        <div>z:{{ item.z }}</div>
      </div>
    </div>
    <div class="ThreeD" @mousemove="hideDialog"></div>
    <div class="dialog-contain">
      <div v-show="itemContentShow" class="item-content" :style="positionStyle">
        <div class="text-top"></div>
        <div class="title">{{ title || "EF车间" }}</div>
        <div class="text-set" v-for="(item, index) in dialogContentList" :key="index">
          <div class="dot"></div>
          <span>
            <label class="label-style">今日{{ item.name }} :</label>
            <span class="color-set">{{ item.data }} </span>
            <label class="unit-style">{{ item.unit }}</label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const { LBTcamera, THREE, Stats } = window;
import { DRACOLoader } from "@/utils/DRACOLoader.js";
import {
  createLinePoint,
  drawLine,
  goFly,
  updateLineByChangeMainPoint,
  domTag,
  getLabelRenderer
} from "@/utils/threeUtils.js";
import { max } from "moment";
// import app from "@/constants/app";
// import { Flow } from "three/addons/modifiers/CurveModifier.js";
// import { Flow } from "https://threejs.org/examples/jsm/modifiers/CurveModifier.js";

// import { newSetDialogPosition } from "@/utils";
// import { searchWorkShopConsumption } from "@/request/home";
// 建筑模型列表
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
  name: "factory",
  props: {
    ratio: {
      type: [Number, String],
      default: () => 1
    }
  },
  data() {
    return {
      itemContentShow: false,
      positionStyle: {},
      dialogContentList: [
        // { label: '今日电用量', usage: 100, unit: 'kWh' }, { label: '今日蒸汽用量', usage: 100, unit: 't' },
        // { label: '今日天然气用量', usage: 100, unit: 'Nm3' }, { label: '今日水用量', usage: 100, unit: 't' }
      ],
      title: "",
      loading: false,
      currentPonts: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.init();
    });
  },
  methods: {
    init() {
      // searchWorkShopConsumption({
      //   keys: "A29,E3",
      //   time: this.$moment().format("YYYY-MM-DD"),
      //   timeType: "dd",
      //   tbKeySuffix: ""
      // })
      //   .then((res) => {
      //     const list = res.data.data.list;
      //     factoryList.forEach((item) => {
      //       const findItem = list.find((childitem) => childitem.deviceName === item.name);
      //       item.deviceCode = findItem?.deviceCode;
      //       item.deviceName = findItem?.deviceName;
      //       item.entityId = findItem?.entityId;
      //       item.list = findItem?.list;
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    hideDialog() {
      // this.itemContentShow=false
    },
    getData() {
      const that = this;
      const El = document.querySelector(".ThreeD");
      if (!El) return;
      const width = El.offsetWidth;
      const height = El.offsetHeight;
      var renderer,
        camera,
        scene,
        gui,
        light,
        stats,
        controls,
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
        cureCuttingNumber = 50,
        flower,
        arrowData,
        labelRenderer,
        lineObject = {}; //多条线的实体列表
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
        // 告诉渲染器需要阴影效果
        document.querySelector(".ThreeD").appendChild(renderer.domElement);
      }

      function initCamera() {
        camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 10000000);
        // camera.position.set(200, 200, 200);
        camera.position.set(0, 250, 10000);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
          // 相机看向哪个坐标
          x: 500,
          y: 500,
          z: 0
        });
      }

      function initScene() {
        scene = new THREE.Scene();
        //scene.background = new THREE.Color(0x010e31);
        // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
      }

      function initLight() {
        /**
         * 常规增加光照
         */
        // scene.add(new THREE.AmbientLight(0x444444, 1.0)); //环境光

        // light = new THREE.DirectionalLight(0xffffff, 1.0); //平行光
        // light.position.set(0.5, 1, 0.5);
        // // 告诉平行光需要开启阴影投射
        // light.castShadow = true;
        // scene.add(light);
        /**
         * 模拟舍内光(模型导入)
         */
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.5).texture;
      }

      // function getFitScaleValue(obj) {
      //   var boxHelper = new THREE.BoxHelper(obj);
      //   boxHelper.geometry.computeBoundingBox();
      //   var box = boxHelper.geometry.boundingBox; // 获取模型边界
      //   var maxDiameter = 1.5 * Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z); // 数值越大，模型越小
      //   return Math.ceil(LBTcamera.position.z / maxDiameter);
      // }

      function initModel() {
        console.log("执行");
        // 辅助工具
        var helper = new THREE.AxesHelper(500000);
        scene.add(helper);

        // // 地板
        const meshColor = new THREE.Color("rgb(35, 78, 176)");
        var mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(2000, 2000),
          new THREE.ShadowMaterial({ opacity: 0.2 })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        // mesh.copy(points);

        scene.add(mesh);

        // 添加地板割线
        var grid = new THREE.GridHelper(20000, 100);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        //加载CSS2DRenderer
        labelRenderer = getLabelRenderer({ width, height });
        setTotip();

        //加载GLB模型
        const loaderGLTF = new THREE.GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("./threejs/draco/gltf/");
        loaderGLTF.setDRACOLoader(dracoLoader);

        loaderGLTF.load("./threejs/1110small.glb", function (mesh) {
          let glfItem;
          flower = mesh.scene;
          //放大缩小模型
          console.log(flower);
          flower.scale.set(3900, 3900, 3900);
          //遍历模型里面的各种小部件
          flower.traverse((item) => {
            if (item.name === "仪器") glfItem = item;
          });
          //flower.scale.copy(new THREE.Vector3(50, 50, 50)); //通过copy放大50倍
          // flower.scale.set(1, 1, 1); //通过set放大50倍
          glfItem.material.color.set("yellow"); //模型外表设置颜色为黄色 material外观材质
          //打印glfColor.material.constructor你会发现它的类型就是MeshStandardMaterial，颜色可以通过color.set进行设置
          //为什么flower可以直接使用set方法设置scale和position等属性，因为flower的constructor看到的scene,包含了Objec3D基础对象类，
          //基础对象类有position和scale这些属性，而这些属性又是三维向量Vector3的类型，Vector3具有set等方法

          //可以拿到模型中的某一个几何体,并进行多边形物体类创建
          /*const geometry = mesh.scene.children[2].geometry;
          flower = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(35, 78, 176)") })
          );
          flower.scale.copy(new THREE.Vector3(4000, 4000, 4000)); //glb模型放大*/
          scene.add(flower);
          loaderGLTF.load("./threejs/arrow.glb", function (arrow) {
            arrowData = arrow;
            getArrowSetLine();
          });
        });
        // 加载FBX模型
        var loader = new THREE.FBXLoader();

        // 加载路面

        // 加载图标
        const modeZ = 150;
        console.log("加载");

        // 加载建筑
        // loader.load("./threejs/factory1.fbx", function (mesh) {
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

        //   console.log(mesh);
        //   scene.add(mesh);
        //   that.loading = false;
        // });
        El.addEventListener("click", onMouseClick, false);
        // El.addEventListener('mousemove', debounce(
        //   function(){console.log('移动')}
        // ), false)
        El.onmousemove = debounce(function () {
          that.itemContentShow = false;
        }, 500);
        // El.addEventListener('contextmenu', function(event) {
        // resetSign();
        // that.show = false;
        // }, false);
        // El.addEventListener('mousemove', function(e) {
        // resetSign();
        // that.show = false;
        // });
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
          console.log(
            `x:${intersects[0].point.x},y:${intersects[0].point.y},y:${intersects[0].point.z}`
          );
        }
        const findItem = factoryList.find((item) => item.code === currentItem);
        if (findItem) {
          that.clickHorse(event, findItem);
        } else {
          that.itemContentShow = false;
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
        controls.autoRotateSpeed = 0.5;
        // 设置相机距离原点的最远距离
        controls.minDistance = 15;
        // 设置相机距离原点的最远距离
        controls.maxDistance = 8000;
        // 是否开启右键拖拽
        controls.enablePan = true;
        //由于OrbitControls,和camera lookAt冲突，改变相机朝向位置需要用controls.target
        // controls.target = new THREE.Vector3(1500, 1500, 500);
        // controls.enabled = false;
        //增加点击3D空间事件
        controls.addEventListener("start", (event) => {
          // console.log("3D空间按下触发", event);
        });

        //增加离开3D空间事件
        controls.addEventListener("end", (event) => {
          // console.log("3D空间鼠标松手触发", event);
        });
      }

      function render() {
        var time = clock.getDelta();
        if (mixer) {
          mixer.update(time);
        }

        controls.update();
      }

      //绘制曲线运动轨迹 拉拽寻找坐标点逻辑

      function setCatmullRomCurve3() {
        //根据基础坐标值创建相应的四方体
        cubeList = createLinePoint({ THREE, scene }).cubeList;
        /**绘制线路*/
        const drawLineReturn = drawLine({ position: cubeList.map((cube) => cube.position), THREE });
        line = drawLineReturn.line;
        curve = drawLineReturn.curve;
        scene.add(line);
        //创造一个点目的是沿着线路运行
        creatMoveItem();

        //arrowData
      }

      function getArrowSetLine() {
        //多条轨道
        const origin = [
          {
            points: [
              { x: 935.4736532220461, y: 125.72124294247564, z: 1292.9298960835008 },
              { x: 852.3585184605006, y: 126.579089893769847, z: 1679.3401069559873 },
              { x: 623.8722171402046, y: 273.6766653395756, z: 1775.0513808810504 }
            ],
            speed: 0.005,
            key: "one"
          },
          {
            points: [
              { x: 391.3617063106858, y: 64.25004833278402, z: 2417.8107032109883 },
              { x: 255.5820537741204, y: -1.590312712515221, z: 2863.653726133555 },
              { x: 63.968133554482776, y: 292.5416169737242, z: 2903.89072115592 }
            ],
            speed: 0.005,
            key: "two"
          }
        ];

        origin.forEach((item) => {
          const { points } = item;
          const arrow = arrowData.scene.clone();
          arrow.scale.set(1000, 1000, 1000);
          scene.add(arrow);
          const { cubeList } = createLinePoint({ initialPoints: points, THREE, scene });
          console.log(cubeList);
          const { line, curve } = drawLine({
            position: cubeList.map((cube) => cube.position),
            THREE
          });
          scene.add(line);
          item.goFly = goFly({ curve, targeItem: arrow });
          item.goFly();
        });
      }

      function creatMoveItem() {
        //创造一个跑动点movingTarget
        var material = new THREE.MeshLambertMaterial({
          color: new THREE.Color("rgb(35, 78, 176)")
        });
        movingTarget = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), material);
        movingTarget.position.x = 1075.3834454744501;
        movingTarget.position.y = 109.87132556560576;
        movingTarget.position.z = 322.08633024099527;
        movingTarget.castShadow = true;
        movingTarget.receiveShadow = true;
        scene.add(movingTarget);
      }
      // transformContols 事件操作
      function transformContols() {
        console.log(renderer.domElement);
        const transformControl = new THREE.TransformControls(camera, renderer.domElement);
        transformControl.addEventListener("change", render);
        scene.add(transformControl);
        transformControl.addEventListener("mouseDown", function (e) {
          console.log("鼠标按下ss");
          console.log(e.object);
        });
        console.log(cubeList, movingTarget);
        var dragcontrols = new THREE.DragControls(cubeList, camera, renderer.domElement); //
        // dragcontrols.enabled = false; //关闭DragControls控制器
        dragcontrols.addEventListener("hoveron", function (event) {
          controls.enabled = false; //点击后要进行拖拽改路径，需要禁止控制器的执行,拖拽结束后再次开启controls
          transformControl.attach(event.object); //加载显示3D控制器
        });

        dragcontrols.addEventListener("hoveroff", function (event) {
          console.log("鼠标离开模型", event.object);
          controls.enabled = true;
          transformControl.detach(event.object); //去除加载3D控制器
        });

        transformControl.addEventListener("objectChange", function (e) {
          //更新展示的线
          updateLineByChangeMainPoint({ line, THREE, cubeList });
          //显示坐标值
          that.currentPonts = curve.points;
          that.$forceUpdate();
        });
      }

      function animate() {
        // 更新控制器
        render();
        // 更新性能插件
        stats.update();
        renderer.render(scene, camera);
        // path += 0.005;
        // path %= 2;
        if (labelRenderer) labelRenderer.render(scene, camera);

        requestAnimationFrame(animate);
      }

      //创造多条轨道和物体进行，物体并沿轨道进行位移
      const origin = [
        {
          points: [
            { x: 935.4736532220461, y: 125.72124294247564, z: 1292.9298960835008 },
            { x: 852.3585184605006, y: 126.579089893769847, z: 1679.3401069559873 },
            { x: 623.8722171402046, y: 273.6766653395756, z: 1775.0513808810504 }
          ],
          path: 0,
          speed: 0.005,
          den: 1,
          key: "one"
        },
        {
          points: [
            { x: 391.3617063106858, y: 64.25004833278402, z: 2417.8107032109883 },
            { x: 255.5820537741204, y: -1.590312712515221, z: 2863.653726133555 },
            { x: 63.968133554482776, y: 292.5416169737242, z: 2903.89072115592 }
          ],
          path: 0,
          speed: 0.005,
          den: 1,
          key: "two"
        }
      ];
      //创建多条线，各自目标物体沿线运动
      function createLineAndTargetMove() {
        return origin.reduce((total, item) => {
          //创造目标移动物体
          const movingTarget = new THREE.Mesh(
            new THREE.BoxGeometry(50, 50, 50),
            new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
          );

          movingTarget.position.x = 500;
          movingTarget.position.y = 500;
          movingTarget.position.z = 500;

          movingTarget.castShadow = true;
          movingTarget.receiveShadow = true;
          scene.add(movingTarget);

          //画线逻辑
          const verticesList = item.points.map((item) => {
            const { x, y, z } = item;
            return new THREE.Vector3(x, y, z);
          });
          const createCurve = new THREE.CatmullRomCurve3(verticesList);
          createCurve.curveType = "catmullrom";
          createCurve.closed = false;
          let createLine, createlineGeometry;
          createlineGeometry = new THREE.Geometry();
          for (let i = 0; i < 50; i++) {
            createlineGeometry.vertices.push(new THREE.Vector3());
          }
          createLine = new THREE.Line(
            createlineGeometry.clone(),
            new THREE.LineBasicMaterial({ color: 0x00ff00 })
          );
          scene.add(createLine);

          for (var i = 0; i < 50; i++) {
            var p = createLine.geometry.vertices[i];
            var t = i / (50 - 1);
            createCurve.getPoint(t, p); //返回曲线上的点，P向量会被这个返回值赋值,相当于线有点了，会画成线了
          }
          createLine.geometry.verticesNeedUpdate = true;
          console.log(total, item.key);
          if (!total[item.key]) total[item.key] = {};
          total[item.key] = {
            createCurve,
            createLine,
            movingTarget,
            path: item.path,
            speed: item.speed,
            den: item.den
          };
          return total;
        }, {});
      }
      //创造可移动目标
      // function creatMoveTarget(){

      // }

      /**
       * 设置相机沿着模型上空运动观察模型
       * @param camera
       * @param v
       */
      let stopID;
      // const clock = new Clock();
      let cameraX, cameraZ;
      const setCameraAnimate = () => {
        const vector = new THREE.Vector3();

        // cancelAnimationFrame(stopID);

        const t = clock.getElapsedTime();
        const theta = t / 6;
        const newx = 14 * Math.sin(theta) - 6;
        const newy = 14 * Math.cos(theta) - 6;
        cameraX = newx < -10 ? cameraX : newx;
        cameraZ = newy < -10 ? cameraZ : newy;
        // camera.position.lerp(vector.set(cameraX, 0.5, cameraZ), 0.5);
        stopID = requestAnimationFrame(setCameraAnimate);
      };

      //增加弹出框
      function setTotip() {
        const dialogTip = [
          {
            id: "one",
            label: "设备1",
            position: { x: -40.339814351422575, y: 50.94430054091745, z: 253.68931618741232 }
          },
          {
            id: "two",
            label: "设备2",
            position: { x: -40.339814351422575, y: 50.94430054091745, z: 369.4471831471705 }
          }
        ];

        createLinePoint({
          initialPoints: dialogTip.map((item) => item.position),
          THREE,
          scene
        });

        let domDialog;
        dialogTip.forEach((item, index) => {
          domDialog = document.createElement("div");
          domDialog.className = `title-text`;
          domDialog.innerHTML = item.label;
          // domDialog.innerHTML = JSON.stringify(item);
          scene.add(domTag(domDialog, item.position, item.id));
        });
      }

      function draw() {
        // 兼容性判断
        // if (!Detector.webgl) Detector.addGetWebGLMessage();

        // initGui();
        initRender();
        initScene();
        setCatmullRomCurve3();
        // setTotip();
        initraycasterFunc();
        initCamera();
        initLight();
        initModel();
        initControls();
        transformContols();
        // lineObject = createLineAndTargetMove();
        initStats();
        goFly({ curve, targeItem: movingTarget })();
        animate();
        setTimeout(() => {
          setCameraAnimate();
        }, 5000);
      }
      draw();
    },

    clickHorse(e, findItem) {
      const itemLsit = [
        // 今日
        { name: "电用量", data: 0, unit: "kWh" },
        { name: "蒸汽用量", data: 0, unit: "t" },
        { name: "天然气用量", data: 100, unit: "Nm3" },
        { name: "水用量", data: 100, unit: "t" }
      ];
      this.title = findItem.name;
      this.dialogContentList = findItem.list ? findItem.list : itemLsit;
      this.itemContentShow = false;
      // this.$nextTick(() => {
      //   this.itemContentShow = true;
      //   const position = newSetDialogPosition(".dialog-contain", { eventItem: e, dialogElName: ".item-content" });
      //   Object.keys(position).forEach((key) => {
      //     this.positionStyle[key] = "";
      //     if (position[key] !== undefined) {
      //       this.positionStyle[key] = `${position[key] / this.ratio + 5}px`;
      //     }
      //   });
      // });
    }
  }
};
</script>

<style lang="scss">
.Three-contain {
  height: 500px;
  position: relative;
  .current-points-style {
    position: absolute;
    border: 1px solid;
    z-index: 2;
  }
  .dialog-contain {
    position: absolute;
    left: 380px;
    right: 676px;
    top: 0;
    bottom: 0;
  }
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

  .item-content {
    width: 243px;
    height: 141px;
    position: absolute;
    z-index: 3;

    background: url("~@/assets/img/home/item_bg.png");
    .text-top {
      height: 18px;
    }
    .title {
      text-align: center;
      color: rgba(0, 245, 208, 1);
      font-size: 16px;
      line-height: 25px;
      height: 25px;
    }

    .text-set {
      font-size: 14px;
      /*text-align: center;*/
      color: #fff;
      margin-left: 15px;
      line-height: 20px;
      margin-bottom: 3px;
    }

    .label-style {
      width: 110px;
      display: inline-block;
      text-align: right;
    }

    .color-set {
      color: rgba(0, 245, 208, 1);

      display: inline-block;
      text-indent: 5px;
      padding-right: 5px;
    }
  }
}

.title-text {
  position: absolute;
  border: 1px solid rgb(33 186 206);
  min-width: 50px;
  height: 10px;
  background: rgba(27, 74, 127, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
