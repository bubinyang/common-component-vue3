// import { setGuid } from '@/utils';
import ChangeYearMonthDayProps from "@/packages/Widget/changeYearMonthDay/prop.js";
// import { once, findMax } from '@/utils';
const originList = [
  {
    type: "tools",
    name: "执行一次方法",
    detail: "只执行一次的方法，不能执行第二次，用到了闭包的知识",
    code: "tools-1",
    fun: `
        function once(fn) {
          let done = false;
          return function() {
            return done ? undefined : ((done = true), fn.apply(this, arguments))
          }
        };
        const dpayment = once((param) => {
          console.log(param)
        });
        dpayment('hehe');
        dpayment()
    `
  },

  {
    type: "tools",
    name: "找出最大最小值",
    detail: "只执行一次的方法，不能执行第二次，用到了闭包的知识",
    code: "tools-2",
    fun: `function findMax({ origin, key, type = 'max' }) {
          const condition = function(total, key, item) {
            return {
              max() { return key ? total[key] < item[key] : total < item },
              min() { return key ? total[key] > item[key] : total > item }
            }
          };

          return origin.reduce((total, item) => {

            return total
          }, 0);

        };`
  },

  {
    type: "tools",
    name: "保留几位小数,去除多余0",
    detail: "保留小数,不会出现补0情况,支持千分位,百分位增加逗号",
    code: "tools-3",
    explain: [
      { name: "val", state: "数据源", type: "[Number,String]" },
      { name: "num", state: "保留小数位", type: "Number" },
      { name: "standard", state: "千分位，百分位等位数,逗号摆放位置", type: "Number" }
    ],
    fun: `function setToFixed({val, num = 1, standard = 0}) {
      let assistDec = 1;
      for (let i = 0; i < num; i++) {
        assistDec *= 10;
      }
      if (val === '' || val === null || val === undefined || isNaN(val)) return '';
      if (Object.is(val, NaN)) return 0;
      if (!assistDec) return Math.round(Number(val));
      const finalVal = Math.round(Number(val) * assistDec) / assistDec;
      const findValStr = finalVal.toString();
      const list = findValStr.split('.');
      const reverList = list[0].split('');
      reverList.reverse();
      const pointList = reverList.reduce((total, item, index) => {
        total.push(item);
        if (standard) {
          if ((index + 1) % standard === 0 && !isNaN(item) && reverList.length > standard) {
            total.push(',');
          }
        }
        return total;
      }, []);
      pointList.reverse();
      if (list[1]) {
        return pointList.join('')+'.'+list[1];
      } else {
        return pointList.join('');
      }
    }
    console.log(setToFixed({val:1655587887.5555, num:1, standard:3}))
    `
  },

  {
    type: "component",
    name: "快捷编辑",
    deail: "点击后快速编辑内容",
    code: "component-1",
    templete: `<LabelInputSwitch v-model="color" type="select" :options="options" />`,
    fun: `
      data: function() {
        return {
          color: 'red',
          options: [{ label: '红色', value: 'red' }, { label: '蓝色', value: 'blue' }],
        };
      }
    `
  },

  {
    type: "component",
    name: "编辑日期",
    deail: "切换年月日编辑不同类型的日期",
    code: "component-2",
    explain: ChangeYearMonthDayProps,
    templete: `<ChangeYearMonthDay
      v-model:dateOption="dateOption"
      :addHours="0"
      :multiple="true"
      :increase="true"
      :type-list="['year', 'allyear']"
      :typeListMutiple="['allyear']"
      :intervalTimeValue="{ realtime: 1, day: 1, month: 1, year: 1,allyear:1}"
    ></ChangeYearMonthDay>`,
    fun: `data:function(){
     return{
        dateOption:{
          type:'year',
          date:'',
          dateOther:''   
      }
     }
    }`
  },

  {
    type: "component",
    name: "左右布局",
    deail: "左右布局主体",
    keyWord: "layout",
    code: "component-3",
    templete: `<SideLayout>
    <template #side></template>
    <template #main></template>
    </SideLayout>`,
    fun: ``
  },

  {
    type: "component",
    name: "上下布局",
    deail: "上下布局主体",
    keyWord: "layout",
    code: "component-4",
    templete: `<ContainLayout>
    <template #action></template>
    <template #contain></template>
    </ContainLayout>`,
    fun: ``
  },

  {
    type: "component",
    name: "全屏按钮",
    deail: "展示框全屏显示",
    code: "component-5",
    templete: `<ExpandButton></ExpandButton>`,
    fun: ``
  },

  {
    type: "component",
    name: "快速编辑",
    deail: "点击内容快速编辑",
    code: "component-6",
    templete: `<LabelInputSwitch v-model="value" type="select" :options="options"></LabelInputSwitch>`,
    fun: `data:function(){
      return{
        value:'red',
        options: [{ label: '红色', value: 'red' }, { label: '蓝色', value: 'blue' }],
      }
     }`
  },

  {
    type: "component",
    name: "下拉选项显示树形结构",
    deail: "下来选项有父子结构，树形结构",
    code: "component-7",
    templete: `<InputTree :keyType="{label: 'name',children: 'childs'}" v-model="value" :origin='treeList'></InputTree>`,
    fun: `data:function(){
      return{
        value:'',
        treeList: [
                { name: '颜色', id: '1415499924753809410',
                childs:[
                  {name:'红色',id:'1415499396971954177'},
                  {name:'蓝色',id:'1415499396971954174'}
                ]
        }],
      }
     }`
  }
];

// 将props设置成可读的表格数据，进行展示
originList.forEach((item) => {
  if (item.type === "component" && item.explain) {
    item.explain = Object.keys(item.explain).map((key) => {
      return {
        name: key,
        state: item.explain[key].state,
        type: Object.prototype.toString.call(item.explain[key].type()),
        default: JSON.stringify(item.explain[key].default())
      };
    });
  }
});
console.log(originList);
export default originList;

// export default originList.map(item => {
//   item.code = setGuid();
//   return item;
// });
