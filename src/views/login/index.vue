<template>
  <section class="container" v-loading="loading">
    <div v-if="loginMode === 'user'" class="mainRowCon">
      <!-- left -->
      <div class="mainLeft">
        <div class="mainLeftTitle">Innovate At The Frontier</div>
        <img class="mainLeftImg" src="@/assets/loginImg.webp" />
      </div>

      <!-- right -->
      <div class="mainRight">
        <div class="topRow">
          <div class="lang">
            <SelectLang />
          </div>
        </div>
        <div class="content">
          <Login
            :login-status="loginStatus"
            :mode-change="modeChange"
            @login-submit="loginSubmit"
          />
          <Forget :forget-status="forgotStatus" :mode-change="modeChange" />
        </div>
        <img class="moLoginImg" src="@/assets/loginImg.webp" />
      </div>
      <!-- {/* 图片 */} -->
    </div>

    <el-result v-if="loginMode === 'error'" icon="error" :subTitle="resultText">
    </el-result>

    <el-result v-if="loginMode === 'dingLink'" icon="success" :subTitle="resultText">
    </el-result>
  </section>
</template>

<script>
import SelectLang from "@/components/SelectLang";
import Login from "./components/Login";
import Forget from "./components/Forget";
import dd from "dingtalk-jsapi";
import { encryptByDES } from "@/utils/aes.js";
import { postUwellOauth, getResourceListByCurrentUser } from "@/api";

