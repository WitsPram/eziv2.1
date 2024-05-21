<template>
    <div class="notifications">
      <h1>Admin Notifications</h1>
  
      <div class="section">
        <h2>All Notifications</h2>
        <ul>
          <li v-for="notification in limitedNotifications" :key="notification.id" class="notification-item">
            {{ notification.description }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>

import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        allNotifications: [],
      };
    },
    created() {
      this.fetchNotifications();
    },
    computed: {
      limitedNotifications() {
        return this.allNotifications.slice(0, 10);
      },
      ...mapGetters([
        'getUser', 'isAuthenticated'
      ]),
    
    },
    methods: {
        async getEmail(){
        return await this.getUser.username;
      },
      async fetchNotifications() {
        const email = await this.getEmail();
        const baseurl = 
        // 'http://localhost:'+3019;
        "https://ezezimalii.azurewebsites.net/";
        const response = await fetch(baseurl+'/api/v1/auth/readNotifications/'+email, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        console.log(data);
        this.allNotifications = data;
      }
    },
  };
  </script>
  
  <style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }
  
  .notifications {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  .section {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  h1 {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 22px;
    font-weight: bold;
    color: #555;
    margin-bottom: 15px;
  }
  </style>