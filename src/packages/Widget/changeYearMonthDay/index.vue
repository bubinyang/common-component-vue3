<template>
  <div class="yearDateComponentPriva">
    <el-radio-group v-if="typeList.length > 1" v-model="dateOption.type" @change="changeRadio">
      <el-radio-button v-if="typeList.includes('realtime')" label="realtime">实时</el-radio-button>
      <el-radio-button v-if="typeList.includes('day')" label="day">日</el-radio-button>
      <el-radio-button v-if="typeList.includes('month')" label="month">月</el-radio-button>
      <el-radio-button v-if="typeList.includes('year')" label="year">年</el-radio-button>
    </el-radio-group>
    <!--        将年月日拆分成三个组件的原因：快速切换datePicker的type并且很快的打开关闭，会出现样式bug-->
    <div>{{ titleList[0] ? titleList[0] : "" }}</div>
    <el-date-picker
      v-show="dateOption.type === 'day' || dateOption.type === 'realtime'"
      v-model="dateOption.date"
      :clearable="false"
      :picker-options="futureTime || pickerOptions"
      type="date"
      placeholder="选择日期"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <HourMinuteSecond
      v-if="dateOption.type === 'realtime'"
      v-model="timeValueFrom"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <el-date-picker
      v-show="dateOption.type === 'month'"
      v-model="dateOption.date"
      :clearable="false"
      :picker-options="futureTime || pickerOptions"
      type="month"
      placeholder="选择月"
      @change="changeDatePicker(dateOption.date, 'date')"
    />
    <el-date-picker
      v-show="dateOption.type === 'year'"
      v-model="dateOption.date"
      :clearable="false"
      :picker-options="futureTime || pickerOptions"
      type="year"
      placeholder="选择年"
      @change="changeDatePicker(dateOption.date, 'date')"
    />

    <template v-if="multiple && typeListMutiple.includes(dateOption.type)">
      <div>{{ titleList[1] ? titleList[1] : "" }}</div>
      <template v-if="!titleList.length"><div class="septalLine">-</div></template>
      <el-date-picker
        v-show="dateOption.type === 'day' || dateOption.type === 'realtime'"
        v-model="dateOption.dateOther"
        :clearable="false"
        :picker-options="futureTime || pickerOptions"
        type="date"
        placeholder="选择日期"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />

      <HourMinuteSecond
        v-if="dateOption.type === 'realtime'"
        v-model="timeValueTo"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />

      <el-date-picker
        v-show="dateOption.type === 'month'"
        v-model="dateOption.dateOther"
        :clearable="false"
        :picker-options="futureTime || pickerOptions"
        type="month"
        placeholder="选择月"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />
      <el-date-picker
        v-show="dateOption.type === 'year'"
        v-model="dateOption.dateOther"
        :clearable="false"
        :picker-options="futureTime || pickerOptions"
        type="year"
        placeholder="选择年"
        @change="changeDatePicker(dateOption.dateOther, 'dateOther')"
      />
    </template>
  </div>
</template>

