<template>
  <section id="stageContain">
    <Clock></Clock>
    <ChangeYearMonthDay
      v-model:dateOption="dateOption"
      :addHours="0"
      :multiple="true"
      :increase="true"
      :type-list="['year', 'allyear']"
      :typeListMutiple="['allyear']"
      :intervalTimeValue="{ realtime: 1, day: 1, month: 1, year: 1, allyear: 1 }"
    ></ChangeYearMonthDay>
    <el-button type="primary">Primary</el-button>

    <LabelInputSwitch v-model="color" type="select" :options="options" />
    222
    <div class="logContain">111</div>
    <section class="pokerContain">
      <div class="group" v-for="(item, index) in dataPoker" :key="index">
        <div class="pokerCard" v-for="(childitem, indexs) in item.data" :key="indexs">
          {{ childitem }}
          <el-button
            @click="deleteCard(item.data, childitem, item.id)"
            class="delete"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </div>
      </div>

      <div class="playerA">
        <el-checkbox @change="playChange('playA')" v-model="playACheck">playA</el-checkbox>
        <div class="playerContain">
          <div v-for="(item, index) in playAList" :key="index">
            <div v-for="(childitem, index) in item.data" :key="index">{{ childitem }}</div>
          </div>
        </div>
      </div>

      <div class="playerB">
        <el-checkbox @change="playChange('playB')" v-model="playBCheck">playerB</el-checkbox>
        <div class="playerContain">
          <div v-for="(item, index) in playBList" :key="index">
            <div v-for="(childitem, index) in item.data" :key="index">{{ childitem }}</div>
          </div>
        </div>
      </div>

      <div class="playerMine">
        <div>
          playerMine
          <el-checkbox @change="playChange('playerMine')" v-model="playMineCheck"
            >playerMine</el-checkbox
          >
        </div>
      </div>
    </section>

    <!-- <EasyPlayer :videoUrl="videoUrl" fluent autoplay live stretch></EasyPlayer> -->
    <!-- <el-input v-model="input" placeholder="请输入播放地址" size="mini"></el-input> -->
    <!-- <p>
      列如：http://127.0.0.1:10800/test.flv
      <a href="http://www.easydarwin.org/easyplayer/" target="_blank"> 在线演示</a>
    </p>
    <el-button class="player-button" size="mini" type="success" @click="player">播放</el-button> -->
  </section>
