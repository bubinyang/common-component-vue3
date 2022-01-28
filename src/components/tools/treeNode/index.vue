<!--
 * @Descripttion:
 * @version:
 * @Author: BBY
 * @Date: 2020-11-17 10:56:41
 * @LastEditTime: 2020-12-10 13:22:45

1.默认数据和外部数据的loading处理方式(watch data的变化，当[]的时候loading，当有数据的时候loading消失)
  接口传数据的时候，如果接口成功和失败都要让loading消失
-->
<template>
  <div class="tree-node-style">
    <div v-if="filter" class="tree-node-style-action">
      <el-input v-model="filterText" class="filter-node-style" placeholder="关键字/能源品种 查询" />
    </div>

    <el-tree
      ref="tree"
      v-loading="loading || loadingInitial"
      :data="originTreeData"
      v-bind="($props, $attrs)"
      :filter-node-method="filterNode"
      :default-expand-all="defaultExpandAll"
      :check-strictly="checkStrictly"
      :expand-on-click-node="expandOnClickNode"
      element-loading-text="加载中"
      :highlight-current="highlightCurrent"
      @node-click="handleNodeClick"
      @check="selectMultiple"
    />
  </div>
</template>

<script>
import { dataList } from "./data.js";
export default {
  name: "TreeNode",
  props: {
    // 是否有过滤
    filter: {
      type: Boolean,
      default: false
    },
    filterNode: {
      type: Function,
      default: (value, data) => {
        if (!value) return true;
        return data.name ? data.name.includes(value) : false;
      }
    },
    checkStrictly: {
      type: Boolean,
      default: () => true
    },
    defaultExpandAll: {
      type: Boolean,
      default: () => true
    },
    expandOnClickNode: {
      type: Boolean,
      default: () => false
    },
    isInitialData: {
      type: Boolean,
      default: () => true
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: () => true
    },
    elementLoadingText: {
      type: String,
      default: () => {
        return "加载中";
      }
    },
    highlightCurrent: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      // loading: true,
      origin: [],
      filterText: "",
      initialTreeData: [],
      loadingInitial: false,
      //test,
      datas: [
        {
          label: "Level one 1",
          children: [
            {
              label: "Level two 1-1",
              children: [
                {
                  label: "Level three 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "Level one 2",
          children: [
            {
              label: "Level two 2-1",
              children: [
                {
                  label: "Level three 2-1-1"
                }
              ]
            },
            {
              label: "Level two 2-2",
              children: [
                {
                  label: "Level three 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "Level one 3",
          children: [
            {
              label: "Level two 3-1",
              children: [
                {
                  label: "Level three 3-1-1"
                }
              ]
            },
            {
              label: "Level two 3-2",
              children: [
                {
                  label: "Level three 3-2-1"
                }
              ]
            }
          ]
        }
      ],

      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    originTreeData() {
      console.log(this.data);
      return this.data.length ? this.data : this.initialTreeData;
    },
    loadingValue: {
      get() {
        return this.loading;
      },
      set(val) {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {},

  created() {
    // 如果是默认数据源就调取默认接口
    if (this.isInitialData) {
      this.loadingInitial = true;
      this.getInitialData()
        .then((data) => {
          console.log(data);
          this.initialTreeData = data;
        })
        .finally(() => {
          this.loadingInitial = false;
        });
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    // 获取默认接口调取的数据
    getInitialData() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(dataList);
        }, 500);
      });
    },

    // 多选
    selectMultiple(item) {
      // const resNodes = this.$refs.tree.getCheckedNodes()
    }
  }
};
</script>
