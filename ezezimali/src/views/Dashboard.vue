<template>


  <main class="dashboard">

    <!-- <router-link to="/apply-funding-manager">
        <button class="dashboard-button">Apply to be a Fund Manager</button>
      </router-link> -->


    <section class="fundingOpps" v-if="fundingOpps.length != 0">

      <article class="opp-card" v-for="opp in fundingOpps" :key="opp.id">
        <opp-card-edit :opp="opp" :editing="false"></opp-card-edit>
      </article>

    </section>
    <section v-else>{{ message }}</section>


  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import toast from '@/components/toasty';
import { baseurl } from '../config/config';
import oppCardEdit from '../components/opp-card-edit.vue';

export default {

  data() {
    return {
      fundingOpps: [],
      message: 'Fetching content... Please reload webpage if the content doesn\'t arrive within 10 seconds',
      selectedFile: null,
      formData: {
        title: '',
        summary: '',
        description: '',
        agree: false
      }
    };
  },
  components: { oppCardEdit },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
  },
  methods: {
    async readFundOpps() {
      const id = await this.getUser.id;
      const token = await this.getUser.token;

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
        }
        this.fundingOpps = data;
      }).catch(error => {
        console.error(error);
      });


    }
  },
  created() {

    this.readFundOpps();
  }
};
</script>


<style scoped>
.dashboard {
  width: 100%;
  max-width: 1200px;

  /* margin: 0 auto; */
  /* padding: 20px; */
}

.dashboard-title {
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-button {
  display: block;
  width: 100%;
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 20px 0;
  cursor: pointer;
}

.fundingOpps {
  display: flex;
  /* background: #4CAF50; */
  gap: 2rem;
  width: 100%;
  /* width: 100vw; */
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}



.opp-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>