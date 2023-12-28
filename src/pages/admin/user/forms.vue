<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/bar/page-header.vue";
import {editUserProfile, editUserRoles, user, userRoles} from ".";
import {email, helpers, integer, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Address from "@/pages/forms/address.vue";
import moment from "moment";
import Swal from "sweetalert2";

export default {
  setup(){
    return{
      v$: useVuelidate()
    }
  },
  components: {
    Address,
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Manajemen Aplikasi",
      items: [
        {
          text: "Administrator",
        },
        {
          text: "Pengguna",
          active: true
        }
      ],
      fullPage: true,
      dataReady: false,
      user: {
        first_name: "",
        last_name: "",
        email: "",
        card_number: "",
        dob: "",
        sex: "",
        address: "",
        province: null,
        regency: "",
        district: "",
        village: "",
        postal_code: "",
      },
      access:{
        roles:"",
        status:"",
        verified:"",
        password:"",
      },
      addressHandler:{
        province: "",
        regency: "",
        district: "",
        village: "",
      },
      userRoles: [],
      userStatus: [],
      userVerified: [{id: 1, status: "Terverifikasi"}, {id: 2, status: "Belum Terverifikasi"}],
    };
  },
  validations() {
    return {
      access: {
        password: {
          required: helpers.withMessage("Anda diwajibkan memasukkan password untuk melakukan aksi ini", required),
        },
      },
      user: {
        first_name: {
          required: helpers.withMessage("Mohon masukkan Nama Depan", required),
        },
        last_name: {
          required: helpers.withMessage("Mohon masukkan Nama Belakang", required),
        },
        email: {
          required: helpers.withMessage("Mohon masukkan Email", required),
          email: helpers.withMessage("Email yang Anda masukkan tidak valid", email),
        },
        card_number: {
          required: helpers.withMessage("Mohon masukkan 16 digit NIK Anda", required),
          integer: helpers.withMessage("NIK harus berupa angka", integer),
          length: helpers.withMessage("NIK harus 16 digit", (value) => {
            return value.toString().length === 16;
          }),
        },
        dob: {
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
            return value.toString() === "1" || value.toString() === "2";
          }),
        },
        address: {
          required: helpers.withMessage("Mohon masukkan Alamat", required),
        },
        postal_code: {
          required: helpers.withMessage("Mohon masukkan Kode Pos", required),
          integer: helpers.withMessage("Kode Pos harus berupa angka", integer),
          length: helpers.withMessage("Kode Pos harus 5 digit", (value) => {
            return value.toString().length === 5;
          }),
        },
      },
    }
  },
  methods: {
    handleAddressSelectedChange(selected) {
      this.user.province = selected.province;
      this.user.regency = selected.regency;
      this.user.district = selected.district;
      this.user.village = selected.village;
    },

    handleUserEdit(){
      this.v$.user.$touch()
      if(this.v$.user.$invalid){
        return
      }else{
        Swal.fire(
            {
              title: "Apakah Anda yakin?",
              text: "Anda akan mengubah profil dari pengguna ini",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak, Batalkan",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }
        ).then((result) => {
          if (result.isConfirmed) {
            editUserProfile(this.user).then(() => {
                  Swal.fire({
                    title: "Berhasil",
                    text: "Profil pengguna berhasil diubah",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    location.reload()
                  })
                },
                err => {
                  Swal.fire({
                    title: "Gagal",
                    text: "Pengguna gagal diubah, " + err.message,
                    icon: "error",
                    confirmButtonText: "OK",
                  })
                })
          }
        })
      }
    },
    handleUserEditRoles(){
    this.v$.access.$touch()
      if(this.v$.access.$invalid){
        return
      }else{
        Swal.fire(
            {
              title: "Apakah Anda yakin?",
              text: "Anda akan mengubah hak akses dari pengguna ini",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak, Batalkan",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }
        ).then((result) => {
          if (result.isConfirmed) {
            editUserRoles(this.access).then(() => {
                  Swal.fire({
                    title: "Berhasil",
                    text: "Hak akses pengguna berhasil diubah",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    location.reload()
                  })
                },
                err => {
                  Swal.fire({
                    title: "Gagal",
                    text: "Hak akses pengguna gagal diubah, " + err.message,
                    icon: "error",
                    confirmButtonText: "OK",
                  })
                })
          }
        })
      }
    }
  },
  created() {
    this.userStatus= [
        {
          id: 1,
          status: "Aktif",
        },
            {
              id: 2,
              status: "Tidak Aktif",
            },
        ];
    if(this.$route.params.id) {
      this.isEdit = true
      user(this.$route.params.id).then(data => {
            this.user = data
            this.user.dob = moment(this.user.dob).format('YYYY-MM-DD')
            this.addressHandler.province = data.province;
            this.addressHandler.regency = data.regency;
            this.addressHandler.district = data.district;
            this.addressHandler.village = data.village;
            this.access.id = data.id
            this.access.roles = data.roles
            this.access.status = data.status
            this.access.verified = data.verified
        this.dataReady= true
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
      })
    }
    userRoles().then(
        data => {
          this.userRoles = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  },

};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">Edit Pengguna</h5>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <b-form class="p-2">

                <div class="row ">
                  <b-form-group
                      class="col-6 mb-3"
                      id="first_name-group"
                      label="Nama Depan"
                      label-for="first_name"
                  >
                    <b-form-input
                        id="first_name"
                        v-model="user.first_name"
                        type="text"
                        placeholder="Masukkan Nama Depan"
                        @keyup="user.first_name = user.first_name.toUpperCase()"
                        @input="() => v$.user.first_name.$touch()"
                        :class="{
                    'is-invalid': v$.user.first_name.$error,
                  }"
                    ></b-form-input>
                    <div
                        v-if="v$.user.first_name.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.user.first_name.required.$invalid">{{
                      v$.user.first_name.required.$message
                    }}</span>
                    </div>
                  </b-form-group>
                  <b-form-group
                      class="col-6"
                      id="last_name-group"
                      label="Nama Belakang"
                      label-for="last_name"
                  >
                    <b-form-input
                        id="last_name"
                        v-model="user.last_name"
                        type="text"
                        placeholder="Masukkan Nama Belakang"
                        @keyup="user.last_name = user.last_name.toUpperCase()"
                        @input="()=> v$.user.last_name.$touch()"
                        :class="{
                    'is-invalid':v$.user.last_name.$error,
                  }"
                    ></b-form-input>
                    <div
                        v-if="v$.user.last_name.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.user.last_name.required.$invalid">{{
                      v$.user.last_name.required.$message
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
                        v-if="v$.user.email.$error"
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
                      id="card_number"
                      label="Nomor Induk Kependudukan"
                      label-for="card_number"
                  >
                    <b-form-input
                        id="card_number"
                        v-model="user.card_number"
                        type="text"
                        placeholder="Masukkan 16 digit Nomor Induk Kependudukan"
                        @input="() => {v$.user.card_number.$touch()}"
                        :class="{
                    'is-invalid': v$.user.card_number.$error,
                  }"
                    ></b-form-input>
                    <div v-if="v$.user.card_number.$error" class="invalid-feedback">
                      <span v-if="v$.user.card_number.required.$invalid">{{ v$.user.card_number.required.$message }}</span>
                      <span v-else-if="v$.user.card_number.integer.$invalid">{{ v$.user.card_number.integer.$message }}</span>
                      <span v-else-if="v$.user.card_number.length.$invalid">{{ v$.user.card_number.length.$message }}</span>
                    </div>
                  </b-form-group>
                </div>
                  <div class="row">
                    <b-form-group
                        class="col-6"
                        id="dob-group"
                        label="Tanggal Lahir"
                        label-for="dob"
                    >
                      <b-form-input
                          id="dob"
                          v-model="user.dob"
                          type="date"
                          placeholder="Masukkan Tanggal Lahir"
                          :class="{
                    'is-invalid': v$.user.dob.$error,
                  }"
                          @input="()=> v$.user.dob.$touch()"
                      ></b-form-input>
                      <div
                          v-if="v$.user.dob.$error"
                          class="invalid-feedback"
                      >
                  <span v-if="v$.user.dob.required.$invalid">{{
                      v$.user.dob.required.$message
                    }}</span>
                        <span v-else-if="v$.user.dob.isBeforeToday.$invalid">{{
                            v$.user.dob.isBeforeToday.$message
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
                    'is-invalid':  v$.user.address.$error,
                  }"
                      ></b-form-input>
                      <div
                          v-if=" v$.user.address.$error"
                          class="invalid-feedback"
                      >
                  <span v-if="v$.user.address.required.$message">{{
                      v$.user.address.required.$message
                    }}</span>
                      </div>
                    </b-form-group>
                  </div>
                  <Address v-if="dataReady" @selected-changed="handleAddressSelectedChange" :selectFrom="addressHandler"></Address>
                  <div class="row">
                    <b-form-group
                        class="col-6 mb-3"
                        id="card_number-group"
                        label="Kode Pos"
                        label-for="postalCode"
                    >
                      <b-form-input
                          id="postalCode"
                          v-model="user.postal_code"
                          type="text"
                          placeholder="Masukkan Kode Pos"
                          @input = "() => v$.user.postal_code.$touch()"
                          :class="{
                    'is-invalid': v$.user.postal_code.$error,
                  }"
                      ></b-form-input>
                      <div v-if=" v$.user.postal_code.$error" class="invalid-feedback">
                        <span v-if="v$.user.postal_code.required.$invalid">{{ v$.user.postal_code.required.$message }}</span>
                        <span v-else-if="v$.user.postal_code.integer.$invalid">{{ v$.user.postal_code.integer.$message }}</span>
                        <span v-else-if="v$.user.postal_code.length.$invalid">{{ v$.user.postal_code.length.$message }}</span>
                      </div>
                    </b-form-group>
                  </div>
              </b-form>

              <div class="mt-4 d-grid">
                <b-button type="submit" variant="info" class="btn btn-warning-outline text-white"
                          @click="handleUserEdit"
                >Edit Pengguna
                </b-button
                >
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">Hak Akses dan Verifikasi Pengguna</h5>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <b-form class="p-2">

                <div class="row">
                  <b-form-group
                      class="col-6 mb-3 form-label"
                      id="address-group"
                      label="Hak Akses"
                      label-for="roles"
                  >
                    <b-form-select
                        class="form-select"
                        id="roles"
                        v-model="access.roles"
                        :options="userRoles"
                        value-field="id"
                        text-field="role"
                    >
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                      class="col-6 mb-3 form-label"
                      id="status-group"
                      label="Status"
                      label-for="userStatus"
                  >
                    <b-form-select
                        class="form-select"
                        id="userStatus"
                        v-model="access.status"
                        :options="userStatus"
                        value-field="id"
                        text-field="status"
                    >
                    </b-form-select>
                  </b-form-group>
                    <b-form-group
                        class="col-6 mb-3 form-label"
                        id="status-group"
                        label="Terverifikasi"
                        label-for="userVerified"
                    >
                    <b-form-select
                        class="form-select"
                        id="userVerified"
                        v-model="access.verified"
                        :options="userVerified"
                        value-field="id"
                        text-field="status"
                    >
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                      class="mb-3"
                      id="input-group-2"
                      label="Password"
                      label-for="input-2"
                  >
                    <b-form-input
                        id="input-2"
                        v-model="access.password"
                        type="password"
                        placeholder="Masukkan Password Anda"
                        @input="()=> v$.access.password.$touch()"
                        :class="{
                    'is-invalid': v$.access.password.$error,
                  }"
                    ></b-form-input>
                    <div
                        v-if="v$.access.password.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.access.password.required.$invalid">{{
                      v$.access.password.required.$message
                    }}</span>
                    </div>
                  </b-form-group>
                </div>

              </b-form>

              <div class="mt-4 d-grid">
                <b-button type="submit" variant="info" class="btn btn-warning-outline text-white"
                          @click="handleUserEditRoles"
                >Edit Pengguna
                </b-button
                >
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>