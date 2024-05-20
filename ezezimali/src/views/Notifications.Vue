<template>
  <div class="notifications">
    <h1>Admin Notifications</h1>

    <div class="section">
      <h2>All Notifications</h2>
      <ul>
        <li v-for="notification in limitedNotifications" :key="notification.id" class="notification-item">
          {{ notification.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
  },
  methods: {
    fetchNotifications() {
      // Mock API calls
      const fundingOpportunities = [
        { id: 1, message: 'New Funding Opportunity: Grant A - Funding for project A' },
        { id: 2, message: 'New Funding Opportunity: Grant B - Funding for project B' },
      ];
      const fundChanges = [
        { id: 3, message: 'Fund Change Notice: Grant A - New fund amount = $5000' },
        { id: 4, message: 'Fund Change Notice: Grant B - New fund amount = $1000' },
      ];

      // Combine all notifications into one array
      this.allNotifications = [
        ...fundingOpportunities,
        ...fundChanges
      ];
    },
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
