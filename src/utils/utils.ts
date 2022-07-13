/**
 * 背景:看板过多，经常要开发各种能源数据展示看板，属性对应的实时，日月年，能源接口固定，数据结构固定
 * 针对固定内容封装出一个专门产出 供echart展示的数据结构的类。该类可以进行改变属性方法应对其他非能源结构数据的接口
 * echart展示使用装饰器思想进行封装
 */
interface IObject<T = any> {
  [key: string]: T;
}
import moment from "moment";

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
