<script>
import Layout from "@/layouts/auth.vue";

import appConfig from "@/app.config.json";

import {required, helpers, email} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Captcha from "@/pages/forms/captcha.vue";
import {reset} from '.';
import Swal from "sweetalert2";

export default {
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },

  page: {
    title: "Reset Password",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Captcha,
    Layout,
  },

  data() {
    return {
      user: {
        email: "",
        captcha:""
      },
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
    };
  },
  validations() {
    return {
      user: {
        email: {
          required: helpers.withMessage("Mohon masukkan Email", required),
          email: helpers.withMessage("Email yang Anda masukkan tidak valid", email),
        },
      },
    }
  },
  computed: {

  },
  methods: {

    handleRecaptchaVerified(response) {
      this.user.captcha = response;
    },

    tryToRegisterIn() {
      this.submitted = true;

      this.v$.$touch()
      if (this.v$.$invalid) {
        return;
      } else {
        reset(this.user).then(
            () => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Jika email Anda terdaftar, kami akan mengirimkan email untuk mengatur ulang kata sandi Anda',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push({name: 'login'})
          })
        },
        err => {
          Swal.fire({
            title: "Gagal",
            text: "Gagal mengatur ulang kata sandi, " + err.message,
            icon: "error",
            confirmButtonText: "OK",
          })
        })

      }
    },
  },
};
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-6">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-info mb-4">
            <div class="row">
              <div class="col-12">
                <div class="text-info p-4">
                  <h4 class="text-info">Atur Ulang Kata Sandi</h4>
                  <p class="text-info">Anda perlu memasukkan email yang terdaftar untuk mengatur ulang kata sandi Anda</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">

            <b-form class="p-2" @submit.prevent="tryToRegisterIn">

              <div class="row">
                <b-form-group
                    class="mb-3"
                    id="email-group"
                    label="Email"
                    label-for="email"
                >
                  <b-form-input
                      id="email"
                      v-model="user.email"
                      type="email"
                      placeholder="Enter email"
                      @input="()=>v$.user.email.$touch()"
                      :class="{
                    'is-invalid': v$.user.email.$error,
                  }"
                  ></b-form-input>
                  <div
                      v-if="v$.user.email.$pending || v$.user.email.$error"
                      class="invalid-feedback"
                  >
                  <span v-if="v$.user.email.required.$invalid">{{
                      v$.user.email.required.$message
                    }}</span>
                    <span v-else-if="v$.user.email.email.$invalid">{{
                        v$.user.email.email.$message
                      }}</span>
                  </div>
                </b-form-group>
              </div>
                <div class="mt-3">
                  <Captcha v-model="user.captcha" @recaptcha-verified="handleRecaptchaVerified"
                           @recaptcha-error="handleRecaptchaError" @recaptcha-failed="handleRecaptchaFailed"/>
                </div>
              <div class="mt-4 d-grid">
                <b-button type="submit" variant="info" class="btn-block btn-primary text-white"
                  >Reset Password
                </b-button
                >
              </div>
            </b-form>
          </div>
        </div>

        <div class="mt-5 text-center">
          <p>
            Ingat passwordnya?
            <router-link to="/login" class="fw-medium text-info"
            >Menuju ke halaman Masuk
            </router-link
            >
          </p>
          <p>
            Kantor Daring Urusan Merek Dagang<br/> Direktorat Jenderal Paten dan Merek Dagang<br/>{{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>