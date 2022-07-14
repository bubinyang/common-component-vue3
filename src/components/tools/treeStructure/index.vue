<template>
  <div class="setting-trees">
    <div v-if="isReportTree !== true" class="categorysContain">
      <el-select
        v-model="activeCategory"
        size="medium"
        placeholder="请选择"
        @change="changeCategory"
      >
        <el-option
          v-for="(item, index) in categorys"
          :key="index"
          :label="item.groupName"
          :value="item.groupType"
        >
        </el-option>
      </el-select>
    </div>

    <div class="contain" :class="{ mytree: true, noCheckBox: !check }">
      <div v-if="filter && showFilter" class="contain-action">
        <el-input class="filter-node-style" placeholder="关键字/能源品种 查询" v-model="filterText">
        </el-input>
        <span class="foldable">
          <el-button @click="setAllExpandOrFold(true)">全部展开</el-button>

          <el-button @click="setAllExpandOrFold(false)">全部收起</el-button>

          <!-- <el-tooltip effect="dark" content="全部展开" placement="top-start">
            <svg-icon2
              iconClass="extend"
              :className="'icon-svg'"
              :style="iconStyle"
              @click="setAllExpandOrFold(true)"
            ></svg-icon2>
          </el-tooltip> -->
          <!-- <el-tooltip effect="dark" content="全部收起" placement="top-start">
            <svg-icon2
              iconClass="fold"
              :className="'icon-svg'"
              :style="iconStyle"
              @click="setAllExpandOrFold(false)"
            ></svg-icon2>
          </el-tooltip> -->
        </span>
      </div>
      <div class="subselect">
        <span class="checkbtns">
          <el-checkbox
            @change="checkAllEvent"
            v-if="check && !limitMultiple"
            v-model="isCheckedAll"
            style="float: left"
            >全选</el-checkbox
          >
          <el-checkbox v-if="check && !limitMultiple" v-model="isCheckStrictly" style="float: right"
            >是否级联</el-checkbox
          >
        </span>
      </div>

      <div class="contain-content">
        <el-tree
          class="tree-contain"
          v-loading="loading && treeLoading"
          ref="tree"
          :data="originTreeData"
          :show-checkbox="check"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultKey"
          :check-on-click-node="checkOnClickNode"
          :check-strictly="!isCheckStrictly"
          :indent="16"
          :filter-node-method="filterNode"
          :default-expand-all="true"
          :props="defaultProps"
          element-loading-text="加载中"
          :accordion="accordion"
          highlight-current
          node-key="id"
          @node-click="select"
          :tree-props="{ children: 'childs' }"
          @check="selectMultiple"
        >
          <template #default="{ node, data }">
            <span class="span-ellipsis">
              <i
                class="iconfont"
                v-if="needIcon"
                :style="{
                  color: data.type !== 'PROCEDURE' ? '#1E97E8' : 'inherit'
                }"
                :type="data.type"
              ></i>
              <span
                class="iconlabel"
                :style="{
                  color: data.type !== 'PROCEDURE' ? '#1E97E8' : 'inherit',
                  fontSize: `${data.fontSize}px`,
                  fontWeight: data.fontWeight
                }"
                :title="node.label"
                :name="node.type"
              >
                {{ node.label }}
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { dataList } from "@/components/tools/treeNode/data";

