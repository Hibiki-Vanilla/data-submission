<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-upload
    :action="flieLoadUrl()"
    :headers="flieHeader"
    :on-error="handError"
    :on-remove="handleRemove"
    :on-success="handleChange"
    :before-upload="beforeNewUpload"
    :placeholder="placeholder"
    :disabled="disabled"
    :file-list="fileList"
    :limit='1'
  >
    <el-button type="primary" :disabled="disabled">
      {{ btnText || "点击上传" }}
    </el-button>
  </el-upload>
</template>

<script>
import { decryptByDES } from "@/utils/aes";
import { openNewPage } from "@lljj/vjsf-utils/utils";
export default {
  name: "UploadStringWidget",
  props: {
    value: {
      type: String,
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
    if (this.$attrs.fileList) {
      this.emitValue(this.$attrs.fileList);
    }
    const fileList =
      this.$attrs.fileList ||
      (() => {
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
      isArrayValue: false,
      fileList,
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
    flieLoadUrl() {
      let webUrl = window.location.protocol + '//' + window.location.host;
      return `${webUrl}/u/drs/file/upload/dataFilling`;
    },
    emitValue(fileList) {
      // v-model
      let value;
      const fileItem = fileList[fileList.length - 1];
      value = this.getUrl(fileItem);
      this.$emit("input", value);
    },
    beforeNewUpload(file) {
      const isLt100M = file.size < 100 * 1024 * 1024 ? true : false;
      if (!isLt100M) {
        this.$message.error("Upload files cannot exceed 100MB!");
      }
      return isLt100M 
    },
    handError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    handleRemove(file, fileList) {
      this.emitValue(fileList);

    },
    handleChange(response, file, fileList) {
      if (response?.success) {
        this.emitValue(fileList);
      } else {
        this.$message.error(this.$t('editInfo.uploadfailed'));
        let list = fileList;
        const index = fileList.findIndex(
          (item, index) => item.uid === file.uid
        );
        list.splice(index, 1);
        this.emitValue(fileList);
      }
    },
  },
};
</script>
