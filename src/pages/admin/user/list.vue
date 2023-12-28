<script>
import Layout from "@/layouts/main";
import PageHeader from "@/components/bar/page-header.vue";
import appConfig from "@/app.config";
import {ref} from "vue";
import moment from "moment";
import {deleteUser, userRoles, users} from ".";
import {getDak} from "@/pages/haki/register/helpers";
import Swal from "sweetalert2";

export default {
  computed: {
    moment() {
      return moment
    }
  },
  page: {
    title: "Daftar Pengguna",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: {Layout, PageHeader },
  setup(){
    const isOpen = ref(false);
    const trademarkModel = ref([]);
    return {
      isOpen,
      trademarkModel,
    }
  },
  data: () => ({
    title: "Manajemen Pengguna",
    items: [
      {
        text: "Pengguna",
      },
      {
        text: "Daftar",
        active: true
      }
    ],
    users :[],
    headers: [
      { title:"No", text: '1', value: 'num', sortable: false },
      {
        title: 'Email',
        sortable: false,
        key: 'email',
      },
      { title: 'Nama Lengkap', key: 'first_name' },
      { title: 'No HP', key: 'phone' },
      { title: 'Role', key: 'roles' },
      { title: 'Terverifikasi', key: 'verified' },
      { title: 'Status', key: 'status' },
      { title: 'Aksi', key: 'action' , sortable: false },
    ],
    userVerified: [],
    userStatus: [],
    userRoles: [],
    userProfiles:"",
    addressDak: "",
    search:"",
    isError: false,
    errorMessage: ""
  }),
  methods: {
    async userProfileHandle(value) {
      this.userProfiles = value
      console.log(value)
      console.log(this.userProfiles)
      this.addressDak = await getDak(this.userProfiles.province, this.userProfiles.regency, this.userProfiles.district, this.userProfiles.village)
      console.log(this.users)
      this.userProfiles["full_name"] = value.first_name + " " + value.last_name
    },

    deleteUserHandler(value) {
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
          deleteUser(value).then(
              () => {
                Swal.fire(
                    'Terhapus!',
                    'Data telah dihapus.',
                    'success'
                )
                this.users = this.users.filter(item => item.id !== value)
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
  async created() {
    await users().then(data => {
          this.users = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    await userRoles().then(
        data => {
          this.userRoles = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-sm-6 col-md-4 col-xl-3">
        <div class="my-4 text-center">
          <b-modal
              v-model="isOpen"
              id="modal-standard"
              title="Detail Profil Pengguna"
              title-class="font-18"
          >
            <div class="table-responsive">
              <table class="table align-middle dt-responsive nowrap w-100 table-check" id="job-list">
                <thead>
                <tr>
                  <th scope="col">Identitas</th>
                  <th scope="col">Keterangan</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Nama Pengguna</td>
                  <td>{{ isOpen? userProfiles.full_name : '' }}</td>
                </tr>
                <tr>
                  <td>Nomor Induk Kependudukan</td>
                  <td>{{ isOpen? userProfiles.card_number : '' }}</td>
                </tr>
                <tr>
                  <td>Tanggal Lahir</td>
                  <td>{{ isOpen? moment(userProfiles.dob).format('DD MMMM YYYY') : '' }}</td>
                </tr>
                <tr>
                  <td>Jenis Kelamin</td>
                  <td>{{ isOpen ? (userProfiles.sex === 1 ? "Laki-laki" : "Perempuan") : ''}}</td>
                </tr>
                <tr>
                  <td>Alamat Pemilik</td>
                  <td>{{ isOpen ? `${userProfiles.address}, ${this.addressDak.address}` : ""}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body border-bottom">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 card-title flex-grow-1">Daftar Pengguna</h5>
            </div>
          </div>
          <div class="card-body">
            <div>
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
                          placeholder="Cari Pengguna..."
                          variant="outlined"
                          class=""
                          hide-details
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <v-data-table :search="search" :headers="headers" :items="users" class="table align-middle dt-responsive nowrap w-100 table-check">
                <template v-slot:[`item.num`]="{ index }">
                  <span>{{ index + 1 }}</span>
                </template>
                <template v-slot:[`item.first_name`]="{ item }">
                  <span> {{ item.first_name }} {{ item.last_name }} </span>
                </template>
                <template v-slot:[`item.roles`]="{ item }">
                  <span class="badge" :class="{
                    'badge-soft-success': item.roles == 1,
                    'badge-soft-info': item.roles == 2,
                  }">
                    {{ item.roles == 1 ? "ADMIN" : "PENGGUNA" }}
                  </span>
                </template>
                <template v-slot:[`item.verified`]="{ item }">
                  <span class="badge" :class="{
                    'badge-soft-success' : item.verified == 1,
                    'badge-soft-danger' : item.verified !=1
                  }">
                    {{ item.verified == 1 ? "TERVERIFIKASI" : "BELUM TERVERIFIKASI" }}
                  </span>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <span class="badge" :class="{
                    'badge-soft-success' : item.status == 1,
                    'badge-soft-danger' : item.status !=1
                  }">
                    {{ item.status == 1 ? "AKTIF" : "TIDAK AKTIF" }}
                  </span>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <ul class="list-unstyled hstack gap-1 mb-0">
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Lihat">
                      <b-button @click="() => { userProfileHandle(item); isOpen = true }" class="btn btn-sm btn-soft-primary"
                      ><i
                          class="mdi mdi-eye-outline text-primary"></i></b-button>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                      <router-link :to="{path: '/admin/account/'+item.id}" class="btn btn-sm btn-soft-warning"><i class="mdi mdi-pencil-outline"></i></router-link>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                      <b-button @click="deleteUserHandler(item.id)" class="btn btn-sm btn-soft-primary"
                      ><i
                          class="mdi mdi-delete-outline text-danger"></i></b-button>
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