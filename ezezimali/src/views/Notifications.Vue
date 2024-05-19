<template>
  <div class="notifications">
    <h1>Admin Notifications</h1>

    <div class="section">
      <h2>New Funding Opportunities</h2>
      <ul>
        <li v-for="opportunity in fundingOpportunities" :key="opportunity.id" class="notification-item">
          {{ opportunity.title }} - {{ opportunity.description }}
        </li>
      </ul>
    </div>

    <div class="section">
      <h2>Budget Change Requests</h2>
      <ul>
        <li v-for="request in budgetRequests" :key="request.id" class="notification-item">
          {{ request.title }} - Requested change: {{ request.amount }}
          <div class="buttons">
            <button @click="handleBudgetRequest(request.id, true)">Accept</button>
            <button @click="handleBudgetRequest(request.id, false)">Deny</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fundingOpportunities: [],
      budgetRequests: [],
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    fetchNotifications() {
      // Mock API calls
      this.fundingOpportunities = [
        { id: 1, title: 'Grant A', description: 'Funding for project A' },
        { id: 2, title: 'Grant B', description: 'Funding for project B' },
      ];

      this.budgetRequests = [
        { id: 1, title: 'Request A', amount: 5000 },
        { id: 2, title: 'Request B', amount: 3000 },
      ];
    },
    handleBudgetRequest(id, isAccepted) {
      // Handle budget request logic
      if (isAccepted) {
        alert(`Request ${id} accepted.`);
        // Update the total funds logic here
      } else {
        alert(`Request ${id} denied.`);
      }

      // Remove the processed request from the list
      this.budgetRequests = this.budgetRequests.filter(request => request.id !== id);
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

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #02c432;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #028322;
}

button:last-child {
  background-color: #dc3545;
}

button:last-child:hover {
  background-color: #c82333;
}
</style>
