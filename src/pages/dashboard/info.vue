<script>
import Layout from "@/layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/bar/page-header.vue";
import {getAnnouncement} from "@/pages/dashboard/helpers";
import moment from "moment";
import {jwtDecode} from "jwt-decode";
import fastLocalStorage from "fastlocalstorage";
import Trademark from "@/pages/dashboard/trademark.vue";
import User from "@/pages/dashboard/user.vue";

export default {
  page: {
    title: "Dashboard",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    User,
    Trademark,
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Dashboard",
      fullPage: true,
      time: "",
      fullName: "",
      role:"",
      isError : false,
      errorMessage : "",
      announcements: [],
    };
  },
  computed :{
    moment() {
      return moment
    },
  },
  created() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;
    if (currentHour < 12) {
      greeting = "Selamat Pagi";
    } else if (currentHour < 18) {
      greeting = "Selamat Siang";
    } else {
      greeting = "Selamat Malam";
    }
    this.time = greeting
    const details = jwtDecode(JSON.parse(fastLocalStorage.getItem('user')).refresh_token)
    this.fullName = details.firstName + " " + details.lastName
    this.role = details.role
    getAnnouncement().then(data => {
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
      <div class="col-xl-4">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-primary">
            <div class="row">
              <div class="col-7">
                <div class="text-primary p-3">
                  <h5 class="text-primary">{{ time }}!</h5>
                  <p>Semoga Sehat Selalu</p>
                </div>
              </div>
              <div class="col-5 align-self-end">
                <img src="@/assets/images/profile-img.png" alt class="img-fluid" />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row">
              <div class="col-sm-12">
                <div class="avatar-md profile-user-wid mb-4">
                  <img
                      src="@/assets/images/users/user-dummy-img.jpg"
                      alt
                      class="img-thumbnail rounded-circle"
                  />
                </div>
                <h5 class="font-size-15 text-truncate">{{fullName}}</h5>
                <p class="text-muted mb-0 text-truncate">{{ role===1 ? "Administrator" : "Pengguna"}}</p>
              </div>
            </div>
          </div>
        </div>
        <div vif="role===1" class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Pengumuman</h4>
            <div v-if="isError" class="row">
              <div class="col-lg-12">
                <div class="alert alert-danger alert-dismissible fade show">
                  {{ this.errorMessage }}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
            </div>
            <ul class="list-group">
              <SimpleBar style="max-height: 390px">
                <li v-for="(announcement, index) in announcements" :key="index" class="list-group-item border-0">
                  <div class="d-flex">
                    <div class="flex-grow-1">
                      <h5 class="font-size-14">{{announcement.title}}</h5>
                      <p class="text-muted">
                        {{announcement.description}}
                      </p>
                      <p class="text-muted mb-0">{{ moment(announcement.created_at).format('DD MMMM YYYY') }}</p>
                    </div>
                  </div>
                </li>
              </SimpleBar>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="role===1" class="col-xl-8">
        <Trademark></Trademark>
        <User></User>
        <div v-if="role!==1" class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Pengumuman</h4>
            <div v-if="isError" class="row">
              <div class="col-lg-12">
                <div class="alert alert-danger alert-dismissible fade show">
                  {{ this.errorMessage }}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
            </div>
            <ul class="list-group">
              <SimpleBar style="max-height: 390px">
                <li v-for="(announcement, index) in announcements" :key="index" class="list-group-item border-0">
                  <div class="d-flex">
                    <div class="flex-grow-1">
                      <h5 class="font-size-14">{{announcement.title}}</h5>
                      <p class="text-muted">
                        {{announcement.description}}
                      </p>
                      <p class="text-muted mb-0">{{ moment(announcement.created_at).format('DD MMMM YYYY') }}</p>
                    </div>
                  </div>
                </li>
              </SimpleBar>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
