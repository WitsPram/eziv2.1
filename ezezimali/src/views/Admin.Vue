<template>
    <div class="admin-panel">
      <div class="tabs" ref="tabsContainer">
        <div
          class="tab"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          :class="{ active: activeTab === index }"
        >
          {{ tab.title }}
        </div>
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 0">
          <h2>Manage Users</h2>
          <textarea v-model="userData" rows="30" cols="50"></textarea>
        </div>
        <div v-else-if="activeTab === 1">
          <h2>Manage Existing Funds</h2>
          <textarea v-model="jsonDataString" rows="30" cols="50"></textarea>
        </div>
        <div v-else>
          <h2>Fund Manager requests</h2>
          <textarea v-model="requestData" rows="30" cols="50"></textarea>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: 0,
        tabs: [
          { title: "Manage Users" },
          { title: "Manage Existing Funds" },
          { title: "Fund Manager requests" }
        ],
        jsonDataString: '',
        userData: '',
        requestData: ''
      };
    },
    mounted() {
      this.setupScrolling();
      this.fetchData(); // Fetch data on component mount
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('/api/v1/auth/getUserData/pookies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          this.userData = JSON.stringify(data, null, 2); // Assuming the data returned is for "Manage Users" tab
        } catch (error) {
          console.error('Error:', error);
        }
      },
      changeTab(index) {
        this.activeTab = index;
        // Optionally, you can fetch data for other tabs here based on your API structure
      },
      setupScrolling() {
        const tabsContainer = this.$refs.tabsContainer;
        if (tabsContainer) {
          tabsContainer.style.display = 'flex';
          tabsContainer.style.overflowX = 'auto';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-panel {
    display: flex;
    flex-direction: column;
  }
  
  .tabs {
    white-space: nowrap;
  }
  
  .tab {
    cursor: pointer;
    padding: 10px;
    margin-bottom: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    display: inline-block;
  }
  
  .tab.active {
    background-color: #fff;
    font-weight: bold;
  }
  
  .tab-content {
    margin-top: 10px;
  }
  
  .tab-content h2 {
    margin-top: 0;
  }
  </style>
  