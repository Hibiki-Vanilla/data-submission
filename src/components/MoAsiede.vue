<template>
  <section v-if="status" class="moAside">
    <div
      v-for="(item, index) in menuList"
      :key="index"
      class="bottomItem"
      :class="{ bottomItemAct: $route.path === item.path }"
      @click="routerjunp(item.path)"
    >
      <i :class="item.icon"></i>
      <span>{{ $t(item.name) }}</span>
    </div>
  </section>
</template>

<script>
import { inAuthority } from "@/utils/authority";
export default {
  data() {
    return {
      status: false,
      menuList: [
        {
          name: "menu.submission",
          submenu: false,
          path: "/fillIn",
          icon: "el-icon-upload2",
          state: inAuthority("1760840143028809732", 0),
        },
        {
          name: "menu.mange",
          submenu: false,
          path: "/management",
          icon: "el-icon-s-home",
          state: inAuthority("1760840143028809731", 0),
        },
      ],
    };
  },
  mounted() {
    this.status = inAuthority("1760840143028809731", 0);
  },
  methods: {
    routerjunp(value) {
      this.$route.path !== value && this.$router.push(value);
    },
  },
};
</script>

<style lang="less" scoped>
.moAside {
  display: none;
}
@media (max-width: 992px) {
  .moAside {
    z-index: 3;
    position: fixed;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 10px 0;
    bottom: 0;
    left: 0;

    background-color: #ffffff;
    .bottomItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;
      color: #303133;
      white-space: nowrap;
      font-size: 14px;
      i {
        color: #909399;
        font-size: 18px;
      }

      &.bottomItemAct {
        color: #409eff;
        i {
          color: #409eff;
        }
      }
    }
  }
}
</style>
