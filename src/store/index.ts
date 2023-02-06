import { createStore } from "vuex";
import { setRouterComponent } from "@/utils/utils.ts";
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
      console.log(userInfo);
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
        commit("setUserInfo", { userRouters, userName });
        setTimeout(resolve, 1000, { userRouters, userName });
      }).then((res) => {
        //console.log(userRouters);
        return res;
      });
    }
  },
  modules: {}
});
