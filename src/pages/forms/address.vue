<script>
import axios from "axios";

import {reactive} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  async created (){
    await this.getProvinces()

  },
  props: {
    selectFrom: {
      type: Object,
    },
  },
  mounted() {
    console.log(this.selectFrom)
    if (this.selectFrom) {
      this.getRegencies(this.selectFrom.province).then(() => {
        this.selected.regency = this.selectFrom.regency;
        this.getDistricts(this.selectFrom.regency).then(() => {
          this.selected.district = this.selectFrom.district;
          this.getVillages(this.selectFrom.district).then(() => {
            this.selected.village = this.selectFrom.village;
            this.setVillages(this.selectFrom.village)
          })
        })
      })
    }
  },
  data() {
    return {
      list: reactive({
        provinces: [],
        regencies: [],
        districts: [],
        villages: [],
      }),
      selected: reactive ({
        province: '',
        regency: '',
        district: '',
        village: '',
      }),
      v$: useVuelidate(),
    };
  },
  validations: {
    selected: {
      province: {
        required: helpers.withMessage("Mohon masukkan Provinsi", required),
      },
      regency: {
        required: helpers.withMessage("Mohon masukkan Kabupaten/Kota", required),
      },
      district: {
        required: helpers.withMessage("Mohon masukkan Kecamatan", required),
      },
      village: {
        required: helpers.withMessage("Mohon masukkan Desa/Kelurahan", required),
      },
    },
  },
  methods: {
      fetchDataByProvince: async function (endpoint) {
        try {
          const uninterceptedAxiosInstance = axios.create();
          const {data} = await uninterceptedAxiosInstance.get(`${process.env.VUE_APP_BACKEND_URL}/public/dak/${endpoint}`);
          return data
        } catch (error) {
          console.error(`Error fetching data for ${endpoint}:`, error);
          return [];
        }
      },

      fetchDataAndUpdateList: async function (endpoint, keys, keysToReset = []) {
        const data = await this.fetchDataByProvince(endpoint);
        this.list[keys] = data;
        keysToReset.forEach((key) => {
          this.list[key] = [];
        });
      },

      getProvinces: async function () {
        const endpoint = '';
        await this.fetchDataAndUpdateList(endpoint, "provinces", ['regencies', 'districts', 'villages']);

        },

      getRegencies: async function (value) {
        this.selected.province = value;
        this.selected.regency = ""
        this.selected.district = ""
        this.selected.village = ""
        const endpoint = this.selected.province
        await this.fetchDataAndUpdateList(endpoint, "regencies", ['districts', 'villages']);
        this.emitSelected()
        },

      getDistricts: async function (value) {
        this.selected.regency = value;
        this.selected.district = ""
        this.selected.village = ""
        const endpoint = `${this.selected.province}/${this.selected.regency}`;
        await this.fetchDataAndUpdateList(endpoint, "districts", ['villages']);
        this.emitSelected()
        },

      getVillages: async function (value) {
        this.selected.district = value;
        this.selected.village = ""
        const endpoint = `${this.selected.province}/${this.selected.regency}/${this.selected.district}`;
        await this.fetchDataAndUpdateList(endpoint, "villages");
        this.emitSelected()
      },

      setVillages: async function (value){
        this.selected.village = value;
        this.emitSelected()
      },

      emitSelected() {
        this.$emit("selected-changed", this.selected);
      }
    },
};
</script>
<template>
  <div class="row">
    <b-form-group
        class="col-6 mb-3 form-label"
        id="province-group"
        label="Pilih Provinsi"
        label-for="province"
    >
      <b-form-select
          class="form-select"
          id="province"
          v-model="selected.province"
          :options="list.provinces"
          value-field="id"
          text-field="name"
          @input = "() => v$.selected.province.$touch()"
          @change="getRegencies"
      >
        <template v-slot:first>
          <option value="">Pilih Provinsi</option>
        </template>
      </b-form-select>
      <div
          v-if="v$.selected.province.$error"
          class="invalid-feedback"
      >
      <span v-if="v$.selected.province.required.$invalid">{{
          v$.selected.province.required.$message
        }}</span>
      </div>
    </b-form-group>
    <b-form-group
        class="col-6 mb-3 form-label"
        id="address-group"
        label="Pilih Kabupaten/Kota"
        label-for="regency"
    >
      <b-form-select
          class="form-select"
          id="regency"
          v-model="selected.regency"
          :options="list.regencies"
          value-field="id"
          text-field="name"
          @input = "() => v$.selected.regency.$touch()"
          @change="getDistricts"
          :disabled="!selected.province"
      >
        <template v-slot:first>
          <option value="">Pilih Kabupaten/Kota</option>
        </template>
      </b-form-select>
      <div
          v-if="v$.selected.regency.$error"
          class="invalid-feedback d-block"
      >
      <span v-if="v$.selected.regency.required.$invalid">{{
          v$.selected.regency.required.$message
        }}</span>
      </div>
    </b-form-group>

    <b-form-group
        class="col-6  mb-3 form-label"
        id="address-group"
        label="Pilih Kecamatan/Distrik"
        label-for="district"
    >
      <b-form-select
          class="form-select"
          id="district"
          v-model="selected.district"
          :options="list.districts"
          value-field="id"
          text-field="name"
          @input = "() => v$.selected.district.$touch()"
          @change="getVillages"
          :disabled="!selected.regency"
      >
        <template v-slot:first>
          <option value="">Pilih Kecamatan/Distrik</option>
        </template>
      </b-form-select>
      <div
          v-if="v$.selected.district.$error"
          class="invalid-feedback d-block"
      >
      <span v-if="v$.selected.district.required.$invalid">{{
          v$.selected.district.required.$message
        }}</span>
      </div>
    </b-form-group>
    <b-form-group
        class="col-6 mb-3 form-label"
        id="address-group"
        label="Pilih Desa/Kelurahan"
        label-for="village"
    >
      <b-form-select
          class="form-select"
          id="village"
          v-model="selected.village"
          :options="list.villages"
          value-field="id"
          text-field="name"
          @input = "() => v$.selected.village.$touch()"
          @change = "setVillages"
          :disabled="!selected.district"
      >
        <template v-slot:first>
          <option value="">Pilih Desa/Kelurahan</option>
        </template>
      </b-form-select>
      <div
          v-if="v$.selected.village.$error"
          class="invalid-feedback d-block"
      >
      <span v-if="v$.selected.village.required.$invalid">{{
          v$.selected.village.required.$message
        }}</span>
  </div>
    </b-form-group>
  </div>
</template>