const structureData = {
  code: 0,
  msg: "success",
  data: [
    {
      id: "1509783204981116930",
      deptId: "1509771806460874754",
      groupType: "17353805494409604",
      groupName: "管网结构",
      sort: 0,
      powerType: "17353805494409604",
      powerName: "管网结构",
      tenantCode: "11010"
    },
    {
      id: "1509783288594567169",
      deptId: "1509771806460874754",
      groupType: "17353825440078057",
      groupName: "车间结构",
      sort: 1,
      powerType: "17353825440078057",
      powerName: "车间结构",
      tenantCode: "11010"
    },
    {
      id: "1509783406177685506",
      deptId: "1509771806460874754",
      groupType: "17353853472064015",
      groupName: "天然气",
      sort: 2,
      powerType: "17353853472064015",
      powerName: "天然气",
      tenantCode: "11010"
    },
    {
      id: "1509783440134770690",
      deptId: "1509771806460874754",
      groupType: "17353861569430191",
      groupName: "蒸汽",
      sort: 3,
      powerType: "17353861569430191",
      powerName: "蒸汽",
      tenantCode: "11010"
    },
    {
      id: "1509783347381932034",
      deptId: "1509771806460874754",
      groupType: "17353839455832886",
      groupName: "物计算模块",
      sort: 4,
      powerType: "17353839455832886",
      powerName: "物计算模块",
      tenantCode: "11010"
    },
    {
      id: "1522824959368368130",
      deptId: "1509771806460874754",
      groupType: "20463202053878058",
      groupName: "部门管理",
      sort: 5,
      powerType: "20463202053878058",
      powerName: "部门管理",
      tenantCode: "11010"
    },
    {
      id: "1533632642673545217",
      deptId: "1509771806460874754",
      groupType: "23039954548634193",
      groupName: "抄表测试",
      sort: 10,
      powerType: "23039954548634193",
      powerName: "抄表测试",
      tenantCode: "11010"
    }
  ]
};
const structureType = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(structureData);
    }, 3000);
  });
};

