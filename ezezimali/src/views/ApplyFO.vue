<template>

  <main class="w-full flexCenter" id="form-container">
    <form @submit.prevent="submitForm">
      <h2 id="heading">Application for Funding</h2>
      <p>Please provide a good justification for why you should receive funding. This will be seen by the fund manager.
        Please also upload any supporting documentation.</p>

      <br>


      <label for="documents" class="input-labels">Supporting Documents</label>

      <!-- <input type="file" accept=".pdf" @change="onFileChange" required id="documents" />
       -->

       <article @click="openUploadWidget" class="flexRow uploadbtn">
                    <img src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="30"
                        height="30">
                    <section>
                        <section class="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                            Upload a file
                        </section>
                        <section class="mt-0.5 block text-sm text-gray-500">Max 10 MB</section>
                      </section>
                    </article>

      <label for="applicant_motivation" class="input-labels">Your justification</label>
      <textarea id="applicant_motivation" rows="4" class="input textarea" v-model="formData.applicant_motivation"
        required placeholder="I would be a great fit because..."></textarea>
      <section class="flexRow">
        <article>
          <input id="terms" type="checkbox" value="" v-model="formData.agree" required />
        </article>
        <label for="terms" class="input-labels">I hearby nominate myself to receive <b
            class="text-blue-500">Funding</b></label>
        </section>
      <button type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
    </form>
  </main>
</template>

<script>

import { mapGetters } from 'vuex';
import { baseurl } from '../config/config'
import axios from 'axios';
import toast from '@/components/toasty';




export default {
  data() {
    return {
      formData: {
        title: '',
        summary: '',
        description: '',
        selectedFile: null,
        agree: false,
        documents: null
      }
    };
  }, computed: {
    ...mapGetters([
      'getUser',
    ]),
  },  mounted() {
    this.checker();
  },
  methods: {


    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Applicant') {
        this.$router.push('/');
      }
      // console.log(type);
    },

    openUploadWidget() {
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloud_name: 'djid7mzda',
                    upload_preset: 'upload-demo',
                    sources: ['local', 'url', 'dropbox', 'google_drive', 'facebook', 'instagram'],
                    resource_type: 'image',
                    client_allowed_formats: ['jpg', 'png', 'jpeg'],
                    max_file_size: 10485760 // 10 MB
                },
                (error, result) => {
                    if (!error && result && result.event === 'success') {
                        this.formData.applicant_documents = result.info.url;
                        console.log('Profile picture uploaded: ', result.info);
                    } else {
                        console.log(error);
                    }
                }
            );
            widget.open();
        },

    async notify(id, title, message){
      const token = await this.getUser.token;

                 
      axios.post(`${baseurl}/api/v1/notifications/funds`, {
  "id": id,
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
    toast.info('Notification sent to Fund Manager');
  } else if (data.message === 'Failure'){
          toast.warning('Notification could not be sent to Fund Manager');


        }else{
          toast.error('Failed to notify Fund Manager');
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

    async submitForm() {
// console.log("bdjfjn",this.formData);

        const id = await this.getUser.id;
        const token = await this.getUser.token;

        // const document = this.selectedFile;

        const name = await this.getUser.username;

        if (!this.formData.applicant_documents) {
          toast.error('Please provide a document');
          return;
        }

        

        // this.formData.applicant_documents = document;
        this.formData.fk_tenant_id = id;
        this.formData.fundingOpp_ID = this.$route.params.id;


        // console.log(this.formData);
        axios.post(`${baseurl}/api/v1/applications`, this.formData, {
          headers: {
            'Authorization': `${token}`
          }
        }).then(response => {
          // console.log(response);
          const data = response.data;
          // console.log(data);
          if (data.message === 'Success') {
            toast.success('Application submitted successfully');
            this.notify(this.formData.fundingOpp_ID, 
            "New Applicant has applied" ,"Dear Fund Manager, "+name+" has submitted an application for funding. Please review and approve the application.");
          } else{
            
            this.message = 'Previous application still pending approval';
            toast.info(this.message);
            this.notify(this.formData.fundingOpp_ID, "[FOLLOW UP] Application for Funding - Pending Approval", "Dear Fund Manager, "+name+" has submitted an application for funding. Please review and approve the application.");


 


          }
        }).catch(error => {
          console.error(error);
        });


    }
  }
};
</script>


<style scoped>
input {
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.flexRow {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  margin: 0.5rem 0;
  gap: 10px;
}

.uploadbtn {
    cursor: pointer;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
    gap: 10px;

}

.uploadbtn:hover {
    background-color: #d7d7d7;

}


.input {
  background-color: #f8f9fa;
  border: 1px solid #d1d3d4;
  color: #333;
  width: 100%;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  outline: none;
  padding: 0.625rem;
}

.textarea {
  max-height: 250px;
  /* Adjust the max-height as needed */
  min-height: 100px;

  overflow-y: auto;
  scrollbar-width: none;
}

.input-labels {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #1a202c;
  font-weight: 500;
}

.input::placeholder {
  color: #868e96;
}



button[type="submit"] {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

#heading {
  text-align: left;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;

}

form {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  gap: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;

}

.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

#form-container {
  width: 100%;
  height: 80vh;
}
</style>