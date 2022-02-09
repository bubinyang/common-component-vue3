<!--
 * @Descripttion:
 * @version:
 * @Author: BBY
 * @Date: 2020-11-17 10:56:41
 * @LastEditTime: 2020-12-10 16:13:23
-->
<!--
valueKey 上下树形结构情况，获取的字段可能不是id
keyType : 处理数据结构，左右树形情况给出想要的字段
-->
<template>
  <div class="input-tree-style">
    <el-cascader
      :show-all-levels="false"
      filterable
      :clearable="clearable"
      v-if="treeHorizontal"
      :props="keyType"
      expandTrigger="hover"
      v-model="showValHz"
      :options="origin"
      @change="changeCascader"
      @visible-change="visibleChange"
    ></el-cascader>

    <template v-if="!treeHorizontal">
      <el-popover
        :width="treeWidth"
        :disabled="disabled"
        v-model="deptListVisible"
        ref="deptListPopover"
        placement="bottom-start"
        trigger="click"
        popper-class="input-tree-style-contain"
      >
        <el-tree
          :show-checkbox="showCheckbox"
          v-bind="$attrs"
          @check="checkNode"
          :data="origin"
          :props="keyType"
          node-key="id"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="deptListTree"
          :expand-on-click-node="false"
          accordion
          highlight-current
        ></el-tree>
      </el-popover>
      <el-input
        v-if="!showCheckbox"
        ref="treeInput"
        v-model="showVal"
        v-popover:deptListPopover
        :disabled="disabled"
        :clearable="clearable"
        @clear="clear"
        :placeholder="findVal ? findVal[keyType.label] : placeHolder"
      >
      </el-input>

      <!--多选-->
      <el-input
        v-if="showCheckbox"
        type="textarea"
        ref="treeInput"
        v-popover:deptListPopover
        v-model="multipleVal"
        :disabled="disabled"
        readonly
        placeholder=""
      >
      </el-input>
    </template>
  </div>
</template>

<script>
// 辅助横向inputTree查找层级数组方法
function findParentNode(list, val, key, children) {
  const arr = [];
  circulation(list);
  function circulation(list) {
    let choose = false;
    (list || []).forEach((item, index) => {
      if (item[children]) {
        // eslint-disable-next-line no-unused-vars
        item.choose = circulation(item[children]);
      }
      if (item[key] === val || item.choose) {
        arr.push(item[key]);
        choose = true;
      }
    });
    return choose;
  }
  return arr;
}

function spreadTree(data, children = "children") {
  return data.reduce((total, item) => {
    total.push(item);
    if (item[children]) {
      total.push(...spreadTree(item[children], children));
    }
    return total;
  }, []);
}

