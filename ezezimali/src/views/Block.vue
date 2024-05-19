<template>
    <div class="admin-panel">
      <section>
        <div class="moop">
          <!-- Pending Funding Opportunities -->
          <section class="category-box">
            <article class="pending-title-box">
              <h2 class="bold-title">Blockable Users</h2>
            </article>
            <div v-if="data.length === 0" class="no-data-box">
              No Users
            </div>
            <div v-else>
              <div v-for="(item, index) in data" :key="index" class="card">
                <h5><strong>{{ item.name }}</strong></h5>
                <p>{{item.email}}</p>


                <button class="verdict2-button" @click="block(item.email,index)">Block</button>

              </div>
            </div>
          </section>
  
          <!-- Rejected Funding Opportunities -->
          <div class="category-box">
            <section class="rejected-title-box">
              <h2 class="bold-title">Blocked Users</h2>
            </section>
            <div>
              <div v-for="(item, index) in rejectedData" :key="index" class="card">
                <h5><strong>{{ item.name }}</strong></h5>
                <p>{{item.email}}</p>
                <p class="bold-status-r">Blocked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: [],
        rejectedData: []
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const baseurl = 'http://localhost:3019';
          const response = await fetch(baseurl + '/api/v1/auth/readAllUsers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log(data);
          this.data = data;
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async block(email, index) {
        try {
          const baseurl = 'http://localhost:3019';
          const response = await fetch(`${baseurl}/api/v1/auth/blockUser/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email})
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          alert(`You have denied ${this.data[index].name}'s application to be a fund manager.`);
          const item = this.data.splice(index, 1)[0];
          item.status = 'Blocked';
          this.rejectedData.push(item);
        } catch (error) {
          console.error('Error:', error);
        }
      }
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
height: 80vh;
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
    position: sticky; /* Make the element sticky */
    top: 0; /* Stick it to the top of its container */
    z-index: 1; /* Ensure it appears above other content */
}

  
  .rejected-title-box {
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    position: sticky; /* Make the element sticky */
    top: 0; /* Stick it to the top of its container */
    z-index: 1; /* Ensure it appears above other content */
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
.flexRow{
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
  background-color: rgb(216, 31, 31);
    width: 100%;
  color: white;
}

.verdict2-button:hover {
  background-color: rgb(187, 10, 10);
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
  