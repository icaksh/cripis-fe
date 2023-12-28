<script>
import {helpers, required} from "@vuelidate/validators";
import {getSimilarity, getTrademarkClasses} from "@/pages/haki/register/helpers";
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
    handleTrademarkNameInput(value) {
      this.trademark.name = value
      this.emitInput()
    },
    setClass(value) {
      this.trademark.class = value
      this.emitInput()
    },
    checkSimilarity(){
      getSimilarity(this.trademark.name).then(data => {

        if(data!==undefined && data.length > 0){
          this.similarity.lists = data.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity))
          this.similarity.checked = true
          this.similarity.noDuplicate = false
        }else{
          this.similarity.noDuplicate = true
          this.similarity.checked = false
        }
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          })
    },
    onFileChangeLogo(e) {
      const file = e.target.files[0];
      if(file){
        if(file.size > 500000){
          this.trademark.image = null
          this.trademark.preview.image = false
          this.error.image = true
        }else {
          this.error.image = false
          this.trademark.preview.show = true
          this.trademark.image = file
          this.trademark.preview.image = URL.createObjectURL(file)
          this.emitInput()
        }
      }
    },
    emitInput() {
      this.$emit("trademark", this.trademark);
    },
  },
  data() {
    return {
      trademarkClasses: [],
      similarity: {
        lists: [],
        checked: false,
        noDuplicate: false,
      },
      trademark: reactive({
        name: "",
        class: "",
        image: null,
        preview: {
          image: null,
          show : false,
        },
      }),

      error:{
        image : false,
      }
    };
  },
  validations() {
    return {
      trademark: {
        name: {
          required: helpers.withMessage("Mohon masukkan nama merek dagang", required),
        },
        class: {
          required: helpers.withMessage("Mohon masukkan kelas merek dagang", required),
        },
        image:{
          required: helpers.withMessage("Mohon masukkan logo merek dagang", required),
        }
      },
    }
  },
}
</script>

<template>
  <div class="row">
    <div class="col-lg-6">
      <div class="card-body">
        <h4 class="card-title">Data Merek Dagang</h4>

      <div class="row mt-4">
        <b-form-group
            id="trademarkName"
            class="mb-3"
            label="Nama Merek Dagang"
            label-for="trademarkName"
        >
          <b-input-group>
            <b-form-input
                id="trademarkName"
                v-model="trademark.name"
                :class="{
                              'is-invalid': v$.trademark.name.$error,
                            }"
                placeholder="Masukkan nama merek dagang"
                type="text"
                @keyup=" trademark.name = trademark.name.toUpperCase()"
                @input="handleTrademarkNameInput"
                autocapitalize="characters"
            ></b-form-input>
            <b-input-group-append>
              <b-button class="btn btn-info text-white" @click="checkSimilarity">Cek Nilai Kemiripan</b-button>
            </b-input-group-append>
            <div
                v-if="v$.trademark.name.$error"
                class="invalid-feedback"
            >

                    <span v-if="v$.trademark.name.required.$invalid">{{
                        v$.trademark.name.required.$message
                      }}</span>
            </div>
          </b-input-group>
          <div v-if="similarity.noDuplicate" class="row">
            <span>Nama merek tidak memiliki kemiripan</span>

          </div>
        </b-form-group>
      </div>

        <div v-if="similarity.checked" class="row">
          <table class="table align-middle dt-responsive nowrap w-100 table-check">
            <thead>
            <tr>
              <th scope="col">Merek Dagang</th>
              <th scope="col">Kelas</th>
              <th scope="col">Nilai Kemiripan</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(list, index) in similarity.lists.slice(0,3)" :key="index">
              <td>{{ list.name}}</td>
              <td>{{ trademarkClasses[list.class_code].class }}</td>
              <td>{{ `${Math.round((parseFloat(list.similarity)) * 100) } %`}}</td>
              <td></td>
            </tr>
            </tbody>
          </table>

        </div>
      <div class="row">
        <b-form-group
            id="trademarkClass"
            class="mb-3"
            label="Kelas Merek Dagang"
            label-for="trademarkClass"
        >
          <b-form-select
              id="trademarkClass"
              v-model="trademark.class"
              :options="trademarkClasses"
              class="form-select"
              text-field="class"
              value-field="id"
              @change="setClass"
              @input="() => {v$.trademark.class.$touch() }"
          >
            <template v-slot:first>
              <option value="">Pilih Kelas Merek Dagang</option>
            </template>
          </b-form-select>
          <div
              v-if="v$.trademark.class.$error"
              class="invalid-feedback d-block"
          >
          <span v-if="v$.trademark.class.required.$invalid">{{
              v$.trademark.class.required.$message
            }}</span>
          </div>
        </b-form-group>
      </div>
      <div class="row">
        <b-form-group
            id="trademarkImage"
            class="mb-3"
            label="Nama Merek Dagang"
            label-for="trademarkName"
        >
            <b-form-file
                v-model="trademark.image"
                accept="image/jpeg, image/png, image/gif"
                id="trademarkImage"
                placeholder="Pilih file atau drop logo merek dagang disini..."
                drop-placeholder="Drop logo usaha disini..."
                @change="onFileChangeLogo"
                :class="{ 'is-invalid': error.image }"
            ></b-form-file>
          <div
              v-if="error.image"
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
          <h4 class="card-title">Preview Logo Merek Dagang</h4>
          <div class="mt-4">
              <img v-if="trademark.preview.show" :src="trademark.preview.image" class="img-fluid" />
              <img v-else src="@/assets/images/small/img-2.jpg" class="img-fluid rounded-3"/>
       </div>
        </div>
      </div>
  </div>
</template>