<script>
// import HourMinuteSeconds from '@/components/upgrade/hourMinuteSecond';
import moment from "moment";
import props from "./prop.js";
const once = false;
export default {
  name: "ChangeYearMonthDay",
  model: {
    prop: "dateOption",
    event: "set"
  },
  props: props,
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeValueFrom: "",
      timeValueTo: "",
      test: "00:00:00"
      // timeValueFrom: this.dateOption.date ? this.$moment(this.dateOption.date).format('HH:mm:ss') : '',
      // timeValueTo: this.dateOption.dateOther ? this.$moment(this.dateOption.dateOther).format('HH:mm:ss') : ''
    };
  },
  computed: {
    datePickerType() {
      const types = { day: "date", month: "month", year: "year" };
      return types[this.dateOption.type];
    }
    // radioGroupStyle() {
    //   return {
    //     marginRight: this.showType
    //   };
    // }
  },
  watch: {
    dateOption: {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // 重选日月年点回实时,会出现格林威治时间,需要重置。首次加载传入的时间戳不能startof
        const nutralTimeDate = this.$moment(new Date(val.date))
          .startOf("day")
          .add(this.addHours, "hour")
          .format("HH:mm:ss");
        const nutralTimeDateOther = this.$moment(new Date(val.dateOther))
          .startOf("day")
          .add(this.addHours, "hour")
          .format("HH:mm:ss");
        // this.timeValueFrom = val.date ? (once ? nutralTimeDate : this.$moment(new Date(val.date)).format('HH:mm:ss')) : '',
        // this.timeValueTo = val.dateOther ? (once ? nutralTimeDateOther : this.$moment(new Date(val.dateOther)).format('HH:mm:ss')) : '',
        // console.log(this.timeValueFrom);
        // once = true;

        // this.timeValueFrom = val.date ? this.$moment(new Date(val.date)).format('HH:mm:ss') : '';
        // this.timeValueTo = val.date ? this.$moment(new Date(val.dateOther)).format('HH:mm:ss') : '';

        this.timeValueFrom = val.date
          ? !val.date.includes(":")
            ? nutralTimeDate
            : this.$moment(new Date(val.date)).format("HH:mm:ss")
          : "";
        this.timeValueTo = val.dateOther
          ? !val.date.includes(":")
            ? nutralTimeDateOther
            : this.$moment(new Date(val.dateOther)).format("HH:mm:ss")
          : "";
      },
      deep: true, // true 深度监听
      immediate: true
    }
  },
  mounted() {
    console.log(moment("2022-01-22").format("YYYY-MM-DD"));
    const { date, dateOther } = this.dateOption;
    if (!date || !dateOther) {
      this.setInitialVal();
    }
    this.$emit("set", this.dateOption);
  },
  methods: {
    changeRadio(type) {
      this.setInitialVal();
      // this.timeValueFrom = this.$moment().startOf('day').format('HH:mm:ss');
      // this.timeValueTo = this.$moment().startOf('day').format('HH:mm:ss');
      this.$emit("set", this.dateOption);
      this.$emit("change");
    },
    changeDatePicker(date, key) {
      if (date) {
        const { type } = this.dateOption;
        this.setTimeFormatter()[type](date, key);
        this.$emit("set", this.dateOption);
      } else {
        let setDate = JSON.stringify(this.dateOption);
        setDate = {
          dateOther: "",
          date: "",
          type: "day"
        };
        this.$emit("set", setDate);
      }
      this.$emit("change");
    },
    setInitialVal(val = new Date()) {
      if (this.dateOption.type === "realtime") {
        this.dateOption.date = `${moment(val)
          .subtract(this.setDiffVal("day")["startDiffVal"], "days")
          .format("YYYY-MM-DD")} ${this.timeValueFrom}`;
        this.dateOption.dateOther = `${moment(val)
          .subtract(this.setDiffVal("day")["endDiffVal"], "days")
          .format("YYYY-MM-DD")} ${this.timeValueTo}`;
      } else if (this.dateOption.type === "day") {
        this.dateOption.date = moment(val)
          .subtract(this.setDiffVal("day")["startDiffVal"], "days")
          .format("YYYY-MM-DD");
        this.dateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("day")["endDiffVal"], "days")
          .format("YYYY-MM-DD");
      } else if (this.dateOption.type === "month") {
        this.dateOption.date = moment(val)
          .subtract(this.setDiffVal("month")["startDiffVal"], "month")
          .format("YYYY-MM");
        this.dateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("month")["endDiffVal"], "month")
          .format("YYYY-MM");
      } else {
        this.dateOption.date = moment(val)
          .subtract(this.setDiffVal("year")["startDiffVal"], "year")
          .format("YYYY");
        this.dateOption.dateOther = moment(val)
          .subtract(this.setDiffVal("year")["endDiffVal"], "year")
          .format("YYYY");
      }
    },

    setTimeFormatter() {
      return {
        realtime: (val, key) => {
          if (key === "date")
            this.dateOption.date = `${moment(new Date(val)).format("YYYY-MM-DD")} ${
              this.timeValueFrom
            }`;
          if (key === "dateOther")
            this.dateOption.dateOther = `${moment(new Date(val)).format("YYYY-MM-DD")} ${
              this.timeValueTo
            }`;
        },
        day: (val, key) => {
          if (key === "date") this.dateOption.date = moment(val).format("YYYY-MM-DD");
          if (key === "dateOther") this.dateOption.dateOther = moment(val).format("YYYY-MM-DD");
        },
        month: (val, key) => {
          if (key === "date") this.dateOption.date = moment(val).format("YYYY-MM");
          if (key === "dateOther") this.dateOption.dateOther = moment(val).format("YYYY-MM");
        },
        year: (val, key) => {
          if (key === "date") this.dateOption.date = moment(val).format("YYYY");
          if (key === "dateOther") this.dateOption.dateOther = moment(val).format("YYYY");
        }
      };
    },

    setDiffVal(type) {
      if (this.increase) {
        return {
          startDiffVal: this.intervalTimeValue[type],
          endDiffVal: 0
        };
      } else {
        return {
          startDiffVal: 0,
          endDiffVal: this.intervalTimeValue[type]
        };
      }
    }
  }
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
