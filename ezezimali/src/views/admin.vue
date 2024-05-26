<template>
  <div class="admin-panel">
    <section>
      <article class="moop">

        <columns :disabledColName="'Blocked Users'" :enabledColName="'Blockable Users'" :data="enabledUsers"
          :rejectedData="disabledUsers"></columns>


      </article>
    </section>

  </div>
</template>

<script>

import columns from '../components/blockedColumns.vue';
import { baseurl } from '../config/config';
import axios from 'axios';
import { mapGetters } from 'vuex';

import toast from '../components/toasty'

export default {
  data() {
    return {
      enabledUsers: [],
      disabledUsers: []
    };
  },
  components: { columns },
  mounted() {
    this.checker();
    this.fetchData();
  }, computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
  },
  methods: {
    async checker(){
      const type = await this.getUser.user_type;
      if (type !== 'Admin') {
        this.$router.push('/');
      }
      // console.log(type);
    },
    async fetchData() {


      const token = await this.getUser.token;

      axios.get(baseurl + '/api/v1/user/All/', {
        headers: {
          'Authorization': `${token}`  // Ensure token is correctly formatted
        }
      }).then(response => {
        const data = response.data;



        console.log(data);

        if (data.message === 'Success') {
          // toast.success('Users loaded successfully');
          this.enabledUsers = data.users.filter(user => user.disabled === false);
          this.disabledUsers = data.users.filter(user => user.disabled === true);
        } else if (data.message === 'Failure') {
          toast.warning('No Users found');
        } else {
          toast.error('Failed to fetch users');
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

  }
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.moop {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.category-box {
  width: 25rem;
  height: min-content;
  overflow: scroll;
  scrollbar-width: 0rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9f9f9;
  margin: 0.5rem;
}

.category-box::-webkit-scrollbar {
  display: none;
}

.pending-title-box {
  background-color: lightblue;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  position: sticky;
  /* Make the element sticky */
  top: 0;
  /* Stick it to the top of its container */
  z-index: 1;
  /* Ensure it appears above other content */
}


.rejected-title-box {
  background-color: #f8d7da;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  position: sticky;
  /* Make the element sticky */
  top: 0;
  /* Stick it to the top of its container */
  z-index: 1;
  /* Ensure it appears above other content */
}

.bold-title {
  font-weight: bold;
  text-align: center;
  font-size: larger;
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
  margin-bottom: 0.25rem;
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
  width: 100%;
  margin-right: 0.5rem;
}

.flexRow {
  display: flex;
  width: 100%;
  gap: 1rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.download-button:hover {
  background-color: #054fc6;
}

.verdict-button {
  background-color: #09f043;
  width: 100%;
  color: #fff;
}

.verdict-button:hover {
  background-color: rgb(37, 191, 37);
}

.verdict2-button {
  background-color: rgb(204, 0, 0);
  width: 100%;
  color: white;
}

.verdict2-button:hover {
  background-color: rgb(215, 41, 41);
}

.bold-status-r {
  font-weight: bold;
  color: #d39399;
}

.containerp {
  white-space: nowrap;
}

.first-paragraph,
.second-paragraph {
  display: inline-block;
}

.first-paragraph {
  font-weight: bold;
}



@media (max-width: 950px) {
  .category-box {
    width: 100%;
    margin: 0.5rem 0;
  }

  .card {
    margin-bottom: 0.25rem;
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