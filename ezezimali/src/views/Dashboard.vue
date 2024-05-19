<template>
    <div class="dashboard">
        
      <!-- <router-link to="/apply-funding-manager">
        <button class="dashboard-button">Apply to be a Fund Manager</button>
      </router-link> -->
      <div class="fundingOpps">
        


        <div class="opp-card" v-for="opp in fundingOpps" :key="opp.id">
            <div class=" opp-card block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

<img v-if="opp.type == 'Educational'" width="50" height="50" src="https://svgsilh.com/svg/2429310.svg" alt="education type">

<img v-else-if="opp.type == 'Business'" width="50" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8BAQEAAAB8fHw4ODhiYmL09PTQ0NCSkpIsLCzDw8Ph4eHMzMyLi4vb29udnZ3u7u5ZWVk9PT2GhoZnZ2eoqKjg4OCysrJUVFSAgIDW1ta/v7+5ubl3d3cPDw8yMjJLS0seHh5vb2/ItqhJAAACrElEQVR4nO3d2WKiMABA0ZpWinRcKnVp0bH1/z9yZgSKDRkkkAXiPa8R5D7IJsvDAwAAAAAAAAAAAAAAAAAAgEeH2Jb5i++23FFY8+y7LfcoJpZQ6AqFFI6n0OA6dJiF4vfMGDHMwjdzsxxo4dTYHCMKHaNQH4WuUaiPQtco1EehaxTqo9A1CvVR6BqF+ih0ralwWZ4fXMgjaTHwqpgqjMJ5MaCaalyFxbIqCv8/FYWuUUhhHYWuUUhhHYWuURh6Yeh73pvT+mK2lUeW+cjTUTHVmAq7odA1CvVR6BqF+u6o8MPYLHuxWLh5/qUjMrYEP1ks1FTbcTLEXqFuoq3bMywWaqGwOwr1jalwt3+9+Kx9+SYf2aeKqXTXND4Lb/9/2HiM35bXwmJZu52nSaLVbdFhxIXt9ksTCvuikMI6CiUU9kYhhXUUSjwX3trzNnDlntfCJJ1fpCt55JCPpBvFVGMq7OZOC18k1UgghR/yUW81FEzh5BqFRlGoj0IKTWNroU9VuCr2/0pX58oDKWxAYW8U6htTYVyu+WrXjbwXA3vFVGMqvIezGBRS2AKFvVFopnAVL3+Iq6FACod6bGGycHKNQqMopLBuTIXfxxa9/10bauE2Sy6y2kXmi3wgUW3Ux7S16EZVGC0k1VAghQ0o7I1CfRRKKOyNQn2ahVnwhbuysHZZkiHeC8/FAnwZWwCJ78KovKNkbWwBJL4L47JwaWwBJJ4LE+s3BXkuzL5v7LL2M7T5jpKb93Jvz9VLaTJz3y8pC0/vphzLwrfmz51nogr8tBZo8V1BLWZZfdLi0wnsve+pPSFU1xoHVCiE6lFFARUKobrXNpzCv7/GndVAv4X/1jZT26+6fDS4Eu1gav8BKPPTkyfrfWpvMw8AAAAAAAAAAAAAAAAAANDOH6HfVItuARy5AAAAAElFTkSuQmCC" alt="business type">

<img v-else width="50" height="50" src="https://icons.veryicon.com/png/o/miscellaneous/standard/event-19.png" alt="education type">

<h5 class="opp-title">{{ opp.title }}</h5>
<h6>Awarded amount: {{ opp.amount }}</h6>
<br>
<p class="font-normal text-gray-700 dark:text-gray-400">{{ opp.summary }}</p>
<router-link :to="'/apply-funding-opportunity/' + opp.id" class="download-button">Apply for Funding
            </router-link>
        </div>
        </div>

      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    
    data() {
      return {
        fundingOpps: [],
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
    methods: {
      async getEmail(){
        return await this.getUser.username;
      },
      submitForm() {
        // ... existing code ...
      },
      async readFundOpps() {
        const email = await this.getEmail();
        const baseurl = 
        'http://localhost:'+3019;
        // "https://ezezimalii.azurewebsites.net/";
        const response = await fetch(baseurl+'/api/v1/auth/readFundOpps/'+email, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        this.fundingOpps = data;
      }
    },
    created() {
      this.readFundOpps();
    }
  };
  </script>


<style scoped>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
    /* width: 100vw; */
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }
  
  .opp-card {
    width: 25rem;
    padding: 1.5rem;

  }

  .opp-card:hover{
    transform: translateY(-5px);
    transition: transform 0.3s;
  }
  
  .opp-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: start;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .opp-type,
  .opp-amount,
  .opp-description,
  .opp-end-date {
    margin-bottom: 10px;
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