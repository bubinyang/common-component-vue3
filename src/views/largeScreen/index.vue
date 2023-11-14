<template>
  <section class="largeScreen-contain">
    <largeScreenMain :bg="{ backgroundImage: `url(${top_bg})` }" @emitRatio="emitRatio">
      <div class="screen-top">
        <div class="time-show">{{ timeVal }}</div>

        <div class="screen-top-title-l" />
        <div class="screen-top-title">看板标题</div>
        <div class="screen-top-title-r" />
      </div>

      <section class="screen-main-content">
        <section class="screen-main-l">
          <SmallContain :title="'综合能源消费量'">
            <template #action>
              <el-select
                style="width: 90px"
                class="frond-style"
                popper-class="frond-style"
                filterable
                clearable
                v-model="waterpumpValueA"
                placeholder=" "
              >
                <el-option
                  v-for="item in waterpumpA"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </template>

            <chartBar></chartBar>
          </SmallContain>

          <SmallContain :title="'综合能源消费量'">
            <template #action>
              <el-date-picker
                style="width: 90px"
                class="frond-style"
                popper-class="frond-style"
                v-model="rankDate"
                type="year"
                placeholder=" "
              >
              </el-date-picker>
              <el-select
                style="width: 90px"
                class="frond-style"
                popper-class="frond-style"
                filterable
                clearable
                v-model="waterpumpValueA"
                placeholder=" "
              >
                <el-option
                  v-for="item in waterpumpA"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </template>
            <one></one>
          </SmallContain>

          <SmallContain :title="'综合能源消费量'">
            <template #action>
              <el-radio-group v-model="energyType">
                <el-radio-button label="水" />
                <el-radio-button label="电" />
                <el-radio-button label="汽" />
              </el-radio-group>
              <label>kwh</label>
            </template>

            <two></two>
          </SmallContain>
        </section>

        <section class="screen-main-center">
          <mapModule :ratio="ratio" />
        </section>

        <section class="screen-main-r">
          <SmallContain :title="'综合能源消费量'">
            <three></three>
          </SmallContain>

          <SmallContain :title="'综合能源消费量'">
            <four></four>
          </SmallContain>

          <SmallContain :title="'综合能源消费量'">
            <five></five>
          </SmallContain>
        </section>
      </section>
    </largeScreenMain>
  </section>

  <section class="chart-demo">
    <SmallContain :title="'综合能源消费量'">
      <pie3D></pie3D>
    </SmallContain>

    <SmallContain :title="'综合能源消费量'">
      <meterOne></meterOne>
    </SmallContain>

    <SmallContain :title="'今日用能'">
      <chart1></chart1>
    </SmallContain>

    <SmallContain :title="'排行'">
      <chart2></chart2>
    </SmallContain>

    <!-- <div class="contain">
      <pie3Dtest></pie3Dtest>
    </div> -->
  </section>
</template>
<script>
import { getWeek } from "@/utils";
import mapModule from "@/views/largeScreen/map.vue";
import chartBar from "@/views/largeScreen/chartBar.vue";
import one from "./one.vue";
import two from "./two.vue";
import three from "./three.vue";
import four from "./four.vue";
import five from "./five.vue";
import pie3D from "./pie3D.vue";
import meterOne from "./meter.vue";
import chart1 from "./chart-1.vue";
import chart2 from "./chart-2.vue";

import pie3Dtest from "./pie3Dtest.vue";

