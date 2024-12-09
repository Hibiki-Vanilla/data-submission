<template>
  <div v-show="forgetStatus" class="main">
    <!-- {/* 登录 */} -->
    <div class="forgotCon">
      <div class="title">{{ $t("forgot.forgotPassword") }}</div>
      <div class="tip">{{ $t("forgot.tip") }}</div>

      <el-form
        ref="forgotForm"
        :rules="rules"
        :model="forgotForm"
        onsubmit="return false;"
      >
        <el-form-item prop="email">
          <el-input
            v-model="forgotForm.email"
            size="medium"
            prefix-icon="el-icon-user"
            :placeholder="$t('login.enterEmail')"
          ></el-input>
        </el-form-item>
        <!-- {/* code */} -->
        <el-form-item prop="code">
          <el-row class="codeRow">
            <el-input
              v-model="forgotForm.code"
              size="medium"
              prefix-icon="el-icon-user"
              :placeholder="$t('forgot.code')"
            ></el-input>
            <el-button
              type="primary"
              class="sendButton"
              :loading="codeStatus"
              @click="onCodeSend"
              >{{ $t("forgot.send") }}</el-button
            >
          </el-row>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="forgotForm.password"
            size="medium"
            prefix-icon="el-icon-search"
            :placeholder="$t('forgot.password')"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgotForm.confirmPassword"
            size="medium"
            prefix-icon="el-icon-search"
            :placeholder="$t('forgot.confirmPassword')"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="linkRow">
        <div class="forgot" @click="modeChange">
          {{ $t("forgot.login") }}
        </div>
      </div>
      <el-button
        type="primary"
        class="signButton"
        :loading="submitLoading"
        @click="onSubmit"
        >{{ $t("forgot.submit") }}</el-button
      >
    </div>
    <GRecaptcha @get-token="getToken" ref="gRecaptchaChild" />
  </div>
</template>

<script>
import { emReg } from "@/mixins/validator";
import { postUwellForgetPwd, postUwellForgetPassword } from "@/api";
import GRecaptcha from "@/components/GRecaptcha.vue";
import md5 from "js-md5";
export default {
  name: "ForgotModule",
  props: ["forgetStatus", "modeChange"],
  components: { GRecaptcha },
  data() {
    const emailPass = (rule, value, callback) => {
      if (!emReg.test(value)) {
        callback(new Error(this.$t("login.inEmail")));
      } else {
        callback();
      }
    };

    const twoPasswordPass = (_, value, callback) => {
      if (value) {
        if (value === this.forgotForm.password) {
          callback();
        } else {
          callback(new Error(this.$t("login.passwordNotMatch")));
        }
      } else {
        callback(new Error(this.$t("login.enterPassword")));
      }
    };

    return {
      forgotForm: {
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
      },
      rules: {
        email: [{ validator: emailPass }],
        code: [{ required: true, message: this.$t("login.enterCode") }],
        password: [{ required: true, message: this.$t("login.enterPassword") }],
        confirmPassword: [{ validator: twoPasswordPass }],
      },

      codeStatus: false,
      submitLoading: false,
    };
  },
  methods: {
    async getToken(token) {
      // :token
      const res = await postUwellForgetPwd({
        email: this.forgotForm.email.trim(),
        token,
      });
      if (res?.success) {
        this.$message.success(this.$t("forgot.send"));
      } else if (res.code === 33100) {
        this.$message.error(this.$t("login.inEmail"));
      }
    },
    onCodeSend() {
      this.$refs.forgotForm.validateField("email", (valid) => {
        this.codeStatus = true;
        if (!valid) {
          this.$refs.gRecaptchaChild.execute();
        }
        this.codeStatus = false;
      });
    },
    onSubmit() {
      this.$refs.forgotForm.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;

          const res = await postUwellForgetPassword({
            email: this.forgotForm.email.trim(),
            verificationCode: this.forgotForm.code.trim(),
            appId: "1760580848534081637",
            password: md5(this.forgotForm.password.trim()),
            confirmPassword: md5(this.forgotForm.confirmPassword.trim()),
          });
          if (res?.success) {
            this.$message.success(this.$t("editFill.submitSuccess"));
            this.$refs.forgotForm.resetFields();
          } else {
            this.$message.error(res.msg || "error");
          }
          this.submitLoading = false;
        }
      });
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
    padding-bottom: 12px;
  }
  .tip {
    text-align: center;
    padding-bottom: 48px;
    font-size: 16px;
    font-family: Helvetica Neue LT Pro-55 Roman, Helvetica Neue LT Pro;
    font-weight: normal;
    color: #b2b8c7;
    line-height: 1;
  }

  :deep(.el-input__inner) {
    height: 56px;
    border-radius: 8px;
    border: 1px solid #d9dde6;
    padding: 4px 30px;
    font-size: 16px;
  }

  .codeRow {
    display: flex;
    justify-content: space-between;
    width: 100%;
    :deep(.el-input__inner) {
      width: 100%;
    }

    .sendButton {
      margin-left: 10px;
      width: auto;
      height: 56px;
      border-radius: 8px;
      border: 0;
      font-size: 18px;
      font-family: Helvetica Neue LT Pro-55 Roman, Helvetica Neue LT Pro;
      font-weight: normal;
      background: #0d66ff;
    }
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

    .codeRow {
      :deep(.el-input__inner) {
        width: 100%;
      }

      .sendButton {
        height: 10.66vw;
        border-radius: 1.6vw;
        font-size: 3.4vw;
        width: auto;
      }
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
      font-size: 4.4vw;
    }
  }
}
</style>
