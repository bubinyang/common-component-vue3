import { createStore } from "vuex";
import { setRouterComponent } from "@/utils/utils.ts";
import { menuList } from "@/utils/menuData.js";
import { getCache } from "@/utils/cache";

interface IObject<T = any> {
  [key: string]: T;
}
export default createStore({
  state: {
    userInfo: getCache("userInfo"),
    routes: []
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
      commit("setUpdateState", data);
    },
    getuserRouters({ commit }, data) {
      //获取路由数据
      const userRouters = setRouterComponent(menuList);
      const userName = "bby";
      return new Promise((resolve) => {
        //  commit("setUserInfo", { userRouters, userName });
        // const info=getCache("userInfo");
        //  commit("setUserInfo", { userRouters, userName });
        setTimeout(resolve, 1000, { userRouters, userName });
      }).then((res) => {
        //console.log(userRouters);
        return res;
      });
    },
    getUserInfo({ commit }, data) {
      commit("setUserInfo", data);
    }
  },
  modules: {}
});
