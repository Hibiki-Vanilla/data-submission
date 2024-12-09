<template>
  <div v-show="loginStatus" class="main">
    <!-- {/* 登录 */} -->
    <div class="loginCon">
      <div class="title">{{ $t("login.title") }}</div>

      <el-form ref="loginForm" :rules="rules" :model="loginForm" onsubmit="return false;">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            size="medium"
            prefix-icon="el-icon-user"
            :placeholder="$t('login.enterEmail')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            size="medium"
            prefix-icon="el-icon-search"
            :placeholder="$t('login.enterPassword')"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="linkRow">
        <div class="forgot" @click="modeChange">
          {{ $t("login.forgotPassword") }}
        </div>
      </div>
      <el-button
        type="primary"
        class="signButton"
        :loading="buttonLoading"
        @click="onLogin"
        >{{ $t("forgot.login") }}</el-button
      >
    </div>

    <GRecaptcha @get-token="getToken" ref="gRecaptchaLogin" />
  </div>
</template>

<script>
import { emReg } from "@/mixins/validator";
import { postUwellOauth, getResourceListByCurrentUser } from "@/api";
import { encryptByDES } from "@/utils/aes.js";
import GRecaptcha from "@/components/GRecaptcha.vue";
import md5 from "js-md5";
export default {
  name: "LoginModule",
  props: ["loginStatus", "modeChange"],
  components: { GRecaptcha },
  data() {
    const emailPass = (rule, value, callback) => {
      if (!emReg.test(value)) {
        callback(new Error(this.$t("login.inEmail")));
      } else {
        callback();
      }
    };
    return {
      buttonLoading: false,
      loginForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ validator: emailPass }],
        password: [{ required: true, message: this.$t("login.enterPassword") }],
      },
    };
  },
  methods: {
    async getToken(token) {
      this.buttonLoading = true;
      const userAgent = window.navigator.userAgent.toLowerCase();
      let mode = /mobile|android|iphone|ipad|phone/i.test(userAgent) ? 1 : 3;
      const res = await postUwellOauth(
        {
          grant_type: "password",
          uwell_app_id: "1760580848534081637",
          device: mode,
          username: this.loginForm.email.trim(),
          password: md5(this.loginForm.password.trim()),
        },
        token
      );
      if (res?.success) {
        const token = res?.data?.accessToken;
        const userName = res?.data?.realname;
        const localToken = encryptByDES(token, "dst");
        const localName = encryptByDES(userName, "dsn");
        localStorage.setItem("dst", localToken);
        localStorage.setItem("dsn", localName);
        this.getCurrentUser();
      } else if (
        res.code === 108500 ||
        res.code === 108501 ||
        res.code === 108502 ||
        res.code === 108503 ||
        res.code === 108507
      ) {
        this.$message.warning(this.$t("login.loginfailed"));
      }
      this.buttonLoading = false;
    },
    onLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.$refs.gRecaptchaLogin.execute();
        }
      });
    },
    async getCurrentUser() {
      const res = await getResourceListByCurrentUser();
      if (res?.success) {
        let list = JSON.stringify(res.data);
        localStorage.setItem("dsu", 0);
        localStorage.setItem("dsa", list);
        if (this.$route.path !== "/fillIn" && this.$route.path === "/") {
          this.$router.push("/fillIn");
        }
        this.$emit("login-submit", {});
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10.25vw auto 0;
  width: 480px;
  display: flex;
  flex-direction: column;
  align-content: center;

  .title {
    text-transform: uppercase;
    text-align: center;
    display: block;
    font-size: 28px;
    font-family: Helvetica Neue LT Pro-85 Heavy, Helvetica Neue LT Pro;
    font-weight: bold;
    padding-bottom: 50px;
  }

  :deep(.el-input__inner) {
    height: 56px;
    border-radius: 8px;
    border: 1px solid #d9dde6;
    padding: 4px 30px;
    font-size: 16px;
  }

  .linkRow {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 68px;
  }

  .forgot {
    cursor: pointer;
    font-size: 18px;
    font-family: Helvetica Neue LT Pro-55 Roman, Helvetica Neue LT Pro;
    font-weight: normal;
    color: #6b737e;
  }

  .signButton {
    width: 100%;
    font-size: 18px;
    height: 56px;
    background: #0d66ff;
  }
}

@media screen and (max-width: 992px) {
  .main {
    margin: 10.25vw auto 0;
    width: 85vw;
    display: flex;
    flex-direction: column;
    align-content: center;

    .title {
      font-size: 6vw;
      padding-top: 8vw;
      padding-bottom: 8vw;
    }

    :deep(.el-input__inner) {
      height: 10.6vw;
      border-radius: 1.6vw;
      padding: 0.5vw 25px;
      font-size: 3.73vw;
    }

    .linkRow {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10vw;
    }

    .forgot {
      font-size: 3.73vw;
    }

    .signButton {
      height: 10.66vw;
      border-radius: 1.6vw;
      font-size: 4.8vw;
    }
  }
}
</style>
