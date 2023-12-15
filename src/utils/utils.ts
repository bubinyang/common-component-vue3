/**
 * 背景:看板过多，经常要开发各种能源数据展示看板，属性对应的实时，日月年，能源接口固定，数据结构固定
 * 针对固定内容封装出一个专门产出 供echart展示的数据结构的类。该类可以进行改变属性方法应对其他非能源结构数据的接口
 * echart展示使用装饰器思想进行封装
 */
// import { criculationActionSwitch } from "@/utils/index.js";
interface IObject<T = any> {
  [key: string]: T;
}
interface IFunction<T = any> {
  (x?: any): T;
}

import { isTemplateNode } from "@vue/compiler-core";
import moment from "moment";
// import { createPointFood } from "@/utils/index.js";

export class lrdEchart {
  public xAxisData: Array<number>; //xAxisData 横轴数据集合
  public barChartData:
    | Array<{ attrKey: string; name: string; list: Array<number | string> }>
    | undefined; //源数据
  public format: IObject; //横坐标筛选对应位置数据的date格式(按照位置查找数据的关键字段的格式类型)

  currentDate = moment(new Date()).format("YYYY-MM"); //图表渲染数据的时间
  dateType: string; //图表数据展示时间列表类型
  findUnit: string; //单位
  decimalDigits = 2; //数据保留小数位
  frequency = 15; //24小时时间数组，循环间隔

  constructor(param: {
    currentDate?: string;
    dateType: string;
    findUnit: string;
    decimalDigits?: number;
    frequency?: number;
  }) {
    const { currentDate, dateType, decimalDigits, findUnit, frequency } = param;
    if (currentDate !== undefined) this.currentDate = currentDate;
    this.dateType = dateType;
    this.findUnit = findUnit;
    if (decimalDigits !== undefined) this.decimalDigits = decimalDigits;
    if (frequency !== undefined) this.frequency = frequency;
    this.xAxisData = this.getTimeListUpdate(this.currentDate, dateType);
    this.format = {
      day: "HH",
      month: "YYYY-MM-DD",
      year: "YYYY-MM",
      realtime: "YYYY-MM-DD HH:mm:ss",
      randomtime: "YYYY-MM-DD HH:mm:ss"
    };
  }

  getXAxisLabelBarFormatter(val: number): string {
    return (
      {
        day: moment.unix(val / 1000).format("HH:mm"),
        month: `${moment.unix(val / 1000).format("DD")}日`,
        year: `${moment.unix(val / 1000).format("MM")}月`,
        realtime: moment.unix(val / 1000).format("HH:mm")
      } as { [key: string]: string }
    )[this.dateType];
  }

  getTimeListUpdate(time: string | Date, type: string, endTime?: string | Date): Array<any> {
    if (!type) type = this.dateType;
    // 获取起始日期（月或者年）
    const starNum = moment(time)
      .startOf(type as any)
      .valueOf();
    return (
      {
        year: this.getYear(starNum),
        month: this.getMonth(time, starNum),
        day: this.getTimeDataRange({ date: time, minute: this.frequency }), //自然天时间数组
        realtime: this.getTimeDataRange({ date: time, minute: this.frequency, endTime }) //非自然天时间数组
      } as {
        [key: string]: Array<any>;
      }
    )[type];
  }

  getMonth(time: string | Date, starNum: number): Array<number> {
    // 获取某月天数
    const timeData = [];
    timeData.push(starNum);
    const monthDays = moment(time).daysInMonth() - 1; // 获得月的天数
    for (let i = 0; i < monthDays; i++) {
      starNum = starNum + 24 * 60 * 60 * 1000;
      timeData.push(starNum);
    }
    return timeData;
  }

  getYear(starNum: number): Array<number> {
    // 获取某年月数
    const timeData = [];
    for (let i = 0; i < 12; i++) {
      timeData.push(moment(starNum).clone().add(i, "months").valueOf());
    }
    return timeData;
  }
  /**
   *
   * @param date   从几点开始
   * @param minute 间隔时间(单位分钟)
   * @returns 24小时间隔为60分钟的时间组成的数组。可以实现跨天获取24小时的时间数组
   */
  getTimeDataRange({
    date,
    minute = 60,
    endTime
  }: {
    date: string | Date;
    minute: number;
    endTime?: string | Date | undefined;
  }): Array<number> {
    const dateValue = moment(date).valueOf();
    const endTimeValue = endTime ? moment(endTime).valueOf() : dateValue + 24 * 60 * 60 * 1000;
    const differ = minute * 60 * 1000;
    const arr = [];
    for (let i = dateValue; i < endTimeValue; i += differ) {
      arr.push(i);
    }
    return arr;
  }

