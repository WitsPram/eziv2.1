<template>
    <article>
        <!-- Blockable Users Section -->
        <section class="category-box">
            <article class="pending-title-box">
                <h2 class="bold-title">{{ enabledColName }}</h2>
            </article>
            <section v-if="data.length === 0" class="no-data-box">
                No data
            </section>
            <article v-else>
                <section v-for="(item, index) in data" :key="index" class="card">
                    <h5><strong>{{ item.username }}</strong></h5>
                    <p>{{ item.user_type }}</p>

                    <button class="verdict2-button" @click="block(item.tenant_id, index)">Block</button>
                </section>
            </article>
        </section>

        <!-- Blocked Users Section -->
        <article v-if="data.length === 0" class="category-box">
            <section class="rejected-title-box">
                <h2 class="bold-title">{{ disabledColName }}</h2>
            </section>
            <section>
                <section v-for="(item, index) in rejectedData" :key="index" class="card">
                    <h5><strong>{{ item.username }}</strong></h5>
                    <p>{{ item.user_type }}</p>
                    <p class="bold-status-r">Blocked</p>
                </section>
            </section>
        </article>
    </article>
</template>

<script>
import timeAgo from '../utils/timeAgoConverter';
import { mapGetters } from 'vuex';
import { baseurl } from '../config/config';
import axios from 'axios';

import toast from './toasty';

export default {
    name: 'columns',
    props: {
        data: Array,
        enabledColName: String,
        disabledColName: String,
        rejectedData: Array
    },  computed: {
    ...mapGetters([
      'getUser', 'getUserType'
    ]),
},
    methods: {
        timeAgo(date) {
            return timeAgo(date);
        },
        async block(id, index) {

            // console.log(id, index);


            const token = await this.getUser.token;

            axios.put(baseurl + '/api/v1/user/',{
                "id": id,
                "disabled": 1
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
        const data = response.data;

        if (data.message === 'Success') {
          toast.success(this.data[index].username +' has been blocked.');
          
        this.rejectedData.push(this.data[index]);
        this.data.splice(index, 1);

        } else if (data.message === 'Failure') {
          toast.warning(this.data[index].username +' could not be blocked.');
        } else {
          toast.error(this.data[index].username +' could not be blocked.');
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
}
</script>

<style scoped>
/* Add CSS styling here */
.category-box {
    margin: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.pending-title-box,
.rejected-title-box {
    margin-bottom: 10px;
}

.card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.verdict2-button {
    background-color: rgb(204, 0, 0);
    width: 100%;
    color: white;
}

.verdict2-button:hover {
    background-color: rgb(215, 41, 41);
    transform: scale(1.02);
    transition: transform 0.3s;
}

.bold-title {
    font-weight: bold;
}

.bold-status-r {
    color: red;
    font-weight: bold;
}
</style>../utils/timeAgoConverter