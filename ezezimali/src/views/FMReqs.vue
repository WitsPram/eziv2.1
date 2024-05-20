<template>
  <section class="admin-panel">
    <section>
      <section class="moop">
        <!-- Pending Funding Opportunities -->
        <section class="category-box">
          <header class="pending-title-box">
            <h2 class="bold-title">Fund Manager Requests</h2>
          </header>
          <template v-if="data.length === 0" class="no-data-box">
            No Fund Manager Requests
          </template>
          <template v-else>
            <article v-for="(item, index) in data" :key="index" class="card">
              <h5><strong>{{ item.name }}</strong></h5>
              <br>
              <p>{{ item.justification }}</p>
              <a class="download-button" :href="item.applicant_documents" target="_blank">Download Documents</a>
              <section class="flexRow">
                <button class="verdict2-button" @click="deny(item.applicant_email,index)">Deny</button>
                <button class="verdict-button" @click="accept(item.applicant_email, index)">Approve</button>
              </section>
            </article>
          </template>
        </section>

        <!-- Rejected Funding Opportunities -->
        <section class="category-box">
          <header class="rejected-title-box">
            <h2 class="bold-title">Rejected Fund Manager Requests</h2>
          </header>
          <article v-for="(item, index) in rejectedData" :key="index" class="card">
            <h5><strong>{{ item.applicant_email }}</strong></h5>
            <p>{{ item.justification }}</p>
            <p class="bold-status-r">Denied</p>
          </article>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      rejectedData: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const baseurl = 'http://localhost:3019';
        const response = await fetch(baseurl + '/api/v1/auth/readFundApps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        this.data = data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async accept(applicant_email,i) {
      try {
        const baseurl = 'http://localhost:3019';
        const response = await fetch(`${baseurl}/api/v1/auth/updateFundingApp/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: applicant_email, verdict: "Approved" })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        alert(`You have accepted ${this.data[i].name}'s application to be a fund manager.`);
        const item = this.data.splice(i, 1)[0];
        item.status = 'Accepted';
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async deny(applicant_email, index) {
      try {
        const baseurl = 'http://localhost:3019';
        const response = await fetch(`${baseurl}/api/v1/auth/updateFundingApp/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: applicant_email, verdict: "Rejected" })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        alert(`You have denied ${this.data[index].name}'s application to be a fund manager.`);
        const item = this.data.splice(index, 1)[0];
        item.status = 'Denied';
        this.rejectedData.push(item);
      } catch (error) {
        console.error('Error:', error);
      }
    }
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