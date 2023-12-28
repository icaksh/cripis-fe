<script>

import {defineComponent} from "vue";
import PageHeader from "@/components/bar/page-header.vue";
import Layout from "../../../layouts/main.vue";
import Holder from "@/pages/haki/list/edit/holder.vue";
import {FormWizard, TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
import {getDak, getTrademarkClasses} from "@/pages/haki/register/helpers";
import Trademark from "@/pages/haki/list/edit/trademark.vue";
import Document from "@/pages/haki/list/edit/document.vue";
import Swal from "sweetalert2";
import {getTrademark} from "@/pages/admin/trademark";
import axios from "axios";
import {editTrademark} from "@/pages/haki/list/index";


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
  components: {Document,Trademark, PageHeader, Layout, FormWizard, TabContent, Holder},
  data() {
    return {
      title: "Perbaikan Merek Dagang",
      items: [
        {
          text: "Merek Dagang",
        },
        {
          text: "Edit",
          active: true
        }
      ],
      isError: false,
      errorMessage: "",
      trademark: {
        id:"",
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
      },
      dataReady: false,
      documentState: [],
      trademarkState: [],
      holderState: [],
    };
  },

  beforeCreate() {
    if(this.$route.params.id) {
      getTrademark(this.$route.params.id).then(
          data => {

            this.trademarkState = {
              name: data.trademark_name,
                  class: data.trademark_class,
                  image: data.image,
                  preview: {
                    image: {
                        show: true,
                        image: data.image
                    },
                  },
            }


            this.holderState = {
                  fullName: data.owner_name,
                  address: data.address,
                  province: data.province,
                  regency: data.regency,
                  district: data.district,
                  village: data.village,
            }

            this.documentState = {
                  signature: data.register_signature,
                  certificate: data.sme_certificate,
                  preview: {
                    signature: {
                      show: true,
                      image: data.register_signature
                    },
                  certificate: {
                  show: true,
                      image: data.sme_certificate
                },
              },
            }

            if(this.trademark.sme_certificate){
              axios.create().get(this.trademark.sme_certificate, {responseType: 'blob'})
                  .then(res => {
                    const blob = new Blob([res.data], { type: 'application/pdf' })
                    this.certificate = URL.createObjectURL(blob)
                  })
            }else{
              this.certificate = ""
            }
            this.dataReady = true
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          })
    }
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
      if (this.trademark.name !== "" && this.trademark.class !== "") {
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
        id: this.$route.params.id,
        ...this.trademark,
        ...this.holder,
        ...this.document
      }
      console.log(data)
      editTrademark(data).then(
          () => {
            Swal.fire({
              title: 'Perbaikan data berhasil!',
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
              <TabContent title="Data Merek Dagang" :before-change="validateTrademark">
                <div class="border-top">
                </div>
                <Trademark v-if="dataReady" :value="trademarkState" @trademark="handleIdentityValueChange"></Trademark>
              </TabContent>
              <TabContent title="Data Pemegang"  :before-change="validateHolder">
                <div class=" border-top">
                </div>
                <Holder v-if="dataReady" :value="holderState" @holder="handleHolderValueChange"></Holder>
              </TabContent>
              <TabContent title="Dokumen Administrasi"  :before-change="validateDocument">
                <div class=" border-top">
                </div>
                <Document v-if="dataReady" :value="documentState" @document="handleDocumentValueChange"></Document>
              </TabContent>
            </FormWizard>
            </b-form>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>