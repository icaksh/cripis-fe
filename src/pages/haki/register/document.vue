<script>
import {getTrademarkClasses} from "@/pages/haki/register/helpers";
import useVuelidate from "@vuelidate/core";
import {reactive} from "vue";
export default {
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  created() {
    getTrademarkClasses().then(data => {
          this.trademarkClasses = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  },
  methods: {
    onSignatureChange(e) {
      const file = e.target.files[0];
      if(file){
        if(file.size > 500000){
          this.document.signature = null
          this.document.preview.signature.show = false
          this.error.signature = true
        }else {
          this.error.signature = false
          this.document.preview.signature.show = true
          this.document.signature = file
          this.document.preview.signature.image = URL.createObjectURL(file)
          this.emitInput()
        }
      }
    },
    onCertificateChange(e) {
      const file = e.target.files[0];
      if(file){
        if(file.size > 500000){
          this.document.certificate = null
          this.document.preview.certificate.show = false
          this.error.certificate = true
        }else {
          this.error.certificate = false
          this.document.preview.certificate.show = true
          this.document.certificate = file
          this.document.preview.certificate.image = URL.createObjectURL(file)
          this.emitInput()
        }
      }
    },
    emitInput() {
      this.$emit("document", this.document);
    },
  },
  data() {
    return {
      document: reactive({
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
      }),

      error :{
        signature: false,
        certificate: false,
      }
    };
  },
}
</script>

<template>
  <div class="row">
    <div class="col-lg-6">
      <div class="card-body">
        <h4 class="card-title">Dokumen Pelengkap</h4>

        <div class="row mt-4">
          <b-form-group
              id="documentSignature"
              class="mb-3"
              label="Tanda Tangan Pemegang Merek Dagang (jpg/png maks. 500KB)"
              label-for="documentSignature"
          >
            <b-form-file
                accept="image/jpeg, image/png, image/gif"
                v-model="document.signature"
                ref="documentSignature"
                id="documentSignature"
                placeholder="Pilih file atau drop logo merek dagang disini..."
                drop-placeholder="Drop logo usaha disini..."
                @change="onSignatureChange"
                :class="{ 'is-invalid': error.signature }"
            ></b-form-file>
            <div
                v-if="error.signature"
                class="invalid-feedback d-block"
            >
              <span>
Ukuran file tidak boleh lebih dari 500KB
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="row mt-4">
          <b-form-group
              id="documentCertificate"

              class="mb-3"
              label="Surat Keterangan Usaha (opsional, pdf maks. 500KB)"
              label-for="documentCertificate"
          >
            <b-form-file
                accept="application/pdf"
                v-model="document.certificate"
                ref="documentCertificate"
                id="documentCertificate"
                placeholder="Pilih file atau drop Surat Keterangan Usaha disini..."
                drop-placeholder="Drop Surat Keterangan Usaha disini..."
                @change="onCertificateChange"
                :class="{ 'is-invalid': error.certificate }"
            ></b-form-file>
            <div
                v-if="error.certificate"
                class="invalid-feedback d-block"
            >
              <span>
Ukuran file tidak boleh lebih dari 500KB
              </span>
            </div>
          </b-form-group>
        </div>
      </div>

    </div>
    <div class="col-lg-6">
      <div class="card-body">
        <h4 class="card-title">Preview Tanda Tangan Pemilik Merek Dagang</h4>
        <div class="mt-4">
          <img v-if="document.preview.signature.show" :src="document.preview.signature.image" class="img-fluid" />
          <img v-else src="@/assets/images/small/img-2.jpg" class="img-fluid rounded-3"/>
        </div>
        <div v-if="document.preview.certificate.show">
          <h4 class="card-title mt-4">document.preview Surat Keterangan Usaha</h4>
          <div class="mt-4">
            <embed :src="document.preview.certificate.image" style="width: 100%;height: 350px"/>
          </div>
      </div>
    </div>
  </div>
  </div>
</template>