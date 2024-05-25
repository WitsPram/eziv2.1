<template>
    <div class="opp-card block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <img v-if="!editMode" :src="getImageSrc(opp.type)" width="50" height="50" :alt="editedType">
        <img v-else :src="getImageSrcEdit()" width="50" height="50" :alt="editedType">
      <h5 class="opp-title">{{ editMode ? editedTitle : opp.title }}</h5>
      <h6>Awarded amount: {{ editMode ? "R"+editedAmount : opp.amount }}</h6>
      <br>
      <p class="font-normal text-gray-700 dark:text-gray-400">{{ editMode ? editedDescription : opp.description }}</p>
  
      <br>
    
      <div v-if="editing">
      <div v-if="!editMode" class="flexRow">
        <button class="download-button" @click="editMode = true; initializeEditData()">Edit</button>
      </div>
    
      <div v-else>
  <form @submit.prevent="submitChanges(opp.id, opp.amount)">
    <div class="form-group">
      <label for="editedTitle" class="form-label">Title</label>
      <input type="text" v-model="editedTitle" id="editedTitle" class="edit-input" placeholder="Enter edited title">
    </div>
    <div class="form-group">
      <label for="editedSummary" class="form-label">Description</label>
      <textarea v-model="editedDescription" id="editedDescription" class="edit-textarea" placeholder="Enter edited description"></textarea>
    </div>
    <div class="form-group">
      <label for="editedAmount" class="form-label">Amount</label>
      <input type="number" v-model="editedAmount" id="editedAmount" class="edit-input" placeholder="Enter edited amount">
    </div>
    <!-- Add more input fields as needed -->
    <div class="form-group">
      <label class="form-label">Type</label>
      <div class="radio">
        <input type="radio" v-model="editedType" value="Educational" name="type">
        <label>Educational</label>
      </div>
      <div class="radio">
        <input type="radio" v-model="editedType" value="Business" name="type">
        <label>Business</label>
      </div>
      <div class="radio">
        <input type="radio" v-model="editedType" value="Events" name="type">
        <label>Events</label>
      </div>
    </div>
    <div class="flexRow">
        <button type="button" class="verdict-button" @click="cancelEdit">Cancel</button>
        <button type="submit" class="download-button">Submit Changes</button>
    </div>
  </form>
</div>
</div>
<div v-else>

              <router-link v-if="applicant" :to="'/apply-funding-opportunity/' + opp.id" class="download-button">Apply for Funding
              </router-link>
</div>

    </div>
  </template>
    
  <script>
  import { mapGetters } from 'vuex';

