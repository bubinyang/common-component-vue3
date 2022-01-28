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
        {{ iframeLoading }}
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
        <el-table :data="tableData" style="width: 100%">
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
    function throttle(action, ms) {
      const startTime = 0;
      return function () {
        const currentTime = +new Date();
        if (currentTime - startTime > ms) {
          action();
        }
      };
    }
    window.addEventListener(
      "resize",
      throttle(function () {
        console.log(11);
      })
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

    // getEditValue(val) {
    //   this.iframeLoading = true
    //   const { language, editValue } = val
    //   this[languages[language]] = editValue
    //   this.iFrameEl.contentWindow.location.reload()
    //   this.iFrameEl.onload = () => {
    //     this.compile()
    //     this.iframeLoading = false
    //   }
    // },

    getEditValue(val) {
      const { language, editValue } = val;
      this[languages[language]] = editValue;
      console.log(val);
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
      console.log(extendParam, "extendParam");
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
        console.log("加载完成");
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
  height: 100%;
  display: flex;
  padding: 10px;
  .item-list-contain {
    flex: 0 0 200px;
    ul li {
      cursor: pointer;
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
    }
    .stageContainIframe {
      width: 100%;
      height: 100%;
      padding: 5px;
      // @extend .cardShow;
    }
  }
  .activeStyle {
    background-color: #409eff;
    color: white;
  }
}
</style>
