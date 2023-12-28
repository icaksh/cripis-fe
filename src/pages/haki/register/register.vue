<script>

import {defineComponent} from "vue";
import PageHeader from "@/components/bar/page-header.vue";
import Layout from "../../../layouts/main.vue";
import Holder from "./holder.vue";
import {FormWizard, TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
import {getDak, getTrademarkClasses, postRegister} from "@/pages/haki/register/helpers";
import Trademark from "@/pages/haki/register/trademark.vue";
import Agreement from "@/pages/haki/register/agreement.vue";
import Document from "@/pages/haki/register/document.vue";
import Swal from "sweetalert2";


export default defineComponent({
  created(){
    getTrademarkClasses().then(data => {
          this.trademarkClasses = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  },
  components: {Agreement, Document,Trademark, PageHeader, Layout, FormWizard, TabContent, Holder},
  data() {
    return {
      title: "Pendaftaran Merek Dagang",
      items: [
        {
          text: "Merek Dagang",
        },
        {
          text: "Pendaftaran",
          active: true
        }
      ],
      isError: false,
      errorMessage: "",
      trademark: {
        name: "",
        class: "",
        image: null,
        preview: {
          image: {
            show: false,
            image: null
          },
        },
      },
      holder:{
        fullName: "",
        address: "",
        province: "",
        regency: "",
        district: "",
        village: "",
      },
      document : {
        signature: null,
        certificate: null,
        preview: {
          signature: {
            show: false,
            image: null
          },
          certificate: {
            show: false,
            image: null
          },
        },
      },
      verification :{
        address:"",
      }
    };
  },
  methods: {
    getAddressFromDak(village, district, regency, province){
      getDak(province, regency, district, village).then(
          data => {
            console.log(data)
            this.verification.address = data.address
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          }
      )
    },
    handleHolderValueChange(value){
      this.holder = value;
    },
    handleIdentityValueChange(value) {
      this.trademark = value;
    },
    handleDocumentValueChange(value){
      this.document = value;
    },
    validateTrademark() {
      if (this.trademark.name !== "" && this.trademark.class !== "" && this.trademark.image !== null) {
        return true
      }else{
        Swal.fire({
          title: 'Data tidak lengkap!',
          text: "Mohon isi semua data terlebih dahulu",
          icon: 'warning',
          confirmButtonColor: '#50a5f1',
        });
        return false
      }
    },
    validateHolder() {
      if (this.holder.fullName !== "" && this.holder.address !== "" && this.holder.district !== "" && this.holder.province !== "" && this.holder.regency !== "" && this.holder.village !== "") {
        this.getAddressFromDak(this.holder.village, this.holder.district, this.holder.regency, this.holder.province)
        return true
      }else{
        Swal.fire({
          title: 'Data tidak lengkap!',
          text: "Mohon isi semua data terlebih dahulu",
          icon: 'warning',
          confirmButtonColor: '#50a5f1',
        });
        return false
      }
    },
    validateDocument() {
      if (this.document.signature !== null) {
        return true
      }else{
        Swal.fire({
          title: 'Data tidak lengkap!',
          text: "Mohon isi semua data terlebih dahulu",
          icon: 'warning',
          confirmButtonColor: '#50a5f1',
        });
        return false
      }
    },
    onComplete() {
      const data = {
        ...this.trademark,
        ...this.holder,
        ...this.document
      }
      postRegister(data).then(
          () => {
            Swal.fire({
              title: 'Pendaftaran Berhasil!',
              text: "Silahkan tunggu proses verifikasi dari Admin",
              icon: 'success',
              confirmButtonColor: '#50a5f1',
            });
            this.$router.push({name: 'haki-list'})
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          })
    }
  },
})
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="isError" class="row">
      <div class="col-lg-12">
        <div class="alert alert-danger alert-dismissible fade show">
          {{ this.errorMessage }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-form class="p-2">
            <FormWizard step-size="xs" color="#50a5f1" @on-complete="onComplete">
              <TabContent title="Syarat dan Ketentuan" icon="bx bx-info-circle">
                <div class="border-top">

                </div>
                <Agreement></Agreement>
              </TabContent>
              <TabContent title="Data Merek Dagang" :before-change="validateTrademark">
                <div class="border-top">
                </div>
                <Trademark @trademark="handleIdentityValueChange"></Trademark>
              </TabContent>
              <TabContent title="Data Pemegang" :before-change="validateHolder">
                <div class=" border-top">
                </div>
                <Holder @holder="handleHolderValueChange"></Holder>
              </TabContent>
              <TabContent title="Dokumen Administrasi"  :before-change="validateDocument">
                <div class=" border-top">
                </div>
                <Document @document="handleDocumentValueChange"></Document>
              </TabContent>
              <TabContent title="Verifikasi">
                <div class=" border-top">
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <div class="card-body">
                      <h4 class="card-title">Identitas Merek Dagang</h4>
                      <div class="row mt-4">
                        <img :src="trademark.preview.image" class="img-fluid"/>
                      </div>
                      <div class="row mt-4">
                        <div class="table-responsive">
                          <table class="table align-middle dt-responsive nowrap w-100 table-check">
                            <thead>
                            <tr>
                              <th scope="col">Identitas</th>
                              <th scope="col">Keterangan</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                              <td>Nama Merek Dagang</td>
                              <td>{{ trademark.name }}</td>
                            </tr>
                            <tr>
                              <td>Kelas Merek Dagang</td>
                              <td>{{ trademark.class }}</td>
                            </tr>
                            <tr>
                              <td>Nama Pemegang Merek Dagang</td>
                              <td>{{ holder.fullName }}</td>
                            </tr>
                            <tr>
                              <td>Alamat Pemegang Merek Dagang</td>
                              <td>{{ `${holder.address}, ${verification.address}`}}</td>
                            </tr>
                            <tr>
                              <td>Tanda Tangan Pemegang Merek Dagang</td>
                              <td><img :src="document.preview.signature.image" class="img-fluid"/></td>
                            </tr>
                            <tr v-if="document.preview.certificate.show">
                              <td>Surat Keterangan Usaha</td>
                              <td><embed :src="document.preview.certificate.image" style="width: 100%;height: 350px"/></td>
                            </tr>
                            </tbody>
                          </table>
                          <div class="my-4">
                            Pastikan data yang anda masukkan sudah benar. Jika sudah yakin, silahkan klik tombol "Daftar" untuk melanjutkan proses pendaftaran.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabContent>
            </FormWizard>
            </b-form>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>