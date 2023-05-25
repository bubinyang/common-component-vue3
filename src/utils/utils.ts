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
  public barChartData: Array<{ attrKey: string; name: string; list: Array<number | string> }>; //源数据
  /**
   *
   * @param dateType 图表数据展示时间列表类型
   * @param decimalDigits 数据保留小数位
   * @param findValueKey 查找每条数据关键索引
   * @param realTimeName 非用量情况下的能源名称
   * @param findUnit 单位
   */
  constructor(
    private dateType: string,
    private decimalDigits: number = 2,
    private findValueKey: string = "YYYY-MM-DD",
    private realTimeName: string,
    private findUnit?: string
  ) {
    this.dateType = dateType;
    this.findUnit = findUnit;
    this.xAxisData = this.getTimeListUpdate(new Date(), dateType);
    this.barChartData = [];
    this.realTimeName = realTimeName;
  }
  //设置xAxisData坐标list
  // setPublicMethod(fn: (e?: any) => any): void {
  //   this.getTimeListUpdate = fn;
  // }

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

  getTimeListUpdate(
    time: string | Date,
    type: string = this.dateType,
    minute?: number
  ): Array<any> {
    // 获取起始日期（月或者年）
    const starNum = moment(time)
      .startOf(type as any)
      .valueOf();
    return (
      {
        year: this.getYear(starNum),
        month: this.getMonth(time, starNum),
        day: this.getTimeDataRange(time, minute),
        realtime: this.getTimeDataRange(time, minute)
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

  getTimeDataRange(date?: string | Date, minute = 60, star = 0, end = 1): Array<number> {
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

  dealEchartList(
    origin: IObject[],
    type: string
  ): () => Array<{ attrKey: string; name: string; list: Array<number | string> }> {
    console.log(origin);
    return (
      {
        normal: () => {
          return origin.map((item, index) => {
            const { attrKey, values } = item.data[0];
            const list = Object.keys(values).map((key) => {
              return {
                time: key,
                value: attrKey === "A29" ? this.dealData(values[key]) : values[key][0][attrKey]
              };
            });
            const sum = this.setEchartTotal(
              list.map((item) => item.value),
              this.findUnit ? this.findUnit : ""
            );
            return {
              attrKey,
              name: "用量",
              list: this.complementData(list)
            };
          });
        },
        realTime: () => {
          return origin.map((item, index) => {
            const { attrVals } = item.data;
            const sum = this.setEchartTotal(
              attrVals ? attrVals[0].list.map((item: any) => item.value) : [],
              this.findUnit ? this.findUnit : ""
            );

            return {
              attrKey: attrVals ? attrVals[0].key : "",
              name: this.realTimeName,
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
    return `  (总量:${this.setToFixed(undefined, this.decimalDigits)}${unit})`;
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

  complementData(origin: IObject[]): Array<number | string> {
    const modelList = this.xAxisData.map((item) => {
      return moment(item).format(this.findValueKey);
    });
    return modelList.map((item) => {
      const findItem = origin.find((childitem) => childitem.time === item);
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

/**
 * 背景:树形表格行进行顺序切换
 * 1.eventSuspension 事件绑定不需要在每一个拖拽按钮上绑定，直接在el盒子上绑定事件,判断event属性值觉得事件是否可以执行
 * 2.lrdDrg 相当于基类，辅助各种拖拉拽子类
 * 3.moveActionBind 作为方法传入addEventListener会导致this指向变化，需要bind
 * 4.onselectstart和ondragstart 防止拖拽选中文字和元素
 * 5.外部数据重新渲染，lrdDrag实例化禁止重复，否则点击事件会多次绑定导致多次执行   if(newLrdDrag) return;
 * 6.findParent 查找仅次于拖拽子项容易，有两种情况，className和attribute，需要包括这2个条件
 */
/**
 * @param el 拖拉拽所在的相对位置的盒子
 * @param options 配置参数
 * id  唯一索引key值
 */
export class lrdDrag {
  public completeContentEl: HTMLDivElement;
  constructor(public el: HTMLDivElement, options: IObject) {
    const { completeContentEl } = options;
    this.el = el;
    this.completeContentEl = completeContentEl;
    this.eventSuspension();
  }
  //位移事件
  moveAction(event: MouseEvent): void {
    console.log("位移");
  }

  //滚动事件
  moveScroll(): void {
    console.log("滚动");
  }

  //事件代理点击
  eventSuspension(): void {
    const moveActionBind = this.moveAction.bind(this);
    const moveScrollBind = this.moveScroll.bind(this);
    this.el.addEventListener("mousedown", (event) => {
      const el: any = event.target;
      if (el?.getAttribute("draggable") === null) return;
      document.onselectstart = function () {
        return false;
      };
      document.ondragstart = function () {
        return false;
      };
      this.mouseDownAction(event);

      document.addEventListener("mousemove", moveActionBind);
      // this.scrollEl.addEventListener("scroll", moveScrollBind);
    });

    document.addEventListener("mouseup", (event) => {
      document.onselectstart = null;
      document.ondragstart = null;
      document.removeEventListener("mousemove", moveActionBind);
      this.mouseUpAction();
    });
  }

  //创建tootip元素
  mouseDownAction(event: MouseEvent): void {
    console.log("鼠标按下事件");
  }

  mouseUpAction(): void {
    console.log("鼠标松开事件");
  }
}

export class lrdDragSort extends lrdDrag {
  public markeLineEl: HTMLDivElement | null; //标注线 元素
  public createEl: HTMLDivElement | null; //弹出框 元素
  private parentNodeList: Array<ParentNode | HTMLDivElement | null>; //查找父元素
  public name: string; //点击弹出createEl中的内容
  public alowSort: boolean; //鼠标超出el容器框是否允许执行mouseup事件关键字段
  public mouseUpCallBack: IFunction; //mouseUp外部回调函数
  public attributeKey: string; //排序子项容器的className
  constructor(public el: HTMLDivElement, options: IObject) {
    super(el, options);
    const { attributeKey } = options;
    this.createEl = null;
    this.markeLineEl = null;
    this.parentNodeList = [];
    this.name = "";
    this.alowSort = true;
    this.attributeKey = attributeKey;
    this.mouseUpCallBack = function () {};
  }
  private newSetDialogPosition(el: HTMLDivElement, options: IObject): SetDialogPosition {
    return new SetDialogPosition(el, options);
  }

  moveScroll(): void {
    // console.log(event.target);
    console.log("被滚动");
  }
  moveAction(event: MouseEvent): void {
    const position: IObject = this.newSetDialogPosition(this.el, {
      eventItem: event,
      dialogElName: ".createEl-style"
    }).action();
    this.createEl = document.querySelector(".createEl-style") as HTMLDivElement;

    //根据鼠标位置，强制tootip位置不能超过内容框
    const elRect = this.el.getBoundingClientRect();
    Object.keys(position).forEach((key) => {
      if (position[key] !== undefined) {
        (this.createEl as HTMLDivElement).style[key as any] = `${position[key] + 2}px`;
      } else {
        (this.createEl as HTMLDivElement).style[key as any] = "initial";
      }
    });
    //限制tootip在容器内定位
    this.alowSort = true;
    if (event.x < elRect.left) {
      this.createEl.style.left = "0px";
      this.alowSort = false;
    }
    if (event.x > elRect.right) {
      this.createEl.style.right = "0px";
      this.alowSort = false;
    }
    if (event.y < elRect.top) {
      this.createEl.style.top = "0px";
      this.alowSort = false;
    }
    if (event.y > elRect.bottom) {
      this.createEl.style.bottom = "0px";
      this.alowSort = false;
    }

    //根据位移高度  设置位移后的位置标注线
    this.setMarkeLinePosition(event);
    // this.parentNodeList = [];
    // this.findParent(event.target);

    // const trEl = this.parentNodeList[0] as HTMLDivElement;
    // const currentKey = trEl?.getAttribute("data-row-key");
    // if (!trEl || !currentKey) return;
    // const { top, height, bottom } = trEl.getBoundingClientRect();

    // const centerY = top + height / 2;
    // const completeContentElTop = this.completeContentEl.getBoundingClientRect().top;
    // if (event.pageY > centerY) {
    //   (this.markeLineEl as HTMLDivElement).style.top = `${bottom - completeContentElTop}px`;
    // } else {
    //   (this.markeLineEl as HTMLDivElement).style.top = `${top - completeContentElTop}px`;
    // }
  }

  setMarkeLinePosition(event: MouseEvent): void {
    this.parentNodeList = [];
    this.findParent(event.target);

    const trEl = this.parentNodeList[0] as HTMLDivElement;
    const currentKey = trEl?.getAttribute(this.attributeKey);
    if (!trEl || !currentKey) return;
    const { top, height, bottom } = trEl.getBoundingClientRect();

    const centerY = top + height / 2;
    const completeContentElTop = this.completeContentEl.getBoundingClientRect().top;
    if (event.pageY > centerY) {
      (this.markeLineEl as HTMLDivElement).style.top = `${bottom - completeContentElTop}px`;
    } else {
      (this.markeLineEl as HTMLDivElement).style.top = `${top - completeContentElTop}px`;
    }
  }

  findParent(dom: HTMLDivElement | EventTarget | null): any {
    const parentDom = dom && ((dom as HTMLDivElement).parentNode as HTMLDivElement);
    //属性条件或者className条件 满足都算父节点。查找排序子项容器dom,有时候要按照属性判断，有时候要按照className判断
    if (dom) {
      if (
        !this.parentNodeList.length &&
        parentDom?.hasAttribute &&
        parentDom?.hasAttribute(this.attributeKey)
      ) {
        this.parentNodeList.push((dom as HTMLDivElement).parentNode);
      } else if (
        !this.parentNodeList.length &&
        parentDom?.className &&
        parentDom?.className.includes(this.attributeKey)
      ) {
        this.parentNodeList.push((dom as HTMLDivElement).parentNode);
      }
      this.findParent((dom as HTMLDivElement).parentNode); //dom.parentNode作为子元素向上查找它的父元素
    } else {
      // console.log("end");
    }
  }

  mouseDownAction(event: MouseEvent): void {
    //插入tootip
    const styleItem: IObject<any> = {
      height: "40px",
      padding: "6.4px 15px",
      fontSize: "16px",
      borderRadius: "2px",
      fontWeight: "400",
      whiteSpace: "nowrap",
      textAlign: "center",
      border: "1px solid rgb(217, 217, 217)",
      boxShadow: "0 2px #00000004",
      cursor: "pointer",
      background: "white",
      position: "absolute",
      zIndex: 3
    };

    this.createEl = document.createElement("div");
    Object.entries(styleItem).forEach((item) => {
      const [key, value] = item;
      (this.createEl as HTMLDivElement).style[key as any] = value;
    });
    this.createEl.innerText = this.name;

    this.createEl.className = "createEl-style";
    this.el.appendChild(this.createEl);

    const position: any = this.newSetDialogPosition(this.el, {
      eventItem: event,
      dialogEl: this.createEl
    }).action();

    Object.keys(position).forEach((key) => {
      if (position[key] !== undefined) {
        (this.createEl as HTMLDivElement).style[key as any] = `${position[key]}px`;
      }
    });

    //插入标注线
    const markeLine: IObject<any> = {
      height: "1px",
      background: "red",
      position: "absolute",
      width: "100%",
      zIndex: 3
    };
    this.markeLineEl = document.createElement("div");
    Object.entries(markeLine).forEach((item) => {
      const [key, value] = item;
      (this.markeLineEl as HTMLDivElement).style[key as any] = value;
    });

    // document.querySelector("body")?.appendChild(this.markeLineEl);
    this.completeContentEl.appendChild(this.markeLineEl);
    this.setMarkeLinePosition(event);
    //获取当前行唯一id
    this.parentNodeList = [];
    this.findParent(event.target);
    // this.key = (this.parentNodeList[0] as HTMLDivElement).getAttribute("data-row-key");
    //获取当前tr
  }

  mouseUpAction(): void {
    if (!this.createEl) return;
    this.el.removeChild(this.createEl as HTMLDivElement);
    this.completeContentEl.removeChild(this.markeLineEl as HTMLDivElement);
    this.createEl = null;
    this.mouseUpCallBack();
  }
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
export class snake {
  public points: Array<IObject>; //初始蛇各点位置
  public currentDirection: string; //方向
  public bindPoints: string;
  public speed: number; //速度
  public currentPointList: Array<any>; //当前点的数量
  public pointDiameter = 2; //点的直径除以2
  public keyDownHistory: Array<any>; //键盘方向记录点
  public pointFood: Array<any>; //随机落地的食物
  private width: number; //容器的宽度
  private height: number; //容器的高度
  public snakeWidth: number; //蛇身宽度
  public criculationActionObj: IObject;
  // public keydownObj={
  //   ArrowUp:'up'
  //   ArrowRight:'right'
  //   ArrowDown
  //   ArrowLeft
  // }
  public svgEl: HTMLDivElement; //获取当前svg容器
  public rafId = 0;
  public pause: boolean; //暂停启动
  private forbidAction = {
    ArrowUp: "ArrowDown",
    ArrowDown: "ArrowUp",
    ArrowRight: "ArrowLeft",
    ArrowLeft: "ArrowRight"
  } as any;
  private score: number;
  private render: IFunction;
  private gameStatus: IObject;
  public currentGameStatus: symbol;
  constructor(public options: IObject = {}) {
    const { speed, svgEl, height, width, snakeWidth } = options;
    this.snakeWidth = snakeWidth;
    this.width = width;
    this.height = height;
    this.svgEl = svgEl;
    this.speed = speed ? speed : 1;
    this.points = [
      { cx: 80, cy: 16, direction: "ArrowDown" },
      { cx: 80, cy: 24, direction: "ArrowDown" },
      { cx: 80, cy: 32, direction: "ArrowDown" },
      { cx: 80, cy: 40, direction: "ArrowDown" },
      { cx: 80, cy: 48, direction: "ArrowDown" },
      { cx: 80, cy: 56, direction: "ArrowDown" },
      { cx: 80, cy: 64, direction: "ArrowDown" },
      { cx: 80, cy: 72, direction: "ArrowDown" }

      // { cx: 80, cy: 84, direction: "ArrowDown" },

      // { cx: 80, cy: 92, direction: "ArrowDown" },

      // { cx: 80, cy: 100, direction: "ArrowDown" },

      // { cx: 80, cy: 108, direction: "ArrowDown" },

      // { cx: 80, cy: 116, direction: "ArrowDown" },

      // { cx: 80, cy: 124, direction: "ArrowDown" },

      // { cx: 80, cy: 132, direction: "ArrowDown" },

      // { cx: 82, cy: 138, direction: "ArrowRight" }
    ];
    this.keyDownHistory = [{ cx: 80, cy: 40, direction: "ArrowDown" }];
    this.pointFood = [
      { cx: 328, cy: 40 },
      { cx: 496, cy: 480 },
      { cx: 240, cy: 224 },
      { cx: 232, cy: 296 },
      { cx: 336, cy: 304 }
    ];
    this.currentDirection = "ArrowDown";
    this.criculationActionObj = {};
    this.pause = false;
    this.score = 0;
    this.gameStatus = {
      pause: Symbol(),
      runing: Symbol(),
      reset: Symbol()
    };
    this.currentGameStatus = this.gameStatus.pause;
    this.render = function () {};
    this.eventSuspension();
    // this.rafId = 0;
    // this.createFood();
  }

  eventSuspension(): void {
    // this.criculationActionObj = criculationActionSwitch(() => {
    //   this.eat();
    //   this.move();

    //   this.action();
    //   if (!this.pointFood.length) this.createFood();
    //   if (
    //     this.points.some((item: any) => {
    //       const remainder = this.width % this.snakeWidth;
    //       return item.cx === this.width - remainder;
    //     })
    //   ) {
    //     this.criculationActionObj.isAction = false;
    //   }
    // }, 60);
    // this.criculationActionObj.action();
    this.render = () => {
      this.move();
      this.eat();
      this.action();
      if (!this.pointFood.length) this.createFood();
      this.rafId = requestAnimationFrame(this.render);
      //如果接触到墙壁,蛇头接触到身体，游戏结束
      if (
        this.points.some((item: any) => {
          const start = this.snakeWidth / 2;
          const end = this.width - this.snakeWidth / 2;
          return item.cx < start || item.cx > end || item.cy < start || item.cy > end;
        })
      ) {
        cancelAnimationFrame(this.rafId);
        // this.reset();
      }
    };
    // this.rafId = requestAnimationFrame(this.render);
    // const animloop = () => {
    //   // render();
    //   this.rafId = requestAnimationFrame(render);
    //   if (
    //     this.points.some((item: any) => {
    //       const remainder = this.width % this.snakeWidth;
    //       const val = this.width - remainder;
    //       return item.cx === val || item.cy === val;
    //     }) ||
    //     this.pause
    //   ) {
    //     cancelAnimationFrame(this.rafId);
    //   }
    // };
    // animloop();

    document.addEventListener("keydown", (event) => {
      console.log(this.forbidAction, event.key);
      if (
        this.currentDirection === event.key ||
        this.forbidAction[event.key] === this.currentDirection ||
        Object.entries(this.forbidAction).every((item) => {
          const [key, value] = item;
          return event.key !== value;
        })
      )
        return;
      const item = this.points[this.points.length - 1];
      this.keyDownHistory.push({ ...item, direction: event.key });
      this.points[this.points.length - 1].direction = event.key;
      this.currentDirection = event.key;
    });
  }

  move(): void {
    this.points = this.points.map((item, index) => {
      const findItem = this.keyDownHistory.find((childitem) => {
        return childitem.cx === item.cx && childitem.cy === item.cy;
      });
      const findIndex = this.keyDownHistory.findIndex((childitem) => {
        return childitem.cx === item.cx && childitem.cy === item.cy;
      });
      if (index === 0 && findItem) {
        this.keyDownHistory.splice(findIndex, 1);
      }
      return this.changePointer(item, findItem ? findItem.direction : item.direction)();
    });
  }

  changePointer(item: IObject, key: string): () => IObject {
    const speed = this.speed;
    return (
      {
        ArrowUp: () => {
          const L = item.cx;
          const R = item.cy - speed;
          return { cx: L, cy: R, direction: key };
        },

        ArrowRight: () => {
          const L = item.cx + speed;
          const R = item.cy;
          return { cx: L, cy: R, direction: key };
        },

        ArrowDown: () => {
          const L = item.cx;
          const R = item.cy + speed;
          return { cx: L, cy: R, direction: key };
        },
        ArrowLeft: () => {
          const L = item.cx - speed;
          const R = item.cy;
          return { cx: L, cy: R, direction: key };
        }
      } as { [key: string]: () => any }
    )[key];
  }

  eat(): void {
    //蛇吃到食物 snakeWidth
    let findIndex = -1;
    const isEat = this.points.some((item) => {
      findIndex = this.pointFood.findIndex((childitem) => {
        return (
          Math.abs(childitem.cx - item.cx) < this.snakeWidth &&
          Math.abs(childitem.cy - item.cy) < this.snakeWidth
        );
      });

      return this.pointFood.some((childitem) => {
        return (
          Math.abs(childitem.cx - item.cx) < this.snakeWidth &&
          Math.abs(childitem.cy - item.cy) < this.snakeWidth
        );
      });
    });

    if (findIndex >= 0) {
      //把新点丢到最后一个点后面
      const lastPoint = Object.assign({}, this.points[this.points.length - 1]);
      if (this.currentDirection === "ArrowUp") lastPoint.cy = lastPoint.cy - 8;
      if (this.currentDirection === "ArrowRight") lastPoint.cx = lastPoint.cx + 8;
      if (this.currentDirection === "ArrowDown") lastPoint.cy = lastPoint.cy + 8;
      if (this.currentDirection === "ArrowLeft") lastPoint.cx = lastPoint.cx - 8;
      this.points.push({ ...lastPoint, direction: this.currentDirection });
      this.pointFood.splice(findIndex, 1);
    }
    if (isEat) {
      this.score++;
      // this.criculationActionObj.isAction = false;
      //cancelAnimationFrame(this.rafId);
    }
  }
  //创造随机食物
  createFood(): void {
    const list = [];
    let result = [];
    const top = Math.floor(this.width / 8);
    for (let i = 1; i <= top; i++) {
      list.push(this.snakeWidth * i);
    }
    for (let i = 0; i < list.length; i++) {
      for (let index = 0; index < list.length; index++) {
        result.push({ cx: list[i], cy: list[index] });
      }
    }
    //过滤出蛇身
    result = result.filter((item) => {
      return !this.points.some((childitem) => {
        return childitem.cx === item.cx && childitem.cy === item.cy;
      });
    });
    const arr = [];
    for (let i = 0; i < 100; i++) {
      const len = result.length;
      const index = Math.round(len * Math.random());
      this.pointFood.push(result[index]);
    }
  }

  touchBody(): boolean {
    const snakehead = this.points[this.points.length - 1];
    return this.points.slice(0, this.points.length - 5).some((item: any) => {
      return (
        Math.abs(snakehead.cx - item.cx) < this.snakeWidth &&
        Math.abs(snakehead.cy - item.cy) < this.snakeWidth
      );
    });
  }

  stop(): void {
    if (this.currentDirection === this.gameStatus.pause) return;
    this.currentGameStatus = this.gameStatus.pause;

    cancelAnimationFrame(this.rafId);
  }
  continue(): void {}
  start(): void {
    if (this.currentGameStatus === this.gameStatus.runing) return;
    this.currentGameStatus = this.gameStatus.runing;

    this.rafId = requestAnimationFrame(this.render);
  }
  reset(): void {
    if (this.currentDirection === this.gameStatus.reset) return;
    this.currentGameStatus = this.gameStatus.reset;

    this.points = [{ cx: 80, cy: 16, direction: "ArrowDown" }];
    this.keyDownHistory = [{ cx: 80, cy: 40, direction: "ArrowDown" }];
    this.pointFood = [];
    this.score = 0;
  }
  action(): void {}
}

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

//three3D创建类
import { Depth, LayerMaterial } from "lamina/vanilla";

// import gsap from "gsap";
export class ThreeBasic {
  THREE: IObject;
  El: HTMLDivElement; //元素
  renderer: IObject; //构造器
  width: number; //容器宽
  height: number; //容器高
  camera: IObject; //相机
  scene: IObject; //场景
  light: IObject; //灯光
  raycaster: IObject; //光线投射
  mouse: IObject; //光线投射鼠标
  controls: IObject; //控制器对象

  url: string; //基础模型路径
  assistTools: boolean; //是否显示辅助工具

  loading: boolean; //模型加载完成之前的遮罩及进度条
  progress: number; //模型加载进度百分比

  constructor(param: IObject) {
    this.THREE = param.THREE;
    this.El = param.El;
    this.url = param.url;
    this.renderer = {};
    this.width = param.El.offsetWidth;
    this.height = param.El.offsetHeight;
    this.camera = {};
    this.scene = {};
    this.light = {};
    this.raycaster = {};
    this.mouse = {};
    this.controls = {};
    this.assistTools = param.assistTools;
    this.loading = true;
    this.progress = 0;
    this.draw();
  }

  // get fullname(): number {
  //   console.log(this.progress, 11);
  //   return this.progress;
  // }

  draw(): void {
    this.initRender();
    this.initScene();
    this.initCamera();
    this.initLight();
    if (this.assistTools) {
      this.setAxesHelper();
      this.setGridHelper();
    }

    this.load3DModel();
    this.initControls();
    this.setRaycaster();

    const animate = () => {
      // 更新控制器
      this.render();

      // 更新性能插件
      //stats.update();

      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(animate);
    };
    animate();
  }

  initRender(): void {
    // 初始化场景构造器
    this.renderer = new this.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xaaaaaa);
    // renderer.setClearColor(0xb9d3ff, 1)
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = this.THREE.sRGBEncoding; //让模型看上去更真实,模型更亮
    this.renderer.toneMapping = this.THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.El.appendChild(this.renderer.domElement);
  }
  initScene(): void {
    this.scene = new this.THREE.Scene();
    //scene.background = new THREE.Color(0x010e31); //增加背景
    // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);//增加浓雾

    const cube = new this.THREE.Mesh(
      new this.THREE.BoxGeometry(0.05, 0.05, 0.05),
      new this.THREE.MeshBasicMaterial({
        color: new this.THREE.Color("rgb(41,55,109)")
      })
    );

    cube.position.set(0, 0.35, 0);

    this.scene.add(cube);

    // gsap.fromTo(
    //   cube.position,
    //   {
    //     z: -0.05
    //   },
    //   {
    //     z: 0.5,
    //     duration: 10,
    //     yoyo: false,
    //     repeat: 1,
    //     ease: "sine.inOut"
    //   }
    // );
  }
  initCamera(): void {
    //初始化相机位置及朝向
    this.camera = new this.THREE.PerspectiveCamera(35, this.width / this.height);
    this.camera.position.set(0, 0.7, 0.85);
    this.camera.lookAt({
      // 相机看向哪个坐标
      x: 0,
      y: 0,
      z: 0
    });
  }

  initLight(): void {
    //初始化光照
    this.light = new this.THREE.DirectionalLight(0xffffff, 1); //平行光(相当于太阳光)
    this.light.position.set(60, 100, 40);
    this.light.castShadow = true;
    //   light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2.2);
    //scene.add(light);
    //更亮的室内环境光，模拟threejs官方在线编辑界面
    // const pmremGenerator = new THREE.PMREMGenerator(renderer);
    // pmremGenerator.compileEquirectangularShader();
    // scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.5).texture;
    //环境光
    const ambientLight = new this.THREE.AmbientLight(0x404040); //环境光 无阴影
    ambientLight.intensity = 1;
    this.scene.add(ambientLight);

    //添加舞台聚光灯,点光源，能造阴影
    const bigSpotLight = new this.THREE.SpotLight("#ffffff", 2);
    bigSpotLight.angle = Math.PI / 8;
    bigSpotLight.penumbra = 0.2;
    bigSpotLight.decay = 2;
    bigSpotLight.distance = 30;
    bigSpotLight.position.set(0, 10, 0);
    bigSpotLight.target.position.set(0, 0, 0);
    // scene.add(bigSpotLight.target);
    this.scene.add(bigSpotLight);

    //有时候模型不管什么光都会有暗淡的状况(需要自行增加)
    const virtualScene = new this.THREE.Scene();
    const fbo = new this.THREE.WebGLCubeRenderTarget(256);
    fbo.texture.type = this.THREE.HalfFloatType;
    const cubeCamera = new this.THREE.CubeCamera(1, 1000, fbo);

    virtualScene.add(cubeCamera);

    // 天花板灯
    const topLight = this.generateVirtualLight({
      intensity: 1.75,
      scale: [10, 10, 1],
      position: [0, 5, -9],
      rotation: [Math.PI / 2, 0, 0]
    });

    const leftTopLight = this.generateVirtualLight({
      intensity: 4,
      scale: [20, 0.1, 1],
      position: [-5, 1, -1],
      rotation: [0, Math.PI / 2, 0]
    });
    const leftBottomLight = this.generateVirtualLight({
      intensity: 1.5,
      scale: [20, 0.5, 1],
      position: [-5, -1, -1],
      rotation: [0, Math.PI / 2, 0]
    });
    const rightTopLight = this.generateVirtualLight({
      intensity: 1.5,
      scale: [20, 1, 1],
      position: [10, 1, 0],
      rotation: [0, -Math.PI / 2, 0]
    });

    const floatLight = this.generateVirtualLight({
      form: "ring",
      color: "white",
      intensity: 2,
      scale: 10,
      position: [-15, 4, -18],
      target: [0, 0, 0]
    });

    const floatLightOther = this.generateVirtualLight({
      form: "ring",
      color: "white",
      intensity: 2,
      scale: 10,
      position: [10, 4, 18],
      target: [0, 0, 0]
    });

    virtualScene.add(topLight);
    virtualScene.add(leftTopLight);
    virtualScene.add(leftBottomLight);
    virtualScene.add(rightTopLight);
    virtualScene.add(floatLight);
    virtualScene.add(floatLightOther);

    this.scene.environment = fbo.texture;

    const materials = new LayerMaterial({
      color: "#444",
      layers: [
        new Depth({
          colorA: "#2de8cd",
          colorB: "black",
          alpha: 0.5,
          mode: "normal",
          near: 0,
          far: 300,
          origin: new this.THREE.Vector3(100, 100, 100)
        })
      ]
    });
    (materials as any).side = 1;

    const geometry = new this.THREE.SphereGeometry(1, 64, 64);

    const virtualBackgroundMesh = new this.THREE.Mesh(geometry, materials);
    virtualBackgroundMesh.scale.set(100, 100, 100);
    virtualScene.add(virtualBackgroundMesh);

    //模拟threejs/editor 实现光照
    // const peremGenerator = new this.THREE.PMREMGenerator(this.renderer);
    // peremGenerator.compileEquirectangularShader();
    // this.scene.environment = peremGenerator.fromScene(
    //   new this.THREE.RoomEnvironment(),
    //   0.04
    // ).texture;
    //替代方案，虚拟光
    const virtualRender = () => {
      cubeCamera.update(this.renderer, virtualScene);
      requestAnimationFrame(virtualRender);
    };
    virtualRender();
  }

  // initModel() {}
  //

  //虚拟环境光(原理：插入白色材料，反射光到模型上)
  generateVirtualLight({
    THREE = this.THREE,
    form = "rect",
    intensity = 1,
    color = "white",
    scale = [1, 1, 1],
    toneMapped = false,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    target
  }: IObject): IObject {
    scale = Array.isArray(scale) && scale.length === 2 ? [scale[0], scale[1], 1] : scale;

    let geometry;
    if (form === "circle") {
      geometry = new THREE.RingGeometry(0, 1, 64);
    }
    if (form === "ring") {
      geometry = new THREE.RingGeometry(0.5, 1, 64);
    }
    if (form === "rect") {
      geometry = new THREE.PlaneGeometry();
    }

    const material = new THREE.MeshBasicMaterial({
      toneMapped: toneMapped,
      side: THREE.DoubleSide,
      color: color
    });

    material.color.multiplyScalar(intensity);

    const mesh = new THREE.Mesh(geometry, material);
    Array.isArray(scale) ? mesh.scale.set(...scale) : mesh.scale.set(scale, scale, scale);

    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    if (target) {
      mesh.lookAt(new THREE.Vector3(...target));
    }
    return mesh;
  }

  async load3DModel(): Promise<void> {
    if (!this.url) return;
    //监测模型加载进度
    const manager = new this.THREE.LoadingManager();
    manager.onProgress = (url: any, loaded: number, total: number) => {
      console.log((loaded / total) * 100, loaded, total);
      this.progress = (loaded / total) * 100;
      if (this.progress === 100) {
        this.loading = false;
      }
    };

    //加载gltf配置
    console.log(this.THREE.DRACOLoader);
    const dracoLoader = new this.THREE.DRACOLoader();
    dracoLoader.setDecoderPath("./threejs/draco/gltf/");
    const loaderGLTF = new this.THREE.GLTFLoader(manager);
    loaderGLTF.setDRACOLoader(dracoLoader);

    loaderGLTF.load(this.url, (gltf: any) => {
      const model = gltf.scene;
      console.log(model);
      model.scale.set(0.01, 0.01, 0.01);
      model.position.set(0, 0, 0);
      model.traverse((item: any, index: any) => {
        console.log(item);
        if (item.material && item.material.name === "材质.3") {
          item.material.color.set("#099595");
        }
      });
      this.scene.add(model);
    });
  }

  //添加光线投射，以便点击找到对应模型
  setRaycaster(): void {
    console.log(this);
    this.raycaster = new this.THREE.Raycaster();
    this.mouse = new this.THREE.Vector2();
  }

  initControls(): void {
    console.log(this);
    this.controls = new this.THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = 1.5;
    this.controls.enableDamping = false; //旋转是否由惯性
    this.controls.enableZoom = true; //缩放

    this.controls.autoRotate = false; //自动旋转
    this.controls.autoRotateSpeed = 3;

    this.controls.minDistance = 0; // 设置相机距离原点的最近距离

    this.controls.maxDistance = 80000; // 设置相机距离原点的最远距离

    this.controls.enablePan = true; // 是否开启右键拖拽
  }

  //x和y轴辅助线(辅助开发)
  setAxesHelper(): void {
    const helper = new this.THREE.AxesHelper(500000);

    this.scene.add(helper);
    console.log(this.scene, helper);
  }

  //添加网格地板(辅助开发)
  setGridHelper(): void {
    const grid = new this.THREE.GridHelper(20000, 200, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  render(): void {
    this.controls.update();
  }

  // animate(): void {
  //   // 更新控制器
  //   console.log(this);
  //   this.controls.update();
  //   // 更新性能插件
  //   //stats.update();
  //   this.renderer.render(this.scene, this.camera);
  //   // requestAnimationFrame(this.animate);
  // }

  //管理加载进度

  // setLoading(): void {
  //   const manager = new this.THREE.LoadingManager();
  //   manager.onProgress = async (url: any, loaded: any, total: any) => {
  //     if (Math.floor((loaded / total) * 100) === 100) {
  //       this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
  //       Animations.animateCamera(
  //         camera,
  //         controls,
  //         { x: 0, y: 40, z: 140 },
  //         { x: 0, y: 0, z: 0 },
  //         4000,
  //         () => {
  //           this.setState({ sceneReady: true });
  //         }
  //       );
  //     } else {
  //       this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
  //     }
  //   };
  //   const loader = new GLTFLoader(manager);
  //   loader.load(islandModel, (mesh) => {
  //     mesh.scene.traverse((child) => {
  //       if (child.isMesh) {
  //         child.material.metalness = 0.4;
  //         child.material.roughness = 0.6;
  //       }
  //     });
  //     mesh.scene.position.set(0, -2, 0);
  //     mesh.scene.scale.set(33, 33, 33);
  //     scene.add(mesh.scene);
  //   });
  // }
}
