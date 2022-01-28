import moment from "moment";

/**
 * time 哪一天
 * type 需要的时间类型
 * diffTime 日类型的时间间隔，如1分钟，2分钟
 * star 起始时间，如2020 12-12 08:00 开始
 * 概述:获取 年，月 ，日的时间数组
 *
 */
export function getTimeList({ time, type, diffTime, star = 0, end }) {
  // 获取起始日期（月或者年）
  const starNum = moment(time).startOf(type).valueOf();
  const endNum = moment(time).endOf(type).valueOf();
  return {
    year: getYear(),
    month: getMonth({ starMonth: star || starNum, end: end || endNum }),
    day: getTimeDataRange({ date: time, minute: diffTime, star })
    // day: getTimeData(time, diffTime)
  }[type];

  // 起始 1号，结束是31号
  function getMonth({ starMonth, end }) {
    // 获取某月天数
    const timeData = [];
    const oneDayTimes = 24 * 60 * 60 * 1000;
    const range = (moment(end).valueOf() - moment(starMonth).valueOf()) / oneDayTimes;
    for (let i = 0; i < Math.ceil(range); i++) {
      timeData.push(moment(starMonth).clone().add(i, "day").valueOf());
    }
    return timeData;
  }

  function getYear() {
    // 获取某年月数
    const timeData = [];
    for (let i = 0; i < 12; i++) {
      timeData.push(moment(starNum).clone().add(i, "months").valueOf());
    }
    return timeData;
  }
}

/**
 * star 起始时间点
 * minute 时间间隔，单位为分钟
 * 概述:按照设置的间隔时间段，循环堆叠出一个数组
 */

export function getTimeDataRange({ date, minute = 60, star = 0, end = 1 }) {
  // 转化时间戳到0点

  const time = +new Date(moment(date).format("YYYY-MM-DD 00:00:00"));

  const starTime = time + star * 60 * 60 * 1000; // 起始时间点
  const endTime = starTime + 24 * 60 * 60 * 1000 * end; // 结束时间点

  const differ = minute * 60 * 1000;
  const cycleIndex = Math.floor((endTime - starTime) / differ);

  const arr = [];
  for (let i = 0; i < cycleIndex; i++) {
    arr.push(starTime + differ * i);
  }
  return arr;
}

/**
 * 获取年月日对应的开始和结尾时间
 * time 时间值
 * type 年月日类型(day,month,year)
 * timingType 开始或者结束(startOf,endOf)
 * startOf endOf为用量时间规则
 * difference 为差值，如8点到8点
 *
 */
function getTimeObject(time, type = "day", timingType = "startOf", difference = 0) {
  return {
    startOf: moment(time).startOf(type).add(difference, "hour").format("YYYY-MM-DD HH:mm:ss"),
    endOf: moment(time).endOf(type).add(difference, "hour").format("YYYY-MM-DD HH:mm:ss")
  }[timingType];
}

/**
 * 上传文件通用方法
 * successUpload:上传成功后
 * beforeUpload:上传前
 */
import axios from "axios";
// import { Curve } from 'three';
class UploadClass {
  constructor(options) {
    this.successUpload = options.successUpload || function () {};
    this.errorUpload = options.errorUpload || function () {};
    this.beforeUpload = options.beforeUpload || function () {};
    this.limit = options.limit || 0;
    this.el = options.el; // 节点
    this.url = options.url; // 接口地址
    // this.formData = new FormData() // 表单对象
    // this.fileRender = new FileReader()// 文件对象
    this.configs = {
      // 头部传参
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: options.headertoken
      }
    };
    this.pictures = [];
  }
  get list() {
    return this.pictures;
  }

  changeVal(callback) {
    this.el.onchange = (e) => {
      // this.fileRender.readAsDataURL(this.el.files[0])
      // this.fileRender.onload = function(ie) {
      //   var Base64Val = this.result
      //   console.log('Base64')

      //   console.log(Base64Val)
      // }

      // 初始化表单对象
      this.formData = new FormData();

      this.formData.append("files", this.el.files[0], this.el.files[0].name);
      this.el.value = null;
      axios
        .post(this.url, this.formData, this.configs)
        .then((res) => {
          this.beforeUpload();
          const file = res.data;

          if (!this.limit) {
            // 添加图片次数(无限制,可以一直加)
            this.pictures.push(file.data[0]);
          } else {
            if (this.pictures.length < this.limit) {
              this.pictures.push(file.data[0]);
              if (this.limit > 1) {
                console.error(`上传图片数量不能多于${this.limit}`);
              }
            } else if (this.limit === 1) {
              // 一张默认替换
              this.pictures = [];
              this.pictures.push(file.data[0]);
            }
          }
          console.log(this.pictures);
          // 传出图片
          callback.apply(this);

          this.successUpload();
        })
        .catch((err) => {
          this.errorUpload(err);
        });
    };
  }

  changePictures(list) {
    this.pictures = this.pictures.filter((item) => {
      return list.some((childitem) => childitem.includes(item));
    });
  }
}
// 上传文件
function newUpload(options = {}) {
  return new UploadClass(options);
}

