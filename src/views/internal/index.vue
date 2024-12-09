<template>
  <section>
    <PageTop :title="'内部账号列表'" :tip="'优维尔企业内部账号增删改查'" />
    <main class="main" v-loading="loading">
      <SearchInput
        @search-list="searchList"
        @clean-list="cleanList"
        @refresh-list="refreshList"
      />
      <AllList
        :dept-tree="deptTree"
        @tree-change="treeChange"
        :table-data="tableData"
        :total="total"
        :current="current"
        :role-list="roleList"
        :get-user-page="getUserPage"
        @current-change="currentChange"
        :mode-status="modeStatus"
      />
    </main>
  </section>
</template>

<script>
import PageTop from "@/components/PageTop";
import SearchInput from "./components/SearchInput.vue";
import AllList from "./components/AllList.vue";

import {
  getUwellSystemInnerDeptTree,
  postUwellSystemInnerUserPage,
  getUwellSystemInnerUserSync,
  getUwellSystemRoleList,
} from "@/api";

export default {
  name: "InternalPage",
  components: {
    PageTop,
    SearchInput,
    AllList,
  },
  data() {
    return {
      loading: false,
      modeStatus: "all",

      inQuery: {},
      keywordsQuery: {},
      deptTree: [],
      tableData: [],
      roleList: [],

      size: 10,
      current: 1,
      total: 0,
    };
  },
  mounted() {
    this.getTree();
    this.getUserPage();
    this.getRoleList();
  },
  methods: {
    filterHiddenData(data) {
      // 过滤掉 isHide 为 true 的节点
      const filteredData = data.filter((node) => !node.isHide);

      // 递归处理子级节点
      filteredData.forEach((node) => {
        if (node.children && node.children.length) {
          node.children = this.filterHiddenData(node.children);
        }
      });

      return filteredData;
    },
    // 部门树
    async getTree() {
      if (!this.$inAuthority("1761990651508580369", 0)) {
        return;
      }
      const res = await getUwellSystemInnerDeptTree();
      let list = res?.data || [];
      this.deptTree = this.filterHiddenData(list);
    },
    // 用户
    async getUserPage() {
      if (!this.$inAuthority("1761990651508580369", 0)) {
        return;
      }
      this.loading = true;
      const data = {
        inQuery: this.inQuery,
        keywordsQuery: this.keywordsQuery,
        size: this.size,
        current: this.current,
      };
      const res = await postUwellSystemInnerUserPage(data);
      if (res?.success) {
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
      this.loading = false;
    },
    // 刷新列表
    async getUserSync() {
      const res = await getUwellSystemInnerUserSync();
    },
    // 角色表
    async getRoleList() {
      const res = await getUwellSystemRoleList();
      if (res?.success) {
        this.roleList = res?.data || [];
      }
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
      let arr = [];
      if (data.id !== "1") {
        arr.unshift(data.id);
        if (data.children) {
          this.traverseObject(data, arr);
        }
        this.inQuery = {
          deptId: arr,
        };
      } else {
        this.inQuery = {};
      }
      this.getUserPage();
    },
    searchList(data) {
      this.size = 10;
      this.current = 1;
      this.keywordsQuery = data.trim()
        ? {
            [data.trim()]: ["name", "jobNumber"],
          }
        : {};

      this.modeStatus = "info";
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
    refreshList() {
      this.getTree();
      this.getUserPage();
      this.getUserSync();
    },
    currentChange(data) {
      this.current = data;
      this.getUserPage();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 24px 24px 60px;
}
</style>
