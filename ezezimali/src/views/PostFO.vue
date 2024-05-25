
<template>
    <div class="w-full flexCenter" id="form-container">
      <form @submit.prevent="submitForm">
        <h2  id="heading">Application for funding opportunity</h2>
  
        <label for="title" class="input-labels">Title</label>
        <input type="text" id="title" class="input" v-model="formData.title" placeholder="Students Employment Grant" required />


        <label for="amount" class="input-labels">Amount</label>
        <input type="number" id="amount" class="input" v-model="formData.amount" required placeholder="R1000" />

        <label for="end_date" class="input-labels">End date</label>
        <input type="date" id="end_date" class="input" v-model="formData.end_date" required placeholder="R1000" />


        <label for="type" class="input-labels">Event type</label>
        <div class="radio-group">


          <label class="radio-label flexRow">
            <input type="radio" name="type" value="Educational" checked v-model="formData.type"> Educational </label>

            <label class="radio-label flexRow">
            <input type="radio" name="type" value="Business" v-model="formData.type"> Business </label>

            <label class="radio-label flexRow">
            <input type="radio" name="type" value="Events" v-model="formData.type"> Events </label>

</div>
  
        <label for="description" class="input-labels">Description</label>
        <textarea id="description" required rows="4" class="input textarea" v-model="formData.description" placeholder="This grant offers..."></textarea>
  
        <div class="flexRow">
          <div>
            <input id="terms" type="checkbox" value="" v-model="formData.agree" required />
          </div>
          <label for="terms" class="input-labels">I agree with the <a href="#" class="text-blue-600 hover:underline">terms and conditions</a></label>
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
import { baseurl } from '../config/config';
import axios from 'axios';

import toast from '../components/toasty';

  export default {
    data() {
      return {
        formData: {
      title: '',
      description: '',
      amount: '',
      end_date: '',
      type: 'Educational', 
      agree: false
    }
      };
    },  computed: {
    ...mapGetters([
      'getUser'
    ]),
  },
  mounted() {
    this.checker();
  },
    methods: {  
      async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Fund Manager') {
        this.$router.push('/');
      }
      // console.log(type);
    },  
    async notify(){
      const token = await this.getUser.token;

      const name = await this.getUser.username;
      
      axios.post(`${baseurl}/api/v1/notifications`, {
  // "id": id,
  "adminRequired" : 1,
  "title": "New Funding Opportunity has been posted",
  "message": `Dear Admin, ${name} has posted a new funding opportunity.`,
}, {
  headers: {
    'Authorization': `${token}`  // Ensure token is correctly formatted
  }
}).then(response => {
  const data = response.data;
  console.log(data);
  if (data.message === 'Success') {
    toast.info('Admin has been notified of the new funding opportunity');
  } else if (data.message === 'Failure'){
          toast.warning('Admin could not be notified of the new funding opportunity');


        }else{
          toast.error('Failed to notify admin of the new funding opportunity');
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

    }
    ,
      async submitForm() {
        if (this.formData.agree) {

            const dateObject = new Date(this.formData.end_date);
            this.formData.end_date = dateObject.toISOString();

            this.formData.fk_tenant_id = await this.getUser.id;


            this.formData.amount = 'R'+this.formData.amount;

            const token = await this.getUser.token;
        
        axios.post(baseurl + '/api/v1/oppotunities/',this.formData, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
        const data = response.data;

        if (data.message === 'Success') {
          toast.success('Application submitted successfully.');

          this.notify();

        } else if (data.message === "Failure") {
          toast.warning("Previous application already present.");
        } else {
          toast.error("Application could not be submitted.");
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
        toast.error('Please agree to the terms and conditions');
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

.radio-group {
  display: flex; justify-content: space-evenly; flex-direction: row;
}

.radio-label {
  margin-right: 20px; /* Adjust spacing between radio buttons */
}

.radio-label input[type="radio"] {
  margin-right: 5px; 
  width: 2px;
  border-radius: 100%;
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
    padding: 1rem;
    height: 80vh;
}

@media (max-width: 400px) {
    .radio-group{
        flex-direction: column;
    }

    .flexRow{
      margin: 0;
    }

    
}
</style>