// 操作数据类
function treeSwitch(origin, type, parentId = "parentId", id = "id", children = "children") {
  /* 过滤出root数据*/
  const rootList = origin.filter((item) => !item[parentId]);
  const typeTree = {
    merge() {
      return mergeTree(rootList);
    },
    spread() {
      return spreadTree(origin);
    }
  };
  return typeTree[type]();

  /* 树形数据扩散开，按照父子顺序排开*/
  function spreadTree(data, children = "children") {
    return data.reduce((total, item) => {
      total.push(item);
      if (item[children]) {
        total.push(...spreadTree(item[children], children));
      }
      return total;
    }, []);
  }
  /* 扩散开的父子数据整合成父子关系数据 */
  function mergeTree(data) {
    console.log(data, "data");
    data.forEach((item) => {
      item[children] = origin.filter((childitem) => item[id] === childitem[parentId]);
      mergeTree(item[children]);
    });
    return data;
  }
}

//加快将一维结构的树变成树形结构
function mergeTreeSet(origin) {
  const rootList = origin.filter((item) => !item["pid"]);
  return mergeTree(rootList);
  function mergeTree(data) {
    data.forEach((item) => {
      item["children"] = origin.filter((childitem) => item["id"] === childitem["pid"]);
      if (item["children"]) mergeTree(item["children"]);
    });
    return data;
  }
}

// 深拷贝
function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("参数对象有误");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 创建遮罩层,删除遮罩层(创建遮罩，阻塞部分交互操作)
 * @param parentEl 添加遮罩元素到的指定元素
 * @param type 操作方法的类型
 */
export function createShade() {
  const styles = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute"
  };
  const actionTypes = {
    add: addEl,
    remove: removeEl
  };
  return {
    action(parentEl, type) {
      return actionTypes[type] ? actionTypes[type](parentEl) : false;
    }
  };
  function addEl(parentEl) {
    const el = document.createElement("div");
    el.className = "echart-shade";
    Object.keys(styles).forEach((key) => {
      el.style[key] = styles[key];
    });
    parentEl.appendChild(el);
  }

  function removeEl(parentEl) {
    parentEl.removeChild(document.querySelector(".echart-shade"));
  }
}

/**
 * 滚动
 * @param speed 速度
 * @param boxEl 盒子El
 * @param contentEl 内容El
 * @param orient 方向 horizontal vertical
 */
export function scrollItem({ contentEl, speed = 20, orient = "horizontal" }) {
  const types = {
    horizontal: {
      sizeLabel: "width",
      setStyle(distance) {
        return `translateX(${distance}px)`;
      }
    },
    vertical: {
      sizeLabel: "height",
      setStyle(distance) {
        return `translateY(${distance}px)`;
      }
    }
  };

  // const boxSizeVal = boxEl.getBoundingClientRect()[types[orient].sizeLabel]
  const contentSizeVal = contentEl.getBoundingClientRect()[types[orient].sizeLabel];
  let distance = 0;
  setInterval(() => {
    distance = distance - 1;
    if (-distance >= parseInt(contentSizeVal)) {
      distance = 0;
    }
    // console.log(distance)
    contentEl.style.transform = types[orient].setStyle(distance);
  }, 20);
}

/**
 *
 * @param  containElName 外框El
 * @param contentElName 内容框El
 * @param fixW 固定比例宽
 * @param fixH 固定比例高
 */
export function setTransform(containElName, contentElName, fixW = 1920, fixH = 1080) {
  // 展示内容的外框
  const viewEl = document.querySelector(containElName);
  // 要进行缩小的内框
  const contentEl = document.querySelector(contentElName);
  contentEl.style[fixW] = `${fixW}px`;
  contentEl.style[fixH] = `${fixH}px`;
  const ratio = viewEl.getBoundingClientRect().width / fixW;
  contentEl.style.transform = "scale(" + ratio + ")";
  contentEl.style.transformOrigin = "left top";
  contentEl.style.backgroundSize = "100%";
}

