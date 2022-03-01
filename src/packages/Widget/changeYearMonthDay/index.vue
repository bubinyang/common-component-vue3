<template>
  <div class="yearDateComponentPriva">
    <el-radio-group
      v-if="typeList.length > 1"
      v-model="computeDateOption.type"
      @change="changeRadio"
    >
      <el-radio-button v-if="typeList.includes('realtime')" label="realtime">实时</el-radio-button>
      <el-radio-button v-if="typeList.includes('day')" label="day">日</el-radio-button>
      <el-radio-button v-if="typeList.includes('month')" label="month">月</el-radio-button>
      <el-radio-button v-if="typeList.includes('year')" label="year">年</el-radio-button>
      <el-radio-button v-if="typeList.includes('allyear')" label="allyear">多年</el-radio-button>
    </el-radio-group>
    <!--        将年月日拆分成三个组件的原因：快速切换datePicker的type并且很快的打开关闭，会出现样式bug-->
    <div>{{ titleList[0] ? titleList[0] : "" }}</div>
    <div v-show="computeDateOption.type === 'day' || computeDateOption.type === 'realtime'">
      <el-date-picker
        v-model="computeDateOption.date"
        :clearable="false"
        :disabled-date="disabledDate"
        type="date"
        placeholder="选择日期"
        @change="changeDatePicker(dateOption.date, 'date')"
      />
    </div>

    <HourMinuteSeconds
      v-if="dateOption.type === 'realtime'"
      v-model="timeValueFrom"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <el-date-picker
      v-if="dateOption.type === 'month'"
      v-model="computeDateOption.date"
      :clearable="false"
      :disabled-date="disabledDate"
      type="month"
      placeholder="选择月"
      @change="changeDatePicker(dateOption.date, 'date')"
    />
    <el-date-picker
      v-if="dateOption.type === 'year'"
      v-model="computeDateOption.date"
      :clearable="false"
      :disabled-date="disabledDate"
      type="year"
      placeholder="选择年"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <el-date-picker
      v-if="dateOption.type === 'allyear'"
      v-model="computeDateOption.date"
      :clearable="false"
      :disabled-date="disabledDate"
      type="year"
      placeholder="选择年"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <template v-if="multiple && typeListMutiple.includes(dateOption.type)">
      <div>{{ titleList[1] ? titleList[1] : "" }}</div>
      <template v-if="!titleList.length"><div class="septalLine">-</div></template>
      <el-date-picker
        v-if="dateOption.type === 'day' || dateOption.type === 'realtime'"
        v-model="computeDateOption.dateOther"
        :clearable="false"
        :disabled-date="disabledDate"
        type="date"
        placeholder="选择日期"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />

      <HourMinuteSeconds
        v-if="dateOption.type === 'realtime'"
        v-model="timeValueTo"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />

      <el-date-picker
        v-if="dateOption.type === 'month'"
        v-model="computeDateOption.dateOther"
        :clearable="false"
        :disabled-date="disabledDate"
        type="month"
        placeholder="选择月"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />
      <el-date-picker
        v-if="dateOption.type === 'year'"
        v-model="computeDateOption.dateOther"
        :clearable="false"
        :disabled-date="disabledDate"
        type="year"
        placeholder="选择年"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />

      <el-date-picker
        v-if="dateOption.type === 'allyear'"
        v-model="computeDateOption.dateOther"
        :clearable="false"
        :disabled-date="disabledDate"
        type="year"
        placeholder="选择年"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />
    </template>
  </div>
</template>

