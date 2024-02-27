import { IViewHooksOptions, IViewHooks, IObject } from "@/types/interface";
import { nextTick, onActivated, onMounted } from "vue";
import http from "@/utils/request";
import { ElMessageBox } from "element-plus";

const hooks = (externalStates: IViewHooksOptions, props: IObject): IObject => {
  const defaultOptions = {
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: "",
    getDataListIsPage: true,
    deleteURL: "",
    deleteIsBatch: false, //删除接口，是否需要批量,默认不批量
    deleteIsBatchKey: "id",
    exportURL: "",
    dataForm: {},
    dataList: [],
    order: "",
    orderField: "",
    page: 1,
    limit: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [], //多选的唯一标识集合
    dialogVisible: false, //弹出框显示布尔值
    addOrUpdate: {} //弹出框的ref对象
  };

  const mergeDefaultOptionsToState = (options: IObject, state: IObject): IObject => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(state, key)) {
        state[key] = options[key];
      }
    }
    return state;
  };
  const state = mergeDefaultOptionsToState(defaultOptions, externalStates);
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFun.query();
      console.log("onMounted");
    }
  });

  onActivated(() => {
    if (state.activatedIsNeed) {
      viewFun.query();
      console.log("onActivated");
    }
  });
  const viewFun = {
    query() {
      state.dataListLoading = true;
      if (!state.getDataListURL) {
        return;
      }
      http
        .post(state.getDataListURL, {
          params: {
            order: state.order,
            orderField: state.orderField,
            page: state.getDataListIsPage ? state.page : null,
            limit: state.getDataListIsPage ? state.limit : null,
            ...state.dataForm
          }
        })
        .then((res: any) => {
          if (res.code !== 0) {
            state.dataList = [];
            state.total = 0;
            return console.log("接口报错");
          }
          state.dataList = state.getDataListIsPage ? res.data.list : res.data;
          state.total = state.getDataListIsPage ? res.data.total : 0;
        })
        .finally(() => {
          state.dataListLoading = false;
        });

      console.log("hooks查询");
    },

    //多选
    dataListSelectionChangeHandle(val: IObject[]) {
      state.dataListSelections = val;
    },

    // 分页, 每页条数
    pageSizeChangeHandle(val: number) {
      state.page = 1;
      state.limit = val;
      viewFun.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val: number) {
      state.page = val;
      viewFun.query();
    },
    getDataList() {
      state.page = 1;
      viewFun.query();
    },
    //新增/修改
    addOrUpdateHandle(id?: string, data?: IObject) {
      state.dialogVisible = true;
      nextTick(() => {
        console.log(state.addOrUpdate);
        state.addOrUpdate.dataForm.id = id || "";
        state.addOrUpdate.init(data);
      });
    },
    deleteHandle(id?: string) {
      ElMessageBox.confirm("Are you sure to delete this data?")
        .then(() => {
          http
            .post(
              `${state.deleteURL}`, //为什么要用data作为关键key,那是开发规范，语义化更清晰，后端接的时候拿data
              {
                data: id
                  ? [id]
                  : state.dataListSelections.map((item: IObject) => item[state.deleteIsBatchKey])
              }

              // state.deleteIsBatch //如果是批量，需要以body的形式传参，所以要data
              //   ? {
              //       data: id
              //         ? [id]
              //         : state.dataListSelections.map((item: IObject) => item[state.deleteIsBatchKey])
              //     }
              //   : {}
            )
            .then((res: any) => {
              if (res.code !== 200) {
                return console.log("删除失败");
              }
              viewFun.query();
            });
        })
        .catch(() => {
          // catch error
        });
    },
    //下载文件
    exportTemplateHandle(url: string, params?: IObject, method?: any) {
      const filename = `模板`;

      // baseService.downloadFile(url, params || {}, fileName, method);

      const opt: any = { url, params, method, responseType: "blob" };
      http(opt).then((res: any) => {
        if (method.toLowerCase === "post") {
          opt.data = params;
          delete opt.params;
        }
        if (res.type === "application/json") {
          const reader = new FileReader();
          reader.readAsText(res, "uft-8");
          //
          reader.onload = () => {
            const data = JSON.parse(reader.result as string);
            const { code, msg } = data;
            if (code !== 0) {
              return console.log(msg || "下载失败！");
            }
          };
          return;
        }

        const a = document.createElement("a");
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        a.download = filename || new Date().getTime().toString();
        a.href = URL.createObjectURL(res);
        a.dispatchEvent(evt);
      });
    },

    //下载文件
    dowload(path: string, params: IObject, filename: string, method?: any) {
      const opt: any = { url: path, params, method, responseType: "blob" };
      if (method.toLowerCase() === "post") {
        opt.data = params;
        delete opt.params;
      }
      return http(opt).then((res: any) => {
        let fileName = filename;
        if (res.headers["content-disposition"]) {
          const fileArr = res.headers["content-disposition"].split(";")[1];
          const fileString = fileArr.split("=")[1];
          fileName = decodeURIComponent(fileString);
        }
        const a = document.createElement("a");
        const evt = document.createEvent("MouseEvents");
        //如果要下载PDF需要执行以下代码. URL.createObjectURL(blob)
        //const blob = new Blob([res], { type: "application/pdf" });

        evt.initEvent("click", false, false);
        a.download = fileName || new Date().getTime().toString();
        a.href = URL.createObjectURL(res.data);
        a.dispatchEvent(evt);
      });
    }
  };
  return {
    ...viewFun
  };
};
export default hooks;
