<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/bar/page-header.vue";
import {createAnnouncement, editAnnouncement, getAnnouncement} from ".";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Swal from "sweetalert2";

export default {
  setup(){
    return{
      v$: useVuelidate()
    }
  },
  page: {
    title: "Manajemen Aplikasi",
    items: [
      {
        text: "Manajemen Aplikasi",
      },
      {
        text: "Pengumuman",
        active: true
      }
    ],
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
          text: "Aplikasi",
          active: true
        }
      ],
      fullPage: true,
      announcements: {
        title: "",
        description: "",
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      announcements: {
        title: {
          required: helpers.withMessage("Judul Pengumuman tidak boleh kosong", required),
        },
        description: {
          required: helpers.withMessage("Deskripsi Pengumuman tidak boleh kosong", required),
        },
      },
    };
  },
  methods: {
    handleCreateAnnouncement(){
      createAnnouncement(this.announcements).then(() => {
            Swal.fire({
              title: "Berhasil",
              text: "Pengumuman berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              this.$router.push({name: "admin-announcement-list"})
            })
          },
          err => {
            Swal.fire({
              title: "Gagal",
              text: err.message,
              icon: "error",
              confirmButtonText: "OK",
            })
          })
    },
    handleEditAnnouncement(){
      editAnnouncement(this.announcements).then(() => {
            Swal.fire({
              title: "Berhasil",
              text: "Pengumuman berhasil diubah",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              this.$router.push({name: "admin-announcement-list"})
            })
          },
          err => {
            Swal.fire({
              title: "Gagal",
              text: err.message,
              icon: "error",
              confirmButtonText: "OK",
            })
          })
    },

  },
  created() {
    if(this.$route.params.id) {
      this.isEdit = true
      getAnnouncement(this.$route.params.id).then(data => {
            this.announcements = data
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
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">{{ isEdit? "Edit Pengumuman" : "Tambah Pengumuman" }}</h5>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
                <b-form class="col-12">
                  <b-form-group class="mb-3"
                                id="title"
                                label="Judul Pengumuman"
                                label-for="title">
                    <b-form-input
                        id="title"
                        v-model="announcements.title"
                        type="text"
                        placeholder="Masukkan Judul Pengumuman"

                        :class="{
                    'is-invalid': v$.announcements.title.$error,
                  }"
                        @input="()=> v$.announcements.title.$touch()"
                    ></b-form-input>
                    <div
                        v-if="v$.announcements.title.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.announcements.title.required.$invalid">{{
                      v$.announcements.title.required.$message
                    }}</span>
                    </div>
                  </b-form-group>
                  <b-form-group class="mb-3"
                                id="description"
                                label="Deskripsi Pengumuman"
                                label-for="description">
                    <b-form-textarea
                        id="description"
                        v-model="announcements.description"
                        type="text"
                        placeholder="Masukkan Deskripsi Pengumuman"
                        :class="{
                    'is-invalid': v$.announcements.description.$error,
                  }"
                        @input="()=> v$.announcements.description.$touch()"
                    ></b-form-textarea>
                    <div
                        v-if="v$.announcements.description.$error"
                        class="invalid-feedback"
                    >
                  <span v-if="v$.announcements.description.required.$invalid">{{
                      v$.announcements.description.required.$message
                    }}</span>
                    </div>
                  </b-form-group>
                </b-form>
              <div class="mt-4 d-grid">
                <b-button type="submit" variant="info" class="btn btn-warning-outline text-white"
                          @click="isEdit ? handleEditAnnouncement() : handleCreateAnnouncement()"
                >{{ isEdit? "Edit Pengumuman" : "Tambah Pengumuman" }}
                </b-button
                >
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>