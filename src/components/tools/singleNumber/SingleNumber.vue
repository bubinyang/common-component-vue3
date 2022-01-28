<template>
  <div class="box-i">
    <div
      ref="numberItem"
      :class="pramsColor==='yellow'?'box-item-i yellow':'box-item-i'"
      :style="transformStyle">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
    </div>
  </div>
</template>
<script>
const getStartNumber = function(num) {
  if (num < 3) return 10 + num - 3;
  return num - 3;
};

export default {
  props: {
    num: {
      type: Number,
      default: 0
    },
    pramsColor: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      theNumber: '',
      startNum: '',
      position: 0,
      transformTime: 0
    };
  },
  computed: {
    transformStyle() {
      return `transform: translate(0%, ${this.position}%); transition: transform ${this.transformTime}s ease-in-out;`;
    }
  },
  watch: {
    num: {
      handler(value) {
        if (this.startNum === '') {
          this.startNum = getStartNumber(value);
          this.position = -this.startNum * 5;
          this.transformTime = 0;
        }
        this.theNumber = value;
        setTimeout(() => {
          this.setNumberTransform();
        }, 10);
      },
      immediate: true
    }
  },
  methods: {
    // 设置文字滚动
    setNumberTransform() {
      this.transformTime = 1;
      if (this.startNum > this.theNumber) {
        this.position = -((10 + this.theNumber) * 5);
        setTimeout(() => {
          this.transformTime = 0;
          this.position = -(this.theNumber * 5);
        }, 1010);
      } else {
        this.position = -(this.theNumber * 5);
      }
      this.startNum = this.theNumber;
    }
  }
};
</script>
<style scoped lang='scss'>
    .box-i {
        position: relative;
        width: 28px;
        height: 46px;
        overflow: hidden;

        .box-item-i {
            position: relative;
            top: 0px;
            left: 0px;
            width: 28px;
            height: 920px;
            div{
                font-style: normal;
                font-size: 36px;
                font-weight: bold;
                /*color: rgba(255, 255, 255, 1);*/
                color: #FF972E;
                /*text-shadow: 0px 0px 4px rgba(255, 255, 255, 1);*/
                width: 28px;
                text-align: center;
            }
        }
    }
    .yellow{
        color: rgba(255, 236, 0, 1)!important;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5), 0px 0px 4px rgba(255, 249, 178, 1)!important;
    }
</style>
