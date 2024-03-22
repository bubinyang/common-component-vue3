function speakVoice(val) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = val;
  speechSynthesis.speak(msg);
}

function grouping(origin, lengthVal = 5) {
  let i = 0;
  return origin.reduce((total, item, index) => {
    const arr = origin.slice(i, i + lengthVal);
    i += lengthVal;
    if (arr.length) total.push(arr);
    return total;
  }, []);
}
function overTwoNum(origin, stand = 2) {
  return origin.filter((item) => item > stand).length;
}

function changePoureList(origin = [2, 4, 0, 0, 0, 0, 0, 0, 0, 0]) {
  return origin.reduce((total, item, index) => {
    if (index % 2 === 0) {
      total[index / 2] = origin.slice(index, index + 2);
    }
    return total;
  }, {});
}

// 11月27号晚上开始 850
// 执行函数 mtdglfcq
async function action() {
  const storgeOrigin = JSON.parse(window.localStorage.getItem("history"));
  var isBuy = true;
  var isBuyAction = false;
  var isSpeakVoice = false;
  var poured = false; // 是否已经投注
  var times; // 点击次数
  var pourType; // 上一把买的大小
  let balance = storgeOrigin.balance; // 余额
  let isBlackBuy = false; // 是否反买
  let findResult;

  const poureList = [0, 0, 0, 0, 0, 0, 10, 20, 40, 80, 160]; // [20,40,80,160,320,640,1280]

  let poureListBig = [20, 40, 0, 0, 0, 0, 0, 0, 0, 0];
  let poureListBigOther = poureListBig.reduce((total, item, index) => {
    if (index % 2 === 0) {
      total[index / 2] = poureListBig.slice(index, index + 2);
    }

    return total;
  }, {});

  let isChangepoureListBig = false;
  let isChangepoureListBigTen = false;

  let fiveDoubleBuy = false;

  const bigPoureList = [1000, 2000];
  let totals = storgeOrigin.totals;
  let rightTimes = storgeOrigin.right;

  let loser = storgeOrigin.loser;
  let win = storgeOrigin.win;
  let baoziVal = JSON.parse(window.localStorage.getItem("baozi"));

  var initialDouble = storgeOrigin.double;

  let errorTimes = 0; // 正常翻倍索引

  let isPuseRule = false; //是否暂停顺着买按照规则买大或者小

  let diffVal = 0;

  let refreshBtnIndex = 5;

  //创建按钮，觉得是否开始返买

  const opppsoteBuyButtonClassFunc = function () {
    function setFunc() {
      let puseRuleButton = document.createElement("div");
      puseRuleButton.className = "opppsoteBuyClass";
      puseRuleButton.style.position = "absolute";
      puseRuleButton.style.right = "70%";
      puseRuleButton.style.top = "15px";
      puseRuleButton.style.zIndex = 500;
      puseRuleButton.style.border = "1px solid";
      puseRuleButton.style.color = "white";
      puseRuleButton.style.padding = "10px";
      puseRuleButton.style.background = "black";
      puseRuleButton.style.cursor = "pointer";

      puseRuleButton.innerText = "切成2元";
      document.querySelector("body").appendChild(puseRuleButton);
      let puseDemo = document.querySelector(".opppsoteBuyClass");
      puseDemo.addEventListener("click", function () {
        isChangepoureListBig = true;
        poureListBigOther = changePoureList();
        document.querySelector(".actionButtonClass").innerHTML = "2元";
      });
    }

    function setFuncTen() {
      let puseRuleButton = document.createElement("div");
      puseRuleButton.className = "opppsoteBuyClassTen";
      puseRuleButton.style.position = "absolute";
      puseRuleButton.style.right = "70%";
      puseRuleButton.style.top = "55px";
      puseRuleButton.style.zIndex = 500;
      puseRuleButton.style.border = "1px solid";
      puseRuleButton.style.color = "white";
      puseRuleButton.style.padding = "10px";
      puseRuleButton.style.background = "black";
      puseRuleButton.style.cursor = "pointer";

      puseRuleButton.innerText = "切成6元";
      document.querySelector("body").appendChild(puseRuleButton);
      let puseDemo = document.querySelector(".opppsoteBuyClassTen");
      puseDemo.addEventListener("click", function () {
        isChangepoureListBigTen = true;
        poureListBigOther = changePoureList([6, 12, 0, 0, 0, 0, 0, 0, 0, 0]);
        document.querySelector(".actionButtonClass").innerHTML = "6元";
        console.log(`logs ${poureListBigOther}`);
      });
    }

    function setFuncFiveTen() {
      let puseRuleButton = document.createElement("div");
      puseRuleButton.className = "opppsoteBuyClassFiveTen";
      puseRuleButton.style.position = "absolute";
      puseRuleButton.style.right = "70%";
      puseRuleButton.style.top = "95px";
      puseRuleButton.style.zIndex = 500;
      puseRuleButton.style.border = "1px solid";
      puseRuleButton.style.color = "white";
      puseRuleButton.style.padding = "10px";
      puseRuleButton.style.background = "black";
      puseRuleButton.style.cursor = "pointer";

      puseRuleButton.innerText = "切成10元";
      document.querySelector("body").appendChild(puseRuleButton);
      let puseDemo = document.querySelector(".opppsoteBuyClassFiveTen");
      puseDemo.addEventListener("click", function () {
        isChangepoureListBigTen = true;
        poureListBigOther = changePoureList([10, 20, 0, 0, 0, 0, 0, 0, 0, 0]);
        document.querySelector(".actionButtonClass").innerHTML = "10元";
      });
    }

    function setFunc100() {
      let puseRuleButton = document.createElement("div");
      puseRuleButton.className = "opppsoteBuyClass100";
      puseRuleButton.style.position = "absolute";
      puseRuleButton.style.right = "70%";
      puseRuleButton.style.top = "135px";
      puseRuleButton.style.zIndex = 500;
      puseRuleButton.style.border = "1px solid";
      puseRuleButton.style.color = "white";
      puseRuleButton.style.padding = "10px";
      puseRuleButton.style.background = "black";
      puseRuleButton.style.cursor = "pointer";

      puseRuleButton.innerText = "切成20元";
      document.querySelector("body").appendChild(puseRuleButton);
      let puseDemo = document.querySelector(".opppsoteBuyClass100");
      puseDemo.addEventListener("click", function () {
        isChangepoureListBigTen = true;
        poureListBigOther = changePoureList([20, 40, 0, 0, 0, 0, 0, 0, 0]);
        document.querySelector(".actionButtonClass").innerHTML = "20元";
      });
    }

    function setFunc200() {
      let puseRuleButton = document.createElement("div");
      puseRuleButton.className = "opppsoteBuyClass200";
      puseRuleButton.style.position = "absolute";
      puseRuleButton.style.right = "70%";
      puseRuleButton.style.top = "175px";
      puseRuleButton.style.zIndex = 500;
      puseRuleButton.style.border = "1px solid";
      puseRuleButton.style.color = "white";
      puseRuleButton.style.padding = "10px";
      puseRuleButton.style.background = "black";
      puseRuleButton.style.cursor = "pointer";

      puseRuleButton.innerText = "切成40元";
      document.querySelector("body").appendChild(puseRuleButton);
      let puseDemo = document.querySelector(".opppsoteBuyClass200");
      puseDemo.addEventListener("click", function () {
        isChangepoureListBigTen = true;
        poureListBigOther = changePoureList([40, 80, 0, 0, 0, 0, 0, 0]);
        document.querySelector(".actionButtonClass").innerHTML = "40元";
      });
    }

    setFunc();
    setFuncTen();
    setFuncFiveTen();
    setFunc100();
    setFunc200();
  };

  opppsoteBuyButtonClassFunc();

  //创建按钮，决定是否开始下注
  const puseRuleButtonClassFunc = function () {
    let puseRuleButton = document.createElement("div");
    puseRuleButton.className = "puseRuleButtonClass";
    puseRuleButton.style.position = "absolute";
    puseRuleButton.style.left = "10%";
    puseRuleButton.style.top = "15px";
    puseRuleButton.style.zIndex = 500;
    puseRuleButton.style.border = "1px solid";
    puseRuleButton.style.color = "white";
    puseRuleButton.style.padding = "10px";
    puseRuleButton.style.background = "black";
    puseRuleButton.style.cursor = "pointer";

    puseRuleButton.innerText = isBuyAction ? "取消下注" : "启动下注";
    document.querySelector("body").appendChild(puseRuleButton);
    let puseDemo = document.querySelector(".puseRuleButtonClass");
    puseDemo.addEventListener("click", function () {
      isBuyAction = !isBuyAction;
      if (isBuyAction) {
        puseDemo.innerText = "取消下注";
      } else {
        puseDemo.innerText = "启动下注";
      }
    });
  };

  puseRuleButtonClassFunc();

  const actionButtonClassFunc = function () {
    let puseRuleButton = document.createElement("div");
    puseRuleButton.className = "actionButtonClass";
    puseRuleButton.style.position = "absolute";
    puseRuleButton.style.left = "80%";
    puseRuleButton.style.top = "15px";
    puseRuleButton.style.zIndex = 500;
    puseRuleButton.style.border = "1px solid";
    puseRuleButton.style.color = "white";
    puseRuleButton.style.padding = "10px";
    puseRuleButton.style.background = "red";
    puseRuleButton.style.cursor = "pointer";

    puseRuleButton.innerText = "2元";
    document.querySelector("body").appendChild(puseRuleButton);
    let puseDemo = document.querySelector(".actionButtonClass");
    // puseDemo.addEventListener('click',function(){
    //   isPuseRule=!isPuseRule
    //     if(isPuseRule){
    //       puseDemo.innerText='暂停（出现）'
    //     }else{
    //       puseDemo.innerText='启动（出现）'
    //     }
    // })
  };

  actionButtonClassFunc();

  //创建按钮

  async function go() {
    while (true) {
      await waiting();

      //隐藏投注按钮
      //  document.querySelector('.sicbo-digital-table').style.transform='translate(-1250%)'

      if (!poured && document.querySelector(".timer-wrapper")) {
        const newestNodeList = Array.prototype.slice.call(
          document
            .querySelector(".game-container .sicbo-history .sicbo-history__item-dice")
            .querySelectorAll(".sicbo-history__item-dice-number")
        );
        const newestList = newestNodeList.map((item) => item.innerText);
        const rules = [
          { label: "big", values: ["2,5", "2,2", "4,4"] },
          { label: "small", values: ["6,6", "3,3", "1,3"] }
        ];

        // 查找大小对象

        findResult = rules.find((item) => {
          return item.values.some((childitem) => {
            const copyList = newestList.map((item) => item);
            const total = childitem.split(",").reduce((total, item, current, arr) => {
              const index = copyList.indexOf(item);
              if (index > -1) {
                total++;
                copyList.splice(index, 1);
              }
              return total;
            }, 0);
            return total > 1;
          });
        });

        // 判断大小计算输赢
        const newestTotal = newestList.reduce((total, item) => {
          total += Number(item);
          return total;
        }, 0);
        console.log(`logs    ${newestList},${findResult}`);

        // //豹子
        const baozi = newestList.every((item, index) => {
          return newestList[0] === item;
        });

        // 如果是反买过来的投注额
        if (isBlackBuy) {
          // 中了就恢复投注额度,且关闭投注状态
          if (
            ((newestTotal > 10 && pourType === "big") ||
              (newestTotal < 11 && pourType === "small")) &&
            !baozi &&
            pourType
          ) {
            const storge = JSON.parse(window.localStorage.getItem("history"));
            // 虚拟币加钱
            const arr = [
              storge.double[storge.double.length - 1],
              storge.double[storge.double.length - 2],
              storge.double[storge.double.length - 3],
              storge.double[storge.double.length - 4]
            ];

            if (errorTimes < 9) {
              console.log("logs 命中");
              if (isSpeakVoice) speakVoice("命中命中命中命中命中");
            }

            // 存一下翻的倍数记录
            // let storge=JSON.parse(window.localStorage.getItem("history"))
            if (errorTimes < 2) fiveDoubleBuy = false; //0,1的时候,命中，即关闭，等待下次5循环
            storge.double.push(errorTimes);

            window.localStorage.setItem("history", JSON.stringify(storge));
            errorTimes = 0;
            isBlackBuy = false; // 关闭反买
            pourType = null;

            console.log(`logs   关闭反买机制${isBlackBuy}`);
          }
          // 没中就继续累加投注额
          if (
            (newestTotal > 10 && pourType === "small") ||
            (newestTotal < 11 && pourType === "big") ||
            (baozi && pourType)
          ) {
            errorTimes++;
            pourType = null;

            const storge = JSON.parse(window.localStorage.getItem("history"));
          }
        }
        // 对一场
        if (
          ((newestTotal > 10 && pourType === "big") ||
            (newestTotal < 11 && pourType === "small")) &&
          !baozi
        ) {
          var storge = JSON.parse(window.localStorage.getItem("history"));
          console.error(`logs     规则大小出现 ${storge.double.length}`);

          if (storge.double.length % 5 === 0) {
            //往前查找3组数据，出现大于2的次数超<=2,那么允许投2组数据,但凡有一组前面出现6以上的数字，都禁止投注，等待下一次符合3组规则的数据
            storge.double.push(0);
            let origin = grouping(storge.double).map((item) => {
              const obj = {
                isAllow: false
              };
              obj.list = item;
              return obj;
            });

            let actionNum = 0;
            let totalStand = 0;
            origin.forEach((item, index) => {
              if (item.isAllow) {
                return;
              }
              actionNum++;

              if (actionNum <= 3) totalStand += overTwoNum(item.list);
              if (actionNum === 3 && totalStand <= 2) {
                const a = overTwoNum(origin[index].list, 6);
                const b = origin[index + 1] ? overTwoNum(origin[index + 1].list, 6) : 0;
                if (origin[index + 1] && !a) {
                  origin[index + 1].isAllow = true;
                }
                if (origin[index + 2] && !b) {
                  origin[index + 2].isAllow = true;
                }
              }
              if (actionNum === 3) {
                actionNum = 0;
                totalStand = 0;
              }
            });

            // console.log(`logs`,origin)
            if (origin[origin.length - 1].isAllow) {
              fiveDoubleBuy = true;
            }

            if (fiveDoubleBuy) speakVoice(`规则大小出现 即将开始编号${storge.double.length}任务`);
          }

          if (storge.double.length % 5 === 4) {
            speakVoice(`第四条数据已经出现，请提前观察并做好准备`);
          }
          if (storge.double.length % 5 === 0) {
            speakVoice(`第五条数据已经出现`);
          }

          pourType = null;
          isBlackBuy = true; // 通知可以反买
        }

        // 错一场,此处为什么要增加错误，因为如果没有到反买阶段，错误了也要恢复，等待下一次判断是否符合返买要求
        if (
          (newestTotal > 10 && pourType === "small") ||
          (newestTotal < 11 && pourType === "big") ||
          (baozi && pourType)
        ) {
          console.log(`logs     规则大小未出现`);
          if (isSpeakVoice) speakVoice("规则大小没有出现");
          if (baozi) {
            baoziVal++;
            window.localStorage.setItem("baozi", JSON.stringify(baoziVal));
          }
          //  ruleIndex++
          pourType = null;
          isBlackBuy = false;
        }

        if (findResult && findResult.label === "big") {
          console.log("logs    ", "big", isBlackBuy);
          if (isBlackBuy) {
            // 大于3的情况后面2次要翻倍打
            const storge = JSON.parse(window.localStorage.getItem("history"));

            //存储map
            // storge.doubleMap.push({index: storge.double.length,map:getMap()})
            window.localStorage.setItem("history", JSON.stringify(storge));

            if (errorTimes < 2) {
              const arr = poureListBigOther[storge.double.length % 5];
              if (fiveDoubleBuy) clickSmall(arr[errorTimes]);
            }

            pourType = "small";
            if (isSpeakVoice) speakVoice(`大 true 第${errorTimes}次`);
          } else {
            console.log(`logs   按照规则买大`, isBuyAction);

            // if(isPuseRule)clickBig(2)
            //  if(isopppsoteBuy)clickSmall(2)

            if (isSpeakVoice) speakVoice("按照规则买大");
            pourType = "big";
          }
          poured = true;
        } else if (findResult && findResult.label === "small") {
          console.log("logs   ", "small", isBlackBuy);
          if (isBlackBuy) {
            const storge = JSON.parse(window.localStorage.getItem("history"));

            //存储map
            //  storge.doubleMap.push({index: storge.double.length,map:getMap()})
            window.localStorage.setItem("history", JSON.stringify(storge));
            // len 大于2，出现2次以上
            if (errorTimes < 2) {
              const arr = poureListBigOther[storge.double.length % 5];
              if (fiveDoubleBuy) clickBig(arr[errorTimes]);
            }

            pourType = "big";
            if (isSpeakVoice) speakVoice(`小 true 第${errorTimes}次`);
          } else {
            console.log(`logs   按照规则买小`, isBuyAction);
            // if(isopppsoteBuy)clickBig(2)
            if (isSpeakVoice) speakVoice("按照规则买小");
            pourType = "small";
          }

          poured = true;
        }
      }

      if (!document.querySelector(".timer-wrapper")) {
        // 倒计时，状态改成未下注
        poured = false;
      }
    }
  }

  function waiting(ms = 8000) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function clickSmall(value) {
    times = Math.ceil(value / 2);

    console.log(`logs    余额${balance}建议买小,需要点击${times}次，投注额为${times * 2}`);
    subtractBalance(times * 2);
    // 设置投注额
    var eTwo = document.createEvent("MouseEvents");
    eTwo.initEvent("click", true, true);
    document.querySelector(".arrow-slider__scrollable-content svg").dispatchEvent(eTwo);

    if (isBuyAction) {
      for (var i = 0; i < times; i++) {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        e.auto = true;
        document
          .querySelector(".sicbo-bet-place_small .sicbo-bet-place__multiplier-background")
          .dispatchEvent(e);
      }
    }
  }

  function clickBig(value) {
    times = Math.ceil(value / 2);
    console.log(`logs    余额${balance}建议买大,需要点击${times}次，投注额为${times * 2}`);
    subtractBalance(times * 2);

    // 设置投注额
    var eTwo = document.createEvent("MouseEvents");
    eTwo.initEvent("click", true, true);
    document.querySelector(".arrow-slider__scrollable-content svg").dispatchEvent(eTwo);

    if (isBuyAction) {
      for (var i = 0; i < times; i++) {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        e.auto = true;
        document
          .querySelector(".sicbo-bet-place_big .sicbo-bet-place__multiplier-background")
          .dispatchEvent(e);
      }
    }
  }

  function subtractBalance(value) {
    //  let value=Number(document.querySelector('.balance .fit-container__content2nPGiJBm9YMsqn0juLFoTe').innerText.replace(/¥ /g,''))
    //   document.querySelector('.balance .fit-container__content2nPGiJBm9YMsqn0juLFoTe').innerText=value-balance
    balance -= value;
  }

  function addBalance(value) {
    // let value=Number(document.querySelector('.balance .fit-container__content2nPGiJBm9YMsqn0juLFoTe').innerText.replace(/¥ /g,''))
    // document.querySelector('.balance .fit-container__content2nPGiJBm9YMsqn0juLFoTe').innerText=value+balance

    balance += value;
  }

  // 判断是否时候下注
  function canPush() {
    const domScore = document.querySelectorAll(".score-card-column");
    var listnew = Array.prototype.slice.call(domScore).map((item) => {
      return item.querySelectorAll("circle").length;
    });

    const resultList = listnew.reduce((total, item, index) => {
      if (item > 4) {
        total.push(index);
      }
    }, []);
  }

  // 循环关闭房间，重新进

  async function refresh() {
    var starTime = new Date();

    while (true) {
      await waiting(60 * 1000);

      // 如果出现重新连接,自动推出

      var curTime = new Date();
      //console.log(`logs 监听刷新 ${starTime}-${curTime}=${curTime-starTime}`);
      // 如果出现下注调整，最近出现5次上未中,说明下过注，暂停刷新，更新statTime

      if (document.querySelector(".sicbo-bet-place__chip")) starTime = new Date();

      if (curTime - starTime > 5 * 60 * 1000 && !document.querySelector(".timer-wrapper")) {
        //!document.querySelector('.timer-wrapper')
        console.log("logs 执行刷新");
        const e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        if (document.querySelector(".header__close-button"))
          document.querySelector(".header__close-button").dispatchEvent(e);
        await waiting(3000);
        // 点击分类
        const eSlide = document.createEvent("MouseEvents");
        eSlide.initEvent("click", true, true);
        document
          .querySelectorAll(".game-category-list--FHHPj .horizontal-auto-scroll__item--PdIXC")
          [refreshBtnIndex].dispatchEvent(eSlide);
        console.log("logs 点击分类");
        await waiting(3000);

        //点击分类3秒后还有 loader,那么再延长8s
        if (document.querySelector(".lobby__loader")) await waiting(8000);
        // 点击房间
        console.log("logs 点击房间前");
        console.log(document.querySelector(".lobby-table_sic-bo-deluxe .lobby-table__container"));
        const eContainer = document.createEvent("MouseEvents");
        eContainer.initEvent("click", true, true);
        document
          .querySelector('[data-automation-locator="lobby.gamecode_sbdl"] .table-footer--zpwhg')
          .dispatchEvent(eContainer);
        console.log("logs 点击房间");
        await waiting(1000);
        // 无法进入房间

        async function goInFun() {
          var goIn = true;
          while (goIn) {
            await waiting(1000);
            // 禁止进入房间，重复点击关闭提示框
            const es = document.createEvent("MouseEvents");
            es.initEvent("click", true, true);
            //  if (document.querySelector('.modal-confirm_desktop_with-icon .modal-footer-btn'))document.querySelector('.modal-confirm_desktop_with-icon .modal-footer-btn').dispatchEvent(e);
            console.log(`logs 寻找点击确认`);
            if (document.querySelector(".modal-button--XBKpB")) {
              console.log(`logs 我点击到了确认`);
              document.querySelector(".modal-button--XBKpB").dispatchEvent(es);
            }

            // 再次点击房间

            const eContainerAgain = document.createEvent("MouseEvents");
            eContainerAgain.initEvent("click", true, true);
            console.log(`logs 查找点击房间`);
            if (
              document.querySelector(
                '[data-automation-locator="lobby.gamecode_sbdl"] .table-footer--zpwhg'
              )
            ) {
              console.log(`logs 点击房间`);
              document
                .querySelector(
                  '[data-automation-locator="lobby.gamecode_sbdl"] .table-footer--zpwhg'
                )
                .dispatchEvent(eContainerAgain);
            }
            await waiting(1000);
            go();
            if (!document.querySelector(".modal-button--XBKpB")) {
              goIn = false;
            }
          }
        }
        goInFun();

        starTime = new Date();
      }
    }
  }

  go();
  refresh();
  // clear()
  // opppsoteBuy()
}
