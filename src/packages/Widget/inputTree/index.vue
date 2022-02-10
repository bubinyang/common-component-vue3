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
  <div class="input-tree-style test">
    <el-cascader
      v-if="treeHorizontal"
      :show-all-levels="false"
      :clearable="clearable"
      :props="keyType"
      v-model="showValHz"
      :options="origin"
      filterable
      expand-trigger="hover"
      @change="changeCascader"
      @visible-change="visibleChange"
    />

    <template v-if="!treeHorizontal">
      <el-popover
        ref="deptListPopover"
        :width="treeWidth"
        :disabled="disabled"
        v-model:visible="deptListVisible"
        placement="bottom-start"
        trigger="click"
      >
        <el-tree
          ref="deptListTree"
          :show-checkbox="showCheckbox"
          v-bind="$attrs"
          :data="origin"
          :props="keyType"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          node-key="id"
          accordion
          highlight-current
          @check="checkNode"
          @node-click="handleNodeClick"
        />

        <template #reference>
          <el-input
            v-if="!showCheckbox"
            ref="treeInput"
            v-model="showVal"
            :disabled="disabled"
            :clearable="clearable"
            :placeholder="findVal ? findVal[keyType.label] : placeHolder"
            @click="deptListVisible = !deptListVisible"
            @clear="clear"
          />
        </template>
        <!-- <template #reference>
          <el-button @click="deptListVisible = !deptListVisible">手动激活</el-button>
        </template> -->
      </el-popover>

      <!--多选-->
      <el-input
        v-popover:deptListPopover
        v-if="showCheckbox"
        ref="treeInput"
        v-model="multipleVal"
        :disabled="disabled"
        type="textarea"
        readonly
        placeholder=""
      />
    </template>
  </div>
</template>

<script>
import { spreadTrees } from "@/utils/index.js";
import props from "./prop.js";
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

export default {
  name: "InputTree",
  props: props,
  data() {
    return {
      visible: false,
      deptListVisible: false,
      spreadData: [],
      showVal: "",
      findVal: {},
      filterText: "",
      treeWidth: 350,
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
        const val = findParentNode(this.origin, this.modelValue, key, childrenKey).reverse();
        return val;
      },
      set(val) {
        this.originVal = val;
        // this.$emit("set", val[val.length - 1]);
        this.$emit("update:modelValue", val[val.length - 1]);
      }
    }

    // 多选val监听
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
            (item) => item[this.valueKey] === this.modelValue || item.name === this.modelValue
          );
          this.$nextTick(() => {
            if (findVal) {
              this.$refs.deptListTree.setCurrentKey(findVal[this.valueKey]);
            } else {
              this.$refs.deptListTree.setCurrentKey(null);
            }
          });
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
        this.spreadData = spreadTrees(val, this.keyType.children);
        this.findVal = this.spreadData.find(
          (item) => item[this.valueKey] === this.modelValue || item.name === this.modelValue
        );

        if (this.findVal) this.showVal = this.findVal[this.keyType.label];
      },
      immediate: true
    },
    // 外面的待选数据列表快于历史数据处理
    modelValue: {
      handler(val) {
        // 有历史数据,但是未找到findVal,代变历史数据更快，执行一次查找
        if (val || !this.findVal) {
          this.findVal = this.spreadData.find(
            (item) => item[this.valueKey] === this.modelValue || item.name === this.modelValue
          );
          if (this.findVal) this.showVal = this.findVal[this.keyType.label];
        }
        if (!val) {
          this.showVal = "";
          this.findVal = null;
        }
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
    this.$nextTick(() => {
      if (!this.$refs.treeInput) return;
      this.treeWidth = this.$refs.treeInput.$el.getBoundingClientRect().width;
    });
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
      this.$emit("update:modelValue", entity[this.valueKey]);
      this.$emit("change", entity);

      this.deptListVisible = false;
      this.$forceUpdate();
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
      this.$emit("update:modelValue", "");
    },
    // 搜索
    filterNode(value, data) {
      return data[this.keyType.label].includes(value);
    },
    focus() {
      this.showVal = "";
    },
    visibleChange(isShow) {},
    changeCascader() {
      this.$emit("change", {
        list: this.originVal,
        val: this.originVal[this.originVal.length - 1]
      });
    },
    //vue3.0
    focusInput() {
      // this.deptListVisible = true;
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
