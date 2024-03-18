<template>
  <!-- <el-form label-width="100px" :model="formLabelAlign" style="max-width: 460px">
    <el-form-item label="用户名">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="formLabelAlign.password" />
    </el-form-item>

    <el-form-item>
      <el-button @click="submit">登录</el-button>
    </el-form-item>
  </el-form> -->

  <div class="formContainer">
    <!-- <div class="login_bg_radial_login">
        <canvas id="rightCanvas"></canvas>
      </div> -->
    <div class="form-box">
      <el-form :model="formLabelAlign">
        <el-form-item>
          <el-input placeholder="请输入用户名" v-model="formLabelAlign.name" @keyup.enter="submit">
            <template #prefix>
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADmSURBVHgBtZRhEcIwDEa/YoBJqAPmgDlgDpAyJCABJKBgwwEo2FDAHIT02OCO0jZt4d3lth/tay9NAvwRJVlERBV/Vhwlx8hxUUodkQuL9/SdnqNEKh7xzJ1DIxaTCpLRuhwLj38DGeYSRay8gJxlrHyEEK6cW6z8BBkHpMC5bAKP2SdVi+CANiSWdqiG3aHn0D4VkFaTVMOunmE66MoHdZDC0nrKpxSzNjwKeNGO0ql9Yk15mFnzSt9nnTfIw4i3Lnn6CH1TueQx88SFMy3B2hXQzT9WnfODrPFMj7mBhowBEc31Ex7f4ZLk6lL1SAAAAABJRU5ErkJggg=="
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formLabelAlign.password"
            @keyup.enter="submit"
          >
            <template #prefix>
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADvSURBVHgBvVSLEcIgDE17DsAIjOAIbuIouoFuUDeoG9QNHIFuQDeI4QwnckVIsX13OUh5eU34BCADRFRkZzKDHwxkR6gBCehA1JI9WdjD+RqkiIQvroJorfNVgBQUdOXg0w9OzxzZFnHWNsNRLN6DULyoZE7CzK21iQDN0xEq0MJW4Fsw4HIMmLqa+P1QFv/A6zVh1jQY+AMaghsle34nO7CNIAG+9zsFE3Hd/bYpsueVZv4IHap6omGCUmQyd1mqQq44cyfcBX5Rs5IcqArmuiRg1Re6E3D3KOzd2zwi8keo7IKM2+xXrGtcFqPG9QJ/xgCELpZulgAAAABJRU5ErkJggg=="
              />

              <!-- <svg-icon2 iconClass="password" className="pass-svg"></svg-icon2> -->
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button :loading="loading" type="primary" size="medium" @click="submit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import Cookies from "js-cookie";
import { setCache } from "@/utils/cache";
import { useRouter } from "vue-router";
import http from "@/utils/request";
import { useStore } from "vuex";
// const AriticeItem = reactive({
//   title: "文章标题",
//   info: "文章内容",
//   author: "X"
// });
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const data = reactive({
      formLabelAlign: {
        name: "admin",
        password: "123",
        type: "",
        loading: true
      }
    });
    const submit = () => {
      data.loading = true;
      http
        .post("/api/login", {
          name: data.formLabelAlign.name,
          pwd: data.formLabelAlign.password
        })
        .then((res) => {
          data.loading = false;
          setCache("userInfo", res.data);
          // store.dispatch("getUserInfo", res.data);
          Cookies.set("token", res.data.token);
          router.replace("/");
        });
    };

    return { ...toRefs(data), submit };
  }
};
</script>

<style lang="scss">
.formContainer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 600px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #b39f9f;

  // .login_bg_radial_login {
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   left: 0;
  //   z-index: 0;
  // }

  .user-login {
    font-size: 24px;
    padding: 35px 0;
    text-align: center;
  }

  .form-box {
    padding: 40px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 27px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.5);

    width: 427px;
    height: 235px;
    color: #fff;
    position: relative;
    .el-input__inner {
      background: transparent !important;
      color: #ffffff !important;
      height: 40px;
      line-height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      &:focus {
        color: red;
      }
      &::placeholder {
        color: #ffffff;
      }
    }

    .submit-btn {
      // margin-top: 3.489vw;
      border-radius: 4px;
      .el-button {
        width: 100%;
      }

      // height: 100px;
      background-color: #0077e8;
      box-shadow: 0 15px 10px -15px #333333;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-transition-delay: 111111s;
      -webkit-transition: color 111111s ease-out, background-color 111111s ease-out;
    }
    .el-input__prefix {
      color: #fff;
    }
  }
}
</style>
