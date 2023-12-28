<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/bar/page-header.vue";
import {acceptTrademark, getTrademark, getTrademarkClasses} from ".";
import useVuelidate from "@vuelidate/core";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import {getTrademarkStatus} from "@/pages/haki/register/helpers";

export default {
  computed: {
    moment() {
      return moment
    }
  },
  setup(){
    return{
      v$: useVuelidate()
    }
  },
  components: {
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
      trademark: {
        trademark_name: "",
        trademark_class: "",
        registration_number: "",
        approved_at: "",
        expired_at: "",
        owner_name: "",
        address: "",
        image: "",
        sme_certificate: "",
        register_signature:"",
        notes:""
      },
      trademarkClasses:"",
      trademarkStatus :"",
      certificate: ""
    };
  },
  methods: {
    handleUserEdit(){
        Swal.fire(
            {
              title: "Apakah Anda yakin?",
              text: "Anda akan mengubah status merek dagang ini!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak, Batalkan",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }
        ).then((result) => {
          if (result.isConfirmed) {
            const data = {
              status: this.trademark.status,
              notes: this.trademark.status !== 2 ? this.trademark.notes : "Telah diterbitkan",
              id: this.trademark.id,
            }
            acceptTrademark(data).then(() => {
                  Swal.fire({
                    title: "Berhasil",
                    text: "Status merek dagang berhasil diubah",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    location.reload()
                  })
                },
                err => {
                  Swal.fire({
                    title: "Gagal",
                    text: "Pengguna gagal diubah, " + err,
                    icon: "error",
                    confirmButtonText: "OK",
                  })
                })
          }
        })
    },
  },
  async beforeCreate() {
    await getTrademarkClasses().then(
        data => {
          this.trademarkClasses = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  },
  created() {
    getTrademarkStatus().then(
        data => {
          this.trademarkStatus = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    if(this.$route.params.id) {
      getTrademark(this.$route.params.id).then(
          data => {
            this.trademark = data
            if(this.trademark.sme_certificate){
              axios.create().get(this.trademark.sme_certificate, {responseType: 'blob'})
                  .then(res => {
                    const blob = new Blob([res.data], { type: 'application/pdf' })
                    this.certificate = URL.createObjectURL(blob)
                  })
            }else{
              this.certificate = ""
            }
            this.trademark.notes = this.trademark.notes.String ? this.trademark.notes.String : ""
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          })
    }


  },

};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">Identitas Merek Dagang</h5>
            </div>
          </div>
          <div class="card-body">
            <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
              <b-tab active>
                <template v-slot:[`title`]>
                  <span class="d-inline-block d-sm-none">
                    <i class="fas fa-home"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Identitas</span>
                </template>
                <div class="table-responsive">
                  <table class="table align-middle dt-responsive nowrap w-100" id="job-list">
                    <thead>
                    <tr>
                      <th scope="col">Identitas</th>
                      <th scope="col">Keterangan</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Nomor Registrasi</td>
                      <td>{{ trademark.registration_number }}</td>
                    </tr>
                    <tr>
                      <td>Tanggal Diterbitkan</td>
                      <td>{{ trademark.approved_at.Valid ? moment(trademark.approved_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}</td>
                    </tr>
                    <tr>
                      <td>Tanggal Berakhir Masa Perlindungan</td>
                      <td>{{ trademark.expired_at.Valid ? moment(trademark.expired_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}</td>
                    </tr>
                    <tr>
                      <td>Nama Merek</td>
                      <td>{{ trademark.trademark_name }}</td>
                    </tr>
                    <tr>
                      <td>Kelas Merek</td>
                      <td>{{ trademarkClasses[trademark.trademark_class-1] ? trademarkClasses[trademark.trademark_class-1].class :"" }}</td>
                    </tr>
                    <tr>
                      <td>Detail Merek</td>
                      <td>{{ trademarkClasses[trademark.trademark_class-1] ? trademarkClasses[trademark.trademark_class-1].description :"" }}</td>
                    </tr>
                    <tr>
                      <td>Pemilik</td>
                      <td>{{ trademark.owner_name }}</td>
                    </tr>
                    <tr>
                      <td>Alamat Pemilik</td>
                      <td>{{ trademark.address }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </b-tab>
              <b-tab>
                <template v-slot:[`title`]>
                  <span class="d-inline-block d-sm-none">
                    <i class="far fa-user"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Logo</span>
                </template>
                <img :src="trademark.image" class="img-fluid" />
              </b-tab>
              <b-tab>
                <template v-slot:[`title`]>
                  <span class="d-inline-block d-sm-none">
                    <i class="far fa-envelope"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Dokumen Kelengkapan</span>
                </template>
                <h6 class="my-4 flex-grow-1">Tanda Tangan Pemegang Merek Dagang</h6>
                <img :src="trademark.register_signature" class="img-fluid" />
                <div v-if="certificate">
                  <h6 class="my-4 flex-grow-1">Sertifikat UMKM</h6>
                  <embed :src="certificate" style="width: 100%; height: 350px"/>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="body">
          <div class="card">
            <div class="card-body border-bottom">
              <div class="d-flex align-items-center">
                <h5 class="mb-0 card-title flex-grow-1">Aksi</h5>
              </div>
            </div>
            <b-form class="p-4">
              <div class="row">
                <b-form-group
                    class="col-12 mb-3 form-label"
                    id="address-group"
                    label="Penerbitan Surat"
                    label-for="roles"
                >
              <b-form-select
                  v-model="trademark.status"
                  :options="trademarkStatus"
                  value-field="id"
                  text-field="status"
                  label="Status"
                  class="mb-3"></b-form-select>
                </b-form-group>

                <b-form-group
                    v-if="trademark.status !== 1 && trademark.status !== 2"
                    class="col-12 mb-3 form-label"
                    id="address-group"
                    label="Keterangan"
                    label-for="roles"
                >
                  <b-form-textarea
                      v-model="trademark.notes"
                      label="Status"
                      class="mb-3"></b-form-textarea>
                </b-form-group>
                <div v-if="trademark.status == 2" class="mb-3">
                  <span>
                    Setelah surat diterbitkan, Anda tidak dapat melakukan perubahan apapun terhadap merek dagang ini kecuali menghapusnya
                  </span>
                </div>
                <b-button type="submit" variant="info" class="btn btn-warning-outline text-white"
                          @click="handleUserEdit"
                > {{ trademark.status === 1 ? 'Simpan': trademark.status === 2 ? 'Terbitkan' : trademark.status ===3 ?'Simpan' : 'Tolak Surat'}}
                </b-button
                >
              </div>


            </b-form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>