<template>
  <main class="w-full flexCenter" id="form-container">
    <form @submit.prevent="submitForm">
      <h2 id="heading">Application for Fund Manager</h2>
      <p>As a funding manager, you play a pivotal role in sourcing and securing financial resources for community
        projects. Your tasks include identifying funding opportunities, crafting compelling proposals, managing budgets,
        fostering relationships with donors, ensuring regulatory compliance, and contributing to strategic planning.
        Your efforts are instrumental in ensuring the sustainability and success of community initiatives.</p>

      <br>


      <label for="documents" class="input-labels">Supporting Documents</label>

      <article @click="upload" class="flexRow uploadbtn">
        <img  src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="30" height="30">
        <section>
          <section class="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
              Upload a file
          </section>
          <section class="mt-0.5 block text-sm text-gray-500">Max 10 MB</section>
          </section>
        </article>

      <!-- <input type="file" accept=".pdf" @change="onFileChange" required id="documents" /> -->
      <label for="justification" class="input-labels">Your justification</label>
      <textarea id="justification" rows="4" class="input textarea" v-model="formData.justification" required
        placeholder="I would be a great fit because..."></textarea>

      <article class="flexRow">
        <section>
          <input id="terms" type="checkbox" value="" v-model="formData.agree" required />
        </section>
        <label for="terms" class="input-labels">I hearby nominate myself for the role of <b class="text-blue-500">Fund
            Manager</b></label>
        </article>
      <button type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
    </form>
  </main>
</template>

<script>
import { baseurl } from '../config/config'
import { mapGetters } from 'vuex';

import toast from '@/components/toasty';
import axios from 'axios';



export default {
  data() {
    return {
      formData: {
        title: '',
        summary: '',
        description: '',
        agree: false
      }
    };
  },
  computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
  },
  mounted() {
    this.checker();
  },
  methods: {
    async getEmail() {
      return await this.getUser.username;
    },
    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Applicant') {
        this.$router.push('/');
      }
      // console.log(type);
    },
    
    upload(){
      const widget = window.cloudinary.createUploadWidget(
  {
    cloud_name: 'djid7mzda',
    upload_preset: 'upload-demo',
    sources: ['local', 'url', 'camera' , 'dropbox', 'google_drive'],
    resource_type: 'raw', // Specify that we are uploading non-image files
    client_allowed_formats: ['jpg', 'png', 'jpeg'], // Restrict to PDF files only
    max_file_size: 10485760 // Optional: restrict file size (10 MB in this example)
  },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      this.formData.document = result.info.url;
      console.log('Done! Here is the file info: ', result.info);
      console.log(this.formData.document);
    } else {
      console.log(error);
    }
  }
);

widget.open();
    },
    async submitForm() {
      if (this.formData.agree) {

        const id = await this.getUser.id;
        const name = await this.getUser.username;
        const token = await this.getUser.token;

        if (!this.formData.document) {
          toast.error('Please provide a document');
          return;
        }
        // const document = "document"

        axios.post(`${baseurl}/api/v1/apply`, {
  "fk_tenant_id": id,
  "document": this.formData.document,
  "justification": this.formData.justification
}, {
  headers: {
    'Authorization': `${token}`  // Ensure token is correctly formatted
  }
}).then(response => {
  const data = response.data;
  console.log(data);
  if (data.message === 'Success') {
    toast.success('Application submitted successfully');
  } else if (data.message === 'Failure'){
          toast.warning('Previous application still pending approval');


          axios.post(`${baseurl}/api/v1/notifications`, {
  "id": id,
  "adminRequired" : 1,
  "title": "[FOLLOW UP] Application for Fund Manager - Pending Approval",
  "message": `Dear Admin, ${name} has submitted an application for the role of Fund Manager. Please review and approve the application.`,
}, {
  headers: {
    'Authorization': `${token}`  // Ensure token is correctly formatted
  }
}).then(response => {
  const data = response.data;
  console.log(data);
  if (data.message === 'Success') {
    toast.info('Follow up notification sent to admin');
  } else if (data.message === 'Failure'){
          toast.warning('Follow up notification could not be sent to admin');


        }else{
          toast.error('Failed to send a follow up to admin');
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







        }else{
          toast.error('Failed to submit application');
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


      } else {
        alert('Please agree to the terms and conditions');
      }
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

.uploadbtn{
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  gap: 10px;

}

.uploadbtn:hover{
  background-color: #f8f9fa;

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