/**
 * 将[{normal:'1'},{peack:'2'}]转成[{label:'normal',value:'1'},{label:'peack',value:'2'}]
 */
export function changeObj(origin, type = "keyArr") {
  const keyArr = origin.map((item) => {
    const key = Object.keys(item)[0];
    const obj = { label: key, value: item[key] };
    return obj;
  });

  const arrKey = origin.map((item) => {
    const obj = {};
    obj[item.label] = item.value;
    return obj;
  });

  return {
    keyArr,
    arrKey
  }[type];
}

/**
 * 16进制颜色改成rgba
 */
export function colorRgb(val, opacity = 1) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  var color = val.toLowerCase();

  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt(`0x${color.slice(i, i + 2)}`));
    }

    return `rgba(${colorChange.reverse().join(",")},${opacity})`;
  } else {
    return color;
  }
}

/**
 *
 * @param {数据源}} list
 * @param {匹配值} val
 * @param {匹配ID} key
 * @param {children的字段} children
 * 在树形数据中从内往外层找数据
 */

export function findParentNode({ list = [], val, key = "id", children = "children" }) {
  const arr = [];
  circulation(list);
  function circulation(list) {
    let choose = false;
    list.forEach((item, index) => {
      if (item[children]) {
        item.choose = circulation(item[children]);
      }
      if (item[key] === val || item.choose) {
        arr.push(item[key]);
        choose = true;
      }
    });
    return choose;
  }
  return arr;
}

/**
 * @name: 特殊轮播
 * @msg: 实现轮番，同时可以配置某个模块的延迟时间
 * @param {delay 延迟轮播时间}
 * @param {options 属性传参(delayOptions:特殊模块需要延迟)}
 * @return {el 容器元素对象}
 */

class SwpierSpecial {
  constructor(elName, options = {}) {
    this.delayOptions = options.delayOptions || [];
    this.defaultDelay = 2000;
    this.delay = options.delay ? options.delay : this.defaultDelay;
    this.el = document.querySelector(elName);

    this.getContainStyle();
  }
  // 获取容器宽高
  getContainStyle() {
    const { height, width } = this.el.getBoundingClientRect();
    this.elW = width;
    this.elH = height;
    this.getChildEl();
  }
  // 获取子容器元素,组装成操作数组,设置默认属性
  getChildEl() {
    if (!this.el.children.length) return;
    const { children } = this.el;

    this.childEls = Array.prototype.slice.call(children).map((item, index) => {
      const findItem = this.delayOptions.find((item) => item.name === index);
      return {
        el: item,
        delay: findItem ? findItem.value : this.defaultDelay,
        transformTx: this.elW * index
      };
    });
    // 设置默认translateX的值
    this.childEls.forEach((item, index) => {
      if (index === 0) item.el.classList.add("is-active");
      this.setStyle(item.el, "transform", `translateX(${item.transformTx}px)`);
    });
    this.setTransform();
    this.action();
  }
  // 将最后一条数据挪到-elW的位置
  setTransform() {
    if (this.childEls.length > 2) {
      const length = this.childEls.length;
      const findItem = this.childEls[length - 1];
      findItem.transformTx = -this.elW;
    }
  }

  // 休眠方法
  waiting(ms = this.delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  // 轮播方法
  async action() {
    const length = this.childEls.length;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      for (let i = 0; i < length; i++) {
        await this.waiting(this.childEls[i].delay);
        // 位移执行
        this.childEls.forEach((item) => {
          item.transformTx = item.transformTx - this.elW;
          if (item.transformTx === 0) {
            item.el.classList.add("is-active");
          } else {
            item.el.classList.remove("is-active");
          }
        });

        // 判断位移位置,将位移位置是负2倍的挪到最后
        this.childEls.forEach((item) => {
          if (item.transformTx === -2 * this.elW) {
            item.transformTx = (length - 2) * this.elW;
          }
          this.setStyle(item.el, "transform", `translateX(${item.transformTx}px)`);
        });
      }
    }
  }

  // 移动和重置操作
  mutations() {}
  setStyle(el, classKey, value) {
    el.style[classKey] = value;
  }
}
export function newSwpierSpecial(el, options) {
  return new SwpierSpecial(el, options);
}

