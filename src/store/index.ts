import { createStore } from "vuex";
interface IObject<T = any> {
  [key: string]: T;
}
export default createStore({
  state: {
    userInfo: "bby"
  } as IObject,
  mutations: {
    setUpdateState(state, payload): void {
      Object.entries(payload).forEach((item) => {
        const [key, value] = item;
        state[key] = value;
      });
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
    }
  },
  modules: {}
});
