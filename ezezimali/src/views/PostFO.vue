
<template>
    <div class="w-full flexCenter" id="form-container">
      <form @submit.prevent="submitForm">
        <h2 id="heading">Application for funding opportunity</h2>
  
        <label for="title" class="input-labels">Title</label>
        <input type="text" id="title" class="input" v-model="formData.title" placeholder="Students Employment Grant" required />
  
        <label for="summary" class="input-labels">Summary</label>
        <input type="text" id="summary" class="input" v-model="formData.summary" required placeholder="Build a foundation..." />
  
        <label for="description" class="input-labels">Description</label>
        <textarea id="description" rows="4" class="input textarea" v-model="formData.description" placeholder="This grant offers..."></textarea>
  
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
    methods: {
      submitForm() {
        // Output the form data
        // console.log('Form data:', this.formData.agree);
        if (this.formData.agree) {
            // alert('Posted successfully!');

        

        const baseurl = 
        // 'http://localhost:'+3019;
        // process.env.PORT ?
        "https://ezezimalii.azurewebsites.net/"  

fetch(baseurl+'/api/v1/auth/insertFundingOpp/', {
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
      }else {
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