
<template>

  <div class="w-full flexCenter" id="form-container">
    <form @submit.prevent="submitForm">
      <h2 id="heading">Application for Funding</h2>
    <p>Please provide a good justification for why you should receive funding. This will be seen by the fund manager. Please also upload any supporting documentation.</p>

    <br>
  
    
    <label for="documents" class="input-labels">Supporting Documents</label>
<input type="file" required id="documents" />
      <label for="applicant_motivation" class="input-labels">Your justification</label>
      <textarea id="applicant_motivation" rows="4" class="input textarea" v-model="formData.applicant_motivation" required placeholder="I would be a great fit because..."></textarea>
      <div class="flexRow">
        <div>
          <input id="terms" type="checkbox" value="" v-model="formData.agree" required />
        </div>
        <label for="terms" class="input-labels">I hearby nominate myself to receive <b class="text-blue-500">Funding</b></label>
      </div>
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
    </form>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
data() {
  return {
    formData: {
      title: '',
      summary: '',
      description: '',
      agree: false,
      documents: null
    }
  };
},  computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
  },
methods: {
  handleFileUpload(event) {
    this.formData.documents = event.target.files[0];
  },    async getEmail(){
      return await this.getUser.username;
    },
  submitForm() {
  if (this.formData.agree) {
    this.getEmail().then(email => {
      if (email){
            // alert('Posted successfully!');
              const baseurl = 
              // "http://localhost:"+3019;
              "https://ezezimalii.azurewebsites.net/" 

              // ${object.fundingOpp_ID}
              // '${object.applicant_email}', ${object.fundingOpp_ID}, '${object.applicant_motivation}', '${object.applicant_documents}'

              this.formData.applicant_documents = "https://sebenzostorage.blob.core.windows.net/cv-storage-001/sebenzo-cv-1e5008.pdf";
              this.formData.applicant_email = email;
              this.formData.fundingOpp_ID = this.$route.params.id;

              // alert(this.formData.applicant_documents)
              

              fetch(baseurl+'/api/v1/auth/insertApplicationsForFundingOpps/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(this.formData) 
})
.then(response => response.json())
.then(data => {
  if (data.message !== 'Failure') {
      alert('Posted successfully!');
  } else {
      alert('Failed to post');
  }
})
.catch(error => console.error('Error:', error));
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

input{
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.flexRow{
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  margin: 0.5rem 0;
  gap: 10px;
}

.input{
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
max-height: 250px; /* Adjust the max-height as needed */
min-height: 100px;

overflow-y: auto;
scrollbar-width: none;
}

.input-labels{
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #1a202c;
  font-weight: 500;
}

.input::placeholder {
color: #868e96;
}



button[type="submit"]{
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

#heading{
  text-align: left;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;

}

form{
  width: 100%;
  max-width: 500px;
  padding: 20px;
  gap: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;

}

.flexCenter{
  display: flex;
  justify-content: center;
  align-items: center;
}

#form-container {
  width: 100%;
  height: 80vh;
}
</style>