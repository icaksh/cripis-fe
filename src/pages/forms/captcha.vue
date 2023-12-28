<template>
  <vue-recaptcha v-show="showRecaptcha" sitekey="6LdWf8ooAAAAAPgvZTyEQ9wTQ-BrKSuitoBymbBB"
                 size="normal"
                 theme="light"
                 hl="id"
                 :loading-timeout="loadingTimeout"
                 @verify="recaptchaVerified"
                 @expire="recaptchaExpired"
                 @fail="recaptchaFailed"
                 @error="recaptchaError"
                 ref="vueRecaptcha">
  </vue-recaptcha>
</template>


<script lang="js">

import vueRecaptcha from 'vue3-recaptcha2';

export default {
  components: {
    vueRecaptcha
  },
  data() {
    return {
      key: "6LdWf8ooAAAAAPgvZTyEQ9wTQ-BrKSuitoBymbBB",
      showRecaptcha: true,
      loadingTimeout: 30000, // 30 seconds
      recaptchaResponse: null,
    }
  },
  methods: {
    recaptchaVerified(response){
      this.recaptchaResponse = response;
      this.$emit('recaptcha-verified', response);
    },
    recaptchaExpired() {
      this.$refs.vueRecaptcha.reset();
    },
    recaptchaFailed() {
      this.$emit('recaptcha-failed')
    },
    recaptchaError(){
      this.$emit('recaptcha-error')
    }
  }
};
</script>