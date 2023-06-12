<!--
表格样式私有化定制+vue事件结合节流方法
-->
<template>
  <section class="monkeyData-style">
    <div class="action">
      <el-button type="primary" @click="query()">查询</el-button>
    </div>
    <section class="monkeyContainMap-style">
      <div class="coloum" v-for="(item, index) in originList" :key="index">
        <div class="row" v-for="(childitem, childindex) in item" :key="childindex">
          {{ childitem.type }}
          <label :class="{ target: childitem.target }" v-if="childitem.errorTimes !== 9999">{{
            childitem.errorTimes
          }}</label>
        </div>
      </div>
    </section>

    <section class="realTimeData-contain">
      <div
        class="realtime"
        v-for="(item, index) in realTimeData"
        :key="index"
        :class="item.className"
      >
        {{ item.value }}
        <label v-if="item.num !== undefined">{{ item?.num }}</label>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import http from "@/utils/request";
import { debounce } from "@/utils/index.js";
import axios from "axios";
import { getMonkeyData, findRealTimeData, getMonkeyDataPage } from "@/api/monkey.js";
const tableData = [
  {
    date: "高模量对位芳纶纤维及其芳纶纸国产化项目",
    name: "2013/7/5-2016/4/10",
    address: "投产项目",
    a: "苏州富顺纤维有限公司",
    b: "望亭镇",
    c: 151,
    d: "苏州捷碳环保大数据有限公司",
    e: ""
  },
  {
    date: "抗疲劳加成型硫化液态硅橡胶项目",
    name: "2019/10/13-2020/5/13",
    address: "投产项目",
    a: "永儒塑胶工业（苏州）有限公司",
    b: "望亭镇",
    c: 150,
    d: "苏州中创碳投科技有限公司",
    e: ""
  }
];
let El;
let isSetScrollTop = true; //是否允许设置滚动距离
// let originList = [];
const originList = ref(null);
const realTimeData = ref(null);

const list = ref([]);

const handleCurrentChange = debounce(function (event) {
  console.log("执行", event);
}, 500);

const query = function () {
  //console.log(111);
  getMonkeyData().then(({ data }) => {
    let i = 0;
    data.forEach((item) => {
      const numList = item.numValue.split(",");
      item.total = numList.reduce((sum, a) => {
        sum += Number(a);
        return sum;
      }, 0);
      if ((i % 5 === 0 || i % 5 === 1) && item.errorTimes !== 9999) {
        item.target = true;
      }
      if (item.errorTimes !== 9999) i++;
      item.type = isThreeSameNumber(numList) ? "same" : item.total >= 11 ? "big" : "small";
    });
    console.log(data);
    let type;
    let arr = [];
    originList.value = data.reduce((total, item) => {
      if (!type) type = item.type;
      if (item.type !== type) {
        total.push(arr);
        type = item.type;
        arr = [];
      }
      if (type === item.type) arr.push(item);
      return total;
    }, []);
    console.log(originList.value);

    list.value = data.filter((item) => {
      return item.errorTimes !== 9999;
    });

    function grouping(origin, lengthVal = 5) {
      let i = 0;
      return origin.reduce((total, item, index) => {
        const arr = origin.slice(i, i + lengthVal);
        i += lengthVal;
        if (arr.length) total.push(arr);
        return total;
      }, []);
    }

    //console.log(list.value.map((item) => item.errorTimes));
    const arrnew = list.value.map((item) => item.errorTimes);
    console.log(arrnew, grouping(arrnew, 5));
  });

  // http("/getMonkeyHisData", {}).then((res) => {
  //   console.log(res, "http");
  // });
  // getMonkeyDataPage({ page: 1, total: 20 }).then((res) => {
  //   console.log(res, "page");
  // });
};

onMounted(() => {
  query();
  const obj = [
    { value: "got", label: "命中" },
    { value: "big small appear", label: "规则大小出现", class: "main-style" },
    { value: "The rule big small does not appear", label: "规则大小没有出现" },
    { value: "Buy big according to the rules", label: "按照规则买大" },
    { value: "Buy small according to the rules", label: "按照规则买小" }
  ];
  const ws = new WebSocket(`${import.meta.env.VITE_APP_SOCKET}/getRealData`);
  El = document.querySelector(".realTimeData-contain");

  ws.onmessage = (res) => {
    const originData = JSON.parse(res.data);
    originData.forEach((item) => {
      const findItem = obj.find((childitem) => childitem.value === item.value);
      if (findItem) {
        item.value = findItem.label;
        item.className = findItem.class;
      }
    });
    realTimeData.value = originData;

    if (isSetScrollTop) El.scrollTop = El.scrollHeight - El.clientHeight;
  };
  El.addEventListener("mouseenter", () => {
    isSetScrollTop = false;
  });

  El.addEventListener("mouseleave", () => {
    isSetScrollTop = true;
  });
});

function isThreeSameNumber(origin) {
  return origin.every((item, index) => {
    return origin[0] === item;
  });
}
</script>

<style lang="scss">
.monkeyData-style {
  padding-left: 10px;
  .action {
    display: flex;
    justify-content: flex-start;
  }
  .monkeyContainMap-style {
    display: flex;
    height: 200px;
    .coloum {
      border: 1px solid;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      .row {
        width: 50px;
        height: 20px;
        position: relative;
        label {
          background: rgba(84, 92, 100, 0.3);
          position: absolute;
          top: 0;
          right: 0;
        }
        .target {
          background: #e5470a;
          border-radius: 10px;
          width: 15px;
          height: 15px;
          line-height: 15px;
          color: white;
        }
      }
    }
  }

  .realTimeData-contain {
    height: 400px;
    overflow-y: auto;

    .realtime {
      width: 300px;
      text-align: left;
      padding: 5px;
      &:nth-child(2n + 1) {
        background: rgb(84, 92, 100, 0.3);
      }
    }
  }

  .main-style {
    color: red;
    font-weight: bold;
  }
}
</style>