/**
 *
 * @param  val 数据源
 * @param  num 保留的小数位数
 * @param standard 千分位，百分为
 * 四舍五入保留小数位数
 */
// export function setToFixed(val, num = 1) {
//   let assistDec = 1;
//   for (let i = 0; i < num; i++) {
//     assistDec *= 10;
//   }
//   if (val === '' || val === null || val === undefined || isNaN(val)) return '';
//   if (Object.is(val, NaN)) return 0;
//   if (!assistDec) return Math.round(Number(val));
//   return Math.round(Number(val) * assistDec) / assistDec;
// }

/*

*/
export function setToFixed({ val, num = 1, standard = 0 }) {
  let assistDec = 1;
  for (let i = 0; i < num; i++) {
    assistDec *= 10;
  }
  if (val === "" || val === null || val === undefined || isNaN(val)) return "";
  if (Object.is(val, NaN)) return 0;
  if (!assistDec) return Math.round(Number(val));
  const finalVal = Math.round(Number(val) * assistDec) / assistDec;
  // 千分位,百分位增加 ','
  const findValStr = finalVal.toString();
  const list = findValStr.split(".");
  const reverList = list[0].split("");
  reverList.reverse();
  const pointList = reverList.reduce((total, item, index) => {
    total.push(item);
    if (standard) {
      if ((index + 1) % standard === 0 && !isNaN(item) && reverList.length > standard) {
        total.push(",");
      }
    }
    return total;
  }, []);
  pointList.reverse();
  if (list[1]) {
    return `${pointList.join("")}.${list[1]}`;
  } else {
    return `${pointList.join("")}`;
  }
}

/**
 *
 * @param  val 数据源
 * @param  num 保留的小数位数
 * @param standard 千分位，百分为
 * @isDouble 保留小数位,不齐情况是否补0,默认为是
 * 四舍五入保留小数位数,同时增加分位符
 */
// 升级setToFixed
export function setQuantile({ val, num = 0, standard = 0, isDouble = true }) {
  let assistDec = 1; // 扩大数字的乘数
  if (val === "" || val === null || val === undefined || isNaN(val)) return "";
  // var valString = val.toString();
  for (let i = 0; i < num; i++) {
    assistDec *= 10;
  }

  if (isDouble) {
    const result = Number(val).toFixed(num);
    return !standard ? result : setStandard(result);
  } else {
    const result = Math.round(Number(val) * assistDec) / assistDec;

    return !standard ? result : setStandard(result);
  }

  function setStandard(param) {
    param = param.toString();
    const index = param.indexOf(".");
    const decimalsVal = param.slice(index);
    const integerVal = param.slice(0, index > 0 ? index : val.length);
    const remainder = integerVal.length % standard; // 除以分位数得到余数
    if (remainder > 0) {
      return (
        integerVal.slice(0, remainder) +
        "," +
        integerVal
          .slice(remainder)
          .match(new RegExp(`\\d{${standard}}`, "g"))
          .join(",") +
        decimalsVal
      );
    } else {
      return integerVal.match(/\d{standard}/).join(",") + decimalsVal;
    }
  }

  // "\d已经做了一次转义，而regexp需要的是字符串，所以得把\d 的\ 转义掉"
}

// 去重
export function removeRepetiton(origin, key) {
  const typeString = Object.prototype.toString.call(origin);
  if (typeString !== "[object Array]") {
    console.error("请检查数据类型");
    return;
  }
  if (key) {
    return origin.reduce((total, item) => {
      const isPush = total.some((childitem) => childitem[key] === item[key]);
      if (isPush) total.push(item);
      return total;
    }, []);
  } else {
    return origin.filter((item, index) => {
      const findIndex = origin.findIndex((chidlitem) => chidlitem === item);
      return findIndex === index;
    });
  }
}

// 数组扩展方法(过滤)
// eslint-disable-next-line no-extend-native
Array.prototype.reduceFilter = function (callback) {
  return this.reduce((total, item, index) => {
    if (callback(item, index)) {
      total.push(item);
    }
    return total;
  }, []);
};

// 数组扩展方法(重塑)
// eslint-disable-next-line no-extend-native
Array.prototype.reduceMap = function (callback) {
  return this.reduce((total, item, index) => {
    total.push(callback(item, index));
    return total;
  }, []);
};

