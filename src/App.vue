<template>
  <main :dir="lang === 'ar' ? 'rtl' : 'ltr'">
    <LoginPage v-if="status" @user-token="userToken" />
    <UserContent v-else :user-logout="userLogout" />
  </main>
</template>

<script>
import LoginPage from "@/views/login";
import UserContent from "@/components/UserContent.vue";
import { useStore } from "@/store";
import { mapState } from "pinia";
export default {
  name: "App",
  components: {
    LoginPage,
    UserContent,
  },
  data() {
    return {
      status: true,
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
  },
  mounted() {
    const store = useStore();
  },
  methods: {
    userLogout() {
      if (this.$route.query.dingCode) {
        this.$router.replace({ path: this.$route.path });
      }
      this.status = true;
      localStorage.removeItem("dst");
      localStorage.removeItem("dsn");
    },
    userToken(value) {
      this.status = false;
      // console.log(this.$route.path);
    },
  },
};
</script>

<style lang="less">
.el-scrollbar {
  > .el-scrollbar__bar {
    opacity: 1 !important;
  }
}
</style>
