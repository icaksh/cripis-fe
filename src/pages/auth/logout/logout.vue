<script>
import Layout from "../../../layouts/auth.vue";
import appConfig from "@/app.config.json";
import {logout} from ".";
import Swal from "sweetalert2";
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
  },
  mounted() {
    logout().then(() => {
      Swal.fire({
        title: 'Berhasil',
        text: 'Anda berhasil logout',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.clear();
        this.$router.push({name: 'login'})
      })

        },
        error => {
          Swal.fire({
            title: 'Gagal',
            text: 'Anda gagal logout'+error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            localStorage.clear();
            this.$router.push({name: 'dashboard'})
          })
        }
    )
  }
};
</script>

<template>
  <Layout>
  </Layout>
</template>