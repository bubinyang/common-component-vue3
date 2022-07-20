import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// import {debounce} from '../utils/index.js'
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/test.vue")
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
        path: "/layoutDemo",
        component: () => import("@/views/treeDemo/index.vue")
      }
    ]
  },

  // 轮番demo
  {
    path: "/swiperDemo",
    name: "SwiperDemo",
    component: () => import("@/views/swiperDemo/index.vue"),
    children: [
      {
        path: "/layoutDemo",
        component: () => import("@/views/swiperDemo/index.vue")
      }
    ]
  },

  // 点击某个元素，展示弹出框，弹出框位置根据内容框决定位置
  {
    path: "/setDialogPosition",
    name: "SetDialogPosition",
    component: () => import("@/views/setDialogPosition/index.vue"),
    children: [
      {
        path: "/setDialogPosition",
        component: () => import("@/views/setDialogPosition/index.vue")
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
export default router;
