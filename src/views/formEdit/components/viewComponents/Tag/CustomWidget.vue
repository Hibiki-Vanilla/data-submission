<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
      <input type="text" v-model="localValue" :placeholder="placeholder" @input="handleChange">
    </div>
</template>
  
<script>
  export default {
    name:'CustomWidget',
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data(){
      return{
        localValue: this.value
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('input', this.localValue);
      }
    }
  };
</script>