  dealEchartList(
    origin: IObject[],
    type: string
  ): () => Array<{ attrKey: string; name: string; list: Array<number | string> }> {
    return (
      {
        normal: () => {
          return origin.map((item, index) => {
            const { attrKey, values, name } = item.data[0];
            const list = Object.keys(values).map((key) => {
              return {
                time: key,
                value: attrKey === "A29" ? this.dealData(values[key]) : values[key][0][attrKey]
              };
            });
            console.log(list);
            // const sum = this.setEchartTotal(
            //   list.map((item) => item.value),
            //   this.findUnit ? this.findUnit : ""
            // );
            return {
              attrKey,
              name,
              list: this.complementData(list)
            };
          });
        },
        realTime: () => {
          return origin.map((item, index) => {
            const { attrVals, name } = item.data;
            // const sum = this.setEchartTotal(
            //   attrVals ? attrVals[0].list.map((item: any) => item.value) : [],
            //   this.findUnit ? this.findUnit : ""
            // );

            return {
              attrKey: attrVals ? attrVals[0].key : "",
              name,
              list: attrVals ? this.complementData(attrVals[0].list) : []
            };
          });
        }
      } as {
        [key: string]: () => Array<{ attrKey: string; name: string; list: Array<number | string> }>;
      }
    )[type];
    //return testval[type];
  }

  dealData(origin: IObject[any]): Array<number> {
    return origin.reduce((total: number, item: any) => {
      const key = Object.keys(item)[0];
      total += Number(item[key]);
      return total;
    }, 0);
  }

  setEchartTotal(list: IObject[], unit: string): string {
    const sum = list.reduce((total: number, item: any) => {
      if (item && !isNaN(item)) {
        total += Number(item);
      }
      return total;
    }, 0);
    return `  (总量:${this.setToFixed(sum, this.decimalDigits)}${this.findUnit})`;
  }

  setToFixed(val: string | number | undefined | null, num = 1): number | string {
    let assistDec = 1;
    for (let i = 0; i < num; i++) {
      assistDec *= 10;
    }
    if (val === "" || val === null || val === undefined) return "";
    if (Object.is(val, NaN)) return 0;
    if (!assistDec) return Math.round(Number(val));
    return Math.round(Number(val) * assistDec) / assistDec;
  }

  complementData(
    origin: IObject[],
    xAxisData = this.xAxisData,
    key = "time"
  ): Array<number | string> {
    const modelList = xAxisData.map((item) => {
      return moment(item).format(this.format[this.dateType]);
    });
    return modelList.map((item) => {
      const findItem = origin.find((childitem) => childitem[key] === item);
      return findItem ? this.setToFixed(findItem.value, this.decimalDigits) : "";
    });
  }

  //   get fullName(): string | undefined {
  //     return this._fullName;
  //   }

  //   set fullName(newName: string | undefined) {
  //     this._fullName = newName;
  //   }
}

class SetDialogPosition {
  private eventItem: MouseEvent;
  public dialogEl!: HTMLDivElement;
  public containEl!: HTMLDivElement;
  constructor(public containElName: HTMLDivElement, options: IObject) {
    const { eventItem, dialogElName, dialogEl, defaultPosition } = options;
    this.eventItem = eventItem;

    if (!containElName || (!dialogElName && !dialogEl)) {
      console.log("传参有问题，请检查");
      return;
    }
    this.dialogEl = document.querySelector(dialogElName) || dialogEl;
    this.containEl = containElName;
    // return this.action();
  }

  action(): {
    left: number | undefined;
    top: number | undefined;
    bottom: number | undefined;
    right: number | undefined;
  } {
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

export function toSysViewComponentPath(path: string): string {
  path = path.replace("_", "-");
  return `/src/views${path}.vue`;
}

//获取vue文件路径下的 import(url)文件组合成的json， key是url
export function getSysRouteMap(): IObject {
  return import.meta.glob("/src/views/**/*.vue");
}

import layout from "@/layout/layout.vue";
//组装用户路由列表，设置component
export function setRouterComponent(origin: Array<any>): IObject[] {
  function dealUrlSlash(url: string): string {
    //判断开头是否有'/',如果没有，补齐'/'
    return (url = !/^\//g.test(url) ? "/" + url : url);
  }
  const arr: IObject[] = [];
  origin.forEach((item: any) => {
    const path = dealUrlSlash(item.url);
    const vueUrl = toSysViewComponentPath(path);
    const route: IObject = {
      path,
      name: path,
      component: item.children && item.children.length ? layout : getSysRouteMap()[vueUrl]
    };
    if (item.children) {
      route.children = setRouterComponent(item.children);
    }
    arr.push(route);
  });
  return arr;
}

//贪吃蛇
/**
 * 1.随机创造一个点（键盘控制点的位移）
 * 2.空白地方随机创造N个待吃点
 */

function createPointFood(min: number, max: number, times: number) {
  const numList = [];
  const top = Math.floor(max / 8);
  for (let i = 1; i <= top; i++) {
    numList.push(times * i);
  }
  const result = [];
  for (let i = 0; i < 5; i++) {
    const len = numList.length;

    const index = Math.round(len * Math.random());
    result.push(numList.splice(index, 1)[0]);
  }

  return result;
}

function criculationActionSwitch(fn: any, ms: number) {
  const obj = {
    isAction: true,
    action() {
      const beginAction = () => {
        // eslint-disable-next-line prefer-rest-params
        if (obj.isAction) fn.apply(this, arguments);
        setTimeout(beginAction, ms);
      };
      beginAction();
    }
  };
  return obj;
}
