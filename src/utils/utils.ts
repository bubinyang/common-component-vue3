/**
 * 背景:看板过多，经常要开发各种能源数据展示看板，属性对应的实时，日月年，能源接口固定，数据结构固定
 * 针对固定内容封装出一个专门产出 供echart展示的数据结构的类。该类可以进行改变属性方法应对其他非能源结构数据的接口
 * echart展示使用装饰器思想进行封装
 */
interface IObject<T = any> {
  [key: string]: T;
}
interface IFunction<T = any> {
  (x?: any): T;
}

import moment from "moment";
// import { newSetDialogPosition } from "@/utils";

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
  constructor(public el: HTMLDivElement, options: IObject) {
    super(el, options);
    this.createEl = null;
    this.markeLineEl = null;
    this.parentNodeList = [];
    this.name = "";
    this.alowSort = true;
    this.mouseUpCallBack = function () {};
  }
  private newSetDialogPosition(el: string, options: IObject): SetDialogPosition {
    return new SetDialogPosition(el, options);
  }

  moveScroll(): void {
    // console.log(event.target);
    console.log("被滚动");
  }
  moveAction(event: MouseEvent): void {
    const position: IObject = this.newSetDialogPosition(".aTable-style", {
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

    this.parentNodeList = [];
    this.findParent(event.target);

    const trEl = this.parentNodeList[0] as HTMLDivElement;
    const currentKey = trEl?.getAttribute("data-row-key");
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
    if (dom) {
      if (!this.parentNodeList.length && (dom as HTMLDivElement).parentNode?.nodeName == "TR") {
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

    const position: any = this.newSetDialogPosition(".aTable-style", {
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
  constructor(public containElName: string, options: IObject) {
    const { eventItem, dialogElName, dialogEl, defaultPosition } = options;
    this.eventItem = eventItem;

    if (!containElName || (!dialogElName && !dialogEl)) {
      console.log("传参有问题，请检查");
      return;
    }
    this.dialogEl = document.querySelector(dialogElName) || dialogEl;
    this.containEl = document.querySelector(containElName) as HTMLDivElement;
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