// 数组扩展方法(查找)
// eslint-disable-next-line no-extend-native
Array.prototype.reduceFind = function (callback) {
  return this.reduce((total, item, index, array) => {
    if (callback(item, index) && Object.prototype.toString.call(total) === "[object Array]") {
      total = item;
    }
    if (
      index === array.length - 1 &&
      Object.prototype.toString.call(total) === "[object Array]" &&
      total.length === 0
    ) {
      total = undefined;
    }
    return total;
  }, []);
};

// 计算出数组某项目的数量
export function computeAmount(origin) {
  if (!Object.prototype.toString.call(origin) === "[object Array]") {
    console.error("请检查数据类型");
    return null;
  }
  return origin.reduce((total, item, index) => {
    if (item in total) {
      total[item] += 1;
    } else {
      total[item] = 1;
    }
    return total;
  }, {});
}

// 按照属性，将数组分类
/**
 *
 * @param {*数据源} origin
 * @param {*按照某个字段的值进行分组} type
 */
export function typeGroup(origin, type) {
  return origin.reduce((total, item) => {
    if (!total[item[type]]) {
      total[item[type]] = [];
    }
    total[item[type]].push(item);
    return total;
  }, {});
}

// 数组查找最大值的项目
/**
 *
 * @param {*数据源} origin
 * @param {*字段(如果有key就带字段的,否则为纯数组)} key
 * @param {*最大or最小 max min} type
 */
export function findMax({ origin, key, type = "max" }) {
  const condition = function (total, key, item) {
    return {
      max() {
        return key ? total[key] < item[key] : total < item;
      },
      min() {
        return key ? total[key] > item[key] : total > item;
      }
    };
  };
  return origin.reduce((total, item) => {
    if (!total) {
      total = item;
      return total;
    }
    if (condition(total, key, item)[type]()) {
      total = item;
      return total;
    }

    return total;
  }, 0);
}
// 只执行一次
export function once(fn) {
  let done = false;
  return function () {
    return done ? undefined : ((done = true), fn.apply(this, arguments));
  };
}

// 数字显示万，百万，千万，亿
/*
90000000显示成9000万
 */
export function setNumberFormat() {
  const types = [
    { type: "hundredMillion", lengths: 9, label: "亿", standardVal: 100000000 },
    { type: "millions", lengths: 8, label: "千万", standardVal: 10000000 },
    { type: "million", lengths: 7, label: "百万", standardVal: 1000000 },
    { type: "thousand", lengths: 5, label: "万", standardVal: 10000 }
  ];

  return {
    addType(item) {
      types.push(item);
    },
    action({ value, type = "thousand", num = 2 }) {
      const findItem = types.find((item) => item.type === type);
      return `${setToFixed(value / findItem.standardVal, num)}${findItem.label}`;
    }
  };
}

// 将?&区分的字符串转化成json
export function createrUrlJson(param) {
  const list = param.split("?");
  if (list.length > 1) {
    const arr = list[1].split("&");
    return arr.reduce((total, item) => {
      total[item.split("=")[0]] = item.split("=")[1];
      return total;
    }, {});
  } else {
    return "";
  }
}

// 字符串函数转成可执行函数
export function strToJson(str) {
  // eslint-disable-next-line no-eval
  return eval(`(${str})`);
}

// 星期几
export function getWeek(type) {
  const weeks = [
    { code: 1, label: "一" },
    { code: 2, label: "二" },
    { code: 3, label: "三" },
    { code: 4, label: "四" },
    { code: 5, label: "五" },
    { code: 6, label: "六" },
    { code: 0, label: "日" }
  ];
  const findItem = weeks.find((item) => item.code === type);
  return findItem ? findItem.label : "";
}

// 鼠标点击展示弹出框，弹出框位置在数据表点击的地方出现
/**
 * @param {defaultPosition 默认显示位置,左上(lt)、左下(lb)、右上(rt)、右下(rb)}
 * @param {containEl 展示框元素}
 * @param {eventItem 点击元素event}
 * @param {dialogEl  弹出框元素}
 * @param {defaultPosition  弹出框展示位置}
 *
 */
class SetDialogPosition {
  constructor(
    containElName,
    options = {
      defaultPosition: "rt"
    }
  ) {
    const { eventItem, dialogElName, defaultPosition } = options;
    this.eventItem = eventItem;

    if (!containElName || !dialogElName) {
      console.log("传参有问题，请检查");
      return;
    }
    this.dialogEl = document.querySelector(dialogElName);
    this.containEl = document.querySelector(containElName);
    return this.action();
  }

