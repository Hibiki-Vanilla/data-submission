<template>
  <section class="allList">
    <!-- left -->
    <div class="leftItem" :class="{ infoLeftItem: modeStatus !== 'all' }">
      <el-button
        v-if="$inAuthority(`1761990651508580374`, 0)"
        type="primary"
        icon="el-icon-plus"
        class="newOneDepButton"
        @click="treeRowEdit('oneAdd', null)"
        >新建部门</el-button
      >
      <el-tree :data="deptTree" node-key="id" @node-click="handleNodeClick">
        <template v-slot="{ data }">
          <span class="custom-tree-node" @click="treeNode(data.id)">
            <span :class="{ nowSpanColor: nowTreeId === data.id }">
              {{ data?.deptName }}</span
            >
            <div
              @click.stop
              v-if="
                $inAuthority(`1761990651508580375`, 0) ||
                $inAuthority(`1761990651508580374`, 0) ||
                $inAuthority(`1761990651508580376`, 0)
              "
            >
              <el-dropdown
                placement="bottom"
                v-show="data.id === nowTreeId"
                @command="(e) => treeRowEdit(e, data)"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="$inAuthority(`1761990651508580375`, 0)"
                    command="edit"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="
                      $inAuthority(`1761990651508580374`, 0) &&
                      !(findObjectLevel(deptTree, data) > 3)
                    "
                    command="add"
                    >添加子部门</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="$inAuthority(`1761990651508580376`, 0) && !data?.children"
                    command="del"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- right -->
    <div class="rightItem" :class="{ allRightItem: modeStatus !== 'all' }">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="accountNo" label="编号" width="180"> </el-table-column>
        <el-table-column prop="realname" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column v-if="modeStatus !== 'all'" prop="email" label="部门">
          <template v-slot="scope">
            {{ buildDeptNameList(scope.row.deptNameList) }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
          <template v-slot:header
            >角色
            <el-tooltip
              class="item"
              effect="dark"
              content="普通账号：可创建表单，查看表单数据；管理员账号：全部菜单权限和外部账号管。"
              placement="top"
            >
              <span class="toolTipButton">?</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          v-if="
            $inAuthority(`1761990651508580372`, 0) ||
            $inAuthority(`1761990651508580373`, 0)
          "
          label="操作"
          width="100"
        >
          <template v-slot="scope">
            <el-button
              v-show="$inAuthority(`1761990651508580372`, 0)"
              type="text"
              @click="$emit('act-role', 'edit', scope.row)"
              >编辑</el-button
            >
            <el-button
              v-show="$inAuthority(`1761990651508580373`, 0)"
              type="text"
              @click="$emit('act-role', 'del', scope.row)"
              class="delButton"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- total -->
      <div class="bottomRow">
        <div>共 {{ total }} 条</div>
        <el-pagination
          v-if="total"
          background
          layout="prev, pager, next"
          :current-page="current"
          @current-change="currentChange"
          :page-size="10"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <EidtWindow
      :dialog-visible="dialogVisible"
      :dialog-status="dialogStatus"
      :dialog-data="dialogData"
      @submit-window="submitWindow"
      @refresh-list="refreshList"
      @close-window="closeWindow"
    />
  </section>
</template>

<script>
import EidtWindow from "./EidtWindow.vue";

export default {
  name: "AllList",
  components: {
    EidtWindow,
  },
  props: {
    deptTree: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    modeStatus: {
      type: String,
      default: "all",
    },
    refreshList: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    modeStatus(value) {
      if (value === "info") {
        this.nowTreeId = null;
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogStatus: null,
      dialogData: null,

      nowTreeId: null,
      column: [],
    };
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("tree-change", data);
    },
    currentChange(current) {
      this.$emit("current-change", current);
    },
    // 层级判断
    findObjectLevel(data, target, level = 0) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item === target) {
          return level;
        }
        if (item.children && item.children.length > 0) {
          const childLevel = this.findObjectLevel(item.children, target, level + 1);
          if (childLevel !== -1) {
            return childLevel;
          }
        }
      }
      return -1;
    },
    treeRowEdit(e, data) {
      this.dialogData = data;
      this.dialogStatus = e;
      this.dialogVisible = true;
    },
    // 当前操作id
    closeWindow(data) {
      this.dialogVisible = data;
    },
    submitWindow(data) {
      if (this.dialogStatus === "oneAdd") {
        this.oneDeptCreate({ deptName: data.name });
      }
    },
    treeNode(id) {
      this.nowTreeId = id;
    },
    buildDeptNameList(list) {
      let text = list.length ? list.join(", ") : "";
      return text;
    },
  },
};
</script>

<style lang="less" scoped>
.allList {
  display: flex;
  justify-content: space-between;
  padding-top: 32px;

  .leftItem {
    width: 344px;
    min-height: 685px;
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 24px;
    .newOneDepButton {
      margin-bottom: 20px;
    }
    :deep(.custom-tree-node) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
    }
    .nowSpanColor {
      color: #409eff;
    }
    :deep(.moreButton) {
      opacity: 0;
    }
  }

  .infoLeftItem {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .rightItem {
    margin-left: 20px;
    padding: 12px;
    width: 500px;
    flex: 1;

    box-sizing: border-box;
    background-color: #ffffff;
    :deep(.el-table) {
      th.el-table__cell {
        color: rgba(0, 0, 0, 0.85);
        background-color: rgba(243, 243, 243, 1);
        font-size: 14px;
      }
    }
    .toolTipButton {
      display: inline-block;
      border-radius: 100%;
      height: 16px;
      width: 16px;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      line-height: 16px;
    }
    .delButton {
      color: rgba(246, 1, 1, 1);
    }
  }

  .allRightItem {
    margin-left: 0;
  }

  .bottomRow {
    padding-top: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    :deep(.btn-prev) {
      background-color: #fff;
    }
    :deep(.btn-next) {
      background-color: #fff;
    }
    :deep(.el-pager) {
      .number {
        background-color: #fff;
      }
    }
  }
}
</style>
