<template>
  <!-- 侧边 -->
  <el-aside class="aside" :width="isCollapsed ? '64px' : '250px'">
    <el-menu :default-active="$route.path" :collapse="isCollapsed">
      <template v-for="item in menuList">
        <template v-if="item.submenu && item.state">
          <el-submenu :index="item.path" :key="item.path">
            <template v-slot:title>
              <i :class="item.icon"></i>
              <span>{{ $t(item.name) }}</span>
            </template>
            <el-menu-item-group>
              <div v-for="subItem in item.children" :key="subItem.path">
                <el-menu-item
                  v-if="subItem.state"
                  :index="subItem.path"
                  :key="subItem.path"
                  @click="routerjunp(subItem.path)"
                >
                  {{ $t(subItem.name) }}
                </el-menu-item>
              </div>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <template v-if="!item.submenu && item.state">
          <el-menu-item
            :index="item.path"
            :key="item.path"
            @click="routerjunp(item.path)"
          >
            <i :class="item.icon"></i>
            <template v-slot:title>
              <span>{{ $t(item.name) }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="bottomRow" :style="`width:${isCollapsed ? '64px' : '250px'}`">
      <div class="collapseBtn" @click="isCollapsed = !isCollapsed">
        <i class="el-icon-s-unfold" v-if="isCollapsed"></i>
        <i class="el-icon-s-fold" v-else></i>
      </div>
    </div>
  </el-aside>
</template>

<script>
import { inAuthority } from "@/utils/authority";
export default {
  name: "LayoutAside",
  data() {
    return {
      active: "1",
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
        {
          name: "menu.account",
          submenu: true,
          path: "/account",
          icon: "el-icon-user-solid",
          state: inAuthority("1760840143028809733", 0),
          children: [
            {
              name: "menu.uwell",
              path: "/internal",
              state: inAuthority("1760840143028809736", 0),
            },
            {
              name: "menu.external",
              path: "/external",
              state: inAuthority("1760840143028809737", 0),
            },
          ],
        },
      ],
      innerWidth: 1000,
      isCollapsed: false,
    };
  },
  mounted() {
    this.innerWidth = window.innerWidth;
    window.addEventListener("resize", this.handleWindowResize);
  },
  methods: {
    routerjunp(value) {
      this.$route.path !== value && this.$router.push(value);
    },
    handleWindowResize() {
      // 更新窗口宽度
      this.innerWidth = window.innerWidth;
    },
  },
};
</script>

<style lang="less" scoped>
.aside {
  // width: 250px !important;

  .bottomRow {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    width: 250px;
    left: 0;
    bottom: 10px;

    .collapseBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
    }
  }
}
@media (max-width: 992px) {
  .aside {
    display: none;
    width: 0px !important;
  }
}
</style>
