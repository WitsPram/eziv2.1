<template>
  <div class="reporting">
    <h1>Fund Reporting</h1>

    <div class="stats-section">
      <h2>Statistics</h2>
      <div class="stats">
        <div class="stat-item total-funds-used" id="fundsUsed">
          <h3>Total Funds Used</h3>
          <ul>
            <li v-for="(value, key) in fundsUsedData" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </div>
        <div class="stat-item" id="acceptedUsers">
          <h3>Accepted to Each Fund</h3>
          <ul>
            <li v-for="(count, fund) in acceptedCounts" :key="fund">{{ fund }}: {{ count }}</li>
          </ul>
        </div>
        <div class="stat-item" id="awaitingFunds">
          <h3>Fund Applications Awaiting Approval/Rejection</h3>
          <li v-for="(count, fund) in awaitingApproval" :key="fund">{{ fund }}: {{ count }}</li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fundsUsedData: {
        'Fund A': 5000,
        'Fund B': 3000,
        'Fund C': 7000,
      },
      acceptedCounts: {
        'Fund A': 50,
        'Fund B': 30,
        'Fund C': 70,
      },
      awaitingApproval: {
        'Fund A': 50,
        'Fund B': 30,
        'Fund C': 70,
      }
    };
  },
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
}

li {
  font-size: 16px;
  margin-bottom: 5px;
  color: #388e3c;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

