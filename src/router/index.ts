import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router";
import laoyout from "@/layout/index.vue";
import store from "@/store";

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

  {
    path: "/largeScreenOther",
    name: "LargeScreenOther",
    component: () => import("@/views/largeScreenOther/index.vue")
  },
  /**装配看板 */
  {
    path: "/one",
    name: "One",
    component: () => import("@/views/one/index.vue")
  },

  /**装配看板2 */
  {
    path: "/two",
    name: "Two",
    component: () => import("@/views/two/index.vue")
  },

  /**设备故障board */
  {
    path: "/three",
    name: "Three",
    component: () => import("@/views/three/index.vue")
  },

  /**计划安排 */
  {
    path: "/planArrangement",
    name: "PlanArrangement",
    component: () => import("@/views/planArrangement/index.vue")
  },

  // 点击某个元素，展示弹出框，弹出框位置根据内容框决定位置

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
const token = true;
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
