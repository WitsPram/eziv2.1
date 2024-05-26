<template>
  <section>
    <main class="moop">
      <!-- Pending Funding Opportunities -->
      <section class="category-box">
        <article class="pending-title-box">
          <h2 class="bold-title">Pending Funding Opportunities</h2>
        </article>
        <article v-if="pendingData.length === 0" class="no-data-box">
          No pending funding opportunities.
        </article>
        <section v-else>
          <article v-for="(item, index) in pendingData" :key="index" class="card">
            <h5><strong>{{ item.username }}</strong></h5>
            <p>{{ item.applicant_motivation }}</p>
            <!-- <a class="download-button" :href="item.applicant_documents">Download Documents</a> -->
            <a class="download-button btn" :href="item.applicant_documents" target="_blank" @click.prevent="downloadDocument(item.applicant_documents)">Download Documents</a>

            <section class="actionbtns">
              <button class="verdict2-button btn" @click="verdict(item.id, index,'Rejected')">Deny</button>
              <button class="verdict-button btn" @click="verdict(item.id, index,'Accepted')">Accept</button>

            </section>
          </article>
        </section>
      </section>

      <!-- Accepted Funding Opportunities -->
      <section class="category-box">
        <article class="accepted-title-box">
          <h2 class="bold-title">Accepted Funding Opportunities</h2>
        </article>
        <article v-if="acceptedData.length === 0" class="no-data-box">
          No accepted funding opportunities.
        </article>
        <section v-else>
          <article v-for="(item, index) in acceptedData" :key="index" class="card">
            <h5><strong>{{ item.username }}</strong></h5>
            <!-- <a class="download-button" :href="item.applicant_documents">Download Documents</a> -->
            <p class="bold-status-a">Accepted</p>
          </article>
        </section>
      </section>

      <!-- Rejected Funding Opportunities -->
      <article class="category-box">
        <section class="rejected-title-box">
          <h2 class="bold-title">Rejected Funding Opportunities</h2>
        </section>
        <section v-if="rejectedData.length === 0" class="no-data-box">
          No rejected funding opportunities.
        </section>
        <section v-else>
          <article v-for="(item, index) in rejectedData" :key="index" class="card">
            <h5><strong>{{ item.username }}</strong></h5>
            <p class="bold-status-r">Rejected</p>
          </article>
        </section>
      </article>
    </main>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import toast from '@/components/toasty';
import { baseurl } from '../config/config';


export default {
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
  },  mounted() {
    this.checker();
    this.fetchData();
  },
  methods: {

    async fetchData() {

      const token = await this.getUser.token;
      const id = await this.getUser.id;

      // console.log(token);
      // console.log(id);

axios.get(baseurl + '/api/v1/applications/'+id, {
headers: {
  'Authorization': `${token}`
}
}).then(response => {
const data = response.data;
console.log(data);
if (data.message === 'Success') {

  console.log(data.applications);

  this.pendingData = data.applications.filter(item => item.status === 'Pending');
        this.acceptedData = data.applications.filter(item => item.status === 'Accepted');
        this.rejectedData = data.applications.filter(item => item.status === 'Rejected');

        console.log(this.pendingData);
        console.log(this.acceptedData);
        console.log(this.rejectedData);
 
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

    },    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Fund Manager') {
        this.$router.push('/');
      }
      // console.log(type);
    },
    async notify(id,title, message){

const token = await this.getUser.token;

axios.post(`${baseurl}/api/v1/notifications`, {
"id": id,
"adminRequired" : 0,
"title": title,
"message": message,
}, {
headers: {
'Authorization': `${token}`  // Ensure token is correctly formatted
}
}).then(response => {
const data = response.data;
console.log(data);
if (data.message === 'Success') {
toast.info('Notification sent to Applicant');
} else if (data.message === 'Failure'){
  toast.warning('Notification could not be sent to Applicant');


}else{
  toast.error('Failed to notify Applicant');
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
    async verdict(id, index, verdict) {
      const token = await this.getUser.token;
        
        axios.put(baseurl + '/api/v1/applications/',{
                "id": id,
                "verdict": verdict
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
        const data = response.data;

        if (data.message === 'Success') {
            if (verdict === 'Accepted') {
                toast.success(this.pendingData[index].username +' has been approved.');
                const item = this.pendingData.splice(index, 1)[0];
                item.status = 'Accepted';
                this.acceptedData.push(item);
                this.notify(item.fk_tenant_id, 'Your Application for the Funding Oppotunity has been approved', 'Congratulations, your application has been approved. Fund Manager will contact you soon.');


            } else {
                toast.success(this.pendingData[index].username +' has been denied.');
                const item = this.pendingData.splice(index, 1)[0];
        item.status = 'Rejected';
        this.rejectedData.push(item);
        this.notify(item.fk_tenant_id, 'Your Application for the Funding Oppotunity has been denied', 'Unfortunately, your application has been denied. Please try again next time.');
            }
          
        

        } else if (data.message === "Failure") {
          toast.warning(this.pendingData[index].username +' could not be Updated.');
        } else {
          toast.error(this.pendingData[index].username +' could not be Updated.');
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

    downloadDocument(pdf) {
      //downloading pdf
      window.open(pdf);
      // window.location.href = 'https://sebenzostorage.blob.core.windows.net/cv-storage-001/sebenzo-cv-1e5008.pdf';
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
  color: #08d839;
}

.bold-status-r {
  font-weight: bold;
  color: #e1162a
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
