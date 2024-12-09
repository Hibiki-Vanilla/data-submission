<template>
  <el-dropdown placement="bottom" trigger="click" @command="translate">
    <section class="hearderUser">
      <el-avatar
        src="https://files.myuwell.com/u-logo.png"
        fit='contain'
      ></el-avatar>
      <div class="hearderUserText">{{ userName }}</div>
    </section>
    <el-dropdown-menu>
      <el-dropdown-item command="logout">{{$t('login.logout')}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { decryptByDES } from "@/utils/aes";
import { delUwellLogout } from "@/api";
export default {
  name: "HearderUser",
  props:{
    userLogout:{
      type:Function,
      default:()=>{}
    }
  },
  data() {
    return {
      userName: "",
    };
  },
  mounted() {
    if (localStorage.getItem("dsn")) {
      const userName = decryptByDES(localStorage.getItem("dsn"), "dsn");
      this.userName = userName || "";
    }
  },
  methods: {
    async translate(lang) {
      const res = await delUwellLogout();
      this.userLogout();
    },
  },
};
</script>

<style lang="less" scoped>
.hearderUser {
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 120px;
  margin-left: 20px;

  .hearderUserText {
    padding: 0 10px;
    font-size: 14px;
  }
  .el-avatar{
    background:none;
  }
}

@media (max-width: 992px) {
  .hearderUser {
    min-width: 0;

    .hearderUserText {
      display: none;
    }
  }
}
</style>