</template>
<script>
import EasyPlayer from "@easydarwin/easyplayer";
import { reactive, ref } from "vue";
import { list, lista, listb, originData } from "@/utils/test.js";
import { grouping, criculationAction } from "@/utils/index.js";
//import Clock from "@/components/tools/clock/index.vue";
export default {
  name: "Test",
  //components: { Clock },
  setup() {
    const dateOption = ref({ dateOther: "", date: "", type: "year" });
    const color = ref("red");
    const optionList = reactive({
      options: [
        { label: "红色", value: "red" },
        { label: "蓝色", value: "blue" }
      ]
    });
    const playAList = reactive([]);
    const playBList = reactive([]);
    let once;
    const deleteCard = function (data, item, indexs) {
      // if (once === item && (playACheck.value || playBCheck.value)) return;

      // if (playACheck.value) {
      //   data.splice(data.indexOf(item), 1);
      //   playBList.push({ data });
      // } else if (playBCheck.value) {
      //   data.splice(data.indexOf(item), 1);
      //   playAList.push({ data });
      // }
      // once = item;
      data.splice(data.indexOf(item), 1);
      if (playACheck.value) {
        const i = playBList.findIndex((item) => item.id === indexs);
        if (i > -1) {
          playBList.splice(i, 1);
        }
        playBList.push({ data, id: indexs });
      } else if (playBCheck.value) {
        const i = playAList.findIndex((item) => item.id === indexs);
        if (i > -1) {
          playAList.splice(i, 1);
        }
        playAList.push({ data, id: indexs });
      }
    };
    const dataPoker = reactive([
      { data: ["A", "A", "A", "A"], id: "A" },
      { data: ["2", "2", "2", "2"], id: "2" },
      { data: ["3", "3", "3", "3"], id: "3" },

      { data: ["4", "4", "4", "4"], id: "4" },
      { data: ["5", "5", "5", "5"], id: "5" },
      { data: ["6", "6", "6", "6"], id: "6" },

      { data: ["7", "7", "7", "7"], id: "7" },
      { data: ["8", "8", "8", "8"], id: "8" },
      { data: ["9", "9", "9", "9"], id: "9" },

      { data: ["10", "10", "10", "10"], id: "10" },
      { data: ["J", "J", "J", "J"], id: "J" },
      { data: ["Q", "Q", "Q", "Q"], id: "Q" },
      { data: ["K", "K", "K", "K"], id: "K" },
      { data: ["大王", "小王"], id: "wang" }
    ]);
    const playACheck = ref(false);
    const playBCheck = ref(false);

    const playMineCheck = ref(false);

    const playChange = function (val) {
      if (val === "playA") {
        playBCheck.value = false;
        playMineCheck.value = false;
      } else if (val === "playB") {
        playACheck.value = false;
        playMineCheck.value = false;
      } else if (val === "playerMine") {
        playACheck.value = false;
        playBCheck.value = false;
      }
    };
    console.log(originData);
    const origin = grouping([...originData.double].slice(2000), 5).map((item) => {
      const obj = {};
      obj.list = item;
      return obj;
    });
    //集体存在0,1
    origin.forEach((item) => {
      item.two = item.list.some((childitem) => childitem < 2);
    });
    //存在前4个都是大于1，最后一个号小于2
    origin.forEach((item, index) => {
      //item.two = item.list.some((childitem) => childitem < 2);
      // if (item.list.slice(0, 2).every((childitem) => childitem > 1)) {
      //   item.four = true;
      // }
      const sliceList = item.list.slice(0, 3);
      // item.list[0]>1&&item.list[1]>1&&item.list[2]>1&& item.list[3] > 0   2+4+8+16+32+64  洗白   10+20+40+80+160+320
      if (item.list[0] > 1 && item.list[1] > 1 && item.list[2] > 1) {
        item.four = true;
      }
      // if ([212, 302, 318, 330, 339, 415, 423, 506, 517, 535, 555, 570, 586].includes(index)) {
      //   //  item.four = true;
      // }

      // if (item.four) {
      //   item.add = origin.slice(index - 3, index);
      //   item.total = origin
      //     .slice(index - 3, index)
      //     .map((childitem) => {
      //       return childitem.list.filter((item) => item < 2);
      //     }, 0)
      //     .reduce((total, item) => {
      //       total += item.length;
      //       return total;
      //     }, 0);
      // }
    });

    origin.forEach((item, index) => {
      if (item.four) {
        for (let i = 2; i < 20; i++) {
          if (origin[index + i]) origin[index + i].ten = true;
        }
      }
    });

    const AddPush = origin
      .reduce((total, item, index) => {
        if (item.four) {
          total.push(
            ...[
              origin[index + 2],
              origin[index + 3],
              origin[index + 4],
              origin[index + 5],
              origin[index + 6],
              origin[index + 7],
              origin[index + 8],
              origin[index + 9],
              origin[index + 10],
              origin[index + 11],
              origin[index + 12],
              origin[index + 13],
              origin[index + 14],
              origin[index + 15]
            ]
          );
        }
        return total;
      }, [])
      .filter((item) => item);
    // AddPush.forEach((item) => {
    //   if (item.list[0] > 1 && item.list[1] > 1 && item.list[2] > 0) {
    //     item.four = true;
    //   }
    // });

    console.log(
      origin,
      origin.filter((item) => item.ten).filter((item) => item.list[0] < 2 || item.list[1] < 1),
      origin.filter((item) => item.four)
    );

    let videoUrl = ref("");
    let input = ref("");
    const player = function () {
      if (!input.value) {
        console.log("请输入播放地址地址！");
      } else {
        videoUrl = input;
      }
    };

    function A() {
      this.name = "Aname";
      this.play = [1, 2, 3];
    }
    A.prototype = { test: ["aa"] };
    function B() {
      A.apply(this);
      this.name = "Bname";
    }

    B.prototype = Object.create(A.prototype);
    B.prototype.constructor = B;
    const newB = new B();
    const newA = new A();
    newB.test.push("bb");

    console.log(Object.create(A.prototype).test);

    return {
      playACheck,
      playBCheck,
      playMineCheck,
      dateOption,
      color,
      dataPoker,
      deleteCard,
      playChange,
      playAList,
      playBList,
      ...optionList,
      videoUrl,
      input,
      player
    };
  }
};
</script>

<style lang="scss">
// a {
//   color: #42b983;
// }
.pokerContain {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  // flex-direction: column;
  // align-content: center;
  width: 500px;
  position: relative;
  .group {
    display: flex;
    width: 220px;
    height: 60px;
    margin: 5px 10px;
    .pokerCard {
      width: 55px;
      border: 1px solid wheat;
      &:hover {
        .delete {
          display: block;
        }
      }
      .delete {
        display: none;
      }
    }
  }

  .playerA {
    position: absolute;
    left: -200px;
    width: 150px;
  }

  .playerB {
    position: absolute;
    right: -250px;
    width: 180px;
  }
  .playerContain {
    display: flex;
    flex-wrap: wrap;

    & > div {
      width: 180px;
      display: flex;
      height: 50px;
      margin-bottom: 5px;
      & > div {
        width: 40px;
        margin: 0 5px;
        border: 1px solid wheat;
      }
    }
  }
}

.sicbo-score-card-item_big {
  fill: #b51c00;
}
.sicbo-score-card-item__text_black {
  fill: #000000 !important;
}

.sicbo-score-card-item_small {
  fill: #008add;
}
.sicbo-score-card-item__text {
  font-size: 24px;
  text-anchor: middle;
  fill: #ffffff;
}

.score-card-canvas__borderTTw9UOJLPrsmEB9cW34Z,
.score-card-canvas__linegPYZXHnqzs5D5pd23sXQ {
  fill: none;
  stroke: rgb(151, 151, 151);
}

.score-card-canvaswokE_dMM9xzDAQOa2ynK {
  display: block;
  width: 100%;
  height: 100%;
  --baccarat-score-cards-stroke-color: #979797;
}
</style>