import toast from '@/components/toasty';
import axios from 'axios';
import { baseurl } from '../config/config';

  export default {
    props: {
      opp: Object,
      editing: Boolean,
      userType: String
    },

    computed: {
    ...mapGetters([
      'getUser'
    ]),},
    data() {
      return {
        editMode: false,
        editedTitle: '',
        applicant: false,
        editedAmount: '',
        editedType: '',
        editedDescription: ''
      };
    },
    async mounted(){
      const user_type = await this.getUser.user_type;
      this.applicant = user_type === 'Applicant';
    },
    methods: {
        getImageSrcEdit() {
      if (this.editedType === 'Educational') {
        return 'https://svgsilh.com/svg/2429310.svg';
      } else if (this.editedType === 'Business') {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8BAQEAAAB8fHw4ODhiYmL09PTQ0NCSkpIsLCzDw8Ph4eHMzMyLi4vb29udnZ3u7u5ZWVk9PT2GhoZnZ2eoqKjg4OCysrJUVFSAgIDW1ta/v7+5ubl3d3cPDw8yMjJLS0seHh5vb2/ItqhJAAACrElEQVR4nO3d2WKiMABA0ZpWinRcKnVp0bH1/z9yZgSKDRkkkAXiPa8R5D7IJsvDAwAAAAAAAAAAAAAAAAAAgEeH2Jb5i++23FFY8+y7LfcoJpZQ6AqFFI6n0OA6dJiF4vfMGDHMwjdzsxxo4dTYHCMKHaNQH4WuUaiPQtco1EehaxTqo9A1CvVR6BqF+ih0ralwWZ4fXMgjaTHwqpgqjMJ5MaCaalyFxbIqCv8/FYWuUUhhHYWuUUhhHYWuURh6Yeh73pvT+mK2lUeW+cjTUTHVmAq7odA1CvVR6BqF+u6o8MPYLHuxWLh5/qUjMrYEP1ks1FTbcTLEXqFuoq3bMywWaqGwOwr1jalwt3+9+Kx9+SYf2aeKqXTXND4Lb/9/2HiM35bXwmJZu52nSaLVbdFhxIXt9ksTCvuikMI6CiUU9kYhhXUUSjwX3trzNnDlntfCJJ1fpCt55JCPpBvFVGMq7OZOC18k1UgghR/yUW81FEzh5BqFRlGoj0IKTWNroU9VuCr2/0pX58oDKWxAYW8U6htTYVyu+WrXjbwXA3vFVGMqvIezGBRS2AKFvVFopnAVL3+Iq6FACod6bGGycHKNQqMopLBuTIXfxxa9/10bauE2Sy6y2kXmi3wgUW3Ux7S16EZVGC0k1VAghQ0o7I1CfRRKKOyNQn2ahVnwhbuysHZZkiHeC8/FAnwZWwCJ78KovKNkbWwBJL4L47JwaWwBJJ4LE+s3BXkuzL5v7LL2M7T5jpKb93Jvz9VLaTJz3y8pC0/vphzLwrfmz51nogr8tBZo8V1BLWZZfdLi0wnsve+pPSFU1xoHVCiE6lFFARUKobrXNpzCv7/GndVAv4X/1jZT26+6fDS4Eu1gav8BKPPTkyfrfWpvMw8AAAAAAAAAAAAAAAAAANDOH6HfVItuARy5AAAAAElFTkSuQmCC';
      } else {
        return 'https://icons.veryicon.com/png/o/miscellaneous/standard/event-19.png';
      }
    },getImageSrc(type) {
      if (type === 'Educational') {
        return 'https://svgsilh.com/svg/2429310.svg';
      } else if (type === 'Business') {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8BAQEAAAB8fHw4ODhiYmL09PTQ0NCSkpIsLCzDw8Ph4eHMzMyLi4vb29udnZ3u7u5ZWVk9PT2GhoZnZ2eoqKjg4OCysrJUVFSAgIDW1ta/v7+5ubl3d3cPDw8yMjJLS0seHh5vb2/ItqhJAAACrElEQVR4nO3d2WKiMABA0ZpWinRcKnVp0bH1/z9yZgSKDRkkkAXiPa8R5D7IJsvDAwAAAAAAAAAAAAAAAAAAgEeH2Jb5i++23FFY8+y7LfcoJpZQ6AqFFI6n0OA6dJiF4vfMGDHMwjdzsxxo4dTYHCMKHaNQH4WuUaiPQtco1EehaxTqo9A1CvVR6BqF+ih0ralwWZ4fXMgjaTHwqpgqjMJ5MaCaalyFxbIqCv8/FYWuUUhhHYWuUUhhHYWuURh6Yeh73pvT+mK2lUeW+cjTUTHVmAq7odA1CvVR6BqF+u6o8MPYLHuxWLh5/qUjMrYEP1ks1FTbcTLEXqFuoq3bMywWaqGwOwr1jalwt3+9+Kx9+SYf2aeKqXTXND4Lb/9/2HiM35bXwmJZu52nSaLVbdFhxIXt9ksTCvuikMI6CiUU9kYhhXUUSjwX3trzNnDlntfCJJ1fpCt55JCPpBvFVGMq7OZOC18k1UgghR/yUW81FEzh5BqFRlGoj0IKTWNroU9VuCr2/0pX58oDKWxAYW8U6htTYVyu+WrXjbwXA3vFVGMqvIezGBRS2AKFvVFopnAVL3+Iq6FACod6bGGycHKNQqMopLBuTIXfxxa9/10bauE2Sy6y2kXmi3wgUW3Ux7S16EZVGC0k1VAghQ0o7I1CfRRKKOyNQn2ahVnwhbuysHZZkiHeC8/FAnwZWwCJ78KovKNkbWwBJL4L47JwaWwBJJ4LE+s3BXkuzL5v7LL2M7T5jpKb93Jvz9VLaTJz3y8pC0/vphzLwrfmz51nogr8tBZo8V1BLWZZfdLi0wnsve+pPSFU1xoHVCiE6lFFARUKobrXNpzCv7/GndVAv4X/1jZT26+6fDS4Eu1gav8BKPPTkyfrfWpvMw8AAAAAAAAAAAAAAAAAANDOH6HfVItuARy5AAAAAElFTkSuQmCC';
      } else {
        return 'https://icons.veryicon.com/png/o/miscellaneous/standard/event-19.png';
      }
    },
      initializeEditData() {

        this.editedTitle = this.opp.title;
        this.editedDescription = this.opp.description;
        this.editedType = this.opp.type;
        this.editedAmount = parseInt(this.opp.amount.substring(1));
      },
      async notify(title, amount){

        const token = await this.getUser.token;
        const name = await this.getUser.name;
        const id = await this.getUser.id;
        
        axios.post(`${baseurl}/api/v1/notifications`, {
  "id": id,
  "adminRequired" : 1,
  "title": "Assistance Required: Fund Manager Application",
  "message": `Dear Admin, ${name} would like to update the amount for the opportunity titled ${title} to R${amount}. Please review and approve.`,
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

      },
      async submitChanges(id, amount) {
      const token = await this.getUser.token;
      const user_type = await this.getUser.user_type;

      // if (user_type==='Applicant') this.applicant = true

        let adminRequired = false;
        this.opp.title = this.editedTitle;
        this.opp.description = this.editedDescription;
        if (user_type==='Admin') {
        this.opp.amount = "R"+this.editedAmount;
       }

        if (this.opp.amount !== "R"+this.editedAmount) {
          adminRequired = true;
        }
        this.opp.type = this.editedType;
        this.editMode = false;


        axios.put(`${baseurl}/api/v1/oppotunities`,{
    "title" : this.opp.title,
    "description":  this.opp.description,
    "amount": this.opp.amount,
    'type': this.opp.type,
    'id' : id,
  } , {
          headers: {
            'Authorization': `${token}`
          }
        }).then(response => {
          const data = response.data;
          if (data.message !== 'Failure') {
            toast.success('Updated successfully!');
          } else {
            toast.error('Failed to post');
          }
        }).catch(error => {
          console.error(error);
        });

      

if (adminRequired) {
    // Logic to require admin approval
    toast.info('Admin has been notified for approval of the amount changed');
    this.notify(this.opp.title, this.editedAmount);
    
}


      },
      cancelEdit() {
        // Logic to cancel edit mode
        this.editMode = false;
      }
    }
  };
  </script>
    
  <style scoped>

input, textarea{
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}

  
  .opp-card {
    width: 25rem;
    padding: 1.5rem;
  }

  .opp-card:hover{
    transform: translateY(-5px);
    transition: transform 0.3s;
  }

  .form-group{
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  .flexRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .opp-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: start;
    width: 100%;
    margin-bottom: 10px;
  }

  @media (max-width: 430px) {
    .opp-card {
    width: 20rem;
    /* margin: 15px; */
    padding: 1.5rem;
    }
  }
  </style>
  