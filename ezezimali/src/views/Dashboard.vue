<template>
    <div class="dashboard">
      <h1 class="dashboard-title">WELCOME TO THE HOME PAGE</h1>
      <!-- <router-link to="/apply-funding-manager">
        <button class="dashboard-button">Apply to be a Fund Manager</button>
      </router-link> -->
      <div class="fundingOpps">
        <div class="opp-card" v-for="opp in fundingOpps" :key="opp.id">
          <h2 class="opp-title">{{ opp.title }}</h2>
          <p class="opp-type">Type: {{ opp.type }}</p>
          <p class="opp-amount">Amount: {{ opp.amount }}</p>
          <p class="opp-description">{{ opp.description }}</p>
          <p class="opp-end-date">End Date: {{ opp.end_date }}</p>
          <router-link :to="'/apply-funding-opportunity/' + opp.id">
            <button class="opp-button">Apply for this Funding Opportunity</button>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        fundingOpps: [],
        formData: {
          title: '',
          summary: '',
          description: '',
          agree: false
        }
      };
    },
    computed: {
      ...mapGetters([
        'getUser', 'isAuthenticated'
      ]),
    },
    methods: {
      async getEmail(){
        return await this.getUser.username;
      },
      submitForm() {
        // ... existing code ...
      },
      async readFundOpps() {
        const baseurl = "https://ezezimalii.azurewebsites.net/";
        const response = await fetch(baseurl+'/api/v1/auth/readFundOpps/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        this.fundingOpps = data;
      }
    },
    created() {
      this.readFundOpps();
    }
  };
  </script>























  <style scoped>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .dashboard-title {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .dashboard-button {
    display: block;
    width: 100%;
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 20px 0;
    cursor: pointer;
  }
  
  .fundingOpps {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .opp-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
    flex: 1 0 calc(33% - 40px);
    box-sizing: border-box;
  }
  
  .opp-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .opp-type,
  .opp-amount,
  .opp-description,
  .opp-end-date {
    margin-bottom: 10px;
  }
  
  .opp-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
  </style>