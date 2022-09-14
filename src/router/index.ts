import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import laoyout from "@/layout/layout.vue";
// import {debounce} from '../utils/index.js'
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/test-copy.vue")
  },
  {
    path: "/setup",
    name: "setup",
    component: () => import("@/views/setup.vue")
  },
  {
    //贪吃蛇
    path: "/snake",
    name: "snake",
    component: () => import("@/views/snake/index.vue")
  },
  {
    path: "/fourGrid",
    name: "FourGrid",
    component: () => import("@/views/fourGridLayout/index.vue"),
    children: [
      {
        path: "/rotate",
        component: () => import("@/views/fourGridLayout/index.vue")
      }
    ]
  },

  // 树型组件
  {
    path: "/treeMenu",
    name: "TreeMenu",
    component: () => import("@/views/treeDemo/index.vue"),
    children: [
      {
        path: "/treeMenu",
        component: () => import("@/views/treeDemo/index.vue")
      }
    ]
  },

  // 轮番demo
  {
    path: "/swiperDemo",
    name: "SwiperDemo",
    component: laoyout,
    children: [
      {
        path: "/swiperDemo",
        component: () => import("@/views/swiperDemo/index.vue")
      }
    ]
  },

  // 点击某个元素，展示弹出框，弹出框位置根据内容框决定位置
  {
    path: "/setDialogPosition",
    name: "SetDialogPosition",
    component: laoyout,
    children: [
      {
        path: "/setDialogPosition",
        component: () => import("@/views/setDialogPosition/index.vue")
      }
    ]
  },

  // 拖拽树形结构进行排序
  {
    path: "/dragSort",
    name: "DragSort",
    component: laoyout,
    children: [
      {
        path: "/dragSort",
        component: () => import("@/views/dragSort/index.vue")
      }
    ]
  },

  // 组件和方法列表
  {
    path: "/toolList",
    name: "ToolList",
    component: () => import("@/views/toolList/index.vue"),
    children: [
      {
        path: "/toolList",
        component: () => import("@/views/toolList/index.vue")
      }
    ]
  },

  // 组件和方法详情页面
  {
    path: "/toolListDetail/:id",
    name: "ToolListDetail",
    component: () => import("@/views/toolList/detail/index.vue")
  },

  //组件ifram预览界面
  {
    path: "/editIframe",
    name: "Iframe",
    component: () => import("@/views/toolList/editIframe/index.vue"),
    children: [
      {
        path: "/editIframe",
        component: () => import("@/views/toolList/editIframe/index.vue")
      }
    ]
  },
  //看板外壳
  {
    path: "/largeScreen",
    name: "LargeScreen",
    component: () => import("@/views/largeScreen/index.vue"),
    children: [
      {
        path: "/largeScreen",
        component: () => import("@/views/largeScreen/index.vue")
      }
    ]
  },

  //svg标尺
  {
    path: "/svgScalePlate",
    name: "SvgScalePlate",
    component: () => import("@/views/svgScalePlate/index.vue"),
    children: [
      {
        path: "/svgScalePlate",
        component: () => import("@/views/svgScalePlate/index.vue")
      }
    ]
  },

  {
    path: "/layout",
    name: "Layout",
    component: () => import("@/views/layout/index.vue"),
    children: [
      {
        path: "/layout",
        component: () => import("@/views/layout/index.vue")
      }
    ]
  }
];

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach((to, from, next) => {
  console.log(to);
  next();
});

export default router;
