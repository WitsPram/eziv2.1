<template>
  <main class="flexCenter">
    <CanvasJSChart :options="options" :style="styleOptions" @chart-ref="chart1Instance" />
    <CanvasJSChart :options="options2" :style="styleOptions" @chart-ref="chart2Instance" />
    <CanvasJSChart :options="options3" :style="styleOptions" @chart-ref="chart3Instance" />
    <CanvasJSChart :options="options4" :style="styleOptions" @chart-ref="chart4Instance" />

  </main>

</template>

<script>

import { mapGetters } from 'vuex';
import toast from '../components/toasty';
import { baseurl } from '../config/config';
import axios from 'axios';

export default {


  mounted() {
    this.fetchData();
  },
  data() {
    return {
      fundsUsedData: {},
      acceptedCounts: {},
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      options: {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title:{
          text: "Funds consumed over time"
        },
        axisY: {
          title: "Amount",
        },
        data: [{
          type: "line",color: "#1DA1F2",
          // yValueFormatString: "₹##,##,##0.## crores",
          dataPoints:[]
        }]
      },
      styleOptions: {
        width: window.innerWidth > 600 ? "50%" : "100%",
        height: "360px"
      },
      options2: {
          theme: "light2",
          animationEnabled: true,
        exportEnabled: true,
          title:{
            text: "Funds consumed (%)"
          },
          data: [{
            type: "pie",
            indexLabel: "{label} (#percent%)",
            yValueFormatString: "#,##0",
            toolTipContent: "<span style='\"'color: {color};'\"'>{label}</span> {y}(#percent%)",
            dataPoints: []
          }]
        },
        options3: {
        animationEnabled: true,
        theme: "light2",
        exportEnabled: true,
        title:{
          text: "Types of Funding Opportunities"
        },
        data: [{
          type: "column",
          dataPoints: []
        }]
      },
      options4: {
          theme: "light2",
          animationEnabled: true,
        exportEnabled: true,
          title:{
            text: "Accepted vs Rejected Applicants"
          },
          data: [{
            type: "pie",
            indexLabel: "{label} (#percent%)",
            yValueFormatString: "#,##0",
            toolTipContent: "<span style='\"'color: {color};'\"'>{label}</span> {y}(#percent%)",
            dataPoints: []
          }]
        },
    };
  },
  computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
  },
  mounted() {
    this.checker();
    this.fetchData();
  },
  methods: {
    chart2Instance(chart2) {
      this.chart2 = chart2;
    },
    chart3Instance(chart3) {
      this.chart3 = chart3;
    },
    chart4Instance(chart4) {
      this.chart4 = chart4;
    },
    chart1Instance(chart1) {
      this.chart1 = chart1;
    },
    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Fund Manager') {
        this.$router.push('/');
      }
      // console.log(type);
    },
    parseAmount(amountString) {
    // Remove the 'R' and convert the rest to a number
    return parseInt(amountString.replace("R", ""));
},
async fetchData() {
      const token = await this.getUser.token;
      const id = await this.getUser.id;

        axios.get(baseurl + '/api/v1/reports/'+id, {
        headers: {
          'Authorization': `${token}`
        }
      }).then(response => {
        const data = response.data;
        console.log(data);
        if (data.message === 'Success') {

          const consumed = data.consumed;
          const total = data.total;
          const report = data.report;

          const m = report.map(function(entry) {
    return {
      label: entry.date,
      y: parseFloat(entry.amount.replace("R", ""))

    };
});

// m.push({ label : "25th May", y: 2500})
// m.push({ label : "26th May", y: 3000})

this.options.data[0].dataPoints = m;

          this.chart1.render();
          toast.info('You have consumed R' + consumed + ' out of R' + total); 

          this.options2.data[0].dataPoints = [
            { label: "Consumed", y: consumed, color: "#3fa0dc" },
            { label: "Remaining", y: total - consumed, color: "#39cb39"  }
          ];

          this.chart2.render();

          const EducationalCount = data.EducationalCount;
          const BusinessCount = data.BusinessCount;
          const EventsCount = data.EventsCount;

          console.log(EducationalCount, BusinessCount, EventsCount)

          this.options3.data[0].dataPoints = [
            { label: "Educational", y: EducationalCount, color: "#39cb39" },
            { label: "Business", y: BusinessCount, color: "#0fa20f"  },
            { label: "Events", y: EventsCount, color: "#3fa0dc"  }
          ];

          this.chart3.render();

          const AcceptedCount = data.AcceptedCount;
          const RejectedCount = data.RejectedCount;

          this.options4.data[0].dataPoints = [
            { label: "Accepted", y: AcceptedCount, color: "#39cb39" },
            { label: "Rejected", y: RejectedCount, color: "#3fa0dc"  }
          ];

          this.chart4.render();
          
          
        } else if (data.message === 'Failure') {
          toast.info('Insufficient data to display a report');
        } else {
          toast.error('Failed to fetch funds');
        }
      }).catch(error => {
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized access - please log in again');
          console.error('Unauthorized access - please log in again');
        } else {
          const errorMessage = error.response ? error.response.data.message : error.message;
          toast.error(`Request failed: ${errorMessage}`);
          console.error(error);
        }
      });
      }
  }
};
</script>

<style scoped>

.flexCenter{
  display: flex;
  padding: 2rem;
  gap: 4rem;
  /* color: #39cb39;
  background: #3fa0dc;
  background-color: #0fa20f; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* height: ; */
}

</style>