<script>
// import HourMinuteSeconds from '@/components/upgrade/hourMinuteSecond';
// import HourMinuteSeconds from "./hourMinuteSecond.vue";
import moment from "moment";
import props from "./prop.js";
let once = false;
export default {
  name: "ChangeYearMonthDay",

  props: props,
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      timeValueFrom: "",
      timeValueTo: ""

      // timeValueFrom: this.dateOption.date ? moment(this.dateOption.date).format('HH:mm:ss') : '',
      // timeValueTo: this.dateOption.dateOther ? moment(this.dateOption.dateOther).format('HH:mm:ss') : ''
    };
  },
  computed: {
    datePickerType() {
      const types = { day: "date", month: "month", year: "year" };
      return types[this.dateOption.type];
    },
    computeDateOption: {
      get() {
        return this.dateOption;
      },
      set(val) {
        this.$emit("update:dateOption", val);
      }
    }
  },
  watch: {
    dateOption: {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        //重选日月年点回实时,会出现格林威治时间,需要重置。当回写过来的数据没有时分秒,初始化时分秒
        const nutralTimeDate = moment(new Date(val.date))
          .startOf("day")
          .add(this.addHours, "hour")
          .format("HH:mm:ss");
        const nutralTimeDateOther = moment(new Date(val.dateOther))
          .startOf("day")
          .add(this.addHours, "hour")
          .format("HH:mm:ss");
        const isString = Object.prototype.toString.apply(val.date) === "[object String]";
        this.timeValueFrom = val.date
          ? !(isString && val.date.includes(":"))
            ? nutralTimeDate
            : moment(new Date(val.date)).format("HH:mm:ss")
          : "";
        this.timeValueTo = val.dateOther
          ? !(isString && val.date.includes(":"))
            ? nutralTimeDateOther
            : moment(new Date(val.dateOther)).format("HH:mm:ss")
          : "";
      },
      deep: true, // true 深度监听
      immediate: true
    }
  },
  mounted() {
    const { date, dateOther } = this.dateOption;
    if (!date || !dateOther) {
      this.setInitialVal();
    }
    this.$emit("update:dateOption", this.dateOption);
  },
  methods: {
    changeRadio(type) {
      this.setInitialVal();
      // this.timeValueFrom = moment().startOf('day').format('HH:mm:ss');
      // this.timeValueTo = moment().startOf('day').format('HH:mm:ss');
      this.$emit("update:dateOption", this.dateOption);
      this.$emit("change");
    },
    changeDatePicker(date, key) {
      if (date) {
        const { type } = this.dateOption;
        this.setTimeFormatter()[type](date, key);
        this.$emit("update:dateOption", this.dateOption);
      } else {
        let setDate = JSON.stringify(this.dateOption);
        setDate = {
          dateOther: "",
          date: "",
          type: "day"
        };
        this.$emit("update:dateOption", setDate);
      }
      this.$emit("change");
    },
    setInitialVal(val = new Date()) {
      if (this.dateOption.type === "realtime") {
        this.computeDateOption.date = `${moment(val)
          .subtract(this.setDiffVal("day")["startDiffVal"], "days")
          .format("YYYY-MM-DD")} ${this.timeValueFrom}`;
        this.computeDateOption.dateOther = `${moment(val)
          .subtract(this.setDiffVal("day")["endDiffVal"], "days")
          .format("YYYY-MM-DD")} ${this.timeValueTo}`;
      } else if (this.dateOption.type === "day") {
        this.computeDateOption.date = moment(val)
          .subtract(this.setDiffVal("day")["startDiffVal"], "days")
          .format("YYYY-MM-DD");
        this.computeDateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("day")["endDiffVal"], "days")
          .format("YYYY-MM-DD");
      } else if (this.dateOption.type === "month") {
        this.computeDateOption.date = moment(val)
          .subtract(this.setDiffVal("month")["startDiffVal"], "month")
          .format("YYYY-MM");
        this.computeDateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("month")["endDiffVal"], "month")
          .format("YYYY-MM");
      } else if (this.dateOption.type === "year") {
        this.computeDateOption.date = moment(val)
          .subtract(this.setDiffVal("year")["startDiffVal"], "year")
          .format("YYYY");
        this.computeDateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("year")["endDiffVal"], "year")
          .format("YYYY");
      } else {
        this.computeDateOption.date = moment(val)
          .subtract(this.setDiffVal("allyear")["startDiffVal"], "year")
          .format("YYYY");
        this.computeDateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("allyear")["endDiffVal"], "year")
          .format("YYYY");
      }
    },

    setTimeFormatter() {
      return {
        realtime: (val, key) => {
          if (key === "date")
            this.computeDateOption.date = `${moment(val).format("YYYY-MM-DD")} ${
              this.timeValueFrom
            }`;
          if (key === "dateOther")
            this.computeDateOption.dateOther = `${moment(val).format("YYYY-MM-DD")} ${
              this.timeValueTo
            }`;
        },
        day: (val, key) => {
          if (key === "date") this.computeDateOption.date = moment(val).format("YYYY-MM-DD");
          if (key === "dateOther")
            this.computeDateOption.dateOther = moment(val).format("YYYY-MM-DD");
        },
        month: (val, key) => {
          if (key === "date") this.computeDateOption.date = moment(val).format("YYYY-MM");
          if (key === "dateOther") this.computeDateOption.dateOther = moment(val).format("YYYY-MM");
        },
        year: (val, key) => {
          if (key === "date") this.computeDateOption.date = moment(val).format("YYYY");
          if (key === "dateOther") this.computeDateOption.dateOther = moment(val).format("YYYY");
        },
        allyear: (val, key) => {
          if (key === "date") this.computeDateOption.date = moment(val).format("YYYY");
          if (key === "dateOther") this.computeDateOption.dateOther = moment(val).format("YYYY");
        }
      };
    },

    setDiffVal(type) {
      if (this.increase && this.typeListMutiple.includes(type)) {
        return {
          startDiffVal: this.intervalTimeValue[type] || 1,
          endDiffVal: 0
        };
      } else {
        return {
          startDiffVal: 0,
          endDiffVal: this.intervalTimeValue[type] || 1
        };
      }
    }
  },
  emits: ["update:dateOption", "change"]
};
</script>

<style lang="scss">
.yearDateComponentPriva {
  display: flex;
  align-items: center;
  .septalLine {
    margin: 0 5px;
  }

  .el-radio-group {
    margin-right: 5px;
  }
  .el-date-editor.el-input {
    //  margin-left:5px;
    width: 140px;
  }
  //  .marginRight{
  //      margin-right: 5px;
  //  }
}
</style>
