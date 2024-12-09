<template>
  <section class="formEdit" v-loading="loading">
    <TopRow
      :top-title="topTitle"
      :component-list="componentList"
      :window-change="windowChange"
      @on-submit="titleSubmit"
      :pushNowValue="pushNowValue"
      :editInitData="editInitData"
    />
    <Container :component-list="componentList" ref="containerRef" />
    <SettingWindow
      :window-status="windowStatus"
      :window-data="windowData"
      :look-up-user-ids-options="lookUpUserIdsOptions"
      :cascader-options="cascaderOptions"
      @close-window="closeWindow"
      @on-submit="settingSubmit"
    />
  </section>
</template>

<script>
import TopRow from "./components/TopRow";
import Container from "./components/Container";
import SettingWindow from "./components/SettingWindow";
import {
  postDrsFormAdd,
  putDrsFormEdit,
  getDrsFormEditInit,
  getInnerDeptTree,
  getInnerTree,
} from "@/api";
import { componentList2JsonSchema } from "./components/common/editorData";
import jsonSchema2ComponentList from "./components/common/jsonSchema2ComponentList";

// 配置
import configTools from "./components/config/tools";

export default {
  name: "formEdit",
  components: {
    TopRow,
    Container,
    SettingWindow,
  },
  data() {
    return {
      loading: true,
      configTools,
      topTitle: "未命名表单",
      cascaderOptions: [],
      lookUpUserIdsOptions: [],

      editInitData: null,
      componentList: [],
      formConfig: {},
      windowStatus: false,
      windowData: {
        fillIn: null,
        fillInUserIds: null,
        lookUpUserIds: null,
        collaboratorsUserIds: null,

        time: null,
        submitTimes: 0,
        submitUpdate: false,

        numberUpdate: false,
        numberName: "",
        numberPrefix: "",
      },
    };
  },
  mounted() {
    if (this.$route.name === "infoEdit") {
      const id = this.$route.params.id;
      this.getInit(id);
    } else {
      this.innerTree();
      this.innerDeptTree();
      this.loading = false;
    }
    // 使用 ID 参数进行后续操作
  },
  methods: {
    buildTree(datas) {
      for (let i in datas) {
        datas[i].disabled = datas[i].type === 0 && !datas[i].children;
        if (datas[i].children) {
          this.buildTree(datas[i].children);
        }
      }
    },
    async innerTree() {
      const res = await getInnerTree();
      if (res?.success) {
        this.cascaderOptions = res?.data || [];
        this.buildTree(this.cascaderOptions);
        if (this.editInitData) {
          if (this.editInitData.fillIn !== 1) {
            let fillInUserIds = [];
            let fillInUserIdsList = this.editInitData.fillInUserIds || [];
            fillInUserIdsList.map((item) => {
              let arr = [];
              this.idsArrBuild(this.cascaderOptions, item, arr);
              fillInUserIds.push(arr);
            });
            this.windowData.fillInUserIds = fillInUserIds;
          }

          let lookUpUserIds = [];
          let lookUpUserIdsList = this.editInitData.lookUpUserIds || [];
          lookUpUserIdsList.map((item) => {
            let arr = [];
            this.idsArrBuild(this.cascaderOptions, item, arr);
            if (arr.length) {
              arr.unshift("none");
              lookUpUserIds.push(arr);
            }
          });
          if (lookUpUserIds.length > 0) {
            // console.log(lookUpUserIds);
            this.windowData.lookUpUserIds = [
              ...this.windowData.lookUpUserIds,
              ...lookUpUserIds,
            ];
          }
        }
      }
    },
    async innerDeptTree() {
      const res = await getInnerDeptTree();
      if (res?.success) {
        this.lookUpUserIdsOptions = res?.data || [];
        this.buildTree(this.lookUpUserIdsOptions);

        if (this.editInitData) {
          let lookUpUserIds = [];
          let lookUpUserIdsList = this.editInitData.lookUpUserIds || [];
          lookUpUserIdsList.map((item) => {
            let arr = [];
            this.idsArrBuild(this.lookUpUserIdsOptions, item, arr);
            if (arr.length) {
              lookUpUserIds.push(arr);
            }
          });
          this.windowData.lookUpUserIds = [
            ...this.windowData.lookUpUserIds,
            ...lookUpUserIds,
          ];

          let collaboratorsUserIds = [];
          let collaboratorsUserIdsList = this.editInitData.collaboratorsUserIds || [];
          collaboratorsUserIdsList.map((item) => {
            let arr = [];
            this.idsArrBuild(this.lookUpUserIdsOptions, item, arr);
            if (arr.length) {
              collaboratorsUserIds.push(arr);
            }
            this.windowData.collaboratorsUserIds = collaboratorsUserIds;
          });

          // 全部
          if (this.editInitData.fillIn === 1) {
            let fillInUserIds = [];
            let fillInUserIdsList = this.editInitData.fillInUserIds || [];
            fillInUserIdsList.map((item) => {
              let arr = [];
              this.idsArrBuild(this.lookUpUserIdsOptions, item, arr);
              fillInUserIds.push(arr);
            });
            this.windowData.fillInUserIds = fillInUserIds;
          }
        }
      }
    },

    idsArrBuild(data, value, result = []) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.value === value) {
          result.unshift(item.value);
          return true;
        }
        if (item.children && item.children.length > 0) {
          if (this.idsArrBuild(item.children, value, result)) {
            result.unshift(item.value);
            return true;
          }
        }
      }
      return false;
    },
    async getInit(id) {
      const res = await getDrsFormEditInit(id);
      if (res?.success) {
        const formStructure = res.data.formStructure;
        const data = jsonSchema2ComponentList(formStructure, this.configTools);
        const { errorNode, componentList, formConfig } = data;

        this.componentList = componentList;
        this.formConfig = formConfig;
        this.topTitle = res.data.formName;
        this.editInitData = res.data;
        this.windowData = {
          fillIn: res.data.fillIn,
          fillInUserIds: [],
          lookUpUserIds: [],
          collaboratorsUserIds: [],
          time: res.data.acquisitionStartTime
            ? [res.data.acquisitionStartTime, res.data.acquisitionEndTime]
            : null,
          submitTimes: res.data.submitTimes,
          submitUpdate: res.data.submitUpdate ? true : false,
          numberUpdate: res.data.numberName ? true : false,
          numberName: res?.data?.numberName,
          numberPrefix: res?.data?.numberPrefix,
        };
        this.innerTree();
        this.innerDeptTree();
        this.loading = false;
      }
    },
    titleSubmit(data) {
      this.topTitle = data;
    },
    windowChange() {
      // 处理
      this.windowStatus = true;
    },
    closeWindow(data) {
      this.windowStatus = false;
    },
    settingSubmit(data) {
      this.windowStatus = false;
      this.windowData = data;
    },
    async pushNowValue(status) {
      let componentList = this.componentList;
      if (this.topTitle.length === 0 || this.topTitle.trim() === "未命名表单") {
        this.$message.error("请输入表单名称");
      } else if (componentList.length === 0) {
        this.$message.error("请先添加有效字段");
      } else if (
        status === 1 &&
        (this.windowData.fillIn === null || this.windowData.fillIn === undefined)
      ) {
        this.$message.error("请填写设置内容");
      } else {
        // 默认表格属性
        const defaultConfig = {
          formFooter: {
            show: true,
            okBtn: "保存",
            cancelBtn: "取消",
          },
          formProps: this.$refs.containerRef.formProps || {
            inline: false,
            inlineFooter: false,
            layoutColumn: 1,
            labelPosition: "top",
          },
        };
        let fillInUserIds = [];
        if (this.windowData.fillInUserIds) {
          this.windowData.fillInUserIds.map((item) => {
            fillInUserIds.push(item[item.length - 1]);
          });
        }

        let lookUpUserIds = [];
        if (this.windowData.lookUpUserIds) {
          this.windowData.lookUpUserIds.map((item) => {
            lookUpUserIds.push(item[item.length - 1]);
          });
        }
        // 协助者
        let collaboratorsUserIds = [];
        if (this.windowData.collaboratorsUserIds) {
          this.windowData.collaboratorsUserIds.map((item) => {
            collaboratorsUserIds.push(item[item.length - 1]);
          });
        }

        if (status) {
          this.$confirm(`确定发布表单？`, `发布表单`, {
            customClass: "mobileConfirm", // 添加自定义类名
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showClose: false,
          })
            .then(async () => {
              componentList.map((item) => {
                if (item.componentPack.viewSchema.storeName === "product") {
                  item.componentPack.viewSchema["ui:options"].options = [];
                } else if (item.componentPack.viewSchema.storeName === "country") {
                  item.componentPack.viewSchema["ui:enumOptions"] = [];
                }
              });
              const formStructure = {
                schema: componentList2JsonSchema(componentList),
                uiSchema: {},
                formFooter: defaultConfig.formFooter,
                formProps: defaultConfig.formProps,
              };

              let data = {
                formName: this.topTitle,
                formStructure: JSON.stringify(formStructure),
                state: status,
                fillIn: this.windowData.fillIn,
                fillInUserIds:
                  this.windowData.fillIn === 1 || this.windowData.fillIn === 3
                    ? fillInUserIds
                    : [],
                lookUpUserIds: lookUpUserIds,
                collaboratorsUserIds: collaboratorsUserIds,
                acquisitionStartTime: this.windowData.time
                  ? this.windowData.time[0]
                  : null,
                acquisitionEndTime: this.windowData.time ? this.windowData.time[1] : null,
                submitTimes: this.windowData.submitTimes,
                submitUpdate: this.windowData.submitUpdate ? "1" : "0",
              };
              // 判断是否有编号状态
              if (this.windowData.numberUpdate) {
                data.numberName = this.windowData.numberName;
                if (this.windowData.numberPrefix) {
                  data.numberPrefix = this.windowData.numberPrefix;
                }
              }

              if (this.$route.name === "infoEdit") {
                data.id = this.$route.params.id;
              }
              const res =
                this.$route.name === "infoEdit"
                  ? await putDrsFormEdit(data)
                  : await postDrsFormAdd(data);
              if (res?.success) {
                this.$message.success(`发布成功`);
                this.$router.push("/management");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((_) => {});
        } else {
          componentList.map((item) => {
            if (item.componentPack.viewSchema.storeName === "product") {
              item.componentPack.viewSchema["ui:options"].options = [];
            } else if (item.componentPack.viewSchema.storeName === "country") {
              item.componentPack.viewSchema["ui:enumOptions"] = [];
            }
          });
          const formStructure = {
            schema: componentList2JsonSchema(componentList),
            uiSchema: {},
            formFooter: defaultConfig.formFooter,
            formProps: defaultConfig.formProps,
          };

          let data = {
            formName: this.topTitle,
            formStructure: JSON.stringify(formStructure),
            state: status,
            fillIn: this.windowData.fillIn,
            fillInUserIds:
              this.windowData.fillIn === 1 || this.windowData.fillIn === 3
                ? fillInUserIds
                : [],
            lookUpUserIds: lookUpUserIds,
            collaboratorsUserIds: collaboratorsUserIds,
            acquisitionStartTime: this.windowData.time ? this.windowData.time[0] : null,
            acquisitionEndTime: this.windowData.time ? this.windowData.time[1] : null,
            submitTimes: this.windowData.submitTimes,
            submitUpdate: this.windowData.submitUpdate ? "1" : "0",
          };

          // 判断是否有编号状态
          if (this.windowData.numberUpdate) {
            data.numberName = this.windowData.numberName;
            if (this.windowData.numberPrefix) {
              data.numberPrefix = this.windowData.numberPrefix;
            }
          }

          if (this.$route.name === "infoEdit") {
            data.id = this.$route.params.id;
          }
          const res =
            this.$route.name === "infoEdit"
              ? await putDrsFormEdit(data)
              : await postDrsFormAdd(data);
          if (res?.success) {
            this.$message.success(`保存成功`);
            this.$router.push("/management");
          } else {
            this.$message.error(res.msg);
          }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.formEdit {
  width: 100%;
}
</style>
