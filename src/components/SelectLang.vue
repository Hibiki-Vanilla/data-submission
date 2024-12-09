<template>
  <el-dropdown placement="bottom" trigger="click" @command="translate">
    <div class="el-dropdown-link">
      <img src="@/assets/global/lang.svg" class="logo" alt="" />
    </div>
    <el-dropdown-menu>
      <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
      <el-dropdown-item command="en">English</el-dropdown-item>
      <el-dropdown-item command="ru">Русский</el-dropdown-item>
      <el-dropdown-item command="fr">Français</el-dropdown-item>
      <el-dropdown-item command="it">Italiano</el-dropdown-item>
      <el-dropdown-item command="es">Español</el-dropdown-item>
      <el-dropdown-item command="pt">Português</el-dropdown-item>
      <el-dropdown-item command="ko">한국어</el-dropdown-item>
      <el-dropdown-item command="ja">日本語</el-dropdown-item>
      <el-dropdown-item command="ar">العربية </el-dropdown-item>
      <el-dropdown-item command="id">Bahasa Indonesia </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
//中文 英文English 俄语 Русский 法语 Français 意大利语 Italiano
// 西班牙语 Español 葡萄牙语 Português 韩语 한국어 日语 日本語 阿拉伯语 العربية
// 印尼语 Bahasa Indonesia
import { i18n } from "@lljj/vue-json-schema-form";
import localizeZh from "ajv-i18n/localize/zh";
import localizeEn from "ajv-i18n/localize/en";
import localizeRu from "ajv-i18n/localize/ru";
import localizeFr from "ajv-i18n/localize/fr";
import localizeIt from "ajv-i18n/localize/it";
import localizeEs from "ajv-i18n/localize/es";
import localizePt from "ajv-i18n/localize/pt-BR";
import localizeKo from "ajv-i18n/localize/ko";
import localizeJa from "ajv-i18n/localize/ja";
import localizeAr from "ajv-i18n/localize/ar";
import localizeId from "ajv-i18n/localize/id";


import locale from "element-ui/lib/locale";
import langZh from "element-ui/lib/locale/lang/zh-CN";
import langRu from "element-ui/lib/locale/lang/ru-RU";
import langEn from "element-ui/lib/locale/lang/en";
import langFr from "element-ui/lib/locale/lang/fr";
import langIt from "element-ui/lib/locale/lang/it";
import langEs from "element-ui/lib/locale/lang/es";
import langPt from "element-ui/lib/locale/lang/pt";
import langKo from "element-ui/lib/locale/lang/ko";
import langJa from "element-ui/lib/locale/lang/ja";
import langAr from "element-ui/lib/locale/lang/ar";
import langId from "element-ui/lib/locale/lang/id";

export default {
  name: "SelectLang",
  data() {
    return {
      localize: {
        'zh-CN': localizeZh,
        en: localizeEn,
        ru: localizeRu,
        fr: localizeFr,
        it: localizeIt,
        es: localizeEs,
        pt: localizePt,
        ko: localizeKo,
        ja: localizeJa,
        ar: localizeAr,
        id: localizeId,
      },
      localeList: {
        en: langEn,
        ru: langRu,
        'zh-CN': langZh,
        fr: langFr,
        it: langIt,
        es: langEs,
        pt: langPt,
        ko: langKo,
        ja: langJa,
        ar: langAr,
        id: langId,
      },
    };
  },
  methods: {
    translate(lang) {
      this.$i18n.locale = lang;
      i18n.useLocal(this.localize[lang]);
      locale.use(this.localeList[lang]);
      document.title = this.$t("login.title");
      localStorage.setItem("dslocale", lang);
    },
  },
};
</script>

<style lang="less" scoped>
.el-dropdown-link {
  display: flex;
  cursor: pointer;
  padding: 0 10px;

  .logo {
    height: 24px;
    height: 24px;
    padding: 0 10px;
  }
}
</style>
