<template>
  <section class="base-header">
    <div class="base-header-left">
      <SvgIcon :name="collapse ? 'grow' : 'shrink'" @click="switchSlider"></SvgIcon>
      <breadcrumb></breadcrumb>
    </div>

    <div class="base-header-right">
      <SvgIcon
        @click="fullscreen"
        :name="!isFullscreen ? 'fullscreen2' : 'tuichuquanping'"
      ></SvgIcon>

      <div class="user-container">
        <!-- <img :src="userLogo" :alt="props.userName" style="width: 30px; height: 30px; border-radius: 50%; margin-top: 3px; margin-right: 5px" /> -->
        <el-dropdown @command="onClickUserMenus">
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item icon="el-icon-lock" command="/user/password"> 1 </el-dropdown-item> -->
              <el-dropdown-item icon="el-icon-switch-button" divided command="/login">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
          <span class="el-dropdown-link" style="line-height: 50px">
            用户
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </el-dropdown>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive, provide, ref, nextTick, watch, toRefs } from "vue";
import breadcrumb from "./breadcrumb.vue";
import emits from "@/utils/emit.js";
import screenfull from "screenfull";
import { setThemeCacheOfConfig } from "@/utils/theme.js";
import { ElMessageBox } from "element-plus";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export default {
  components: { breadcrumb },
  setup() {
    const router = useRouter();

    const state = reactive({ isShow: false, isFullscreen: false, collapse: false });
    const switchSlider = () => {
      state.collapse = !state.collapse;
      setThemeCacheOfConfig("baseSliderCollapse", state.collapse);
      emits.emit("switchSlider");
      emits.emit("emitTheme");
    };
    const fullscreen = () => {
      state.isFullscreen = !state.isFullscreen;
      screenfull.toggle();
    };

    const onClickUserMenus = () => {
      ElMessageBox.confirm("确定进行退出操作?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Cookies.remove("token", "abcde");
          router.replace("/login");
        })
        .catch(() => {});
    };
    return { ...toRefs(state), switchSlider, fullscreen, onClickUserMenus };
  }
};
</script>
