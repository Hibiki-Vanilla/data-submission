<template>
  <!-- 添加一个 div 用作容器 -->
  <div :id="uniqueIdentifier" ref="grecaptcha"></div>
</template>
<script>
export default {
  data() {
    return {
      uniqueIdentifier: null,
      gooleGRecaptcha: null,
      sitekey: "6Le-XZQpAAAAAP3ssSO7Y70aZIlipDTFpo0DvtsZ",
    };
  },
  methods: {
    submit: function (token) {
      this.$emit("get-token", token);
      window.grecaptcha.reset(this.gooleGRecaptcha);
    },
    loaded() {
      setTimeout(() => {
        if (window.grecaptcha) {
          const elementId = this.uniqueIdentifier;
          this.gooleGRecaptcha = window.grecaptcha.render(elementId, {
            sitekey: this.sitekey,
            callback: this.submit,
            size: "invisible",
          });
        } else {
          this.loaded();
        }
      }, 800);
    },
    execute() {
      window.grecaptcha.execute(this.gooleGRecaptcha);
    },
  },
  beforeUnmount() {
    const elementId = `recaptcha-${this.uniqueIdentifier}`;
    const widgetId = window.grecaptcha.getResponse(elementId);
    if (widgetId) {
      window.grecaptcha.reset(widgetId);
    }
  },
  mounted() {
    this.uniqueIdentifier = `recaptcha-${this._uid}`;
    this.loaded();
  },
};
</script>
