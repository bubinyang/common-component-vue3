<template>
  <section class="labelInput-style">
    <!--时间-->
    <label
      v-if="editBoxType({ isFront: true, typeLabel: 'datapicker' })"
      :style="styleLabel"
      @click="editShow()"
    >
      {{ setDateLabel(value) }}
    </label>
    <el-date-picker
      v-if="editBoxType({ typeLabel: 'datapicker' })"
      ref="dateRef"
      v-model="value"
      type="datetime"
      :clearable="false"
      placeholder="选择日期时间"
      @blur="editBlur()"
      @change="change"
    />

    <!--input数字框-->
    <label
      v-if="editBoxType({ isFront: true, typeLabel: 'number' })"
      :style="styleLabel"
      @click="editShow()"
      >{{ modelValue }}</label
    >
    <el-input
      v-if="editBoxType({ typeLabel: 'number' })"
      ref="numberRef"
      v-model="value"
      type="number"
      align="center"
      placeholder="请输入内容"
      @blur="editBlur()"
      @change="change"
    />

    <!--input框-->
    <label
      v-if="editBoxType({ isFront: true, typeLabel: 'input' })"
      :style="styleLabel"
      @click="editShow()"
      >{{ modelValue }}</label
    >
    <el-input
      v-if="editBoxType({ typeLabel: 'input' })"
      ref="inputRef"
      v-model="value"
      align="center"
      placeholder="请输入内容"
      @blur="editBlur()"
      @change="change"
    />
    <!--文本域-->
    <label
      v-if="editBoxType({ isFront: true, typeLabel: 'textarea' })"
      ref="labelEl"
      :style="styleLabel"
      @click="editShow()"
      >{{ modelValue }}</label
    >
    <el-input
      v-if="editBoxType({ typeLabel: 'textarea' })"
      ref="textareaRef"
      v-model="value"
      type="textarea"
      autosize
      align="center"
      placeholder="请输入内容"
      @blur="editBlur()"
      @change="change"
    />
    <!--下拉框-->
    <label
      v-if="editBoxType({ isFront: true, typeLabel: 'select' })"
      :style="styleLabel"
      @click="editShow()"
      >{{ valLabel(modelValue) }}</label
    >

    <el-select
      v-if="editBoxType({ typeLabel: 'select' })"
      ref="selectRef"
      v-model="value"
      filterable
      :allow-create="allowCreate"
      @blur="editBlur()"
      @change="change"
    >
      <el-option v-for="v in options" :key="v.value" :label="v.label" :value="v.value" />
    </el-select>
  </section>
</template>

<script>
import moment from "moment";

function getConfig() {
  return {
    datapicker: {
      get: this.modelValue ? Number(this.modelValue) : "",
      set: function (val) {
        return +new Date(val);
      },
      autoFocus: function () {
        this.$refs.dateRef.focus();
      }
    },

    select: {
      autoFocus: function () {
        this.$refs.selectRef.toggleMenu();
      }
    },

    number: {
      autoFocus: function () {
        this.$refs.numberRef.focus();
      }
    },

    input: {
      autoFocus: function () {
        this.$refs.inputRef.focus();
      }
    },
    textarea: {
      autoFocus: function () {
        this.$refs.textareaRef.focus();
      }
    }
  };
}

export default {
  name: "LabelInputSwitch",
  components: {},
  props: {
    modelValue: {
      type: [String, Number],
      default() {
        return "";
      }
    },
    // 编辑框类型
    type: {
      type: String,
      default() {
        return "input";
      }
    },
    // 编辑框类型是select的时候
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    // 文字位置
    align: {
      type: String,
      default() {
        return "center";
      }
    },
    allowCreate: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      fullscreen: false,
      showLabel: true,
      inputHeight: "",
      test: ""
      // value:''
    };
  },
  computed: {
    value: {
      get() {
        const config = getConfig.apply(this);
        const { get } = config[this.type];
        return get ? get : this.modelValue;
      },
      set(val) {
        const config = getConfig.apply(this);
        const { set } = config[this.type];
        this.$emit("update:modelValue", set ? set(val) : val);
        this.$emit("set", set ? set(val) : val);
      }
    },

    styleLabel() {
      return {
        textAlign: this.align
      };
    },
    styleInput() {
      return {
        height: `${this.$refs.labelEl.offsetHeight}px`
      };
    }
  },
  methods: {
    setDateLabel(val) {
      return val ? moment(Number(val)).format("YYYY-MM-DD HH:mm:ss") : "";
    },
    editBlur() {
      // this.change()
      setTimeout(() => {
        this.showLabel = true;
      }, 200);
    },
    editShow() {
      this.doSpecial();
      this.showLabel = false;
      setTimeout(() => {
        const config = getConfig.apply(this);
        config[this.type].autoFocus.apply(this);
      }, 200);
    },

    editBoxType({ isFront, typeLabel }) {
      return isFront
        ? this.showLabel && this.type === typeLabel
        : !this.showLabel && this.type === typeLabel;
    },

    valLabel(val) {
      const findItem = this.options.find((item) => item.value === val);

      if (this.allowCreate) {
        return findItem ? findItem.label : val;
      } else {
        return findItem ? findItem.label : "";
      }
    },
    // select event
    // selectEvent(type) {
    //   if (!type) {
    //     this.editBlur()
    //   }
    // },

    // 文本域的时候需要操作一些特殊事件
    doSpecial() {
      const action = {
        textarea() {
          const { offsetHeight } = this.$refs.labelEl;
          this.$refs.textareaRef.$el.children[0].style.height = `${offsetHeight}px`;
        }
      };
      if (action[this.type]) {
        action[this.type].apply(this);
      }
    },
    change() {
      this.$emit("change");
    }
  },
  emits: ["set", "change", "update:modelValue"]
};
</script>

<style lang="scss">
.labelInput-style {
  label {
    display: block;
    cursor: pointer;
    min-height: 35px;
    line-height: 35px;
    overflow: hidden;

    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  .el-input {
    height: 35px;
    input {
      height: 100%;
    }
  }
  .el-textarea {
    // position: absolute;
    // top:0;
    // left:0;
    // z-index: 2;
    textarea {
      line-height: 33px;
      padding: 12px 0 12px 0;
    }
  }
}
</style>
