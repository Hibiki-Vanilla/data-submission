<template>
  <section class="box">
    <div class="leftBox">
      <i class="el-icon-back" @click="backHandle"></i>
      <div class="title">{{ $t("menu.submission") }}</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    conStatus: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    backHandle() {
      const valueList = Object.keys(this.formData);
      if (this.conStatus !== 2 && valueList.length > 0) {
        // 是否空？
        let status = false;
        for (let i = 0; i < valueList.length; i++) {
          const value = this.formData[valueList[i]];
          if (
            (typeof value === "object" && Object.keys(value).length > 0) ||
            (typeof value === "string" && value.trim() !== "") ||
            (Array.isArray(value) && value.length > 0)
          ) {
            status = true;
          }
        }

        if (status) {
          this.$confirm(this.$t("editFill.backSaveTip"), {
            distinguishCancelAndClose: true,
            confirmButtonText: this.$t("editFill.save"),
            cancelButtonText: this.$t("editFill.nosave"),
            customClass: "mobileConfirm", // 添加自定义类名
            showClose: false,
          })
            .then(() => {
              this.$emit("on-save", false);
            })
            .catch((_) => {
              this.$router.push(`/fillIn`);
            });
        } else {
          this.$router.push(`/fillIn`);
        }
      } else {
        this.$router.push(`/fillIn`);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 12px;
  padding-right: 30px;
  width: 100%;
  height: 48px;
  margin-bottom: 4px;
  background-color: #fff;

  .leftBox {
    display: flex;
    align-items: center;

    .el-icon-back {
      cursor: pointer;
      font-size: 28px;
      margin-right: 16px;
    }

    .title {
      cursor: pointer;
      color: rgba(80, 80, 80, 1);
      font-size: 18px;
      font-weight: bold;
      min-width: 200px;
      width: 200px;
      height: 28px;
      line-height: 28px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 溢出内容隐藏 */
      text-overflow: ellipsis; /* 文本超出显示省略号 */
    }
  }
}

@media (max-width: 992px) {
  .box {
    .leftBox {
      .el-icon-back {
        font-size: 24px;
        margin-right: 12px;
      }
      .title {
        font-size: 16px;
      }
    }
  }
}
</style>
