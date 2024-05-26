<template>

  <main class="content">
  <section class="notifications-container">
    <ul>
      <li v-for="notification in notifications" :key="notification.id" class="notification-item">
        <article class="notification-content">
          <section class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </section>
          <section class="text-container">
            <h2>{{ notification.title }}</h2>
            <p>{{ notification.message }}</p>
          </section>
        </article>
        <button @click="removeNotification(notification.id)" class="remove-button">remove</button>
      </li>
    </ul>
  </section>
</main>
</template>

<script>

import { mapGetters } from 'vuex';
import { baseurl } from '../config/config';
import axios from 'axios';
import toast from '../components/toasty';


export default {
  data() {
    return {
      notifications: [],
    };
  },
  created() {
    this.fetchData();
  },
  computed: {

    ...mapGetters([
      'getUser'
    ]),

  },
  methods: {
    async removeNotification(id) {
      const token = await this.getUser.token;
      axios.put(`${baseurl}/api/v1/notifications/`,{
                "id": id,
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
        const data = response.data;

        if (data.message === 'Success') {
          toast.success('Notification has been removed.');
          
this.notifications = this.notifications.filter(notification => notification.id !== id);
  

        } else if (data.message === "Failure") {
          toast.warning('Notification could not be removed.');
        } else {
          toast.error('Notification could not be removed.');
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
    async fetchData() {
      const token = await this.getUser.token;
      const id = await this.getUser.id;

      console.log(id);
      const user_type = await this.getUser.user_type;
      const url = user_type === 'Admin'? `${baseurl}/api/v1/notifications/admin`: `${baseurl}/api/v1/notifications/`+id


      // console.log(user_type,url);

      console.log(url)

      axios.get(url, {
        headers: {
          'Authorization': `${token}`
        }
      }).then(response => {
        const data = response.data;
        console.log(data);
        if (data.message === 'Success') {
          toast.success('Notifications fetched successfully');
          console.log(data.notifications);

          this.notifications = data.notifications;

          

        } else if (data.message === 'Failure') {
          toast.info('No notifications found');
        } else {
          toast.error('Failed to fetch notifications');
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

  },
};
</script>

<style scoped>
.notifications-container {
  width: 100%;
  max-width: 750px;
  /* height: max-; */
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding: 0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.content {
  height: 80vh;
}
.notification-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.notification-content {
  display: flex;
  align-items: center;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid #cfe2ff;
  background-color: #e7f3ff;
  border-radius: 12px;
  margin-right: 16px;
}

.icon {
  width: 32px;
  height: 32px;
  color: #3b82f6;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.text-container h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.text-container p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.remove-button {
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 1.2rem 1.5rem;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #dc2626;
}
</style>