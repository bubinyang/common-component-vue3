<template>
  <div>
    <el-button type="primary" @click="echartsExport">主要按钮</el-button>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
export default {
  name: "ExportImage",
  props: {
    el: {
      type: String,
      default: () => ""
    },
    textName: {
      type: String,
      default: () => ""
    }
  },
  methods: {
    echartsExport() {
      if (!this.el) {
        this.$message({
          message: "无节点",
          type: "warning"
        });
        return;
      }
      html2canvas(document.querySelector(this.el)).then((canvas) => {
        this.imgUrl = canvas.toDataURL("image/png");
        var eleLink = document.createElement("a");
        eleLink.href = this.imgUrl; // 转换后的图片地址
        eleLink.download = this.textName;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      });
    }
  }
};
</script>
