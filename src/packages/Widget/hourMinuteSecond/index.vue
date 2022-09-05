<template>
  <section class="hourMinSecond-style">
    <el-tooltip class="item" effect="dark" content="小时" placement="top">
      <span>
        <el-select @change="changeDate" v-model="hourValue" placeholder="时">
          <el-option v-for="item in hourList" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </span>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="分钟" placement="top">
      <span>
        <el-select @change="changeDate" v-model="minutesVal" placeholder="分">
          <el-option v-for="item in minutes" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </span>
    </el-tooltip>

    <template v-if="isRange">
      <label>-</label>

      <el-tooltip class="item" effect="dark" content="小时" placement="top">
        <span>
          <el-select @change="changeDate" v-model="hourValueEnd" placeholder="时">
            <el-option v-for="item in hourList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </span>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="分钟" placement="top">
        <span>
          <el-select @change="changeDate" v-model="minutesValEnd" placeholder="分">
            <el-option v-for="item in minutes" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </span>
      </el-tooltip>
    </template>
  </section>
</template>

<script>
const typeObj = { 0: "HH", 1: "mm" };
export default {
  name: "HourMinuteSeconds",
  data() {
    return {
      hourList: [],
      minutes: [],
      dateValue: {}
      // hourValue: '',
      // minutesVal: '',
    };
  },
  computed: {
    hourValue: {
      get() {
        let dateValKey = this.computePublic();
        return dateValKey["HH"];
      },
      set(v) {
        if (!this.isRange) {
          const list = [v, this.minutesVal];
          this.$emit("update:modelValue", `${list.join(":")}:00`);
        } else {
          this.computeSet({ v, groupIndex: 0, itemIndex: 0 });
        }
      }
    },

    minutesVal: {
      get() {
        let dateValKey = this.computePublic();
        return dateValKey["mm"];
      },
      set(v) {
        if (!this.isRange) {
          const list = [this.hourValue, v];
          this.$emit("update:modelValue", `${list.join(":")}:00`);
        } else {
          this.computeSet({ v, groupIndex: 0, itemIndex: 1 });
        }
      }
    },

    hourValueEnd: {
      get() {
        let dateValKey = this.computePublic(1);
        return dateValKey["HH"];
      },
      set(v) {
        if (!this.isRange) {
          const list = [v, this.minutesValEnd];
          this.$emit("update:modelValue", `${list.join(":")}:00`);
        } else {
          this.computeSet({ v, groupIndex: 1, itemIndex: 0 });
        }
      }
    },

    minutesValEnd: {
      get() {
        let dateValKey = this.computePublic(1);
        return dateValKey["mm"];
      },
      set(v) {
        if (!this.isRange) {
          const list = [this.hourValueEnd, v];
          this.$emit("update:modelValue", `${list.join(":")}:00`);
        } else {
          this.computeSet({ v, groupIndex: 1, itemIndex: 1 });
        }
      }
    }
  },
  props: {
    modelValue: {
      type: Array,
      default() {
        return new Date();
      }
    },
    isRange: {
      type: Boolean,
      default() {
        return false;
      }
    },
    intervalTime: {
      type: Number,
      default() {
        return 5;
      }
    }
  },
  mounted() {
    this.getHours();
    this.getMinutes();
  },
  methods: {
    getHours() {
      let i = 0;
      while (i < 24) {
        this.hourList.push(i < 10 ? `0${i}` : i);
        i++;
      }
    },
    getMinutes() {
      let i = 0;
      while (i < 60) {
        this.minutes.push(i < 10 ? `0${i}` : i);
        i += this.intervalTime;
      }
    },
    //将转入的数值转成json，有数值类型key
    doOrigin(val = this.modelValue) {
      const dateValList = val.split(":");
      return dateValList.reduce((total, item, index) => {
        const key = typeObj[index];
        total[key] = dateValList[index];
        return total;
      }, {});
    },
    //compute set情况下的公共方法
    computeSet({ v, groupIndex, itemIndex }) {
      if (!this.isRange) {
        const list = [v, this.minutesVal];
        this.$emit("update:modelValue", `${list.join(":")}:00`);
      } else {
        const list = [
          [this.hourValue, this.minutesVal],
          [this.hourValueEnd, this.minutesValEnd]
        ];
        list[groupIndex][itemIndex] = v;
        const emitVal = list.map((item) => {
          return `${item.join(":")}:00`;
        });
        this.$emit("update:modelValue", emitVal);
      }
    },
    changeDate() {
      this.$emit("change");
    },
    computePublic(index = 0) {
      if (!this.isRange) {
        return this.doOrigin();
      } else {
        return this.doOrigin(this.modelValue[index]);
      }
    }
  },
  emits: ["update:modelValue", "change"]
};
</script>

<style lang="scss">
.hourMinSecond-style {
  display: flex;
  align-items: center;
  .el-select {
    width: 70px;
    margin: 0 5px 0 0;
  }
}
</style>
