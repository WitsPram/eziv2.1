<template>

  <AdminPanel :data="enabledUsers" :rejectedData="disabledUsers" />

  </template>
  
  <script>

import AdminPanel from '../components/FMAppsColumns.vue';
import { baseurl } from '../config/config';
import axios from 'axios';
import { mapGetters } from 'vuex';
import toast from '../components/toasty'

  export default {
    data() {
      return {
        enabledUsers: [],
      disabledUsers: []
      };
    },
    components: { AdminPanel },
    mounted() {
      this.fetchData();
      this.checker();
    },computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
  },
    methods: {
      async fetchData() {
      const token = await this.getUser.token;

        axios.get(baseurl + '/api/v1/apply/', {
        headers: {
          'Authorization': `${token}`
        }
      }).then(response => {
        const data = response.data;
        console.log(data);
        if (data.message === 'Success') {
          this.enabledUsers = data.applications
         
        } else if (data.message === 'Failure') {
          toast.info('No Applicants found');
        } else {
          toast.error('Failed to fetch Applicants');
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
      },
      async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Admin') {
        this.$router.push('/');
      }
      // console.log(type);
    },
    }
  };
  </script>
  
  <style scoped>
  .admin-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .moop {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .category-box {
    width: 25rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: #f9f9f9;
    margin: 0.5rem;
  }
  
  .pending-title-box {
    background-color: lightblue;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }
  
  .rejected-title-box {
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }
  
  .bold-title {
    font-weight: bold;
    text-align: center;
    font-size: larger;
  }
  
  .no-data-box {
    font-size: 1.25rem;
    color: #666;
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: #f9f9f9;
  }
  
  .card {
    margin-bottom: 0.25rem;
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .download-button,
  .verdict-button,
  .verdict2-button {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  
  .download-button {
  background-color: #3770cb;
  width: 100%;
  margin-right: 0.5rem;
}
.flexRow{
    display: flex;
    width: 100%;
    gap: 1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.download-button:hover {
  background-color: #054fc6;
}

.verdict-button {
  background-color: #09f043;
  width: 100%;
  color: #fff;
}

.verdict-button:hover {
  background-color: rgb(37, 191, 37);
}

.verdict2-button {
  background-color: rgb(216, 31, 31);
    width: 100%;
  color: white;
}

.verdict2-button:hover {
  background-color: rgb(187, 10, 10);
}
  
  .bold-status-r {
    font-weight: bold;
    color: #d39399;
  }
  
  .containerp {
    white-space: nowrap;
  }
  
  .first-paragraph,
  .second-paragraph {
    display: inline-block;
  }
  
  .first-paragraph {
    font-weight: bold;
  }
  

  
  @media (max-width: 950px) {
    .category-box {
      width: 100%;
      margin: 0.5rem 0;
    }
  
    .card {
      margin-bottom: 0.25rem;
      padding: 1.5rem;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }
  
    .moop {
      flex-direction: column;
      align-items: center;
    }
  }
  </style>
  