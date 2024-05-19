<template>
    <div class="opp-card block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <img v-if="!editMode" :src="getImageSrc(opp.type)" width="50" height="50" :alt="editedType">
        <img v-else :src="getImageSrcEdit()" width="50" height="50" :alt="editedType">
      <h5 class="opp-title">{{ editMode ? editedTitle : opp.title }}</h5>
      <h6>Awarded amount: {{ editMode ? "R"+editedAmount : opp.amount }}</h6>
      <br>
      <p class="font-normal text-gray-700 dark:text-gray-400">{{ editMode ? editedSummary : opp.summary }}</p>
  
      <br>
    
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
      <label for="editedSummary" class="form-label">Summary</label>
      <textarea v-model="editedSummary" id="editedSummary" class="edit-textarea" placeholder="Enter edited summary"></textarea>
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
  </template>
    
  <script>
  export default {
    props: {
      opp: Object // Assuming opp is passed as a prop
    },
    data() {
      return {
        editMode: false,
        editedTitle: '',
        editedAmount: '',
        editedType: '',
        editedSummary: ''
      };
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
        // Initialize edited values with the original data when entering edit mode
        this.editedTitle = this.opp.title;
        this.editedSummary = this.opp.summary;
        this.editedType = this.opp.type;
        this.editedAmount = parseInt(this.opp.amount.substring(1));
      },
      submitChanges(id, amount) {
        // Logic to submit changes
        // Overwrite original data with edited values when submitting changes
        let adminRequired = false;
        this.opp.title = this.editedTitle;
        this.opp.summary = this.editedSummary;
        if (this.opp.amount !== "R"+this.editedAmount) {
          adminRequired = true;
        }
        // this.opp.amount = "R"+this.editedAmount;
        this.opp.type = this.editedType;
        this.editMode = false;

       const baseurl = "http://localhost:"+3019;
       fetch(baseurl+'/api/v1/auth/updateFundingOpp/', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "title" : this.opp.title,
    "summary":  this.opp.summary,
    'type': this.opp.type,
    'id' : id,
  }
  ) 
})
.then(response => response.json())
.then(data => {
    if (data.message !== 'Failure') {
        alert('Updated successfully!');
    } else {
        alert('Failed to post');
    }

})
.catch(error => console.error('Error:', error));

if (adminRequired) {
    // Logic to require admin approval
    alert('Admin has been notified for approval of amount change');
    
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
  </style>
  