export default {
  name: "LoginPage",
  components: {
    SelectLang,
    Login,
    Forget,
  },
  data() {
    return {
      loading: true,
      resultText: "授权中...",
      loginMode: "none",

      info: {},
      loginStatus: true,
      forgotStatus: false,
    };
  },
  mounted() {
    const tokenStatus = localStorage.getItem("dst");
    if (this.$route.query.dingCode) {
      localStorage.removeItem("dst");
      localStorage.removeItem("dsn");
      this.dingLogin();
    } else if (this.$route.query.dingToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const serializedObj = urlParams.get("dingToken");
      const obj = JSON.parse(decodeURIComponent(serializedObj));
      // const { dingToken, dingName } = this.$route.query;
      localStorage.setItem("dst", obj.dingToken);
      localStorage.setItem("dsn", obj.dingName);
      this.getCurrentUser(obj.redirection);
    } else if (tokenStatus) {
      this.$emit("user-token", {});
    } else {
      this.loginMode = "user";
      this.loading = false;
    }
  },
  methods: {
    loginSubmit() {
      this.$emit("user-token", {});
    },
    dingLogin() {
      const testStatus = true;
      if (testStatus) {
        // if (
        //   dd.env.platform.toLowerCase() === "notindingtalk" ||
        //   dd.env.platform.toLowerCase() !== "pc"
        // ) {
        //   this.$message.error("请使用钉钉PC环境访问");
        //   this.resultText = "请使用钉钉PC环境访问";
        //   this.loading = false;
        //   this.loginMode = "error";
        //   return false;
        // } else {
        // 正式环境, 则进行授权, 获取微应用免登授权码
        let that = this;
        dd.ready(function () {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding6f019bea31ee712735c2f4657eb6378f", // 企业 ID
            onSuccess: function (info) {
              // 通过该免登授权码可以获取用户身份 info.code
              that.userDDLogin(info.code);
            },
            onFail: function (err) {
              that.loading = false;
              that.loginMode = "error";
              that.resultText = "钉钉免登授权失败, 请联系管理员";
              that.$message.error("钉钉免登授权失败, 请联系管理员");
            },
          });
        });
        // }
      } else {
        this.devLogin();
      }
    },
    // 正式环境钉钉登录
    async userDDLogin(code) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      let mode = /mobile|android|iphone|ipad|phone/i.test(userAgent) ? 1 : 3;
      if (!this.info?.token) {
        const res = await postUwellOauth({
          grant_type: "dingtalk",
          uwell_app_id: "1760580848534081637",
          device: mode,
          dingtalk_code: code,
        });
        if (res?.code === 1) {
          const url = location.origin;
          const token = res?.data?.accessToken;
          const userName = res?.data?.realname;
          const localToken = encryptByDES(token, "dst");
          const localName = encryptByDES(userName, "dsn");
          if (mode === 3) {
            // pc
            let data = {
              dingToken: localToken,
              dingName: localName,
              redirection: this.$route.query.redirection || false,
            };
            const serializedObj = encodeURIComponent(JSON.stringify(data));
            this.info = res?.data;
            dd.biz.util.openLink({
              url: `${url}/?dingToken=${serializedObj}`, //要打开链接的地址
              onSuccess: function (result) {},
              onFail: function (err) {},
            });
            this.loginMode = "dingLink";
            this.resultText = "已在外部浏览器打开该页面!";
            dd.biz.navigation.close({
              onSuccess: function () {
                console.log("成功关闭钉钉工作台窗口");
              },
              onFail: function (err) {
                console.error("关闭钉钉工作台窗口失败:", err);
              },
            });
          } else {
            localStorage.setItem("dst", localToken);
            localStorage.setItem("dsn", localName);
            this.getCurrentUser(this.$route.query.redirection);
          }
        } else {
          this.$message.error("钉钉免登授权失败, 请联系管理员");
        }
        this.loading = false;
      }
    },
    // 开发环境登录
    async devLogin() {
      // const code = "609965485";
      const userAgent = window.navigator.userAgent.toLowerCase();
      let mode = /mobile|android|iphone|ipad|phone/i.test(userAgent) ? 1 : 3;
      const code = this.$route.query.dingCode;
      const res = await postUwellOauth({
        grant_type: "dingtalk",
        uwell_app_id: "1760580848534081637",
        device: mode,
        dingtalk_code: code,
      });
      if (res?.success) {
        this.resultText = "已在外部浏览器打开该页面!";
        const token = res?.data?.accessToken;
        const userName = res?.data?.realname;
        const localToken = encryptByDES(token, "dst");
        const localName = encryptByDES(userName, "dsn");
        localStorage.setItem("dst", localToken);
        localStorage.setItem("dsn", localName);
        this.getCurrentUser();
      } else {
        this.$message.error("钉钉免登授权失败, 请联系管理员");
      }
      this.loading = false;
    },
    modeChange() {
      this.loginStatus = !this.loginStatus;
      this.forgotStatus = !this.forgotStatus;
    },
    async getCurrentUser(redirection) {
      const res = await getResourceListByCurrentUser();
      if (res?.success) {
        let list = JSON.stringify(res.data);
        localStorage.setItem("dsu", 1);
        localStorage.setItem("dsa", list);
        if (redirection) {
          this.$router.push(`/fillIn/${redirection}`);
        } else {
          if (this.$route.path !== "/fillIn" && this.$route.path === "/") {
            this.$router.push("/fillIn");
          }
        }

        this.$emit("user-token", {});
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  overflow: auto;

  .mainRowCon {
    display: flex;
    height: 100vh;
  }

  .mainLeft {
    width: 52%;
    background-image: url(@/assets/login.png);
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .mainLeftTitle {
      font-size: 48px;
      font-family: Helvetica Neue LT Pro-85 Heavy, Helvetica Neue LT Pro;
      font-weight: normal;
      color: #3e82f8;
      padding-bottom: 100px;
      text-align: center;
      text-transform: uppercase;
    }
    .mainLeftImg {
      display: block;
      height: 602px;
      width: 759px;
    }
  }

  .mainRight {
    display: flex;
    flex-direction: column;
    align-content: center;
    width: 48%;
    background: #ffffff;

    .content {
      flex: 1;
    }
  }
  .topRow {
    display: flex;
    align-items: center;
    justify-content: flex-end !important;
    width: 100%;
    height: 72px;
    line-height: 72px;

    .lang {
      display: flex;
      align-items: center;
      height: 72px;
      padding-right: 20px;
    }
  }
  .moLoginImg {
    display: none;
  }
}

@media (max-width: 992px) {
  .mainRowCon {
    .mainLeft {
      width: 0;
    }

    .mainRight {
      width: 100%;
      background-image: url(@/assets/login.png);
      background-size: auto 100%;
      background-position: center center;
      background-repeat: no-repeat;
      overflow: hidden;

      .topRow {
        height: 11.7vw;
        line-height: 11.7vw;

        .lang {
          height: 11.7vw;
        }
      }
    }
    .moLoginImg {
      height: 79.27vw;
      width: 100vw;
      display: block;
    }
  }
}
</style>
