<template>
  <section class="pageTop">
    <div class="textbox">
      <div class="textTitle">{{ title }}</div>
      <div class="textTip">{{ tip }}</div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PageTop",
  props: ["title", "tip"],
};
</script>

<style lang="less" scoped>
.pageTop {
  display: flex;
  align-items: center;
  width: 100%;
  height: 92px;
  padding: 0 50px;
  box-sizing: border-box;
  color: rgba(80, 80, 80, 1);
  background-color: #ffffff;

  .textbox {
    display: flex;
    flex-direction: column;
  }
  .textTitle {
    color: rgba(80, 80, 80, 1);
    font-size: 24px;
    line-height: 150%;
    text-align: left;
    font-weight: bold;
  }
  .textTip {
    padding-top: 6px;
    color: rgba(169, 169, 169, 1);
    font-size: 14px;
    line-height: 150%;
    text-align: left;
  }
}

@media (max-width: 992px) {
  .pageTop {
    padding: 0 24px;
  }
}
</style>
