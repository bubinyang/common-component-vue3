<template>
  <section class="toolist-style">
    <div class="item-list-contain">
      <ul>
        <li
          v-for="(item, index) in origin"
          :key="index"
          :class="{ activeStyle: activeIndex === item.code }"
          @click="showContent(item.code)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="edit-interface">
      <section id="stageContain" class="edit-room-style">
        <div class="edit-room-top">
          <div class="html-contain">
            <Editor
              :language="'html'"
              :codes="htmlCodes"
              @onCodeChange="htmlOnCodeChange"
              @emitVal="getEditValue"
            />
          </div>

          <!-- <div class="css-contain">
            <Editor
              :language="'css'"
              :codes="cssCodes"
              @onCodeChange="cssOnCodeChange"
            />
          </div> -->

          <div class="javascript-contain">
            <Editor
              :language="'javascript'"
              :codes="javascriptCodes"
              @onCodeChange="javascriptCodeChange"
              @emitVal="getEditValue"
            />
          </div>
        </div>

        <div
          v-loading="iframeLoading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="edit-room-bottom"
        >
          <iframe
            ref="stageContainIframe"
            name="editIframe"
            class="stageContainIframe"
            frameborder="0"
            src="/#/editIframe"
          />
        </div>
      </section>

      <section class="prop-explain-style" style="boder: 1px solid">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="name" label="参数" width="180" />
          <el-table-column prop="state" label="说明" />
          <el-table-column width="180" prop="type" label="类型" />

          <el-table-column width="250" prop="default" label="默认值" />
        </el-table>
      </section>
    </div>
  </section>
</template>
<script>
import origin from "@/utils/origin";
// import { strToJson } from '@/utils';
// import Vue from 'vue';
const languages = {
  html: "htmlCodes",
  css: "cssCodes",
  javascript: "javascriptCodes"
};
export default {
  name: "ToolList",
  data() {
    return {
      origin,
      htmlCodes: "",
      javascriptCodes: "",
      cssCodes: "",
      iFrameEl: "",
      iframeLoading: false,
      activeIndex: "",

      tableData: []
    };
  },
  computed: {
    // activeStyle(){
    //   return {
    //      "background-color":"#409eff",
    //      "color":"white"
    //   }
    // }
  },
  mounted() {
    // function throttle(action, ms) {
    //   let startTime = 0;
    //   return function () {
    //     const currentTime = +new Date();

    //     if (currentTime - startTime > ms) {
    //       action();
    //       startTime = new Date();
    //     }
    //   };
    // }
    function throttle(func, wait) {
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
    window.addEventListener(
      "resize",
      throttle(function () {
        window.location.reload();
      }, 500)
    );
    this.iFrameEl = this.$refs["stageContainIframe"];
    const { id } = this.$route.params;
    if (!id) {
      console.error("路由未接受到参数,请检查");
      return;
    }
    this.showContent(id);
    this.iframeLoad();
  },
  methods: {
    htmlOnCodeChange() {},
    cssOnCodeChange() {},
    javascriptCodeChange() {},

    getEditValue(val) {
      const { language, editValue } = val;
      this[languages[language]] = editValue;
      // this.compile();
      this.iframeReload();
      // this.iFrameEl.contentWindow.location.reload()
      // this.iFrameEl.onload = () => {
      //   this.compile()
      // }
    },

    compile() {
      const jscode = this.javascriptCodes.replace(/([\n\r]+)/g, "");
      const extendParam = {
        obj: this.javascriptCodes,
        template: this.htmlCodes,
        type: this.item.type
      };
      this.iFrameEl.contentWindow.postMessage(extendParam, "*");
    },

    showContent(id) {
      this.activeIndex = id;
      this.item = origin.find((item) => item.code === id);
      this.$router.push({ name: "ToolListDetail", params: { id } });
      if (this.item.type === "tools") {
        this.htmlCodes = "";
        this.javascriptCodes = `${this.item.fun.toString()}`;
      } else {
        this.htmlCodes = this.item.templete;
        this.javascriptCodes = `{
           ${this.item.fun.toString()}
        }`;
      }
      this.tableData = this.item.explain;
      this.iframeReload();
    },
    iframeLoad() {
      this.iframeLoading = true;
      this.iFrameEl.onload = () => {
        setTimeout(() => {
          this.compile();
        }, 1000);

        this.iframeLoading = false;
      };
    },
    iframeReload() {
      this.iFrameEl.contentWindow.location.reload();
      this.iframeLoad();
    },

    javascriptCodesType(type) {
      return {
        tools(item) {
          return `{
            created(){${item.fun}}
          }`;
        }
      }[type];
    },
    routePush(id) {
      this.$router.push({ name: "ToolListDetail", params: { id } });
      //   this.$router.go(0);
    }
  }
};
</script>
<style lang="scss">
// @import "@/style/extend.scss";
.toolist-style {
  height: 100vh;
  display: flex;
  padding: 10px;
  background: #222;
  .item-list-contain {
    flex: 0 0 200px;
    margin-right: 10px;
    background: linear-gradient(#313131, #131313);
    color: rgb(153, 153, 153);

    ul li {
      cursor: pointer;
      text-align: left;
      border-bottom: 1px solid black;
      padding: 7px 5px 6px 8px;
    }
  }
  .edit-interface {
    flex: 1;
    overflow-y: auto;
  }

  .edit-room-style {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .edit-room-top {
      display: flex;
      flex: 0 0 500px;
      & > div {
        flex: 1;
      }
    }
    .edit-room-bottom {
      margin-top: 10px;
      flex: 1;
      background: white;
    }
    .stageContainIframe {
      width: 100%;
      height: 100%;
      padding: 5px;
      // @extend .cardShow;
    }
  }
  .activeStyle {
    // background-color: #409eff;
    color: white;
  }
}
</style>