  action() {
    let left, top, bottom, right;
    // rt:right-e.x,e.y-top
    // rb:right-e.x,bottom-e.y
    // 获取鼠标点击位置距离展示框边缘的距离(默认显示在右上，所以拿right-e.x  e.y-top  )
    const spaceW = this.containEl.getBoundingClientRect().right - this.eventItem.x;
    const spaceH = this.eventItem.y - this.containEl.getBoundingClientRect().top;
    // 获取弹出框高度和宽度
    const dialogW = this.dialogEl.getBoundingClientRect().width;
    const dialogH = this.dialogEl.getBoundingClientRect().height;
    const contentElBoundingRect = this.containEl.getBoundingClientRect();

    if (dialogW <= spaceW) {
      left = contentElBoundingRect.width - spaceW;
    } else {
      if (contentElBoundingRect.width - spaceW < dialogW) {
        right = (contentElBoundingRect.width - dialogW) / 2;
      } else {
        right = spaceW;
      }
    }
    if (dialogH <= spaceH) {
      bottom = contentElBoundingRect.height - spaceH;
    } else {
      // 如果往下放，位置还是不够，那么就放中间
      if (contentElBoundingRect.height - spaceH < dialogH) {
        top = (contentElBoundingRect.height - dialogH) / 2;
      } else {
        top = spaceH;
      }
    }
    return {
      left,
      top,
      bottom,
      right
    };
  }
}

export function newSetDialogPosition(el, options) {
  return new SetDialogPosition(el, options);
}

// 自动生成guid
export function setGuid() {
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}

// 更具时间范围获取时分秒总和
export function timeTotal(value) {
  const list = value.split("~");
  const differenceValue = moment(list[1]).valueOf() - moment(list[0]).valueOf();
  const second = differenceValue / 1000;
  const hour = Math.floor(second / 3600); // 小时
  const minutes = hour > 0 ? Math.floor((second - hour * 3600) / 60) : Math.floor(second / 60); // 小时大于0,去除小时，算出分钟
  const showSecond = second - hour * 3600 - minutes * 60;
  return `${hour}小时${minutes}分钟${showSecond}秒`;
}

/**
 *
 * @param type 多级树结构类型/一级类型
 * @param value 源值
 * @param valueKey 匹配值的字段名
 * @param list  匹配的数据列表
 */
export function filterLabel({
  value,
  type = "normal",
  valueKey = "dictValue",
  labelKey = "dictLabel",
  children = "children",
  list
}) {
  if (value === null || value === undefined) return "";
  const originList = type === "treeType" ? spreadTrees(list, children) : list;
  const values = Object.prototype.toString(value) === "[object Array]" ? value.split(",") : value;
  const filterList = originList.filter((item) => values.includes(item[valueKey]));
  return filterList.map((item) => item[labelKey]).join(",");
}

export function spreadTrees(data, children = "children") {
  return data.reduce((total, item) => {
    total.push(item);
    if (item[children]) {
      total.push(...spreadTrees(item[children], children));
    }
    return total;
  }, []);
}

//防抖(多次触发事件，控制频繁操作只执行一次) 非立即执行
export function debounce(fn, ms) {
  let timeout;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
}

//防抖 立即执行
export function debounceImmedidately(fn, ms) {
  let timeout;
  return function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
    }, ms);
    if (!timeout) fn.apply(this, arguments);
  };
}

//节流 (立即执行,时间戳版本)
export function throttleImmedidately(fn, ms) {
  let star = 0;
  return function () {
    let nowTime = new Date();
    if (nowTime - star > ms) {
      fn.apply(this, arguments);
      star = new Date();
    }
  };
}

//节流 (非立即执行,定时器版本)
export function throttle(func, wait) {
  let timeout;
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      func.apply(this, arguments);
    }
  };
}

//ajax upload
export function setXmlHttpRequest(url, method, options = {}) {
  return new Promise((resolve, reject) => {
    const { headers } = options;
    if (!XMLHttpRequest) {
      return console.err("浏览器不支持XMLHtpRequest,请检查");
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true); // 第三个参数是觉得是否为异步
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.readyState === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    xhr.send();
  });
}

export default {
  // 时间类
  getTimeDataRange,
  getTimeObject,
  // 操作文件类
  newUpload,
  // 操作数据类
  treeSwitch,
  deepClone,
  computeAmount,
  typeGroup,
  findMax,
  once,
  setNumberFormat,
  setToFixed,
  setQuantile,
  createrUrlJson,
  strToJson,
  getTimeList,
  setGuid
};
