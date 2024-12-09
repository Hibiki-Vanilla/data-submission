<template>
  <el-dialog
    :title="roleStatus ? list[roleStatus].title : ''"
    :visible="roleVisible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div v-if="roleStatus !== 'del'" class="dialogCon">
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-position="right"
        label-width="80px"
      >
        <el-form-item prop="deptId" label="部门">
          <el-cascader
            v-model="dialogForm.deptId"
            :options="deptTree"
            clearable
            filterable
            :props="{
              value: 'id',
              label: 'deptName',
              checkStrictly: true,
            }"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="dialogForm.name" max="50" size="medium"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱">
          <el-input v-model="dialogForm.email" size="medium"></el-input>
        </el-form-item>

        <el-form-item prop="status" label="状态">
          <el-select v-model="dialogForm.status" size="medium" style="width: 100%">
            <el-option label="启用" :value="1"> </el-option>
            <el-option label="停用" :value="2"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-else class="dialogCon">是否删除此条数据</div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          v-if="roleStatus !== 'del'"
          type="primary"
          :loading="windowLoading"
          @click="submitForm"
          >确定</el-button
        >
        <el-button v-else type="danger" :loading="windowLoading" @click="submitDel"
          >删除</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  postUwellSystemUserCreate,
  postUwellSystemUserEdit,
  delUwellSystemUser,
} from "@/api";
export default {
  name: "EidtWindow",
  props: {
    roleVisible: {
      type: Boolean,
      default: false,
    },
    roleStatus: {
      type: String,
      default: null,
    },
    roleData: {
      type: Object,
      default: null,
    },
    deptTree: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    roleVisible(value) {
      if (value === true && this.roleStatus === "edit") {
        // let deptId = this.findDept(this.deptTree, this.roleData.deptId);
        // console.log(deptId);
        this.dialogForm = {
          deptId: this.roleData.deptId,
          name: this.roleData.realname,
          email: this.roleData.email,
          status: this.roleData.status,
        };
      }
    },
  },
  data() {
    return {
      list: {
        new: {
          title: "新建账号",
        },
        edit: {
          title: "编辑账号",
        },
        del: {
          title: "删除",
        },
      },
      dialogForm: {
        deptId: null,
        name: "",
        email: "",
        status: 1,
      },
      rules: {
        deptId: [{ required: true, message: "部门为必填项" }],
        name: [
          { required: true, message: "名称为必填项" },
          { max: 50, message: "最大长度50字符" },
        ],
        email: [{ type: "email", message: "请输入正确的邮箱地址" }],
      },
      windowLoading: false,
    };
  },
  methods: {
    handleClose(done) {
      if (this.roleStatus !== "del") {
        this.dialogForm = {
          deptId: null,
          name: "",
          email: "",
          status: 1,
        };
        this.$refs.dialogForm.resetFields();
      }
      this.$emit("close-window", false);
    },
    // 用户创建
    async userCreate(data) {
      this.windowLoading = true;
      const res = await postUwellSystemUserCreate(data);
      if (res?.success) {
        this.$emit("refresh-list", "user");
        this.handleClose();
      } else {
        this.$message.error(res?.msg || "创建失败");
      }
      this.windowLoading = false;
    },
    // 用户编辑
    async userEidt(data) {
      this.windowLoading = true;
      const res = await postUwellSystemUserEdit(data);
      if (res?.success) {
        this.$emit("refresh-list", "user");
        this.handleClose();
      }
      this.windowLoading = false;
    },
    // 用户删除
    async userDel(data) {
      this.windowLoading = true;
      const res = await delUwellSystemUser(data);
      if (res?.success) {
        this.$message.success("删除成功");
        this.$emit("refresh-list", "user");
        this.handleClose();
      } else {
        this.$message.error(res.msg || "");
      }
      this.windowLoading = false;
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.roleStatus === "new") {
            this.userCreate({
              deptId: this.dialogForm.deptId[this.dialogForm.deptId.length - 1],
              realname: this.dialogForm.name.trim(),
              email: this.dialogForm.email.trim(),
              status: this.dialogForm.status,
            });
          } else if (this.roleStatus === "edit") {
            this.userEidt({
              id: this.roleData.id,
              deptId: Array.isArray(this.dialogForm.deptId)
                ? this.dialogForm.deptId[this.dialogForm.deptId.length - 1]
                : this.dialogForm.deptId,
              realname: this.dialogForm.name.trim(),
              email: this.dialogForm.email.trim(),
              status: this.dialogForm.status,
            });
          }
        }
      });
    },
    submitDel() {
      this.userDel({
        id: this.roleData.id,
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
