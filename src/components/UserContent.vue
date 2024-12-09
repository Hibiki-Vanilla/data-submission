<template>
  <el-container class="con">
    <!-- 头部内容 -->
    <el-header class="header">
      <div class="headerItem">
        <img class="logo" src="@/assets/global/uwell.png" alt="" />
        <span class="headerTitle">{{ $t("login.title") }}</span>
      </div>
      <div class="headerItem">
        <SelectLang />
        <HeaderUser :user-logout="userLogout" />
      </div>
    </el-header>
    <el-container>
      <!-- 侧边 -->
      <LayoutAside />
      <!-- 主视窗 -->
      <el-main class="main">
        <router-view></router-view>
        <MoAsiede />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SelectLang from "@/components/SelectLang";
import HeaderUser from "@/components/HeaderUser";
import LayoutAside from "@/components/LayoutAside";
import MoAsiede from "@/components/MoAsiede";
import { getListCountry, getListProduct } from "@/api";

import { useStore } from "@/store";

export default {
  name: "UserContent",
  components: {
    SelectLang,
    HeaderUser,
    LayoutAside,
    MoAsiede,
  },
  props: {
    userLogout: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.getCountry();
    this.getProduct(1);
  },
  methods: {
    async getCountry() {
      const res = await getListCountry();
      if (res?.success) {
        const list = res.data;
        useStore().setCountryList(list);
      }
    },
    renameKeysInArray(list) {
      let res = [];
      list.map((item) => {
        let renamedItem = {
          label: item.name,
          value: item.id,
        };
        let childrenList = [];
        item.productChildren.map((item) => {
          childrenList.push({
            label: item.productName,
            value: item.id,
          });
        });
        renamedItem.children = childrenList;
        res.push(renamedItem);
      });

      return res;
    },
    async getProduct(type) {
      const res = await getListProduct(type);
      if (res?.success) {
        let list = res?.data || [];
        const renamedArr = this.renameKeysInArray(list);
        useStore().setProductList(renamedArr);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.con {
  height: 100vh;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 0 30px;
    .logo {
      height: 35px;
      width: 35px;
      padding-right: 10px;
    }
    .headerItem {
      display: flex;
      align-items: center;
      color: rgba(80, 80, 80, 1);
      font-size: 14px;
      font-weight: bold;
    }
  }

  @media (max-width: 992px) {
    .header {
      padding: 0 17px;
      .logo {
        height: 44px;
        width: 44px;
        padding-right: 10px;
      }
      .headerTitle {
        display: none;
      }
    }
  }

  .aside {
    border-right: 1px solid #ccc;
  }
  .main {
    // display: flex;
    background-color: #f3f3f3;
    padding: 0;
  }
}
</style>
