<template>
  <el-dialog
    title="编辑账号"
    :visible="roleVisible"
    width="520px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dialogForm"
      :rules="rules"
      :model="dialogForm"
      label-position="right"
      label-width="80px"
    >
      <el-form-item prop="roleId" label="角色">
        <el-select v-model="dialogForm.roleId" style="width: 100%">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { postUwellSystemInnerUserEdit } from "@/api";

export default {
  name: "RoleEidtWindow",
  props: {
    roleVisible: {
      type: Boolean,
      default: false,
    },
    roleValue: {
      type: Object,
      default: () => {},
    },
    roleList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    roleVisible(value) {
      if (this.roleValue?.roleName) {
        this.dialogForm.roleId = this.roleValue.roleId;
      }
    },
  },
  data() {
    return {
      dialogForm: {
        roleId: null,
      },
      rules: {
        roleId: [{ required: true, message: "角色为必填项" }],
      },
      windowLoading: false,
    };
  },
  methods: {
    // 内部用户编辑
    async userEdit(data) {
      this.windowLoading = true;
      const res = await postUwellSystemInnerUserEdit(data);
      if (res?.success) {
        this.$message.success("编辑成功");
        this.$emit("get-user-page", "user");
        this.handleClose();
      }
      this.windowLoading = false;
    },
    handleClose(done) {
      this.$refs.dialogForm.resetFields();
      this.$emit("close-window", false);
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.userEdit({
            userid: this.roleValue.userid,
            roleId: this.dialogForm.roleId,
          });
        }
      });
    },
    submitDel() {
      this.$emit("close-window", false);
    },
  },
};
</script>

<style lang="less" scoped>
.dialogCon {
  width: 100%;
}
</style>