const getTreeNode = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dataList);
    }, 3000);
  });
};
// import { getTreeNode } from "@/utils/structureTree";
// import { structureType } from "@/request/workingProcedure.js";
// import tree from "@/utils/tree.js";
// import { setTreeIcon } from "@/utils/utils";
export default {
  name: "treeStructure",
  props: {
    // 是否允许多选
    check: {
      type: Boolean,
      default() {
        return true;
      }
    },

    // 是否在点击节点的时候选中节点
    checkOnClickNode: {
      type: Boolean,
      default: false
    },

    // 资源类型
    resourceType: {
      type: String,
      default() {
        return "";
      }
    },
    // 数据源
    treeList: {
      type: Array,
      default() {
        return [];
      }
    },

    // 是否用默认数据源
    isInitialData: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 多选限制
    limitMultiple: {
      type: Number,
      default() {
        return 0;
      }
    },
    // 是否用的是企业列表的tree,即报表中心显示的tree
    isReportTree: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 企业ID
    consumerNameId: {
      type: String,
      default() {
        return "";
      }
    },
    // 是否每次只打开一个节点
    accordion: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Boolean,
      default: false
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    treeLoading: {
      type: Boolean,
      default: true
    },
    needIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCheckedAll: false,
      isCheckStrictly: false,
      loading: true,
      ifDisabled: false,
      defaultProps: {
        children: "childs",
        label: "name"
      },
      companyId: null,
      selectedkey: null, // 默认选中第一个
      treeData: [],
      defaultKey: [],
      initialTreeData: [], // 默认数据源
      categorys: [],
      activeCategory: "",
      pitchItems: [],
      filterText: ""
      //setTreeIcon
    };
  },
  computed: {
    originTreeData() {
      console.log(this.treeList.length ? this.treeList : this.initialTreeData);
      return this.treeList.length ? this.treeList : this.initialTreeData;
    },
    iconStyle() {
      return "fill:" + localStorage.getItem("skinStyle") === "1" ? "#999999" : "#f5f5f5";
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  mounted() {
    if (this.isInitialData) {
      this.getStructureType("");
    } // 默认数据源
    if (!this.isInitialData) {
      // 外部传入数据源
      this.$nextTick(() => {
        // 不选默认值
        this.$refs.tree.setCurrentKey(this.treeList[0].id || "");
        this.select(this.treeList[0] || {});
      });
    }
  },
  methods: {
    //单选事件
    select(value) {
      if (!this.check) {
        //复选框如果设置了check-on-click-node,那么点击节点的时候就会触发node-click事件
        //结合多选，抛出的value并没有进行字段处理，直接抛出，外部接受的时候为了应对默认选中的多余json,获取值的时候 用 '|| '
        value.groupType = this.activeCategory;
        value.powerType = this.activeCategory;
        this.$emit("send", value);
        this.$emit("change", value);
      }
    },
    //获取能源结构列表
    getStructureType(id) {
      structureType({
        deptId: id
      }).then((res) => {
        if (res.data && res.data.length > 0) {
          this.activeCategory = res.data[0].groupType;
          this.categorys = res.data;
          this.initLoading(id);
        } else {
          this.activeCategory = "";
          this.categorys = [];
          this.initialTreeData = [];
          this.loading = false;
          this.$emit("finishLoading", {});
        }
      });
    },
    initLoading(consumerNameId) {
      const adminParam = [
        {
          group: this.activeCategory,
          id: consumerNameId || this.consumerNameId,
          type: this.activeCategory
        }
      ];
      const param = adminParam;
      const apiAction = getTreeNode;
      this.loading = true;
      apiAction(...param)
        .then((res) => {
          //if (res.code !== 0 || !res.data) this.initialTreeData = [];
          let list = [];
          list = res;
          this.loading = false;
          const first = (list && list[0]) || {};
          //此json不需要，直接抛出默认第一条item即可,key用的地方太多，不进行取消
          const finishData = {
            groupType: this.activeCategory,
            powerType: this.activeCategory,
            deptId: this.consumerNameId,
            fromId: first.pid || "",
            toId: first.id || "",
            entityId: first.entityId || "",
            entityName: first.name || "",
            powerTypeJson: first.powerTypeJson || ""
          };
          this.$emit("finishLoading", finishData);
          if (!list || list.length === 0) return;
          this.initialTreeData = list.map((item) => {
            return item;
          });

          this.$nextTick(() => {
            try {
              if (this.$refs.tree) {
                //单选多选默认选中,但不会触发事件
                this.$refs.tree.setCheckedKeys([this.initialTreeData[0].id]);
                this.$refs.tree.setCurrentKey(this.initialTreeData[0].id);
              }
            } catch (e) {
              console.error(e);
            }
          });
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      const find = value.split("").every((ele) => {
        return data.powerTypeJson.includes(ele);
      });
      return data.name.indexOf(value) !== -1 || find;
    },
    // 多选
    selectMultiple(item) {
      if (!this.$refs.tree) return;
      //check-strictly级联的情况下,子节点为选全，父节点都不会被抓取
      const res = this.$refs.tree.getCheckedNodes();
      /* 限制多选项的清空--start */
      this.pitchItems = res.map((i) => ({ ...i }));
      if (this.pitchItems.length > this.limitMultiple && this.limitMultiple) {
        this.pitchItems.splice(-1);
        const keys = this.pitchItems.map((item) => item.id);
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCheckedKeys(keys);
        this.$notify({
          type: "warning",
          message: `最多勾选${this.limitMultiple}个选项`
        });
        return;
      }
      /* 限制多选项的清空--end */
      this.$emit("send", res);
      this.$emit("change", {
        tree: res,
        other: {
          groupType: this.activeCategory,
          powerType: this.activeCategory
        }
      });
    },
    changeCategory(val) {
      this.activeCategory = val;
      this.isCheckedAll = false;
      this.isCheckStrictly = false;
      this.initLoading();
    },
    // 全部展开或收起
    setAllExpandOrFold(state) {
      const nodes = this.$refs.tree.store.nodesMap;
      for (const i in nodes) {
        nodes[i].expanded = state;
      }
    },
    checkAllEvent(val) {
      this.$emit("checkAll", val);
      if (val) {
        // 全选工工序树
        const totalIds = [];
        this.getAllCheckedKeys(this.$refs.tree.data, totalIds);
        this.$refs.tree.setCheckedKeys(totalIds);
        this.selectMultiple();
      } else {
        // 反选工序树
        this.$refs.tree.setCheckedKeys([]);
        this.tableData = [];
        this.isLoading = false;
        this.selectMultiple();
      }
    },
    getAllCheckedKeys(tree, total) {
      tree.forEach((item) => {
        total.push(item.id);
        if (item.children) {
          this.getAllCheckedKeys(item.children, total);
        }
      });
    }
  },
  emits: ["send", "change", "finishLoading"]
};
</script>

<style lang="scss">
.setting-trees {
  height: 500px;
  display: flex;
  flex-direction: column;
  .contain.mytree {
    height: calc(100% - 70px);
    padding-top: 10px;
    overflow: auto;
    // background: #012f7a;
    :deep() {
      .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      .el-icon-caret-right {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        fill: currentColor;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .el-icon-caret-right:before {
        // content: "\e783";
        content: "\e624";

        font-size: 18px;
        color: #4386c6;
      }
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        // content: "\e781";
        content: "\e625";
        font-size: 18px;
        color: #4386c6;
      }
      .el-tree > .el-tree-node:after {
        border-top: none;
      }
      .el-tree-node {
        position: relative;
        padding-left: 16px;
      }
      .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 0px;
        margin-right: 5px;
      }
      .el-tree-node__content {
        padding-left: 6px !important;
      }
      //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
      .el-tree-node__expand-icon.is-leaf {
        display: none;
      }
      .el-tree-node__children {
        padding-left: 16px;
      }

      .el-tree-node :last-child:before {
        height: 38px;
      }

      .el-tree > .el-tree-node:before {
        border-left: none;
      }

      .el-tree > .el-tree-node:after {
        border-top: none;
      }

      .el-tree-node:before {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
      }

      .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
      }

      .el-tree-node:before {
        border-left: 1px solid #4386c6;
        bottom: 0px;
        height: 100%;
        top: -26px;
        width: 1px;
      }

      .el-tree-node:after {
        border-top: 1px solid #4386c6;
        height: 20px;
        top: 12px;
        width: 24px;
      }
    }
  }
  .mytree.noCheckBox {
    .el-tree-node.is-current > .el-tree-node__content {
      color: #ffffff;
      background-color: #3699fe;
      .iconlabel,
      .iconfont {
        color: #ffffff !important;
      }
    }
    // .el-tree-node.is-current{
    //    .el-icon-caret-right:before{
    //      color: white;
    //    }
    // }
  }
  .categorysContain {
    margin: 5px 0px 10px;
    display: flex;
    .el-select {
      width: 100%;
      .el-input__inner {
        color: #ffffff;
        font-size: 16px;
        border: 1px solid var(--color-primary);
        background-color: var(--color-primary);
      }
      .el-input__inner::-webkit-input-placeholder {
        color: #ffffff;
      }
      .el-input .el-select__caret {
        color: #ffffff;
      }
    }
  }
  .el-tree {
    /*padding: 10px;*/
    /*min-height: 100%;*/
    min-width: 100%;
    display: inline-block;
    .el-tree__empty-block {
      min-width: 100%;
    }
  }

  .filter-node-style {
    margin-bottom: 5px;
  }

  .contain {
    display: flex;
    flex-direction: column;
    flex: 1;
    .subselect {
      overflow: hidden;
      padding: 10px 10px 10px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .checkbtns {
        flex: 0 0 100%;
      }
      .foldable {
        flex: 0 0 40%;
        display: flex;
        justify-content: flex-end;
        svg {
          margin-left: 10px;
          cursor: pointer;
          outline: none;
        }
      }
    }
  }
  .contain-action {
    flex: 0 0 50px;
    padding: 10px 10px 0 10px;
    display: flex;
    padding: 10px 10px 0 10px;
    .foldable {
      flex: 0 0 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      svg {
        margin-left: 10px;
        cursor: pointer;
        outline: none;
      }
    }
  }
  .contain-content {
    flex: 1;
    overflow: auto;
  }
  .tree-contain {
    padding-left: 0 !important;
  }
}
</style>
