import { createStore } from "vuex";
import { setRouterComponent } from "@/utils/utils";
import { menuList } from "@/utils/menuData.js";
interface IObject<T = any> {
  [key: string]: T;
}
export default createStore({
  state: {
    userInfo: null
  } as IObject,
  mutations: {
    setUpdateState(state, payload): void {
      Object.entries(payload).forEach((item) => {
        const [key, value] = item;
        state[key] = value;
      });
    },
    setUserInfo(state, userInfo): void {
      state.userInfo = userInfo;
    }
  },
  actions: {
    updateState({ commit }, data) {
      //   return Promise.all([Promise.resolve("不必要")]).then(async (res) => {
      //     console.log(res, Promise.resolve("不必要"));
      //     return res;
      //   });

      return Promise.resolve("不必要").then((res) => {
        return "有意义";
      });
    },
    getuserInfo({ commit }, data) {
      const userRouters = setRouterComponent(menuList);
      const userName = "bby";
      return new Promise((resolve) => {
        setTimeout(resolve, 1000, { userRouters, userName });
      }).then((res) => {
        commit("setUserInfo", { userRouters, userName });
        return res;
      });
    }
  },
  modules: {}
});

// function setRouterComponent(origin: any): IObject[] {
//   function dealUrlSlash(url: string): string {
//     return (url = !/^\//g.test(url) ? "/" + url : url);
//   }
//   const arr: IObject[] = [];
//   origin.forEach((item: any) => {
//     const path = dealUrlSlash(item.url);
//     const vueUrl = toSysViewComponentPath(path);
//     const route = {
//       path,
//       name: path,
//       component: getSysRouteMap()[vueUrl]
//     };
//     arr.push(route);
//   });
//   return arr;
// }

// function toSysViewComponentPath(path: string): string {
//   path = path.replace("_", "-");
//   return `/src/views${path}.vue`;
// }

// //获取vue文件路径下的 import(url)文件组合成的json， key是url
// function getSysRouteMap(): IObject {
//   return import.meta.glob("/src/views/**/*.vue");
// }
