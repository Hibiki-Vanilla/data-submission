<template>
  <section class="box">
    <div class="leftBox">
      <i class="el-icon-back" @click="$router.push(`/listInfo/${routeValue}`)"></i>
      <div class="title">编辑修改</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    routeValue: {
      type: String,
      default: "",
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
</style>
