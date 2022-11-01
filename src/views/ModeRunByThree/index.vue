<template>
  <div
    class="Three-contain"
    v-loading="loading"
    element-loading-text="模型加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
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
      loading: true
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
        lines;
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
        scene.add(new THREE.AmbientLight(0x444444, 1.0)); //环境光

        light = new THREE.DirectionalLight(0xffffff, 1.0); //平行光
        light.position.set(0.5, 1, 0.5);

        // light.shadow.camera.top = 180
        // light.shadow.camera.bottom = -100
        // light.shadow.camera.left = -120
        // light.shadow.camera.right = 120

        // 告诉平行光需要开启阴影投射
        light.castShadow = true;

        scene.add(light);
      }

      // function getFitScaleValue(obj) {
      //   var boxHelper = new THREE.BoxHelper(obj);
      //   boxHelper.geometry.computeBoundingBox();
      //   var box = boxHelper.geometry.boundingBox; // 获取模型边界
      //   var maxDiameter = 1.5 * Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z); // 数值越大，模型越小
      //   return Math.ceil(LBTcamera.position.z / maxDiameter);
      // }

      function initModel() {
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

        // 加载模型
        var loader = new THREE.FBXLoader();

        // 加载路面

        // 加载图标
        const modeZ = 150;
        // 加载建筑
        loader.load(`${import.meta.env.VITE_APP_API}/threejs/factory1.fbx`, function (mesh) {
          // 添加骨骼辅助
          // meshHelper = new THREE.SkeletonHelper(mesh);
          // scene.add(meshHelper);

          // 设置模型的每个部位都可以投影
          mesh.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          mesh.position.z += modeZ;
          mesh.position.y -= 0;

          //   let LBTscale = getFitScaleValue(mesh);
          //     // 放大三维显示倍数，默认为1
          //     object.scale.multiplyScalar(LBTscale);

          scene.add(mesh);
          that.loading = false;
        });
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
          // console.log(
          //   `x:${intersects[0].point.x},y:${intersects[0].point.y},y:${intersects[0].point.z}`
          // );
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
        controls.maxDistance = 80000;
        // 是否开启右键拖拽
        controls.enablePan = true;
      }

      function render() {
        var time = clock.getDelta();
        if (mixer) {
          mixer.update(time);
        }

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
        const lineItem = new THREE.LineLoop(
          geoetryItem,
          new THREE.LineBasicMaterial({ color: 0x00ff00 })
        );
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
        console.log(points);
        lineBufferGeometry = new THREE.BufferGeometry();
        line = new THREE.Line( // LineLoop画出来的曲线是闭环，最后一个点会连接到第一个点。 Line画出来的是非闭环
          lineBufferGeometry.setFromPoints(points),
          new THREE.LineBasicMaterial({ color: 0x00ff00 })
        ); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了
        scene.add(line);
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
          // const updatePoints = [
          //   { x: 575.3834454744501, y: 109.871325565605753, z: 322.08633024099527 },
          //   { x: -1132.0475222805737, y: 125.50002615639014, z: 313.47358128384633 },
          //   { x: -1124.548672156688, y: 125.499939967936353, z: -215.54737535147314 }
          // ];

          // var vertices = [];
          // points.forEach((point) => {
          //   vertices.push(point.x, point.y, point.z || 0);
          // });
          // vertices = new Float32Array(vertices);
          // line.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
          // console.log(points);
          //console.log();
          // console.log(curve.getPoints(50));
          console.log(line.geometry.attributes.position.array);
          curve.getPoints(50).forEach((item, index) => {
            var t = index / (51 - 1);
            // console.log(t, item);
            curve.getPointAt(t, item);
          });
          const positions = line.geometry.attributes.position.array;
          let x, y, z, index;
          x = y = z = index = 0;

          for (let i = 0, l = 200; i < l; i++) {
            positions[index++] = x;
            positions[index++] = y;
            positions[index++] = z;

            // x += ( Math.random() - 0.5 ) * 30;
            // y += ( Math.random() - 0.5 ) * 30;
            // z += ( Math.random() - 0.5 ) * 30;
          }

          line.geometry.attributes.position.needsUpdate = true;
          // console.log();
          // curve.getPoints(curve.getPoints());
          // for(let i=0;i<50;i++){

          // }
          // console.log(lineBufferGeometry.getPoints());
          // console.log(points);
          // line.geometry.verticesNeedUpdate = true;

          transformControl.detach(event.object); //去除加载3D控制器
          // cancelHideTransorm();
        });
      }

      function animate() {
        // 更新控制器
        render();

        // 更新性能插件
        stats.update();

        renderer.render(scene, camera);

        path += 0.005;
        path %= 1;
        movingTarget.position.copy(curve.getPointAt(path));

        requestAnimationFrame(animate);
      }

      function draw() {
        // 兼容性判断
        // if (!Detector.webgl) Detector.addGetWebGLMessage();

        // initGui();
        initRender();
        initScene();
        setCatmullRomCurve3();

        initraycasterFunc();
        initCamera();
        initLight();
        initModel();
        initControls();
        transformContols();
        initStats();
        animate();
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
</style>
