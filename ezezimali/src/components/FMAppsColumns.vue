<template>
    <article class="admin-panel">
      <section>
        <section class="moop">
          <!-- Pending Funding Opportunities -->
          <section class="category-box">
            <article class="pending-title-box">
              <h2 class="bold-title">Fund Manager Requests</h2>
            </article>
            <section v-if="data.length === 0" class="no-data-box">
              No Fund Manager Requests
            </section>
            <article v-else>
              <section v-for="(item, index) in data" :key="index" class="card">
                <h5><strong>{{ item.username }}</strong></h5>
                <h6 style="margin-bottom: 0.5rem;">Applicant</h6>
                <p>{{ item.justification }}</p>
                <a class="download-button" :href="item.document" target="_blank">View Attachments</a>
                <section class="flexRow">
                  <button class="verdict2-button" @click="verdict(item.fk_tenant_id,index,0)">Deny</button>
                  <button class="verdict-button" @click="verdict(item.fk_tenant_id, index,1)">Approve</button>
                </section>
              </section>
            </article>
          </section>
    
          <!-- Rejected Funding Opportunities -->
          <article class="category-box">
            <section class="rejected-title-box">
              <h2 class="bold-title">Rejected Fund Manager Requests</h2>
            </section>
            <section>
              <section v-for="(item, index) in rejectedData" :key="index" class="card">
                <h5><strong>{{ item.username }}</strong></h5>
                <p class="bold-status-r">Denied</p>
              </section>
            </section>
          </article>
        </section>
      </section>
    </article>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
import { baseurl } from '../config/config';
import axios from 'axios';

import toast from './toasty';

  export default {
    name: 'AdminPanel',
    props: {
      data: Array,
      rejectedData: Array
    },
    computed: {
    ...mapGetters([
      'getUser', 'getUserType'
    ]),
    },
    methods: {
      async notify(message , id){

        const token = await this.getUser.token;
        
        
        axios.post(`${baseurl}/api/v1/notifications`, {
  "id": id,
  "adminRequired" : 0,
  "title": "Fund Manager Application Verdict",
  "message": message,
}, {
  headers: {
    'Authorization': `${token}`  // Ensure token is correctly formatted
  }
}).then(response => {
  const data = response.data;
  console.log(data);
  if (data.message === 'Success') {
    toast.info('Applicant has been notified');
  } else if (data.message === 'Failure'){
          toast.warning('Applicant could not be notified');


        }else{
          toast.error('Failed to notify applicant');
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
        // Implementation to approve a request
        const token = await this.getUser.token;
        
        axios.put(baseurl + '/api/v1/apply/',{
                "id": id,
                "verdict": verdict
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
        const data = response.data;

        if (data.status === 'Success') {
            if (verdict === 1 && data.message === "Successfully Evaluted and approved") {
                toast.success(this.data[index].username +' has been approved.');
                this.data.splice(index, 1);

                this.notify("Congrations, your Fund Manager application has been approved.", id);

            } else {
                toast.success(this.data[index].username +' has been denied.');
                this.rejectedData.push(this.data[index]);
        this.data.splice(index, 1);
        this.notify("Unfortunately, your Fund Manager application has been denied.", id);
            }
          
        

        } else if (data.message === "Failure to Evaluate") {
          toast.warning(this.data[index].username +' could not be Updated.');
        } else {
          toast.error(this.data[index].username +' could not be Updated.');
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
      deny(email, index) {
        // Implementation to deny a request
        console.log('Denying:', email);
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-panel {
    padding: 20px;
  }
  
  .category-box {
    margin: 20px;
    padding: 10px;
    width: 25rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .pending-title-box, .rejected-title-box {
    margin-bottom: 10px;
  }
  
  .card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  
  .verdict2-button, .verdict-button , .download-button{
    margin-right: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }
  
  .download-button {
    background-color: rgb(40, 122, 255);
  }

    .verdict-button {
        background-color: rgb(65, 184, 65);
        margin-right: 0;
    }

    .verdict2-button {
        background-color: rgb(248, 66, 66);
    }

    .download-button:hover, .verdict-button:hover, .verdict2-button:hover {
        transform: scale(1.02);
        transition: transform 0.3s;
    }

    .download-button:hover {
        background-color: rgb(23, 95, 211);
    }

    .verdict-button:hover {
        background-color: rgb(23, 168, 23);
    }

    .verdict2-button:hover {
        background-color: rgb(198, 36, 36);
    }
  
  .bold-title {
    font-weight: bold;
  }
  
  .bold-status-r {
    color: red;
    font-weight: bold;
  }
  
  .flexRow {
    display: flex;
    align-items: center;
  }

  @media (max-width: 450px) {
    .category-box {
        width: 80%;
    }
  }
  </style>
  