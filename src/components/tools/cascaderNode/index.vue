<!--
 * @Descripttion:
 * @version:
 * @Author: BBY
 * @Date: 2020-12-10 13:25:44
 * @LastEditTime: 2020-12-14 10:50:11
-->

<template>
  <div class="cascader-node-style">
    <!-- <el-input v-model="showValHz" placeholder="请输入内容" /> -->
    <el-cascader
      v-model="showValHz"
      v-bind="($props, $attrs)"
      :options="origin"
      :props="keyType"
      @change="handleChange"
    />
    {{ showValHz }}
  </div>
</template>

<script>
import { findParentNode } from "@/utils";
export default {
  name: "CascaderNode",
  model: {
    event: "set",
    prop: "value"
  },
  props: {
    value: {
      type: [Array, String],
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
    keyType: {
      type: Object,
      default() {
        return { label: "label", children: "children", value: "id" };
      }
    },
    /**
     * 判断双向绑定的值
     * 1.所有层级的值组成数组
     * 2.最后一级的值
     */
    valType: {
      type: String,
      default() {
        return "typeString";
      }
    }
  },
  data() {
    return {
      // showValHz: []
    };
  },

  computed: {
    showValHz: {
      get() {
        const { children } = this.keyType;
        const val = findParentNode({ list: this.origin, val: this.value, children }).reverse();
        return this.modeType(this.valType) === "typeString" ? val : this.value;
      },
      set(val) {
        console.log(this.modeType(this.valType));
        this.$emit("set", this.modeType(this.valType) === "typeString" ? val[val.length - 1] : val);
      }
    }
  },

  mounted() {},

  created() {
    // if (this.keyType.multiple && this.modeType(this.valType) === 'typeString') {
    //   console.error('多选情况下,双绑类型必须为Array')
    // }
    if (
      this.modeType(this.valType) === "typeString" &&
      Object.prototype.toString.call(this.value) === "[object Array]"
    ) {
      console.error("双绑数据类型应该为字符串，请检查");
    } else if (
      this.modeType(this.valType) === "typeArray" &&
      Object.prototype.toString.call(this.value) === "[object String]"
    ) {
      console.error("双绑数据类型应该为数组，请检查");
    }
  },
  methods: {
    handleChange(val) {
      this.$emit(
        "change",
        this.modeType(this.valType) === "typeString" ? val[val.length - 1] : val
      );
    },
    // 判单双棒类型,多选的时候双绑必须原生数组，单选时候，根据valType来决定类型
    modeType(type) {
      const typeVal = this.keyType.multiple ? this.keyType.multiple : type;
      if (typeVal === true) {
        return "typeArray";
      } else {
        return typeVal;
      }
    }
  }
};
</script>
