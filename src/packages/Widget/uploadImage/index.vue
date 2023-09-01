<template>
  <el-upload
    ref="upload"
    :headers="headerObj"
    v-bind="$attrs"
    :on-success="handleAvatarSuccess"
    :file-list="fileList"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :accept="$attrs.listType === 'picture-card' ? accept : ''"
    :before-upload="beforeAvatarUpload"
  >
    <el-button v-if="!isPictureCard" size="small" type="primary">点击上传</el-button>
    <i v-if="isPictureCard" class="el-icon-plus"></i>
  </el-upload>
  <a :href="downloadFileUrl" ref="downFileHrefEl"> </a>
  <el-dialog v-model="dialogVisible">
    <img style="width: 100%" :src="dialogImageUrl" alt="" />
  </el-dialog>
</template>
<script>
import { defineAsyncComponent, reactive, ref, toRefs, computed, onBeforeMount } from "vue";
// import { getToken } from "@/utils/cache";
// import { deepClone } from "@/utils/utils.ts";

// import app from "@/constants/app";
import { deepClone } from "@/utils/index.js";
const app = { api: "" };
const token = "";
export default {
  props: {
    modelValue: [Array, String],
    accept: {
      type: String,
      default() {
        return ".jpg,.png,.gif";
      }
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        if (!val) {
          return;
        }
        this.fileList = deepClone(val);
        // this.fileList = modelList.map((item) => {
        //   if (item.url) item.url = item.url.includes(app.apiDownl) ? item.url : `${app.apiDownl}${item.url}`;
        //   return item;
        // });
      },
      immediate: true
    }
  },

  setup(props, context) {
    const disabled = ref(false);
    const url = ref(``);

    const fileList = reactive([]);

    const isPictureCard = computed(() => context.attrs.listType === "picture-card");

    const headerObj = reactive({
      ContentType: "multipart/form-data",
      token: token
    });

    return {
      headerObj,
      isPictureCard,
      fileList,
      disabled,
      url
    };
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      downloadFileUrl: ""
    };
  },

  methods: {
    //点击文件标题，实现下载功能
    handlePreview(file) {
      if (this.isPictureCard) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      } else {
        // const pathVal = file.url.replace(app.apiDownl, "");
        this.downloadFileUrl = `${app.api}/lrd-admin/sys/oss/download?path=${file.url}&fileName=${file.name}`;
        this.$nextTick(() => {
          this.$refs["downFileHrefEl"].click();
        });
      }
    },
    //删除某个文件实时更新modelValue
    handleRemove(file) {
      const index = this.modelValue.findIndex((item) => item.id === file.id);
      let list = this.modelValue;
      list.splice(index, 1);
      this.$emit("update:modelValue", list);
    },
    //上传成功后把文件信息list抛出去给到外部
    handleAvatarSuccess(response, file, fileLists) {
      const list = fileLists.map((item) => {
        return {
          name: item.name,
          url: item.response ? item.response.data.src : item.url,
          fileType: item.response ? item.response.data.fileType : "未知类型",
          isAdd: true
        };
      });

      this.$emit("emitFile", list);
    },
    beforeAvatarUpload(file) {}
  },

  emits: ["update:modelValue", "emitFile"]
};
</script>
