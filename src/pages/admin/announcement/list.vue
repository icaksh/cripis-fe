<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/bar/page-header.vue";
import {deleteAnnouncement, getAnnouncements} from ".";
import Swal from "sweetalert2";

export default {
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
      time: "",
      fullName: "",
      isError : false,
      errorMessage : "",
      announcements: [],
      search: "",
      headers: [
        { title:"No", text: '1', value: 'num', sortable: false },
        { title: 'Judul Pengumuman', key: 'title' },
        { title: 'Deskripsi', key: 'description' },
        { title: 'Aksi', key: 'action' },
      ],
    };
  },
  methods:{
    handleDeleteAnnoucement(value) {
      Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Anda tidak dapat mengembalikan data yang telah dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#536de6',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAnnouncement(value).then(
              () => {
                Swal.fire(
                    'Terhapus!',
                    'Data telah dihapus.',
                    'success'
                )
                this.announcements = this.announcements.filter(item => item.id !== value)
              },
              err => {
                Swal.fire(
                    'Data gagal dihapus!',
                    err.message,
                    'error'
                )
              }
          )
        }
      })
    },
  },
  created() {
    getAnnouncements().then(data => {
          this.announcements = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    setTimeout(() => {
      this.showModal = true;
    }, 1500);
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">Manajemen Pengumuman</h5>
              <div class="flex-shrink-0">
                <a href="/admin/announcement/create" class="btn btn-primary me-1">Tambah Pengumuman</a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 my-2">
              </div>
              <div class="col-lg-6 my-2">
                <div class="row">
                  <div class="col-lg-6">
                  </div>
                  <div class="col-lg-6">
                    <b-form-input
                        v-model="search"
                        label="Search"
                        single-line
                        placeholder="Cari Pengumuman..."
                        variant="outlined"
                        class=""
                        hide-details
                    ></b-form-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <v-data-table :search="search" :headers="headers" :items="announcements" class="table align-middle dt-responsive nowrap w-100 table-check">
                <template v-slot:[`item.num`]="{ index }">
                  <span>{{ index + 1 }}</span>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <ul class="list-unstyled hstack gap-1 mb-0">
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                      <router-link :to="{path: '/admin/announcement/'+item.id}" class="btn btn-sm btn-soft-warning"><i class="mdi mdi-pencil-outline"></i></router-link>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                      <b-button @click="handleDeleteAnnoucement(item.id)" class="btn btn-sm btn-soft-danger"
                      ><i
                          class="mdi mdi-trash-can-outline text-danger"></i></b-button>
                    </li>
                  </ul>
                </template>
              </v-data-table>
          </div>
        </div>
        </div>
      </div>
    </div>
  </Layout>
</template>