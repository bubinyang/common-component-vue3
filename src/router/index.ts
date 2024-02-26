import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router";
import laoyout from "@/layout/index.vue";
import store from "@/store";
import Cookies from "js-cookie";

interface IObject<T = any> {
  [key: string]: T;
}
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
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/largeScreen",
    name: "LargeScreen",
    component: () => import("@/views/largeScreen/index.vue")
  },
  //threejs 沿着路线运动demo
  // {
  //   path: "/modeRunByThree",
  //   name: "ModeRunByThree",
  //   component: () => import("@/views/ModeRunByThree/index.vue")
  // },
  // { src\views\ModeRunByThree\index.vue
  //   //贪吃蛇
  //   path: "/snake/index",
  //   name: "/snake/index",
  //   component: () => import("@/views/snake/index.vue")
  // },

  // {
  //   path: "/fourGrid",
  //   name: "FourGrid",
  //   component: () => import("@/views/fourGridLayout/index.vue"),
  //   children: [
  //     {
  //       path: "/rotate",
  //       component: () => import("@/views/fourGridLayout/index.vue")
  //     }
  //   ]
  // },

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
    component: () => import("@/views/swiperDemo/index.vue"),
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
    component: () => import("@/views/dragSort/index.vue"),
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
const token = Cookies.get("token");
console.log(token, "token");
router.beforeEach((to, from, next) => {
  console.log(to);
  if (token) {
    if (to.path === "/login") {
      //登录地址跳转到/
      next({ path: "/" });
    } else {
      //如果没有拿到路由列表,去请求接口
      if (store.state.userInfo) {
        console.log(11);
        next();
      } else {
        store.dispatch("getuserInfo").then((res) => {
          const { userRouters } = res;
          // router.addRoute(userRouters[1]);
          addRouteFromUser(userRouters);

          // if (!router.hasRoute("/:path(.*)*")) {
          //   router.addRoute({
          //     meta: {},
          //     path: "/:path(.*)*",
          //     redirect: { path: "/largeScreen", query: { to: 404 }, replace: true }
          //   });
          // }

          // setTimeout(() => {
          //   next({ ...to, replace: true });
          // }, 2000);
          console.log(router.options.routes);
          next({ ...to, replace: true });
        });
      }
    }
  } else {
    if (to.path === "/login") next();
    next("/login");
  }
});

//判断是否已经存在该路由  同时动态添加路由地址
function addRouteFromUser(routes: Array<RouteRecordRaw>) {
  routes.forEach((item: RouteRecordRaw) => {
    if (!item.path) return;
    if (!router.hasRoute(item.path)) {
      router.addRoute(item);
    }
  });
}

export default router;
