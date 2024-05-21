<template>
    <div class="reporting">
      <h1>Fund Reporting</h1>
  
      <div class="stats-section">
        <h2>Statistics</h2>
        <div class="stats">
          <div class="stat-item total-funds-used" id="fundsUsed">
            <h3>Your Managed Funds</h3>
            <ul>
              <li v-for="(amount, title) in fundsUsedData" :key="title">{{ title }}: R{{ amount }}</li>
              <li class="total-amount" :key="'total'">Total: R{{ totalFundsUsed }}</li>
            </ul>
          </div>
          <div class="stat-item" id="acceptedUsers">
            <h3>Search for applicant</h3>
            <input type="text" v-model="searchTerm" placeholder="Enter user" />
            <button @click="searchUser">Search</button>      
            <ul>
              Funds Applied To: {{ entryCount }}<br>
              <br>
              <li v-for="fundName in matchedFundNames" :key="fundName">{{ fundName }}</li>
            </ul>
          </div>
          <div class="stat-item" id="awaitingFunds">
            <h3>Fund Applications Awaiting Approval/Rejection</h3>
            <ul>
              <li>Work in progress...</li>
              <li v-for="(count, fund) in awaitingApproval" :key="fund">{{ fund }}: {{ count }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>

import { mapGetters } from 'vuex';

  export default {


    mounted() {
      this.fetchData();
    },
    data() {
      return {
        fundsUsedData: {},
        acceptedCounts: {},
        awaitingApproval: {},
        totalFundsUsed: 0,
        additionalData: {},
        entryCount: 0, // New data property for the count of entries
        matchedFundNames: [], // New data property for matched fund names
        searchTerm: '', // New data property for search term
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
      async fetchData() {
        // alert('Fetching data...');
        const email = await this.getEmail();
        const baseurl = 
        // 'http://localhost:'+3019;
        "https://ezezimalii.azurewebsites.net/";
        const response = await fetch(baseurl+'/api/v1/auth/readFundOpps/'+email, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        this.processData(data);

      },
      processData(data) {
        let fundsUsedData = {};
        let totalFundsUsed = 0;
        this.fundIds = [];
        this.fundNames = [];
  
        // Extract the total funds used data
        data.forEach(item => {
          // Remove non-numeric characters and convert to integer
          const amount = parseInt(item.amount.replace(/[^0-9]/g, ''), 10);
          fundsUsedData[item.title] = amount;
          totalFundsUsed += amount;
          this.fundIds.push(item.id);
          this.fundNames.push(item.title);
        });
  
        this.fundsUsedData = fundsUsedData;
        this.totalFundsUsed = totalFundsUsed;
  
        // Example data for acceptedCounts and awaitingApproval
        this.acceptedCounts = {
          "Fund A": 10,
          "Fund B": 5
        };
  
        this.awaitingApproval = {
          "Fund A": 2,
          "Fund B": 3
        };
      },
      async fetchAdditionalData(id) {
        try {
          const baseurl = 
          "https://ezezimalii.azurewebsites.net/";
        //   'http://localhost:3019';
          const response = await fetch(`${baseurl}/api/v1/auth/getApplicationsForFundingOpps/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          });
  
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
  
          const data = await response.json();
          this.additionalData = data;
          this.entryCount = data.length;
  
          // Extract appIDs and find matching fund names
          const appIDs = data.map(item => item.fundingOpp_ID);
          this.matchedFundNames = this.fundIds
            .map((id, index) => appIDs.includes(id) ? this.fundNames[index] : null)
            .filter(name => name !== null);
  
          console.log(data);
        } catch (error) {
          console.error('Error fetching additional data:', error);
        }
      },
      searchUser() {
        if (this.searchTerm) {
          this.fetchAdditionalData(this.searchTerm);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Updated styling for Total Funds Used */
  .total-funds-used {
    background: linear-gradient(135deg, #ffd54f 0%, #ffa000 100%);
    color: #fff; /* Text color */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Box shadow */
  }
  
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }
  
  .reporting {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: #f4f4f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    animation: fadeIn 1s ease-in-out;
  }
  
  .stats-section {
    margin-top: 20px;
  }
  
  .stats {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-item {
    background: #ffffff;
    
    border: 1px solid #d0d0d0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .stat-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  h1 {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-decoration: underline;
  }
  input {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 40%;
    color: black;
  }
  h2 {
    font-size: 26px;
    font-weight: bold;
    color: black;
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 20px;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    color: black
  }
  
  li {
    font-size: 16px;
    margin-bottom: 5px;
    color: black;
  }
  
  #fundsUsed {
    background: #bdffce;
    color: #fff;
  }
  #acceptedUsers {
    background: rgb(173,216,320);
    color: #fff;
  }
  #awaitingFunds {
    background: #f8d7da;
    color: #fff;
  }
  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    margin-left: 5px;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  </style>