<template>
  <el-dialog
    :title="dialogStatus ? list[dialogStatus].title : ''"
    :visible="dialogVisible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div v-if="dialogStatus !== 'del'" class="dialogCon">
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-position="right"
        label-width="80px"
      >
        <el-form-item v-show="dialogStatus === 'add'" label="上级部门">
          {{ dialogData?.deptName || "" }}
        </el-form-item>

        <el-form-item prop="name" label="名称">
          <el-input v-model="dialogForm.name" max="50" size="medium"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-else class="dialogCon">是否删除此条数据</div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          v-if="dialogStatus !== 'del'"
          :loading="windowLoading"
          type="primary"
          @click="submitForm"
          >确定</el-button
        >
        <el-button
          v-else
          type="danger"
          :loading="windowLoading"
          @click="submitDel"
          >删除</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  postUwellSystemDeptCreate,
  postUwellSystemDeptEdit,
  delUwellSystemDept,
} from "@/api";
export default {
  name: "EidtWindow",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogStatus: {
      type: String,
      default: null,
    },
    dialogData: {
      type: Object,
      default: null,
    },
  },
  watch: {
    dialogVisible(value) {
      if (value === true && this.dialogStatus === "edit") {
        this.dialogForm.name = this.dialogData.deptName;
      }
    },
  },
  data() {
    return {
      list: {
        oneAdd: {
          title: "新建一级部门",
        },
        edit: {
          title: "编辑",
        },
        add: {
          title: "新建子部门",
        },
        del: {
          title: "删除",
        },
      },
      dialogForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "名称为必填项" },
          { max: 50, message: "最大长度50字符" },
        ],
      },
      windowLoading: false,
    };
  },
  methods: {
    handleClose(done) {
      if(this.dialogStatus !== 'del'){
        this.$refs.dialogForm.resetFields();
      }
      this.$emit("close-window", false);
    },
    // 部门创建
    async deptCreate(data) {
      this.windowLoading = true;
      const res = await postUwellSystemDeptCreate(data);
      if (res?.success) {
        this.$message.success('创建成功')
        this.$emit("refresh-list", "tree");
        this.handleClose();
      }
      this.windowLoading = false;
    },
    // 部门编辑
    async deptEdit(data) {
      this.windowLoading = true;
      const res = await postUwellSystemDeptEdit(data);
      if (res?.success) {
        this.$message.success('编辑成功')
        this.$emit("refresh-list", "tree");
        this.handleClose();
      }
      this.windowLoading = false;
    },
    // 部门删除
    async deptDel(data) {
      this.windowLoading = true;
      const res = await delUwellSystemDept(data);
      if (res?.success) {
        this.$message.success('删除成功')
        this.$emit("refresh-list", "tree");
        this.handleClose();
      }else{
        this.$message.error(res.msg||'')
      }
      this.windowLoading = false;
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.dialogStatus === "oneAdd") {
            this.deptCreate({ deptName: this.dialogForm.name.trim() });
          } else if (this.dialogStatus === "add") {
            this.deptCreate({
              parentId: this.dialogData.id,
              deptName: this.dialogForm.name.trim(),
            });
          } else if (this.dialogStatus === "edit") {
            this.deptEdit({
              id: this.dialogData.id,
              deptName: this.dialogForm.name.trim(),
            });
          }
        }
      });
    },
    submitDel() {
      this.deptDel({
        id: this.dialogData.id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dialogCon {
  width: 100%;
}
</style>
