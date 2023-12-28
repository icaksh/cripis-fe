<script lang="js">
import Layout from "@/layouts/auth.vue";
import { mapState} from "vuex";
import appConfig from "@/app.config";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {SimpleBar} from "simplebar-vue3";
import {getAnnouncement} from "@/pages/dashboard/helpers";
import moment from "moment";
import {getDak, getTrademarkClasses, getTrademarkStatus} from "@/pages/haki/register/helpers";
import {getTrademarks} from "@/pages/public/index";
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
    SimpleBar,
    Layout,
  },
  data() {
    return {
      captcha: null,
      search: null,
      searchs: null,
      submitted: false,
      announcements: [],
      headers: [
        { title: 'Logo', key: 'image' },
        {
          title: 'Nomor Registrasi',
          align: 'start',
          sortable: false,
          key: 'registration_number',
        },
        { title: 'Nama', key: 'trademark_name' },
        { title: 'Kelas', key: 'trademark_class' },
        { title: 'Tanggal Diterbitkan', key: 'approved_at' },
        { title: 'Tanggal Berakhir', key: 'expired_at' },
        { title: 'Status', key: 'status' },
      ],
      trademarkStatus: [],
      trademarkClasses: [],
      trademarks: [],
      addressDak: "",
      dataReady:"",
      isError: false
    };
  },
  validations: {
    search: {
      required: helpers.withMessage("Mohon masukkan nama merek dagang", required),
    },
  },
  computed: {

    ...mapState(["status"], ['recaptchaVerified'],['recaptchaError'], ['recaptchaFailed'], ['recaptchaExpired']),
    moment() {
      return moment
    },
  },
  methods: {

    handleRecaptchaError() {
      this.regError = "Recaptcha Error";
      this.isRegisterError = true;
    },

    tryToLogIn(){
      this.submitted = true;
      this.v$.$validate();
      if (!this.v$.$error) {
        this.login(this.user)
          .then(() => {
            this.$router.push({ name: "dashboard" });
          })
          .catch((err) => {
            this.isAuthError = true;
            this.authError = err.message;
          });
      }
    },

    trademarkModelHandler(value) {
      this.trademarkModel = value
    },

    getTrademark(){
      getTrademarks(this.search).then(data =>{
        this.trademarks = data
      })
    },

    getAddressFromDak(data){
      getDak(data.province, data.regency, data.district, data.village).then(
          data => {
            console.log(data)
            this.addressDak = data
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          }
      )
    },
    async getAddressFromDak2(data){
      return getDak(data.province, data.regency, data.district, data.village).then(
          data => {
            return data
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          }
      )
    }

  },
  async created() {
    await getAnnouncement().then(data => {
          this.announcements = data
      this.dataReady = true
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    await getTrademarkStatus().then(data => {
          this.trademarkStatus = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    await getTrademarkClasses().then(data => {
          this.trademarkClasses = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  },
};
</script>

<template>
  <b-navbar toggleable="lg" class="bg-info">
    <b-navbar-brand class="mx-6 text-white" href="#"><strong>Kantor Urusan Merek Dagang</strong></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <router-link to="/login" class="btn mx-6 btn-danger">Masuk</router-link>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-6 mb-5">
          <h2 class="text-info text-center">Selamat Datang di Kantor Urusan Merek Dagang</h2>
      </div>
    </div>
    <div class="row justify-content">
      <div class="col-md-8 col-lg-6 col-xl-6">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-info">
            <div class="row">
              <div class="col-9">
                <div class="text-info p-4">
                  <h4 class="text-info">Cari Merek Dagang Terdaftar</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">

            <b-form class="p-2 mt-4" @submit.prevent="getTrademark">
                <b-form-input
                    id="input-1"
                    v-model="search"
                    type="text"
                    placeholder="Cari nama merek dagang..."
                    :class="{
                    'is-invalid': submitted && v$.search.$error,
                  }"
                ></b-form-input>

              <div class="mt-3 d-grid">
                <b-button type="submit" variant="info" class="btn-block text-white"
                >Cari</b-button
                >
              </div>
            </b-form>
          </div>
        </div>
        <!-- end row -->
      </div>
      <div class="col-md-8 col-lg-6 col-xl-6">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-info">
            <div class="row">
              <div class="col-9">
                <div class="text-info p-4">
                  <h4 class="text-info">Pengumuman Terbaru</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <ul class="list-group">
              <SimpleBar  class="mt-5" v-if="dataReady" style="max-height: 390px">
                <li v-for="(announcement, index) in announcements" :key="index" class="list-group-item border-0">
                  <div class="d-flex">
                    <div class="flex-grow-1">
                      <h5 class="font-size-14">{{announcement.title}}</h5>
                      <p class="text-muted">
                        {{announcement.description}}
                      </p>
                      <p class="text-muted mb-0">{{ moment(announcement.created_at).format('DD MMMM YYYY') }}</p>
                    </div>
                  </div>
                </li>
              </SimpleBar>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content">
      <div class="col-md-8 col-lg-6 col-xl-12">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-info">
            <div class="row">
              <div class="col-9">
                <div class="text-info p-4">
                  <h4 class="text-info">Hasil Pencarian</h4>

                </div>
              </div>
            </div>
          </div>
          <div class="card-body pt-0">

            <v-data-table :search="searchs" :headers="headers" :items="trademarks" class="table align-middle dt-responsive nowrap w-100 table-check">
              <template v-slot:[`item.image`]="{ item }">
                <img :src="item.image" class="img-fluid">
              </template>
              <template v-slot:[`item.registration_number`]="{ item }">
                <span class="badge bg-warning"> {{ item.registration_number}}</span>
              </template>
              <template v-slot:[`item.trademark_class`]="{ item }">
                {{  trademarkClasses[item.trademark_class-1].class }}
              </template>
              <template v-slot:[`item.approved_at`]="{ item }">
                <span class="badge" :class="{ 'badge-soft-warning': item.approved_at.Valid, 'badge-soft-info': !item.approved_at.Valid }">
                {{  item.approved_at.Valid ? moment(item.approved_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}
                  </span>
              </template>
              <template v-slot:[`item.expired_at`]="{ item }">
                <span class="badge" :class="{ 'badge-soft-success': item.expired_at.Valid, 'badge-soft-info': !item.expired_at.Valid, 'badge-soft-danger': moment(item.expired_at.Time).isBefore(moment(), 'day') }">
                {{  item.expired_at.Valid ? moment(item.expired_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}
                  </span>
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <span class="badge" id="statuss" :class="{
                    'badge-soft-info': item.status == 1,
                    'badge-soft-success': item.status == 2,
                    'badge-soft-warning': item.status == 3,
                    'badge-soft-danger': item.status == 4,
                }">
                {{ trademarkStatus[item.status-1].status.toUpperCase() }}
                  </span>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <ul class="list-unstyled hstack gap-1 mb-0">
                  <li v-if="item.status !==2 && item.status !==1" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                    <b-button @click="() => { trademarkModelHandler(item); isOpenNotes = true}" class="btn btn-sm btn-warning">
                      <i class="mdi mdi-file-document-outline text-white"></i>
                    </b-button>
                  </li>
                  <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Lihat">
                    <b-button @click="() => { trademarkModelHandler(item); getAddressFromDak(item); isOpen = true}" class="btn btn-sm btn-soft-primary"
                    ><i
                        class="mdi mdi-eye-outline text-info"></i></b-button>
                  </li>
                  <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                    <a href="#" class="btn btn-sm btn-soft-info"><i class="mdi mdi-file-outline"></i></a>
                  </li>
                  <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                    <router-link :to="{path: '/haki/'+item.id}" class="btn btn-sm btn-soft-warning"><i class="mdi mdi-pencil-outline"></i></router-link>
                  </li>

                  <!--                                      <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">-->
                  <!--                                        <b-button @click="deleteTrademarkHandler(item.id)" class="btn btn-sm btn-soft-danger"-->
                  <!--                                        ><i-->
                  <!--                                            class="mdi mdi-delete-outline text-danger"></i></b-button>-->
                  <!--                                      </li>-->
                </ul>
              </template>
            </v-data-table>
          </div>
        </div>
        <!-- end row -->
      </div>
    </div>
  </Layout>
</template>