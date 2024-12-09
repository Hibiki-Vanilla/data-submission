<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <el-upload
      :action="flieLoadUrl()"
      :headers="flieHeader"
      multiple
      :limit="20"
      :on-error="handError"
      :on-remove="handleRemove"
      :on-success="handleChange"
      :before-upload="beforeNewUpload"
      :placeholder="placeholder"
      :disabled="disabled"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button type="primary" :disabled="disabled">
        {{ btnText || "点击上传" }}
      </el-button>
      <template v-slot:file="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="fileNameHandle(file)" alt="" />
        <div class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-name"
            @click="handlePictureCardPreview(file)"
            >{{ file.name }}</span
          >
        </div>
        <label v-show="!disabled" class="el-upload-list__item-status-label"
          ><i class="el-icon-upload-success el-icon-check"></i
        ></label>
        <i v-show="!disabled" class="el-icon-close" @click="itemRemove(file)"></i>
      </template>
    </el-upload>
    <el-dialog :visible="dialogVisible" :before-close="handleClose">
      <img v-if="!videoStatus" width="100%" :src="dialogImageUrl" alt="" />
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
    </el-dialog>
  </div>
</template>

<script>
import { decryptByDES } from "@/utils/aes";
import { openNewPage } from "@lljj/vjsf-utils/utils";
export default {
  name: "UploadImgWidget",
  props: {
    value: {
      type: [String, Array],
      default: null,
    },
    responseFileUrl: {
      type: [Function],
      default: (res) => (res ? res.url || (res.data && res.data.url) : ""),
    },
    placeholder: {
      type: String,
      default: "",
    },
    btnText: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    slots: {
      type: null,
      default: null,
    },
  },
  data() {
    // 设置默认
    const value = this.value;
    const isArrayValue = Array.isArray(value);
    if (this.$attrs.fileList) {
      this.emitValue(this.$attrs.fileList, Array.isArray(value));
    }
    const fileList =
      this.$attrs.fileList ||
      (() => {
        if (isArrayValue) {
          return value.map((item, index) => ({
            name: `文件${index + 1}`,
            url: item,
          }));
        }
        if (value) {
          return [
            {
              name: `文件`,
              url: value,
            },
          ];
        }

        return [];
      })();
    return {
      isArrayValue,
      fileList,

      dialogImageUrl: null,
      dialogVisible: false,
      videoStatus: false,
    };
  },
  computed: {
    flieHeader() {
      let c_token = localStorage.getItem("dst") || "";
      return {
        Authorization: `Bearer ${decryptByDES(c_token, "dst")}`,
      };
    },
  },
  methods: {
    getUrl(fileItem) {
      return (
        (fileItem &&
          ((fileItem.response && this.responseFileUrl(fileItem.response)) ||
            fileItem.url)) ||
        ""
      );
    },
    handlePictureCardPreview(file) {
      const name = this.fileNameHandle(file);
      this.videoStatus = name === "/langTableEmpty.png";
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
    fileNameHandle(file) {
      const fileExtension = file.name.split(".").pop();
      let url = file.url;
      // 判断后缀名
      if (
        fileExtension === "avi" ||
        fileExtension === "mpeg" ||
        fileExtension === "mp4" ||
        fileExtension === "asf" ||
        fileExtension === "flv" ||
        fileExtension === "quicktime"
      ) {
        url = "/langTableEmpty.png";
      }

      return url;
    },
    flieLoadUrl() {
      let webUrl = window.location.protocol + "//" + window.location.host;
      return `${webUrl}/u/drs/file/upload/dataFilling`;
    },
    emitValue(fileList, isArray) {
      // v-model
      this.fileList = fileList;
      let value;
      if (this.isArrayValue || isArray) {
        value = fileList.length
          ? fileList.reduce((pre, item) => {
              const url = this.getUrl(item);
              if (url) pre.push(url);
              return pre;
            }, [])
          : [];
      } else {
        const fileItem = fileList[fileList.length - 1];
        value = this.getUrl(fileItem);
      }
      this.$emit("input", value);
    },
    beforeNewUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/webp" ||
        file.type === "video/avi" ||
        file.type === "video/mpeg" ||
        file.type === "video/mp4" ||
        file.type === "video/asf" ||
        file.type === "video/flv" ||
        file.type === "image/heic" ||
        file.type === "video/quicktime";
      if (!isJpgOrPng) {
        this.$message.error(
          "Only supports JPG/JPEG/PNG/WEBP/AVI/MPEG/MP4/ASF/HELF/HEVC format/flv"
        );
      }
      const isLt100M = file.size < 100 * 1024 * 1024 ? true : false;
      if (!isLt100M) {
        this.$message.error("Upload files cannot exceed 100MB!");
      }
      if (isLt100M && isJpgOrPng) {
        this.uploadLock = this.uploadLock + 1;
      }
      return isLt100M && isJpgOrPng;
    },
    handError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    itemRemove(file) {
      let list = [...this.fileList];
      let newList = [];
      list.map((item) => {
        if (item.uid !== file.uid) {
          newList.push(item);
        }
      });
      this.fileList = newList;
      this.handleRemove(file, newList);
    },
    handleRemove(file, fileList) {
      this.emitValue(fileList);
      // if (this.$attrs["on-remove"]) {
      //   this.$attrs["on-remove"](file, fileList);
      // }
    },
    handleChange(response, file, fileList) {
      if (response?.success) {
        this.emitValue(fileList);
      } else {
        this.$message.error(this.$t("editInfo.uploadfailed"));
        let list = fileList;
        const index = fileList.findIndex((item, index) => item.uid === file.uid);
        list.splice(index, 1);
        this.emitValue(fileList);
      }
      // 用户注册的 onSuccess
      // if (this.$attrs["on-success"]) {
      //   this.$attrs["on-success"](response, file, fileList);
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.videoBox {
  width: 100%;
  object-fit: cover;
}
</style>
