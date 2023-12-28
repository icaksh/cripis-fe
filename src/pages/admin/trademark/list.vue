<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/bar/page-header.vue";
import appConfig from "@/app.config.json";
import {getDak, getTrademarkClasses, getTrademarks, getTrademarkStatus} from ".";
import {ref} from "vue";
import moment from "moment";
import Swal from "sweetalert2";
import {deleteTrademark} from "@/pages/haki/list/index";

export default {
  computed: {
    moment() {
      return moment
    }
  },
  page: {
    title: "Intellectual Property List",
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
    title: "Merek Dagang Terdaftar",
    items: [
      {
        text: "Merek Dagang",
      },
      {
        text: "List",
        active: true
      }
    ],
    trademarks :[],
    headers: [
      { title:"No", text: '1', value: 'num', sortable: false },
      {
        title: 'Nomor Registrasi',
        align: 'start',
        sortable: false,
        key: 'registration_number',
      },
      { title: 'Nama Merek Dagang', key: 'trademark_name' },
      { title: 'Kelas Merek Dagang', key: 'trademark_class' },
      { title: 'Tanggal Diterbitkan', key: 'approved_at' },
      { title: 'Tanggal Berakhir', key: 'expired_at' },
      { title: 'Status', key: 'status' },
      { title: 'Aksi', key: 'action' , sortable: false },
    ],
    trademarkStatus: [],
    trademarkClasses: [],
    addressDak: "",
    search:"",
    isError: false,
    isOpenNotes: false,
    errorMessage: ""
  }),
  methods: {
    async exportToCSV() {
      const data = []
      if (this.trademarks.length === 0) {
        Swal.fire(
            'Data Kosong!',
            'Tidak ada data yang dapat diexport.',
            'error'
        )
        return
      }
      for (let i = 0; i < this.trademarks.length; i++) {
        const address = await this.getAddressFromDak2(this.trademarks[i]);
        data.push({
          "Nomor Registrasi": this.trademarks[i].registration_number,
          "Tanggal Diterbitkan": this.trademarks[i].approved_at.Valid ? moment(this.trademarks[i].approved_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN",
          "Tanggal Berakhir Masa Perlindungan": this.trademarks[i].expired_at.Valid ? moment(this.trademarks[i].expired_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN",
          "Nama Merek": this.trademarks[i].trademark_name,
          "Kelas Merek": this.trademarkClasses[this.trademarks[i].trademark_class-1].class,
          "Pemilik": this.trademarks[i].owner_name,
          "Alamat Pemilik": `${this.trademarks[i].address}, ${address.address}`,
          "Surat Keterangan Hak Cipta": this.trademarks[i].certificate,
        })
      }
      const csvContent = this.convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', moment()+'.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await Swal.fire(
            'Browser tidak support!',
            'Silahkan gunakan browser lain.',
            'error'
        )
      }
    },

    convertToCSV(data) {
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(';'),

        ...data.map(row => headers.map(field => row[field]).join(';')),
      ];
      return csv.join('\n');
    },

    trademarkModelHandler(value) {
      this.trademarkModel = value
    },

    deleteTrademarkHandler(value) {
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
          deleteTrademark(value).then(
              () => {
                Swal.fire(
                    'Terhapus!',
                    'Data telah dihapus.',
                    'success'
                )
                this.trademarks = this.trademarks.filter(item => item.id !== value)
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
    getAddressFromDak(data){
      getDak(data.province, data.regency, data.district, data.village).then(
          data => {
            console.log(data)
            this.addressDak = data
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          }
      )
    },
    async getAddressFromDak2(data){
      return getDak(data.province, data.regency, data.district, data.village).then(
          data => {
            return data
          },
          err => {
            this.isError = true
            this.errorMessage = err.message
          }
      )
    }
  },
  async created() {
    await getTrademarkStatus().then(data => {
          this.trademarkStatus = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    await getTrademarkClasses().then(data => {
          this.trademarkClasses = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    getTrademarks().then(data => {
          this.trademarks = data
        },
        err => {
          this.isError = true
          this.errorMessage = err.message
        })
    console.log(this.trademarks)
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
              title="Detail Hak Cipta"
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
                  <td>Logo Merek</td>
                  <td><img v-if="isOpen" :src="trademarkModel.image" class="img-fluid" /></td>
                </tr>
                <tr>
                  <td>Nomor Registrasi</td>
                  <td>{{ isOpen? trademarkModel.registration_number:"" }}</td>
                </tr>
                <tr>
                  <td>Tanggal Diterbitkan</td>
                  <td>{{ isOpen? (trademarkModel.approved_at.Valid ? moment(trademarkModel.approved_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN"):"" }}</td>
                </tr>
                <tr>
                  <td>Tanggal Berakhir Masa Perlindungan</td>
                  <td>{{ isOpen? (trademarkModel.expired_at.Valid ? moment(trademarkModel.expired_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN"):"" }}</td>
                </tr>
                <tr>
                  <td>Nama Merek</td>
                  <td>{{ isOpen? trademarkModel.trademark_name:"" }}</td>
                </tr>
                <tr>
                  <td>Kelas Merek</td>
                  <td>{{ isOpen ? trademarkClasses[trademarkModel.trademark_class-1].class : "" }}</td>
                </tr>
                <tr>
                  <td>Detail Merek</td>
                  <td>{{ isOpen ? trademarkClasses[trademarkModel.trademark_class-1].description : "" }}</td>
                </tr>
                <tr>
                  <td>Pemilik</td>
                  <td>{{ isOpen ? trademarkModel.owner_name: "" }}</td>
                </tr>
                <tr>
                  <td>Alamat Pemilik</td>
                  <td>{{ isOpen ? `${trademarkModel.address}, ${this.addressDak.address}` : ""}}</td>
                </tr>
                <tr>
                  <td>Surat Keterangan Hak Cipta</td>
                  <td>{{ isOpen ? `${trademarkModel.address}, ${this.addressDak.address}` : ""}}</td>
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
              <h5 class="mb-0 card-title flex-grow-1">Tabel Daftar Merek Dagang</h5>
            </div>
          </div>
          <div class="card-body">
            <div>
              <div class="row">
                <div class="col-lg-6 my-2">
                  <b-button @click="exportToCSV" class="btn btn-success btn-label">
                    <i class="bx bx-table label-icon"></i> CSV
                  </b-button>
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
                          placeholder="Cari Nama Merk Dagang..."
                          variant="outlined"
                          class=""
                          hide-details
                      ></b-form-input>
                    </div>
                  </div>
                </div>
              </div>
              <v-data-table :search="search" :headers="headers" :items="trademarks" class="table align-middle dt-responsive nowrap w-100 table-check">
                <template v-slot:[`item.num`]="{ index }">
                  <span>{{ index + 1 }}</span>
                </template>
                <template v-slot:[`item.registration_number`]="{ item }">
                  <span class="badge bg-warning"> {{ item.registration_number}}</span>
                </template>
                <template v-slot:[`item.trademark_class`]="{ item }">
                  {{  trademarkClasses[item.trademark_class-1].class }}
                </template>
                <template v-slot:[`item.approved_at`]="{ item }">
                <span class="badge" :class="{ 'badge-soft-warning': item.approved_at.Valid, 'badge-soft-info': !item.approved_at.Valid }">
                {{  item.approved_at.Valid ? moment(item.approved_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}
                  </span>
                </template>
                <template v-slot:[`item.expired_at`]="{ item }">
                <span class="badge" :class="{ 'badge-soft-success': item.expired_at.Valid, 'badge-soft-info': !item.expired_at.Valid, 'badge-soft-danger': moment(item.expired_at.Time).isBefore(moment(), 'day') }">
                {{  item.expired_at.Valid ? moment(item.expired_at.Time).format("DD-MM-YYYY") : "BELUM DITERBITKAN" }}
                  </span>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                <span class="badge" id="statuss" :class="{
                    'badge-soft-info': item.status == 1,
                    'badge-soft-success': item.status == 2,
                    'badge-soft-warning': item.status == 3,
                    'badge-soft-danger': item.status == 4,
                }">
                {{ trademarkStatus[item.status-1].status.toUpperCase() }}
                  </span>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <ul class="list-unstyled hstack gap-1 mb-0">
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Lihat">
                      <b-button @click="() => { trademarkModelHandler(item); getAddressFromDak(item); isOpen = true}" class="btn btn-sm btn-soft-primary"
                      ><i
                          class="mdi mdi-eye-outline text-info"></i></b-button>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Download">
                      <router-link :to="{path: '/admin/trademark/'+item.id}" class="btn btn-sm btn-soft-warning"><i class="mdi mdi-pencil-outline"></i></router-link>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                      <b-button @click="deleteTrademarkHandler(item.id)" class="btn btn-sm btn-soft-danger"
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