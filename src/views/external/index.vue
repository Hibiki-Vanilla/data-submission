<template>
  <section>
    <PageTop :title="'外部账号列表'" :tip="'外部账号的增删改查'" />
    <main class="main" v-loading="loading">
      <SearchInput
        @search-list="searchList"
        @clean-list="cleanList"
        @new-role="newRole"
      />
      <AllList
        :dept-tree="deptTree"
        @tree-change="treeChange"
        :table-data="tableData"
        :total="total"
        :current="current"
        @current-change="currentChange"
        @act-role="actRole"
        :refresh-list="refreshList"
        :mode-status="modeStatus"
      />

      <RoleEidtWindow
        :dept-tree="deptTree"
        :role-visible="roleVisible"
        :role-status="roleStatus"
        :role-data="roleData"
        @refresh-list="refreshList"
        @close-window="closeWindow"
      />
    </main>
  </section>
</template>

<script>
import PageTop from "@/components/PageTop";
import SearchInput from "./components/SearchInput.vue";
import AllList from "./components/AllList.vue";
import RoleEidtWindow from "./components/RoleEidtWindow.vue";

import { getUwellSystemDeptTree, postUwellSystemUserPage } from "@/api";

export default {
  name: "ExternamPage",
  components: {
    PageTop,
    SearchInput,
    AllList,
    RoleEidtWindow,
  },
  data() {
    return {
      loading: false,
      modeStatus: "all",
      roleVisible: false,
      roleStatus: null,
      roleData: null,

      inQuery: {},
      keywordsQuery: {},
      deptTree: [],
      tableData: [],

      size: 10,
      current: 1,
      total: 0,

      treeId: null,
    };
  },
  mounted() {
    this.getTree();
    this.getUserPage();
  },
  methods: {
    // 部门树

    async getTree() {
      if (!this.$inAuthority("1761990651508580370", 0)) {
        return;
      }
      const res = await getUwellSystemDeptTree();
      this.deptTree = res?.data || [];
    },
    // 用户
    async getUserPage() {
      if (!this.$inAuthority("1761990651508580370", 0)) {
        return;
      }
      this.loading = true;
      const data = {
        inQuery: this.inQuery,
        keywordsQuery: this.keywordsQuery,
        size: this.size,
        current: this.current,
      };
      const res = await postUwellSystemUserPage(data);
      if (res?.success) {
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
      this.loading = false;
    },
    modeChange() {},
    newRole() {
      this.roleStatus = "new";
      this.roleVisible = true;
    },
    actRole(value, data) {
      this.roleStatus = value;
      this.roleData = data;
      this.roleVisible = true;
    },
    // 遍历获取点击tree下的全部dept目标id
    traverseObject(obj, arr = []) {
      if (Array.isArray(obj.children)) {
        for (let i = 0; i < obj.children.length; i++) {
          const child = obj.children[i];
          arr.unshift(child.id);
          this.traverseObject(child, arr);
        }
      }
    },
    treeChange(data) {
      this.treeId = data.id;
      let arr = [];
      arr.unshift(data.id);
      if (data.children) {
        this.traverseObject(data, arr);
      }
      this.inQuery = {
        deptId: arr,
      };

      this.getUserPage();
    },

    searchList(data) {
      this.size = 10;
      this.current = 1;
      this.keywordsQuery = data.trim()
        ? {
            [data.trim()]: ["realname", "accountNo", "email"],
          }
        : {};

      this.modeStatus = "info";
      this.treeId = null;
      this.getUserPage();
    },
    cleanList() {
      this.modeStatus = "all";
      this.size = 10;
      this.current = 1;
      this.inQuery = {};
      this.keywordsQuery = {};
      this.getUserPage();
    },

    currentChange(data) {
      this.current = data;
      this.getUserPage();
    },
    refreshList(data) {
      if (data === "tree") {
        this.getTree();
      } else {
        this.getUserPage();
      }
    },

    closeWindow() {
      this.roleVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 24px 24px 60px;
}
</style>
