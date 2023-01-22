import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

const points = [
  { x: 0.3575931895858307, y: 0.023585346503902718, z: 0.24781165932809013 },
  { x: 0.35725956873009235, y: 0.01990188380026229, z: -0.19507437619057438 },

  { x: 0.34080503183996286, y: 0.01890200166052646, z: -0.205949067745171 },
  { x: 0.27607404492791365, y: 0.018168824717028145, z: -0.20375677710517087 }
];
/**
 * 增加拉拽点并画线
 * @param  initialPoints 拉拽变化路劲的点数据
 * @param THREE
 * @param scene
 */
export function createLinePoint({ initialPoints = points, THREE, scene }) {
  //创造点并画线
  let cubeList;
  const addCube = (pos) => {
    const geometry = new THREE.BoxBufferGeometry(0.005, 0.005, 0.005);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos);
    scene.add(cube);
    return cube;
  };

  cubeList = initialPoints.map((pos) => {
    return addCube(pos);
  });

  return {
    cubeList
  };
}

/**
 * 根据传入的position进行画线
 * @param  position getPoints的最大长度
 * @param points Line的截断数量
 */
export function drawLine({ position, THREE }) {
  const curve = new THREE.CatmullRomCurve3(position);
  curve.curveType = "catmullrom"; // 曲线类型
  curve.closed = false; // 曲线是否闭合
  curve.tension = 0.01; //曲线张力设置小一点，可以减少弧度(实现直线)
  const points = curve.getPoints(1000);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  );
  return {
    curve,
    line,
    points
  };
}

/**
 * 指定某个部件按照线路位移
 * @param  maxIndex getPoints的最大长度
 * @param  curve CatmullRomCurve3的实例 位移的路劲
 * @param THREE
 * @param targetItem 目标位移项
 * @param item  外部数据源,此处目的是存储requestAnimatioFrame以便进行cancel
 */
export function goFly({ maxIndex = 1000, curve, targeItem, item }) {
  let index = 0;
  return function action() {
    if (index > maxIndex) index = 0;
    const path = index / maxIndex;
    const position = curve.getPointAt(path);
    //position.y += 10;
    const tanget = curve.getTangentAt(path);
    const look = tanget.add(position);
    targeItem.lookAt(look);
    targeItem.rotateY(Math.PI / 2);
    targeItem.position.copy(position);
    index++;
    //requestAnimationFrame(action);
    item.mainRequestAnimationFrame = requestAnimationFrame(action);
  };
}

/**
 * 改变主体点,更新线外观
 * @param  line Line的实例化
 * @param  cubeList 画线前的主体点
 * @param THREE
 */
export function updateLineByChangeMainPoint({ line, cubeList, THREE }) {
  const drawLineReturn = drawLine({
    position: cubeList.map((cube) => cube.position),
    THREE
  });
  let updatePoints = [];
  updatePoints = drawLineReturn.points.reduce((total, item, index) => {
    const { x, y, z } = item;
    total.push(x, y, z);
    return total;
  }, []);
  line.geometry.attributes.position.array.forEach((item, index) => {
    line.geometry.attributes.position.array[index] = updatePoints[index];
  });
  line.geometry.attributes.position.needsUpdate = true;
}

/**
 * @param id 需要3D展示的dom标签ID
 * @param position tootip在3D空间显示的位置
 * @id 该弹出框的标识
 */
export const domTag = function ({ dom, position, id }) {
  // const dom=document.querySelector(id)
  if (!dom) return null;
  const moonLabel = new CSS2DObject(dom);

  const { x, y, z } = position;
  moonLabel.position.set(x, y, z);
  moonLabel.name = id;
  return moonLabel;
};

/**
 * three 刷新
 */
export const getLabelRenderer = function ({ width, height }) {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  //这个是弹出框 容器位置，需要设置到当前页面的容器位置即可
  labelRenderer.domElement.style.position = "fixed";
  labelRenderer.domElement.style.top = "50px";
  labelRenderer.domElement.style.left = "230px";
  labelRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(labelRenderer.domElement);
  return labelRenderer;
};

/**
 * 通过鼠标的位置和当前相机的矩阵计算出raycaster 以便查找出单个object
 * (一般再鼠标事件需要找到对应模型部件的时候用到)
 */
export const getIntersects = function ({ El, event, mouse, camera, scene, raycaster }) {
  const elRect = El.getBoundingClientRect();
  const left = event.clientX - elRect.left;
  const top = event.clientY - elRect.top;
  // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
  mouse.x = (left / elRect.width) * 2 - 1;
  mouse.y = -(top / elRect.height) * 2 + 1;

  // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
  raycaster.setFromCamera(mouse, camera);
  // 获取raycaster直线和所有模型相交的数组集合
  return raycaster.intersectObjects(scene.children, true);
};
