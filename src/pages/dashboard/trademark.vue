<script>
import {getLogsTrademarks} from "@/pages/dashboard/helpers";
import moment from "moment";

export default {
  components: {
  },
  data() {
    return {
      isActive: "year",
      series : [],
      chartOptions: {
        chart: {
          id: "Laporan Pendaftaran Merek Dagang",
          stacked: true,
          toolbar: {
            show: true,
          },
          export: {
            csv: {
              filename: "Laporan Pendaftaran Merek Dagang",
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value',
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString()
              }
            },
            svg: {
              filename: "Laporan Pendaftaran Merek Dagang",
            },
            png: {
              filename: "Laporan Pendaftaran Merek Dagang",
            }
          },
          zoom: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "15%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
        },
        colors: ["#34c38f", "#f14c51", "#556ee6"],
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
    };
  },
  props: {
    updating: {
      type: Boolean,
    },
  },
  methods: {

    getMonth(){
      const currentDate = moment();
      const lastDayOfMonth = currentDate.daysInMonth();

      const totalData = Array.from({ length: lastDayOfMonth }, () => 0);
      const approvedData = Array.from({ length: lastDayOfMonth }, () => 0);
      const rejectedData = Array.from({ length: lastDayOfMonth }, () => 0);
      getLogsTrademarks(true,true).then(
          (data) => {
            data.forEach(({ day, count, approved_count, rejected_count }) => {
              if (day <= lastDayOfMonth) {
                totalData[day - 1] = count;
                approvedData[day - 1] = approved_count;
                rejectedData[day - 1] = rejected_count;
              }
            });
            this.chartOptions.xaxis.categories = Array.from({ length: lastDayOfMonth }, (_, i) => i + 1)
            this.series = [
              {name: "Diterima", data: approvedData},
              {name: "Ditolak", data: rejectedData},
              {name: "Dalam Proses", data: totalData},
            ];
          });
    },

    getYear(){
      getLogsTrademarks(true).then(
          (data) => {
            const totalData = Array.from({ length: 12 }, () => 0);
            const approvedData = Array.from({ length: 12 }, () => 0);
            const rejectedData = Array.from({ length: 12 }, () => 0);

            data.forEach(({ month, count, approved_count, rejected_count }) => {
              totalData[month - 1] = count - approved_count - rejected_count;
              approvedData[month - 1] = approved_count;
              rejectedData[month - 1] = rejected_count;
            });

            this.series = [
              {name: "Diterima", data: approvedData},
              {name: "Ditolak", data: rejectedData},
              {name: "Dalam Proses", data: totalData},
            ];
            this.chartOptions.xaxis.categories= [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]
          },
      )
    },

    changeVal(value) {
      switch (value) {
        case "month":
          this.isActive = "month";
          this.getMonth()
          break;
        case "year":
          this.isActive = "year";
          this.getYear()
          break;
        default:
          this.series = [];
          break;
      }
    },
  },
  async created() {
    getLogsTrademarks(true).then(
        (data) => {
          const totalData = Array.from({ length: 12 }, () => 0);
          const approvedData = Array.from({ length: 12 }, () => 0);
          const rejectedData = Array.from({ length: 12 }, () => 0);

          data.forEach(({ month, count, approved_count, rejected_count }) => {
            totalData[month - 1] = count - approved_count - rejected_count;
            approvedData[month - 1] = approved_count;
            rejectedData[month - 1] = rejected_count;
          });

          this.series = [
            {name: "Diterima", data: approvedData},
            {name: "Ditolak", data: rejectedData},
            {name: "Dalam Proses", data: totalData},
          ];
          this.chartOptions.xaxis.categories= [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
          console.log(this.series)

        },
        (err) => {
          this.isError = true;
          this.errorMessage = err.message;
        }
    )
  }
};
</script>
<template>
    <div class="card">
      <div class="card-body">
        <div class="d-sm-flex flex-wrap">
          <h4 class="card-title mb-4">Infografis Pendaftaran Merek</h4>

        </div>
        <div class="row">
          <div class="ms-auto">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <a
                    class="nav-link"
                    href="javascript: void(0);"
                    @click="changeVal('month')"
                    :class="{'active': isActive == 'month'}"
                >Bulan Ini</a
                >
              </li>
              <li class="nav-item">
                <a
                    class="nav-link"
                    href="javascript: void(0);"
                    @click="changeVal('year')"
                    :class="{'active': isActive == 'year'}"
                >Tahun Ini</a
                >
              </li>
            </ul>
          </div>
        </div>

        <apexchart
          class="apex-charts"
          type="bar"
          dir="ltr"
          height="240"
          :series="series"
          :options="chartOptions"
        ></apexchart>
      </div>
    </div>
</template>