// import { mapState } from 'vuex'
// input框选中
export default {
  name: "InputTree",
  model: {
    event: "set",
    prop: "value"
  },
  props: {
    // styleBox: {
    //   type: String,
    //   default () {
    //     return {}
    //   }
    // },
    value: {
      type: String,
      default() {
        return "";
      }
    },

    origin: {
      type: Array,
      default() {
        return [];
      }
    },
    placeHolder: {
      type: String,
      default() {
        return "请填写内容";
      }
    },
    keyType: {
      type: Object,
      default() {
        return { label: "label", children: "children" };
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },

    labelVal: {
      type: String,
      default() {
        return "";
      }
    },
    // // 值类型,一般为code，有时候是label
    valueKey: {
      type: String,
      default() {
        return "id";
      }
    },
    treeHorizontal: {
      type: Boolean,
      default() {
        return false;
      }
    },
    /* cascader的属性 */
    // 是否清除
    clearable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    //是否为多选
    showCheckbox: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      deptListVisible: false,
      spreadData: [],
      showVal: "",
      findVal: {},
      filterText: "",
      treeWidth: 150,
      originVal: [],
      multipleVal: ""
      // showValHz: ''
    };
  },
  computed: {
    // Horizontal tree的时候处理
    showValHz: {
      get() {
        const { value, children } = this.keyType;
        const key = value || "id";
        const childrenKey = children || "childList";
        const val = findParentNode(this.origin, this.value, key, childrenKey).reverse();
        //  this.$emit('emitVal', val)
        return val;
      },
      set(val) {
        this.originVal = val;
        this.$emit("set", val[val.length - 1]);
      }
    }

    //多选val监听
    // multipleVal:{
    //   get(){
    //      return [1,2,3]
    //   },
    //   set(val){
    //      this.$emit('set', val)
    //   }
    // }
  },

  watch: {
    deptListVisible: {
      // 设置tree选中状态
      handler(val) {
        if (val) {
          this.filterText = "";
          const findVal = this.spreadData.find(
            (item) => item[this.valueKey] === this.value || item.name === this.value
          );
          this.$nextTick(() => {
            if (findVal) {
              this.$refs.deptListTree.setCurrentKey(findVal[this.valueKey]);
            } else {
              this.$refs.deptListTree.setCurrentKey(null);
            }
          });
          //选中就清空,避免过滤导致无法查看全部待选项目
          this.showVal = "";
        } else {
          this.showVal = this.findVal ? this.findVal[this.keyType.label] : "";
        }
      },
      immediate: true
    },
    // 外面待选数据列表慢于历史value的时候需要这样处理
    origin: {
      handler(val) {
        val = val || [];
        this.spreadData = spreadTree(val, this.keyType.children);
        this.findVal = this.spreadData.find(
          (item) => item[this.valueKey] === this.value || item.name === this.value
        );
        if (this.findVal) this.showVal = this.findVal[this.keyType.label];
      },
      immediate: true
    },
    // 外面的待选数据列表快于历史数据处理
    value: {
      handler(val) {
        // 有历史数据,但是未找到findVal,代变历史数据更快，执行一次查找
        if (val || !this.findVal) {
          this.findVal = this.spreadData.find(
            (item) => item[this.valueKey] === this.value || item.name === this.value
          );
          if (this.findVal) this.showVal = this.findVal[this.keyType.label];
        }
        if (!val) this.showVal = "";
      },
      immediate: true
    },
    showVal(val) {
      if (!this.$refs.deptListTree) return;
      this.$refs.deptListTree.filter(val);
    }
  },

  created() {},
  mounted() {
    if (!this.$refs.treeInput) return;
    this.treeWidth = this.$refs.treeInput.$el.getBoundingClientRect().width;
  },
  methods: {
    checkNode(entity) {
      let list = this.$refs.deptListTree.getCheckedNodes();
      list = list.filter((item) => item.name !== "全部");
      this.$emit("change", list);
      this.multipleVal = list.map((item) => item.name).join(",");
    },
    handleNodeClick(entity, Node) {
      if (this.showCheckbox) return;
      this.setLabel(entity);
      this.$emit("set", entity[this.valueKey]);
      this.$emit("change", entity);

      this.deptListVisible = false;
    },
    setLabel(entity) {
      this.findVal = this.spreadData.find((item) => item[this.valueKey] === entity[this.valueKey]);
      if (this.findVal) {
        this.showVal = this.findVal[this.keyType.label];
        this.$forceUpdate();
      }
    },
    clear() {
      this.findVal = null;
      this.$emit("set", "");
    },
    // 搜索
    filterNode(value, data) {
      return data[this.keyType.label].includes(value);
    },
    focus() {
      // this.showVal=''
    },
    visibleChange(isShow) {},
    changeCascader() {
      this.$emit("change", {
        list: this.originVal,
        val: this.originVal[this.originVal.length - 1]
      });
    }
  }
};
</script>

<style lang="scss">
//   .input-tree-style{
//      .contain{
//          max-height: 10vh;
//          overflow-y: auto;
//      }
//   }
</style>
