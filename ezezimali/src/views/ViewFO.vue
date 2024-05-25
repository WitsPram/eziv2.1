<template>
  <div class="dashboard">

    <!-- <router-link to="/apply-funding-manager">
          <button class="dashboard-button">Apply to be a Fund Manager</button>
        </router-link> -->
    <div class="fundingOpps">



      <div class="opp-card" v-for="opp in data" :key="opp.id">

        <opp-card-edit :opp="opp" :userType="userType" :editing="true"></opp-card-edit>
      </div>

    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import oppCardEdit from '../components/opp-card-edit.vue';
import toast from '@/components/toasty';
import axios from 'axios';
import { baseurl } from '../config/config';

export default {
  components: { oppCardEdit },
  data() {
    return {
      data: [],
      userType: 'Applicant'
    };
  },
  mounted() {
    this.checker();
    this.readFundOpps();
  },
  computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated', 'getUserType'
    ]),
  },
  methods: {
    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Admin' && type !== 'Fund Manager') {
        this.$router.push('/');
      }
      // console.log(type);
    },

    async readFundOpps() {
      const id = await this.getUser.id;
      const token = await this.getUser.token;
      console.log(token);
      const user_type = await this.getUser.user_type;

      if (user_type === "Admin") {
        axios.get(`${baseurl}/api/v1/oppotunities/`+id, {
          headers: {
            'Authorization': `${token}`
          }
        }).then(response => {
          const data = response.data;
          console.log(data);
          if (data.length === 0) {
            this.message = 'No funding opportunities have been created';

            toast.info(this.message);
          }else 
          this.data = data;
        }).catch(error => {
          console.error(error);
        });
      }else if (user_type === "Fund Manager") {
      // alert(token);
        axios.get(`${baseurl}/api/v1/oppotunities/fund-manager/`+id, {
          headers: {
            'Authorization': `${token}`
          }
        }).then(response => {
          const data = response.data;
          console.log(data);
          if (data.length === 0) {
            this.message = 'No funding opportunities have been created';

            toast.info(this.message);
          }else 
          this.data = data;
        }).catch(error => {
          console.error(error);
        });
      }

    }

  }
};
</script>


<style scoped>
.opp-card {
  width: 25rem;
  padding: 1.5rem;

}

.fundingOpps {
  display: flex;
  /* background: #4CAF50; */
  gap: 2rem;
  /* width: 100vw; */
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

.opp-card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s;
}

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