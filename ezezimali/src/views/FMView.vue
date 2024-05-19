<template>
  <section>
    <div class="moop">
      <!-- Pending Funding Opportunities -->
      <section class="category-box">
        <article class="pending-title-box">
          <h2 class="bold-title">Pending Funding Opportunities</h2>
        </article>
        <div v-if="pendingData.length === 0" class="no-data-box">
          No pending funding opportunities.
        </div>
        <div v-else>
          <div v-for="(item, index) in pendingData" :key="index" class="card">
            <h5><strong>{{ item.name }}</strong></h5>
            <p>{{ item.applicant_motivation }}</p>
            <!-- <a class="download-button" :href="item.applicant_documents">Download Documents</a> -->
            <a class="download-button btn" :href="item.applicant_documents" target="_blank" @click.prevent="downloadDocument">Download Documents</a>

            <div class="actionbtns">
              <button class="verdict-button btn" @click="accept(item.id, index)">Accept</button>
              <button class="verdict2-button btn" @click="deny(item.id, index)">Deny</button>

            </div>
          </div>
        </div>
      </section>

      <!-- Accepted Funding Opportunities -->
      <section class="category-box">
        <article class="accepted-title-box">
          <h2 class="bold-title">Accepted Funding Opportunities</h2>
        </article>
        <div v-if="acceptedData.length === 0" class="no-data-box">
          No accepted funding opportunities.
        </div>
        <div v-else>
          <div v-for="(item, index) in acceptedData" :key="index" class="card">
            <h5><strong>{{ item.name }}</strong></h5>
            <p>{{ item.applicant_motivation }}</p>
            <!-- <a class="download-button" :href="item.applicant_documents">Download Documents</a> -->
            <p class="bold-status-a">Accepted</p>
          </div>
        </div>
      </section>

      <!-- Rejected Funding Opportunities -->
      <div class="category-box">
        <section class="rejected-title-box">
          <h2 class="bold-title">Rejected Funding Opportunities</h2>
        </section>
        <div v-if="rejectedData.length === 0" class="no-data-box">
          No rejected funding opportunities.
        </div>
        <div v-else>
          <div v-for="(item, index) in rejectedData" :key="index" class="card">
            <h5><strong>{{ item.name }}</strong></h5>
            <p>{{ item.applicant_motivation }}</p>
            <p class="bold-status-r">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      data: [],
      pendingData: [],
      acceptedData: [],
      rejectedData: []
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
      try {

        const email = await this.getEmail();  
        const baseurl = 
        "https://ezezimalii.azurewebsites.net/"
        // 'http://localhost:3019';
        const response = await fetch(baseurl + '/api/v1/auth/getApplicationsForFundingOpps/'+email, {
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

        this.pendingData = data.filter(item => item.status === 'pending');
        this.acceptedData = data.filter(item => item.status === 'Accepted');
        this.rejectedData = data.filter(item => item.status === 'Rejected');
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async accept(id, index) {
      try {
        const baseurl = 
        "https://ezezimalii.azurewebsites.net/"
        // 'http://localhost:3019';
        const response = await fetch(`${baseurl}/api/v1/auth/acceptOrDenyApplicant/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id, status: 'Accepted' })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.text();
        // alert(result;

        alert(`You have accepted ${this.pendingData[index].name}'s application.`);

        const item = this.pendingData.splice(index, 1)[0];
        item.status = 'Accepted';
        this.acceptedData.push(item);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async deny(id, index) {
      try {
        const baseurl = 
        "https://ezezimalii.azurewebsites.net/"
        // 'http://localhost:3019';
        const response = await fetch(`${baseurl}/api/v1/auth/acceptOrDenyApplicant/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id, status: 'Rejected' })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.text();
        // alert(result);
        alert(`You have rejected ${this.pendingData[index].name}'s application.`);

        const item = this.pendingData.splice(index, 1)[0];
        item.status = 'Rejected';
        this.rejectedData.push(item);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    downloadDocument() {
      //downloading pdf
      window.location.href = 'https://sebenzostorage.blob.core.windows.net/cv-storage-001/sebenzo-cv-1e5008.pdf';
    }
  }
};
</script>

<style>
.moop {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.btn{
  width: 100%;
}

.actionbtns{
  display: flex;
  gap: 2rem;
  justify-content: space-evenly;

}

.category-box {
  width: 20rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9f9f9;
  margin: 1rem;
}

.pending-title-box {
  background-color: lightblue;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.accepted-title-box {
  background-color: #d4edda;
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

.bold-status-a {
  font-weight: bold;
  color: #abe6b9;
}

.bold-status-r {
  font-weight: bold;
  color: #d39399
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
  margin-bottom: 1.5rem;
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
  margin-right: 0.5rem;
}

.download-button:hover {
  background-color: #054fc6;
}

.verdict-button {
  background-color: #09f043;
  color: #fff;
}

.verdict-button:hover {
  background-color: rgb(37, 191, 37);
}

.verdict2-button {
  background-color: rgb(216, 31, 31);
  color: white;
}

.verdict2-button:hover {
  background-color: rgb(187, 10, 10);
}

.status-label {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  border-radius: 0.375rem;
}

.accepted-label {
  background-color: #4caf50;
  color: white;
}

.rejected-label {
  background-color: #f44336;
  color: white;
}

.pending-label {
  background-color: lightblue;
  color: white;
}

@media (max-width: 950px) {
  .category-box {
    width: 100%;
    margin: 0.5rem 0;

  }
  .card{
    height:2%;
    margin-bottom: 1rem;
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
