<template>
  <section v-loading="loading">
    <TopRow :route-value="$route.params.topId" />
    <div class="con">
      <div v-show="customNumbers" class="conNumber">
        {{ numberName }}：{{ customNumbers }}
      </div>
      <div class="conTitle">{{ formName }}</div>
      <VueJsonFrom
        v-model="formData"
        :ui-schema="uiSchema"
        :schema="schema"
        :form-footer="formFooter"
        :form-props="jsonFromValue ? jsonFromValue.formProps : {}"
      ></VueJsonFrom>
      <div class="conTop">
        <span>创建人： {{ createBy }}</span>
        <span>更新时间：{{ timeChange(updateTime) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { getFormDataDetails } from "@/api";
import TopRow from "./components/TopRow.vue";
import configTools from "@/views/formEdit/components/config/tools";
import VueJsonFrom from "@lljj/vue-json-schema-form";
import dayjs from "dayjs";
import { useStore } from "@/store";
export default {
  name: "DetailsPage",
  components: {
    TopRow,
    VueJsonFrom,
  },
  data() {
    return {
      loading: false,
      configTools,

      jsonFromValue: null,
      numberName: "",
      customNumbers: "",
      formName: "",
      createBy: "",
      updateTime: "",
      formData: {},
      formFooter: { show: false },
      schema: {},
      uiSchema: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    timeChange(time) {
      return dayjs.unix(time / 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    buildValue(data) {},
    async getInfo() {
      this.loading = true;
      const res = await getFormDataDetails(this.$route.params.id);
      if (res?.success) {
        this.numberName = res.data.numberName || "";
        this.customNumbers = res.data.customNumbers || "";
        this.formName = res.data.formName;
        this.createBy = res.data.createBy;
        this.updateTime = res.data.updateTime;

        const formStructure = JSON.parse(res.data.formStructure);
        for (let key in formStructure.schema.properties) {
          if (formStructure.schema.properties[key].storeName === "product") {
            formStructure.schema.properties[key]["ui:options"] = useStore().productList;
          }
        }
        this.schema = formStructure.schema;
        this.jsonFromValue = formStructure;
        this.uiSchema = formStructure.uiSchema;
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.con {
  width: 820px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 20px;
  margin: 48px auto;
  padding: 33px 70px;
  display: flex;
  flex-direction: column;
  // align-items: center;
}
.conTop {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  color: rgba(80, 80, 80, 1);
}
.conTitle {
  color: rgba(80, 80, 80, 1);
  font-size: 24px;
  padding: 30px 0 40px;
  text-align: center;
  font-weight: bold;
}
.conNumber {
  color: rgba(80, 80, 80, 1);
  font-size: 16px;
}



@media (max-width: 992px) {
  .con {
    width: calc(100% - 28px);
    margin: 38px 14px;
    padding: 33px 22px;
    box-sizing: border-box;
  }

  .conTitle {
    font-size: 14px;
    padding: 20px 0 20px;
  }

  .tipTextRow {
    padding-top: 90px;
    font-size: 14px;
  }
  .successLogo {
    margin: 0 auto;
    padding: 80px 0 12px;
    height: 82px;
    width: 82px;
  }
  .tipText {
    font-size: 18px;
  }

  .bottomRow {
    right: 0;
    bottom: 0;
    height: 80px;
    width: 100%;
  }
}
</style>
