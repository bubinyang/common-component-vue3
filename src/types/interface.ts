export interface IObject<T = any> {
  [key: string]: T;
}

export interface IViewHooksOptions {
  //  设置属性
  /**
   * 此页面是否在创建时，调用查询数据列表接口？
   */
  createdIsNeed?: boolean;
  /**
   * 此页面是否在激活（进入）时，调用查询数据列表接口？
   */
  activatedIsNeed?: boolean;
  /**
   * 数据列表接口，API地址
   */
  getDataListURL?: string;
  /**
   * 数据列表接口，是否需要分页？
   */
  getDataListIsPage?: boolean;
  /**
   * 删除接口，API地址
   */
  deleteURL?: "";
  /**
   * 删除接口，是否需要批量？
   */
  deleteIsBatch?: boolean;
  /**
   * 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
   */
  deleteIsBatchKey?: string;
  /**
   * 导出接口，API地址
   */
  exportURL?: string;

  /**
   * 查询条件
   */
  dataForm?: IObject;
  /**
   * 数据列表
   */
  dataList?: IObject[];
  /**
   * 排序，asc／desc
   */
  order?: string;
  /**
   * 排序，字段
   */
  orderField?: string;
  /**
   * 当前页码
   */
  page?: number;
  /**
   * 每页数
   */
  limit?: number;
  /**
   * 总条数
   */
  total?: number;
  /**
   * 数据列表，loading状态
   */
  dataListLoading?: boolean;
  /**
   * 数据列表，多选项
   */
  dataListSelections?: IObject[];
  /**
   * 新增／更新，弹窗visible状态
   */
  addOrUpdateVisible?: boolean;
  /**
   * 新增／更新，组件
   */
  addOrUpdate?: IObject;
  elTable?: IObject;
}

export interface IViewHooks extends IViewHooksOptions, IObject {
  /**
   * 检查权限
   */
  hasPermission: (key: string) => boolean;
  /**
   * 获取字典名称
   */
  getDictLabel: (dictType: string, dictValue: number) => string | number;
  /**
   * 查询列表记录
   */
  query: () => void;
  /**
   * 列表多选事件
   */
  dataListSelectionChangeHandle: (list: IObject[]) => void;
  /**
   * 列表排序事件
   */
  dataListSortChangeHandle: (sort: IObject) => void;
  /**
   * 列表切换每页显示数量事件
   */
  pageSizeChangeHandle: (pageSize: number) => void;
  /**
   * 列表分页事件
   */
  pageCurrentChangeHandle: (pageIndex: number) => void;
  /**
   * 列表搜索事件
   */
  getDataList: () => void;
  /**
   * 列表新增事件
   */

  addHandle: (row: IObject) => void;
  /**
   * 列表新增/修改事件
   */
  addOrUpdateHandle: (id?: string) => void;
  /**
   * 列表删除事件
   */
  deleteHandle: (id?: string, pid?: string) => Promise<any>;
  /**
   * 列表导出事件
   */
  exportHandle: () => void;
  /**
   * 关闭当前tab页
   */
  closeCurrentTab: () => void;
  /**
   * 处理流程
   */
  handleFlowRoute: (e: IObject) => void;
  /**
   * 查看流程详情
   */
  flowDetailRoute: (e: IObject) => void;
}
