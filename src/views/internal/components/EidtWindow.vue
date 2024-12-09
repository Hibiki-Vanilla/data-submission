<template>
  <el-dialog
    :title="dialogStatus ? list[dialogStatus].title : ''"
    :visible="dialogVisible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div v-if="dialogStatus !==  'del'" class="dialogCon" >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-position="right"
        label-width="80px"
      >
        <el-form-item v-show="dialogStatus === 'add'" label="上级部门">
          {{ "传递参数" }}
        </el-form-item>

        <el-form-item prop="name" label="名称">
          <el-input v-model="dialogForm.name" max="50" size="medium"></el-input>
        </el-form-item>

        <!-- <el-form-item prop="email" label="邮箱">
          <el-input v-model="dialogForm.email" size="medium"></el-input>
        </el-form-item>

        <el-form-item prop="status" label="状态">
          <el-input v-model="dialogForm.name" size="medium"></el-input>
        </el-form-item> -->
      </el-form>
    </div>

    <div v-else class="dialogCon">
      是否删除此条数据
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="dialogStatus !==  'del'" type="primary" @click="submitForm">确定</el-button>
        <el-button v-else type="danger" @click="submitDel">删除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
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
    dialogData:{
      type: Object,
      default: null,
    }
  },
  watch: {
    dialogStatus(value){
      if(value === 'edit'){
        this.dialogForm.name = this.dialogData.label;
      }

    }
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
        email: "",
      },
      rules: {
        name: [
          { required: true, message: "名称为必填项" },
          { max: 50, message: "最大长度50字符" },
        ],
      },
    };
  },
  methods: {
    handleClose(done) {
      this.$refs.dialogForm.resetFields();
      this.$emit("close-window", false);
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          console.log(this.dialogStatus, this.dialogForm.name);
        }
      });
    },
    submitDel(){
      this.$emit("close-window", false);

    }
  },
};
</script>

<style lang="less" scoped>
.dialogCon {
  width: 100%;
}
</style>
