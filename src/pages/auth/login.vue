<script lang="js">
import Layout from "@/layouts/auth.vue";

import Captcha from "../forms/captcha.vue";
import {
  notificationMethods,
} from "@/store/helpers";


import {mapActions, mapState} from "vuex";

import appConfig from "@/app.config";
import { required, email, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  setup() {
    return { v$: useVuelidate()};
  },
  page: {
    title: "Masuk - Kantor Daring Urusan Merek Dagang",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    Captcha
  },
  data() {
    return {
      user:{
        email: null,
        password: null,
        captcha: null,
        remember: false,
      },
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    user:{
      email: {
        required: helpers.withMessage("Mohon masukkan email", required),
        email: helpers.withMessage("Mohon masukkan email yang benar", email),
      },
      password: {
        required: helpers.withMessage("Mohon masukkan password", required),
      },
      captcha: {
        required: helpers.withMessage("Mohon verifikasi Captcha", required),
      },
    },
  },
  computed: {
    ...mapState(["status"], ['recaptchaVerified'],['recaptchaError'], ['recaptchaFailed'], ['recaptchaExpired']),

    notification() {
      return this.$store ? this.$store.state.Notification : null;
    },
  },
  methods: {
    ...notificationMethods,
    ...mapActions('Auth', ['login']),

    handleRecaptchaVerified(response) {
      this.user.captcha = response;
    },

    handleRecaptchaError() {
      this.regError = "Recaptcha Error";
      this.isRegisterError = true;
    },

    handleRecaptchaFailed() {
      this.regError = "Recaptcha Error";
      this.isRegisterError = true;
    },

    tryToLogIn() {
      this.submitted = true;
      this.v$.$touch();

      if (this.v$.$invalid) {
        return;
      } else {
            this.login(this.user);
      }
    },
  },
  mounted() {},
};
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-info">
            <div class="row">
              <div class="col-9">
                <div class="text-info p-4">
                  <h5 class="text-info">Masuk Akun</h5>
                  <p>Bagi Anda yang sudah terdaftar, silakan masuk dengan akun yang Anda daftarkan.</p>
                </div>
              </div>
              <div class="col-3 align-self-end">
                <img
                  src="@/assets/images/profile-img.png"
                  alt
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo.svg" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>
            <b-alert
              v-model="isAuthError"
              variant="danger"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >
            <div
              v-if="notification.message"
              :class="'alert ' + notification.type"
            >
              {{ notification.message }}
            </div>

            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Email"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="user.email"
                  type="text"
                  placeholder="Enter email"
                  :class="{
                    'is-invalid': submitted && v$.user.email.$error,
                  }"
                ></b-form-input>
                <div
                  v-for="(item, index) in v$.user.email.$errors"
                  :key="index"
                  class="invalid-feedback"
                >
                  <span v-if="item.$message">{{ item.$message }}</span>
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Password"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="user.password"
                  type="password"
                  placeholder="Enter password"
                  :class="{
                    'is-invalid': submitted && v$.user.password.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && v$.user.password.$error"
                  class="invalid-feedback"
                >
                  <span v-if="v$.user.password.required.$message">{{
                    v$.user.password.required.$message
                  }}</span>
                </div>
              </b-form-group>
              <div class="my-2">
                <Captcha v-model="user.captcha" @recaptcha-verified="handleRecaptchaVerified"
                         @recaptcha-error="handleRecaptchaError" @recaptcha-failed="handleRecaptchaFailed"/>
                <div
                    v-if="submitted && v$.user.captcha.$error"
                    class="invalid-feedback d-block"
                >
                  <span v-if="v$.user.captcha.required.$invalid">{{
                      v$.user.captcha.required.$message
                    }}</span>
                </div>
              </div>

              <b-form-checkbox
                class="form-check-input"
                v-model="user.remember"
                id="customControlInline"
                name="remember"
                value="true"
                unchecked-value="false"
              >
                Ingat Saya
              </b-form-checkbox>

              <div class="mt-3 d-grid">
                <b-button type="submit" variant="info" class="btn-block btn-primary text-white"
                  >Masuk</b-button
                >
              </div>

              <div class="mt-4 text-center">
                <router-link to="/reset" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Lupa password?
                </router-link>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="mt-5 text-center">
          <p>
            Tidak memiliki akun?
            <router-link to="/register" class="fw-medium text-info"
              >Daftar Sekarang!</router-link
            >
          </p>
          <p>
            Kantor Daring Urusan Merek Dagang<br/> Direktorat Jenderal Paten dan Merek Dagang<br/>{{ new Date().getFullYear() }}
          </p>
        </div>
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>