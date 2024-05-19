<template>
  <section >
    <div class="moop">
      <!-- <img src="../Logos+icons/TopPage.png" alt="Ezezimali logo" id="larger-banner-logo" style="width: 300px; height: auto;"> -->
      <div v-for="(item, index) in data" :key="index" class="card">
        <h5><strong>
<!--//item.idneeds to be sent -->
          {{ item.applicant_email }}
        </strong>
      </h5>
        <p>{{ item.applicant_motivation }}</p>
        <a class="download-button" :href="item.applicant_documents">Download Documents</a>
        <button class="verdict-button" @click="select(item.id)">Select</button>
      </div>
    </div>
   <!-- <button @click="fetchData" class="submit-button">Submit</button>  -->
  </section>
</template>

<script>


export default {
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      inputText: '',
      id: -1,
      data: null
    };
  },
  methods: {
    select(id){
      this.id = id;
      alert('Selected application with id: ' + id);
    },
    async fetchData() {
      try {
        //'http://localhost:3019';
        const baseurl = 'http://localhost:3019';
        const response = await fetch(baseurl + '/api/v1/auth/getApplicationsForFundingOpps/pookies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        this.data = data;
        // console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    },setupScrolling() {
      const tabsContainer = this.$refs.tabsContainer;
      if (tabsContainer) {
        tabsContainer.style.display = 'flex';
        tabsContainer.style.overflowX = 'auto';
    
    //verdict function
  }
    }
  }
};
</script>

<style>
.moop {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.moop h5{
  margin-bottom: 0.4rem;
}
.card {
  max-width: calc(33.333% - 1rem); /* Adjust margin between cards */
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.download-button,
.verdict-button {
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
  background-color: #3b82f6;
  margin-right: 0.5rem;
}

.download-button:hover{
  background-color: #0b61ec;
}

.verdict-button {

  background-color: #f6f7f8;
  color: #3bf66a;
}

.verdict-button:hover{
  background-color: #3bf66a;
  color: white;
}

.submit-button {
  padding: 8px 16px;
  margin-top: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