export default {
  name: "LargeScreen",
  components: { mapModule, chartBar, one, two, three, four, five, pie3D, meterOne, chart1, chart2 },
  data() {
    return {
      timeVal: "",
      top_bg: "",
      ratio: 2,
      waterpumpValueA: "A",
      energyType: "电",
      waterpumpA: [
        { dictValue: "A", dictLabel: "电" },
        { dictValue: "W", dictLabel: "水" }
      ],
      rankDate: ""
    };
  },
  created() {
    // setInterval(() => {
    //   this.setTime();
    // }, 1000);
  },
  mounted() {
    console.log("largreen 执行");
  },
  methods: {
    setTime() {
      const date = this.$moment().format("YYYY-MM-DD");
      const time = this.$moment().format("HH:mm:ss");
      const week = this.$moment().day();
      this.timeVal = `${date}    星期${getWeek(week)}    ${time}`;
    },
    emitRatio(data) {
      this.ratio = data;
    }
  }
};
</script>
<style lang="scss">
.largeScreen-contain {
  width: 100%;
  // height: 500px;
  .screen-top {
    height: 80px;
    display: flex;
    color: #0dc9ff;
    position: absolute;
    z-index: 2;
    width: 100%;
    .time-show {
      position: absolute;
      left: 28px;
      bottom: 0;
      color: white;
      font-size: 20px;
    }

    .screen-top-title {
      background: linear-gradient(180deg, #ffffff 30%, #0091f6 100.044921875%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 52px;
      position: relative;
      bottom: 5px;
    }
    .screen-top-title-l,
    .screen-top-title-r {
      flex: 1;
      height: 35px;
      background-size: cover;
    }
  }

  .screen-main-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    position: relative;

    .screen-main-l {
      position: absolute;
      height: 100%;
      width: 450px;
      display: flex;
      z-index: 2;
      left: 0;
      flex-direction: column;
      padding: 20px;
    }

    .screen-main-r {
      position: absolute;
      height: 100%;
      width: 450px;
      display: flex;
      z-index: 2;
      right: 0;
      flex-direction: column;
      padding: 20px;
    }

    .screen-main-center {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: url("@/assets/img/home/zybg.jpg");
      z-index: 1;
    }

    .screen-main-l,
    .screen-main-r {
      width: 450px;

      .small-contain {
        flex: 1;
        margin: 15px 0;
        .small-contain-title {
          .title {
            background: linear-gradient(45deg, #ffffff 0%, #88d7f7 30.044921875%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            justify-content: flex-start;
            font-size: 21px;
            position: relative;
            // top: 13px;
            // left: 5px;
            font-weight: bold;
          }
          label {
            color: white;
            position: relative;
            // top: 10px;
            // right: 10px;
          }
        }
      }
    }
  }

  .el-radio-group {
    right: 30px;
    position: absolute;
    .el-radio-button {
      margin: 0 5px;
    }
    .el-radio-button__inner {
      padding: 0;
      height: 21px;
      width: 47px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: #0277d0;
      //background: url("@/assets/images/home/unselected.png") no-repeat;
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      border: 1px solid white;
      // background: url("@/assets/images/home/selected.png") no-repeat;
      background-color: initial;
      border: 0;
      box-shadow: none;
    }
  }
}

//elementui控件
$bg: rgba(43, 63, 102, 0.5);
$has-border: true;
.frond-style {
  background: none !important;
  border: none !important;
  /**input 框(包含所有空间) */
  .el-input__inner {
    background: none;
    // border: 0;
    box-shadow: none;
    color: #00e3ff;
    // border: 1px solid #3b5369;
    @if $has-border {
      border: 1px solid #3b5369;
    } @else {
      border: 0;
    }
  }
  .el-popper__arrow {
    &::before {
      border: none !important;
    }
  }

  /**时间控件 */
  .el-picker-panel {
    background: $bg !important;
    color: #fff;
  }

  &.el-popper {
    box-shadow: none;
  }
  .el-popper__arrow {
    --el-color-white: #2b3f66 !important;
    &:before {
      background: #07355e !important;
    }
  }
  .el-date-picker__header-label {
    color: #00aaff !important;
  }
  .el-date-picker__header--bordered {
    border-bottom: 1px solid #00aaff !important;
  }
  .el-picker-panel__icon-btn {
    color: #00aaff !important;
  }

  .el-picker-panel__content {
    .cell {
      color: #00aaff !important;
    }
    .current {
      .cell {
        color: #fff !important;
      }
    }
  }

  &.el-picker__popper {
    //disable
    .el-year-table td.disabled .cell,
    .el-month-table td.disabled .cell {
      background: $bg;
    }
  }
  /**分页 */
  &.el-pagination {
    button {
      background: #07355e !important;
      color: #fff !important;
    }

    li {
      background: #07355e !important;
      color: rgb(64, 158, 255) !important;
    }

    li.active {
      background: none !important;
    }
  }

  /**下拉 */

  &.el-select__popper {
    border: none !important;
    background: $bg !important;
    li {
      // background: @bg!important;
      color: #8c98a8 !important;
      &:hover {
        color: #fff !important;
        background: $bg !important;
      }
    }
  }

  .el-select-dropdown__item {
    color: #fff !important;
    &.hover {
      background: none;
    }
    &:hover {
      background: #0277d0 !important;
    }
    &.selected {
      // background: #0277d0 !important;
      color: #fff !important;
    }
  }
}

.chart-demo {
  background: rgba(3, 24, 25);
  display: flex;
  flex-wrap: wrap;

  .small-contain {
    flex: 0 0 300px;
    height: 400px;
    .small-contain-title {
      // flex: 0 0 40px;
      padding-left: 36px;

      .title {
        background: linear-gradient(45deg, #ffffff 0%, #88d7f7 30.044921875%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        justify-content: flex-start;
        font-size: 21px;
        position: relative;
        font-weight: bold;
      }
    }
  }
}
</style>
