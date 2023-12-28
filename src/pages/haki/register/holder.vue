<script>
import Address from "@/pages/forms/address.vue";
import useVuelidate from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";

export default {
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },
  components: {
    Address,
  },

  data() {
    return {
      user : {
        fullName: "",
        address: "",
        province: "",
        regency: "",
        district: "",
        village: "",
      }
    };
  },
  validations() {
    return {
      user:{
        fullName: {
          required: helpers.withMessage("Mohon masukkan Nama Lengkap Pemegang Merek Dagang", required),
        },
        address: {
          required: helpers.withMessage("Mohon masukkan Alamat Lengkap Pemegang Merek Dagang", required),
        },
      }
    }
  },
  methods: {
    handleAddressSelectedChange(selected) {
      this.user.province = selected.province;
      this.user.regency = selected.regency;
      this.user.district = selected.district;
      this.user.village = selected.village;
      this.emitInput()
    },
    emitInput() {
      this.$emit("holder", this.user);
    },
  },
};
</script>
<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card-body">
        <h4 class="card-title">Data Pemegang Merek Dagang</h4>

  <b-form class="p-2 mt-4">

    <b-form-group
        class="mb-3"
        id="fullName"
        label="Nama Lengkap Pemegang Merek Dagang (Dapat berupa PT)"
        label-for="fullName"
    >
      <b-form-input
          id="fullName"
          v-model="user.fullName"
          type="text"
          placeholder="Wicaksono/PT. Wicaksono"
          @keyup=" user.fullName = user.fullName.toUpperCase()"
          @input="() => { v$.user.fullName.$touch(); emitInput(); }"
      ></b-form-input>
      <div v-if="v$.user.fullName.$pending || v$.user.fullName.$error" class="invalid-feedback">
        <span v-if="v$.user.fullName.required.$invalid">{{ v$.user.fullName.required.$message }}</span>
      </div>
    </b-form-group>


    <div class="row">
      <b-form-group
          class="mb-3"
          id="address-group"
          label="Alamat"
          label-for="address"
      >
        <b-form-input
            id="address"
            v-model="user.address"
            type="text"
            placeholder="Masukkan Alamat"
            @keyup=" user.address = user.address.toUpperCase()"
            @input="() => { v$.user.address.$touch(); emitInput();}"
            :class="{
                    'is-invalid': v$.user.address.$error,
                  }"
        ></b-form-input>
        <div
            v-if="v$.user.address.$error"
            class="invalid-feedback"
        >
                  <span v-if="v$.user.address.required.$invalid">{{
                      v$.user.address.required.$message
                    }}</span>
        </div>
      </b-form-group>
    </div>
    <Address @selected-changed="handleAddressSelectedChange"></Address>
  </b-form>
      </div>
    </div>
  </div>
</template>

