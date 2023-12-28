<script>
import {
  notificationMethods,
} from "@/store/helpers";
import Layout from "@/layouts/auth.vue";

import appConfig from "@/app.config.json";
import {mapActions, mapState} from "vuex";

import {required, helpers, email, sameAs, integer} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Captcha from "@/pages/forms/captcha.vue";
import Address from "@/pages/forms/address.vue";
import {register} from '.';
import Swal from "sweetalert2";

export default {
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },

  page: {
    title: "Daftar Akun",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Address,
    Captcha,
    Layout,
  },

  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        nik: "",
        birth: "",
        sex: "",
        address: "",
        province: "",
        regency: "",
        district: "",
        village: "",
        zipcode: "",
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
        firstName: {
          required: helpers.withMessage("Mohon masukkan Nama Depan", required),
        },
        lastName: {
          required: helpers.withMessage("Mohon masukkan Nama Belakang", required),
        },
        email: {
          required: helpers.withMessage("Mohon masukkan Email", required),
          email: helpers.withMessage("Email yang Anda masukkan tidak valid", email),
        },
        password: {
          required: helpers.withMessage("Mohon masukkan Password", required),
        },
        confirmPassword: {
          required: helpers.withMessage("Mohon masukkan konfirmasi Password", required),
          isConfirmed:
              helpers.withMessage("Password tidak sama", sameAs(this.user.password))
        },
        nik: {
          required: helpers.withMessage("Mohon masukkan 16 digit NIK Anda", required),
          integer: helpers.withMessage("NIK harus berupa angka", integer),
          length: helpers.withMessage("NIK harus 16 digit", (value) => {
            return value.length === 16;
          }),
        },
        birth: {
          required: helpers.withMessage("Mohon masukkan Tanggal Lahir", required),
          isBeforeToday: helpers.withMessage("Tanggal lahir tidak valid", function (value) {
            const selectedDate = new Date(value);
            const today = new Date();
            return selectedDate < today;
          }),
        },
        sex: {
          required: helpers.withMessage("Mohon masukkan Jenis Kelamin", required),
          isMaleOrFemale: helpers.withMessage("Apakah gender anda bilangan desimal?", function (value) {
            return value === "1" || value === "2";
          }),
        },
        address: {
          required: helpers.withMessage("Mohon masukkan Alamat", required),
        },
        zipcode: {
          required: helpers.withMessage("Mohon masukkan Kode Pos", required),
          integer: helpers.withMessage("Kode Pos harus berupa angka", integer),
          length: helpers.withMessage("Kode Pos harus 5 digit", (value) => {
            return value.length === 5;
          }),
        },
      },
    }
  },
  computed: {
    ...mapState('Auth', ["status"]),
    notification() {
      return this.$store ? this.$store.state.Notification : null;
    },
    details() {
      return this.$store ? this.$store.getters['Auth/getDetails'] : null;
    }
  },
  methods: {
    ...notificationMethods,
    ...mapActions('Auth', ['registerUser']),
    handleAddressSelectedChange(selected) {
      this.user.province = selected.province;
      this.user.regency = selected.regency;
      this.user.district = selected.district;
      this.user.village = selected.village;
    },

    handleRecaptchaVerified(response) {
      this.user.captcha = response;
    },

    setPassword() {
      console.log(this.user.password)
    },

    tryToRegisterIn() {
      this.submitted = true;

      this.v$.$touch()
      if (this.v$.$invalid) {
        return;
      } else {
        register(this.user).then(
            () => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Pendaftaran berhasil dilakukan, silahkan login dengan akun yang telah dibuat.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push({name: 'login'})
          })
        },
        err => {
          Swal.fire({
            title: "Gagal",
            text: "Gagal melakukan registrasi, " + err.message,
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
                  <h4 class="text-info">Isikan Biodata</h4>
                  <p class="text-info">Sebelum mengakses CRIPIS, Anda diwajibkan untuk mengisi biodata Anda terlebih
                    dahulu</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">

            <b-form class="p-2" @submit.prevent="tryToRegisterIn">

              <div class="row ">
                <b-form-group
                    class="col-6 mb-3"
                    id="firstName-group"
                    label="Nama Depan"
                    label-for="firstName"
                >
                  <b-form-input
                      id="firstName"
                      v-model="user.firstName"
                      type="text"
                      placeholder="Masukkan Nama Depan"
                      @keyup=" user.firstName = user.firstName.toUpperCase()"
                      @input="() => v$.user.firstName.$touch()"
                      :class="{
                    'is-invalid': v$.user.firstName.$error,
                  }"
                  ></b-form-input>
                  <div
                      v-if="v$.user.firstName.$error"
                      class="invalid-feedback"
                  >
                  <span v-if="v$.user.firstName.required.$invalid">{{
                      v$.user.firstName.required.$message
                    }}</span>
                  </div>
                </b-form-group>
                <b-form-group
                    class="col-6"
                    id="lastName-group"
                    label="Nama Belakang"
                    label-for="lastName"
                >
                  <b-form-input
                      id="lastName"
                      v-model="user.lastName"
                      type="text"
                      placeholder="Masukkan Nama Belakang"
                      @keyup=" user.lastName = user.lastName.toUpperCase()"
                      @input="()=> v$.user.lastName.$touch()"
                      :class="{
                    'is-invalid':v$.user.lastName.$error,
                  }"
                  ></b-form-input>
                  <div
                      v-if="v$.user.lastName.$error"
                      class="invalid-feedback"
                  >
                  <span v-if="v$.user.lastName.required.$invalid">{{
                      v$.user.lastName.required.$message
                    }}</span>
                  </div>
                </b-form-group>
              </div>

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

              <div class="row">
                <b-form-group
                    class="mb-3"
                    id="password"
                    label="Password"
                    label-for="password"
                >
                  <b-form-input
                      id="password"
                      v-model="user.password"
                      type="password"
                      placeholder="Masukkan password"
                      @input="()=> { v$.user.password.$touch();}"
                      :class="{
                    'is-invalid': v$.user.password.$error,
                  }"
                  ></b-form-input>
                  <div
                      v-if="v$.user.password.$error"
                      class="invalid-feedback"
                  >
                    <span v-if="v$.user.password.required.$invalid">{{
                        v$.user.password.required.$message
                      }}</span>
                  </div>
                </b-form-group>
              </div>

              <div class="row">
                <b-form-group
                    class="mb-3"
                    id="confirmedPassword"
                    label="Konfirmasi Password"
                    label-for="confirmedPassword"
                >
                  <b-form-input
                      id="confirmedPassword"
                      v-model="user.confirmPassword"
                      type="password"
                      placeholder="Masukkan password Anda kembali"
                      @input="()=> {v$.user.confirmPassword.$touch(); setPassword() ;console.log(v$.user.confirmPassword.isConfirmed)}"
                      :class="{
                    'is-invalid': v$.user.confirmPassword.$error,
                  }"
                  ></b-form-input>
                  <div
                      v-if="v$.user.confirmPassword.$error"
                      class="invalid-feedback"
                  >
                    <span v-if="v$.user.confirmPassword.required.$invalid">{{
                        v$.user.confirmPassword.required.$message
                      }}</span>
                    <span v-else-if="v$.user.confirmPassword.isConfirmed">{{
                        v$.user.confirmPassword.isConfirmed.$message
                      }}</span>
                  </div>
                </b-form-group>
              </div>
              <div class="row">

                <b-form-group
                    class="mb-3"
                    id="nik"
                    label="Nomor Induk Kependudukan"
                    label-for="nik"
                >
                  <b-form-input
                      id="nik"
                      v-model="user.nik"
                      type="text"
                      placeholder="Masukkan 16 digit Nomor Induk Kependudukan"
                      @input="() => v$.user.nik.$touch()"
                      :class="{
                    'is-invalid': v$.user.nik.$error,
                  }"
                  ></b-form-input>
                  <div v-if="v$.user.nik.$pending || v$.user.nik.$error" class="invalid-feedback">
                    <span v-if="v$.user.nik.required.$invalid">{{ v$.user.nik.required.$message }}</span>
                    <span v-else-if="v$.user.nik.integer.$invalid">{{ v$.user.nik.integer.$message }}</span>
                    <span v-else-if="v$.user.nik.length.$invalid">{{ v$.user.nik.length.$message }}</span>
                  </div>
                </b-form-group>
              </div>
                <div class="row">
                  <b-form-group
                      class="col-6"
                      id="birth-group"
                      label="Tanggal Lahir"
                      label-for="birth"
                  >
                    <b-form-input
                        id="birth"
                        v-model="user.birth"
                        type="date"
                        placeholder="Masukkan Tanggal Lahir"
                        :class="{
                    'is-invalid': v$.user.birth.$error,
                  }"
                        @input="()=> v$.user.birth.$touch()"
                    ></b-form-input>
                    <div
                        v-if="v$.user.birth.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.user.birth.required.$invalid">{{
                      v$.user.birth.required.$message
                    }}</span>
                      <span v-else-if="v$.user.birth.isBeforeToday.$invalid">{{
                          v$.user.birth.isBeforeToday.$message
                        }}</span>
                    </div>
                  </b-form-group>
                  <b-form-group
                      class="col-6 form-label"
                      id="address-group"
                      label="Jenis Kelamin"
                      label-for="regency"
                  >
                    <b-form-select
                        class="form-select"
                        id="sex"
                        v-model="user.sex"
                        @input="()=> v$.user.sex.$touch()"
                    >
                      <template v-slot:first>
                        <option value="">Jenis Kelamin</option>
                      </template>
                      <option value="1">Laki-laki</option>
                      <option value="2">Perempuan</option>
                      <option value="3">Non-biner</option>
                    </b-form-select>
                    <div
                        v-if="v$.user.sex.$error"
                        class="invalid-feedback d-block"
                    >
                  <span v-if="v$.user.sex.required.$invalid">{{
                      v$.user.sex.required.$message
                    }}</span>
                      <span v-else-if="v$.user.sex.isMaleOrFemale.$invalid">{{
                          v$.user.sex.isMaleOrFemale.$message
                        }}</span>
                    </div>
                  </b-form-group>
                </div>


                <div class="row">
                  <b-form-group
                      class="col-12 mb-3"
                      id="address-group"
                      label="Alamat"
                      label-for="address"
                  >
                    <b-form-input
                        id="address"
                        v-model="user.address"
                        type="text"
                        placeholder="Masukkan Alamat"
                        :class="{
                    'is-invalid': submitted && v$.user.address.$error,
                  }"
                    ></b-form-input>
                    <div
                        v-if="submitted && v$.user.address.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.user.address.required.$message">{{
                      v$.user.address.required.$message
                    }}</span>
                    </div>
                  </b-form-group>
                </div>
                <Address @selected-changed="handleAddressSelectedChange"></Address>
                <div class="row">
                  <b-form-group
                      class="col-6 mb-3"
                      id="nik-group"
                      label="Kode Pos"
                      label-for="postalCode"
                  >
                    <b-form-input
                        id="postalCode"
                        v-model="user.zipcode"
                        type="text"
                        placeholder="Masukkan Kode Pos"
                        :class="{
                    'is-invalid': submitted && v$.user.zipcode.$error,
                  }"
                    ></b-form-input>
                    <div v-if="submitted && v$.user.zipcode.$error" class="invalid-feedback">
                      <span v-if="v$.user.zipcode.required.$invalid">{{ v$.user.zipcode.required.$message }}</span>
                      <span v-else-if="v$.user.zipcode.integer.$invalid">{{ v$.user.zipcode.integer.$message }}</span>
                      <span v-else-if="v$.user.zipcode.length.$invalid">{{ v$.user.zipcode.length.$message }}</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="mt-4">
                  <p class="text-lg-start">
                    Jika e-KTP Anda tidak terdaftar atau tidak sesuai dengan data yang ada di Dukcapil, Anda dapat
                    menghubungi Dukcapil di:
                  </p>
                  <p class="text-sm-start">
                    <strong>WhatsApp/SMS:</strong> 0812-3456-7890
                  </p>
                  <p class="text-sm-start">
                    <strong>Call Center:</strong> 021-12345678
                  </p>
                  <p class="text-sm-start">
                    <strong>Email:</strong> callcenter@dukcapil.kemendagri.go.id
                  </p>
                </div>
                <div class="mt-4">
                  <p class="mb-0">
                    CRIPIS berhak menolak pendaftaran apabila data yang Anda masukkan tidak sesuai dengan data yang ada di
                    Dukcapil.
                  </p>
                </div>

              <div class="row">
                <div class="mt-3">
                  <Captcha v-model="user.captcha" @recaptcha-verified="handleRecaptchaVerified"
                           @recaptcha-error="handleRecaptchaError" @recaptcha-failed="handleRecaptchaFailed"/>
                </div>
              </div>
              <div class="mt-4 d-grid">
                <b-button type="submit" variant="info" class="btn-block btn-primary text-white"
                >Register
                </b-button
                >
              </div>
              <div class="mt-4">
                <p class="mb-0">
                  Dengan melanjutkan, saya menjamin telah mengisi semua data dengan jujur dan benar
                </p>
              </div>
            </b-form>
          </div>
        </div>

        <div class="mt-5 text-center">
          <p>
            Sudah memiliki akun?
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