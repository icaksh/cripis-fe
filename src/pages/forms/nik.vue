<script>
import {integer, maxLength, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
        this.v$.value.$touch();
        this.validateState = this.v$.value.$pending ? null : !this.v$.value.$invalid;
      },
    },
  },
  data() {
    return {
      v$: useVuelidate(),
      formConfig: {
        label: "NIK",
        placeholder: "Masukkan 16 digit Nomor Induk Kependudukan",
        validateState: null,
        validations: {
          required,
          integer,
          minLength: minLength(16),
          maxLength: maxLength(16),
        },
        errorMessage: {
          required: "NIK harus diisi",
          integer: "NIK harus berupa angka",
          minLength: "NIK harus memiliki panjang 16 digit",
          maxLength: "NIK harus memiliki panjang 16 digit",
        },
      },

    }
  },
  mounted()  {
    },
  validations:{
    value: {}
  },
  methods: {
    handleInput() {
      this.v$.value.$touch();
    },
    getValidationState() {
      return this.formConfig.validateState;
    },
  }
}

</script>

<template>
  <b-form-group
      class="mb-3"
      id="nik-group"
      label="Nomor Induk Kependudukan"
      label-for="nik"
      :state="v$.user.nik.$pending ? null : !v$.user.nik.$error"
  >
    <b-form-input
        :id="id"
        v-model="internalValue"
        type="text"
        placeholder="Masukkan 16 digit Nomor Induk Kependudukan"
        :class="{
                    'is-invalid': submitted && v$.user.nik.$error,
                  }"
        @input="handleInput"
    ></b-form-input>
    <div v-if="submitted && v$.user.nik.$pending" class="invalid-feedback">
      <span v-if="v$.user.nik.required.$invalid">{{ v$.user.nik.required.$message }}</span>
      <span v-else-if="v$.user.nik.integer.$invalid">{{ v$.user.nik.integer.$message }}</span>
      <span v-else-if="v$.user.nik.length.$invalid">{{ v$.user.nik.length.$message }}</span>
    </div>
  </b-form-group>
</template>
<script setup>
</script>