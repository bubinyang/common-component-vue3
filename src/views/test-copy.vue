<template>
  <section id="stageContain">
    <img
      style="width: 200px; height: 400px; object-fit: contain"
      src="/public/img/home/house1.png"
    />
    <div class="css-style">My name is Hege Refsnes</div>
    <el-button @click="setCookie" type="primary">设置cookie</el-button>
    <el-button @click="deleteCookie" type="primary">删除cookie</el-button>

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
    <el-button @click="changeUserInfo" type="primary">Primary</el-button>

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
import { reactive, ref, onMounted, nextTick } from "vue";
import { list, lista, listb, originData } from "@/utils/test.js";
import { grouping, criculationAction } from "@/utils/index.js";
import { useStore } from "vuex";
console.log(useStore);
// const { dispatch } = useStore();
export default {
  name: "Test",
  //components: { Clock },
  setup() {
    const store = useStore();

    console.log(store.state.userInfo);
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
    //存在[7,6,8]列表中任意一个数字
    function existList(origin, fromList) {
      return fromList.some((item) => {
        return origin.includes(item);
      });
    }
    //大于2的数字超过2个
    function overTwoNum(origin) {
      return origin.filter((item) => item > 2).length;
    }

    console.log(originData);

    const origin = grouping([...originData.double].slice(2000), 5).map((item) => {
      const obj = {
        isAllow: false
      };
      obj.list = item;
      return obj;
    });
    /**
     * 查找2条数据,如果2条里出现多个2以上的数字,那么后面3条数据isAllow设置为false
     * 如果2条里未出现多个2以上的数字，那么后面3条数据isAllow设置为true。 紧接着继续循环这次操作
     */
    let totalNum = 0; //总值
    let allowTrue = 0; //allow true 设置次数
    let allowFalse = 0; //allow false 设置次数
    let targeIndex = 0; //计算总值次数
    origin.forEach((item, index) => {
      if (allowTrue === 3) {
        //allow true设置3条数据后，需要重置各个条件
        allowTrue = 0;
        totalNum = 0;
        targeIndex = 0;
      }
      if (allowFalse === 2) {
        //allow false设置了2条数据后，需要重置各个条件
        allowFalse = 0;
        totalNum = 0;
        targeIndex = 0;
      } //如果查找了2条数据大于危险值
      const val = overTwoNum(item.list);
      totalNum += val;
      targeIndex++;
      if (totalNum <= 2 && !item.isAllow) {
        //totalNum大于2的时候，后面数据isAllow设置成true
        if (targeIndex > 2) {
          item.isAllow = true;
          allowTrue++;
        }
      } else if (totalNum > 2 && !item.isAllow) {
        //num大于二，累计数据isAllow设置成false的次数
        allowFalse++;
      }
    });

    // let actionNum = 0;
    // let totalStand = 0;
    // origin.forEach((item, index) => {
    //   if (item.isAllow) {
    //     return;
    //   }
    //   actionNum++;
    //   if (actionNum <= 2) totalStand += overTwoNum(item.list);
    //   if (actionNum === 2 && totalStand <= 2) {
    //     if (origin[index + 1]) origin[index + 1].isAllow = true;
    //     if (origin[index + 2]) origin[index + 2].isAllow = true;
    //     if (origin[index + 3]) origin[index + 3].isAllow = true;
    //   }
    //   if (actionNum === 2) {
    //     actionNum = 0;
    //     totalStand = 0;
    //   }
    // });

    //集体存在0或者1
    origin.forEach((item) => {
      item.two = item.list.some((childitem) => childitem < 2);
    });

    //出现多个4+
    // origin.forEach((item,index)=>{
    //    if(item.)
    // })
    //存在前4个都是大于1，最后一个号小于2
    origin.forEach((item, index) => {
      const sliceList = item.list.slice(0, 3);
      // item.list[0]>1&&item.list[1]>1&&item.list[2]>1&& item.list[3] > 0   2+4+8+16+32+64  洗白   10+20+40+80+160+320
      if (item.list[0] > 1 && item.list[1] > 1 && item.list[2] > 1) {
        item.four = true;
      }
      //2,1不出现情况,做4次失败情况
      if (item.list[0] > 1 && item.list[1] > 1) {
        // item.beforeList=getBeforeList(origin,8,index)
        item.DoTreeTimesAllFailure = true;
      }
      //2,1出现，做4次成功
      if (item.list[0] > 1 && item.list[1] === 1) {
        item.DoTreeTimesAllSuccess = true;
      }
      //第二个位置是0, 做3次成功
      if (item.list[0] > 1 && item.list[1] === 0) {
        item.DoTimesThreeSuccess = true;
      }
      //第一个位置是0，做2次内成功
      if (item.list[0] < 2) {
        item.DoTimesTwoSuccess = true;
      }
    });
    //查找

    function getBeforeList(data, num, index) {
      const list = [];
      for (let i = 0; i < num; i++) {
        if (data[index - i - 1]) list.push(...data[index - i - 1].list);
      }
      return list;
    }

    console.log(
      origin,
      // origin.filter((item) => item.ten).filter((item) => item.list[0] < 2 || item.list[1] < 1),
      origin.filter((item) => item.DoTreeTimesFailure),
      {
        aDoTreeTimesAllFailure: origin.filter((item) => item.DoTreeTimesAllFailure && item.isAllow)
          .length,
        bDoTreeTimesAllSuccess: origin.filter((item) => item.DoTreeTimesAllSuccess && item.isAllow)
          .length,
        cDoTimesThreeSuccess: origin.filter((item) => item.DoTimesThreeSuccess && item.isAllow)
          .length,
        dDoTimesTwoSuccess: origin.filter((item) => item.DoTimesTwoSuccess && item.isAllow).length,
        isAllow: origin.filter((item) => item.isAllow).length
      }
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
    //关于原型
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
    console.log(newB.test, newA.test);
    console.log(Object.create(A.prototype).test);

    //继承经典案例
    function human() {
      this.walkMethod = "leg";
      this.play = [1, 2, 3];
    }

    function woman() {
      this.apperance = "beautiful";
    }
    woman.prototype = new human();
    woman.prototype.constructor = woman;
    console.log(woman.prototype.constructor);
    const xiaohong = new woman();
    const hm = new human();
    xiaohong.play.push(4);
    console.log(xiaohong.play, hm);

    //设置cookie和删除cookie
    const setCookie = () => {
      //  document.cookie=
      const time = new Date();
      time.setTime(+time + 10 * 10000);
      const expires = `expires=${time.toGMTString()}`;
      document.cookie = `username=John Doe; ${expires}`;
      console.log(document.cookie);
    };
    const deleteCookie = () => {
      const time = new Date();
      time.setTime(+time - 1);
      const expires = `expires=${time.toGMTString()}`;
      document.cookie = `username=; ${expires}`;
      console.log(document.cookie);
    };
    //随机生产日语
    const japanes = [];
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
      player,
      store,
      setCookie,
      deleteCookie
    };
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    refreshComponent(key) {
      this[key] = false;
      this.$nextTick(() => {
        this[key] = true;
      });
    },
    changeUserInfo() {
      this.store.dispatch("updateState", { userInfo: "lhx" }).then((res) => {
        console.log(res);
      });

      console.log("执行1");
    }
  }
};
</script>

<style lang="scss">
// a {
//   color: #42b983;
// }
.css-style {
  font-variant: small-caps;
  unicode-bidi: bidi-override;
  direction: rtl;
}
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

// .aTable-style{
//   .tootip-contain{}
// }
</style>
