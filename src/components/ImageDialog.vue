<template>
  <el-dialog
    :visible="visible"
    :before-close="() => $emit('close-visible', false)"
  >
    <div class="con">
      <img
        v-if="status === `Image`"
        class="imgItem"
        :src="dialogImageUrl"
        alt=""
      />
      <video
        v-else
        x5-video-player-type="h5"
        x-webkit-airplay="true"
        webkit-playsinline
        playsinline
        x5-playsinline
        controls
        preload="auto"
        class="videoBox"
      >
        <source :src="dialogImageUrl" type="video/mp4" />
      </video>
    </div>

    <span
      class="el-image-viewer__btn el-image-viewer__prev"
      @click="listChange('prev')"
    >
      <i class="el-icon-arrow-left"></i>
    </span>

    <span
      class="el-image-viewer__btn el-image-viewer__next"
      @click="listChange('next')"
    >
      <i class="el-icon-arrow-right"></i>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    conList: {
      type: Array,
      default: () => [],
    },
    conListIndex: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    conList: {
      handler(now) {
        this.dialogImageUrl = now[this.conListIndex];
        this.nowIndex = this.conListIndex;
        this.status =
          now.length > 0
            ? this.fileNameHandle(this.dialogImageUrl)
              ? "Video"
              : "Image"
            : "Image";
      },
      deep: true,
    },
  },
  data() {
    return {
      status: "Image",
      nowIndex: 0,
      dialogImageUrl: "",
    };
  },
  methods: {
    fileNameHandle(url) {
      const fileExtension = url.split(".").pop();
      // 判断后缀名
      return (
        fileExtension === "avi" ||
        fileExtension === "mpeg" ||
        fileExtension === "mp4" ||
        fileExtension === "asf" ||
        fileExtension === "flv" ||
        fileExtension === "quicktime"
      );
    },

    listChange(type) {
      if (type === "next") {
        let num =
          this.conList.length - 1 === this.nowIndex ? 0 : this.nowIndex + 1;
        this.dialogImageUrl = this.conList[num];
        this.nowIndex = num;
      } else {
        let num =
          this.nowIndex === 0 ? this.conList.length - 1 : this.nowIndex - 1;
        this.dialogImageUrl = this.conList[num];
        this.nowIndex = num;
      }

      this.status =
        this.conList.length > 0
          ? this.fileNameHandle(this.dialogImageUrl)
            ? "Video"
            : "Image"
          : "Image";
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.el-dialog) {
  width: 60%;
  max-height: 100vh;

  .con {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 600px;
    .imgItem {
      height: 100%;
      width: auto;
      max-height: 100%;
      max-width: 100%;
    }
    .videoBox {
      height: auto;
      width: 100%;
      object-fit: cover;
    }
  }
}

@media (max-width: 1000px) {
  :deep(.el-dialog) {
    width: 96%;

    .con {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
      .imgItem {
        height: auto;
        width: 100%;
      }
    }
  }
}
</style>
